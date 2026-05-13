const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendOTPEmail = require("../utils/sendOTPEmail");
const { getCollections } = require("../config/db");

// Get currently logged-in user
const getMe = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: "No token found, please login" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.send({ message: "You are logged in!", user: decoded });
  } catch (err) {
    res.status(401).send({ message: "Invalid token" });
  }
};

// Logout user
const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).send({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).send({ message: "Logout failed", error });
  }
};

// Register new user
// Register new user
const register = async (req, res) => {
  try {
    const { userCollection } = getCollections();
    const user = req.body;

    // ১. চেক করুন ইউজার ডাটাবেসে আছে কিনা
    const existingUser = await userCollection.findOne({ email: user.email });

    if (existingUser) {
      // যদি ইউজার থাকে এবং সে ভেরিফাইড হয়, তবেই অ্যাকাউন্ট খুলতে মানা করুন
      if (existingUser.isVerified) {
        return res
          .status(400)
          .send({ message: "User already exists and is verified." });
      }
      // আর যদি ভেরিফাইড না হয়, তবে আমরা এরর দিবো না, বরং নিচের ধাপে তার ডাটা আপডেট করবো।
    }

    // ২. নতুন OTP এবং Hash PIN জেনারেট করুন
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPin = await bcrypt.hash(user.pin, 10);

    // ৩. ডাটাবেসে সেভ করার আগেই ইমেইল সেন্ড করে চেক করুন ইমেইলটি ভ্যালিড কিনা
    const isEmailSent = await sendOTPEmail(user.email, otpCode);
    if (!isEmailSent) {
      return res.status(400).send({
        message: "Invalid email address! We couldn't send the OTP.",
        success: false,
      });
    }

    // OTP এর ডাটা স্ট্রাকচার
    const otpData = {
      code: otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min expiry
      attempts: 0,
    };

    // ৪. যদি ইউজার আগে থেকেই থাকে কিন্তু Verified না হয় (Update old unverified user)
    if (existingUser && !existingUser.isVerified) {
      await userCollection.updateOne(
        { email: user.email },
        {
          $set: {
            name: user.fullName,
            businessName: user.businessName,
            phone: user.phone,
            pin: hashedPin,
            otp: otpData, // নতুন OTP সেট করে দিলাম
            updatedAt: new Date(),
          },
        },
      );

      return res.send({
        message: "OTP resent to your email. Please verify.",
        userId: existingUser._id,
        success: true,
      });
    }

    // ৫. আর যদি সম্পূর্ণ নতুন ইউজার হয় (Insert complete new user)
    else {
      const businessId = Math.floor(10000 + Math.random() * 9000).toString();

      const newUser = {
        name: user.fullName,
        businessName: user.businessName,
        businessId: `#${businessId}`,
        email: user.email,
        phone: user.phone,
        pin: hashedPin,
        isVerified: false,
        otp: otpData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await userCollection.insertOne(newUser);

      return res.send({
        message: "User created successfully. OTP sent to your email.",
        userId: result.insertedId,
        success: true,
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { userCollection } = getCollections();
    const { email, otp } = req.body;

    const user = await userCollection.findOne({ email });
    if (!user) return res.status(404).send({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).send({ message: "User is already verified" });

    // Check OTP Match
    if (user.otp.code !== otp) {
      user.otp.attempts += 1;
      await userCollection.replaceOne({ _id: user._id }, user);

      // Max attempts check
      if (user.otp.attempts >= 3) {
        await userCollection.deleteOne({ _id: user._id });
        return res
          .status(400)
          .send({
            message: "Too many invalid OTP attempts. Please request a new OTP.",
          });
      }
      return res.status(400).send({ message: "Invalid OTP" });
    }

    // Check OTP Expiration
    if (new Date() > user.otp.expiresAt) {
      await userCollection.deleteOne({ _id: user._id });
      return res
        .status(400)
        .send({ message: "OTP has expired. Please request a new OTP." });
    }

    // Update user status
    await userCollection.updateOne(
      { _id: user._id },
      { $set: { isVerified: true }, $unset: { otp: 1 } },
    );

    res.send({ message: "OTP verified successfully", success: true });
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

// Resend OTP
const resendOtp = async (req, res) => {
  try {
    const { userCollection } = getCollections();
    const { email } = req.body;

    const user = await userCollection.findOne({ email });
    if (!user) return res.status(404).send({ message: "User not found" });
    if (user.isVerified) return res.status(400).send({ message: "User is already verified" });

    // নতুন OTP জেনারেট করুন
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // ইমেইল পাঠান
    const isEmailSent = await sendOTPEmail(email, otpCode);
    if (!isEmailSent) {
      return res.status(400).send({ message: "Failed to send OTP email" });
    }

    // ডাটাবেসে OTP আপডেট করুন
    await userCollection.updateOne(
      { email },
      { 
        $set: { 
          "otp.code": otpCode,
          "otp.expiresAt": new Date(Date.now() + 5 * 60 * 1000),
          "otp.attempts": 0 
        } 
      }
    );

    res.send({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { userCollection } = getCollections();
    const { email, pin } = req.body;

    if (!email || !pin)
      return res.status(400).send({ message: "Email and pin are required" });

    const user = await userCollection.findOne({ email });
    if (!user) return res.status(404).send({ message: "User not found" });
    if (!user.isVerified)
      return res.status(400).send({ message: "User is not verified" });

    const isPinMatch = await bcrypt.compare(pin, user.pin);
    if (!isPinMatch)
      return res.status(400).send({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
        phone: user.phone,
        businessName: user.businessName,
        businessId: user.businessId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.send({
      success: true,
      message: "Login successful",
      user: {
        email: user.email,
        name: user.name,
        phone: user.phone,
        businessName: user.businessName,
        businessId: user.businessId,
      },
    });
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

module.exports = { getMe, logout, register, verifyOtp, login, resendOtp };
