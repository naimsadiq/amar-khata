const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]); // গুগল ও ক্লাউডফ্লেয়ারের ডিএনএস

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const sendOTPEmail = require("./utils/sendOTPEmail");
const authMiddleware = require("./middleware/authMiddleware");
// const { use } = require("react");
// ======================
// MIDDLEWARE
// ======================
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(express.json());
app.use(cookieParser());
// ======================
// DATABASE URI (USE .env ONLY)
// ======================
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// ======================
// DB CONNECT
// ======================
async function run() {
  try {
    await client.connect();

    const db = client.db("amar_khata_db");

    const userCollection = db.collection("users");
    const partiesCollection = db.collection("parties");

    //login check
    app.get("/api/auth/me", async (req, res) => {
      const token = req.cookies.token; // কুকি থেকে টোকেন নেওয়া (cookie-parser লাগবে)

      if (!token) {
        return res
          .status(401)
          .send({ message: "No token found, please login" });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.send({ message: "You are logged in!", user: decoded });
      } catch (err) {
        res.status(401).send({ message: "Invalid token" });
      }
    });

    // logout user
    app.post("/api/logout", (req, res) => {
      try {
        res.clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // production হলে true
          sameSite: "strict",
        });

        res.status(200).send({
          message: "Logged out successfully",
        });
      } catch (error) {
        res.status(500).send({
          message: "Logout failed",
          error,
        });
      }
    });

    //create User
    app.post("/api/register", async (req, res) => {
      try {
        const user = req.body;
        console.log("Received registration data:", user);

        // 1. Check duplicate
        const existingUser = await userCollection.findOne({
          email: user.email,
        });
        if (existingUser) {
          return res.status(400).send({ message: "User already exists" });
        }

        // // 2. Check pin match
        // if (user.pin !== user.confirmPin) {
        //   return res.status(400).send({ message: "Pin does not match" });
        // }

        // 3. Generate OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const businessId = Math.floor(10000 + Math.random() * 9000).toString();

        // 4. Hash pin
        const hashedPin = await bcrypt.hash(user.pin, 10);

        // 5. Create new user
        const newUser = {
          name: user.fullName,
          businessName: user.businessName,
          businessId: `#${businessId}`,
          email: user.email,
          phone: user.phone,
          pin: hashedPin,
          isVerified: false,
          otp: {
            code: otpCode,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
            attempts: 0,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // 6. Save DB
        const result = await userCollection.insertOne(newUser);

        // 7. Send Email
        const isEmailSent = await sendOTPEmail(user.email, otpCode);

        if (!isEmailSent) {
          await userCollection.deleteOne({ _id: result.insertedId });

          return res.status(400).send({
            message:
              "Invalid email address! We couldn't send the OTP. Please provide a valid email.",
            success: false,
          });
        }

        // 9. response email send success and user created
        res.send({
          message: "User created successfully. OTP sent to your email.",
          userId: result.insertedId,
          success: true,
        });
      } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });

    // verify OTP
    app.post("/verify-otp", async (req, res) => {
      try {
        const { email, otp } = req.body;

        // 1. Find user by email
        const user = await userCollection.findOne({ email });

        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }

        // 2. Check if already verified
        if (user.isVerified) {
          return res.status(400).send({ message: "User is already verified" });
        }

        // 3. Check OTP
        if (user.otp.code !== otp) {
          user.otp.attempts += 1;
          await userCollection.replaceOne({ _id: user._id }, user);

          // 4. If attempts exceed, delete user
          if (user.otp.attempts >= 3) {
            await userCollection.deleteOne({ _id: user._id });
            return res.status(400).send({
              message:
                "Too many invalid OTP attempts. Please request a new OTP.",
            });
          }

          return res.status(400).send({ message: "Invalid OTP" });
        }

        // 5. Check OTP expiration
        if (new Date() > user.otp.expiresAt) {
          await userCollection.deleteOne({ _id: user._id });
          return res
            .status(400)
            .send({ message: "OTP has expired. Please request a new OTP." });
        }

        // Update user verification status
        await userCollection.updateOne(
          { _id: user._id },
          {
            $set: { isVerified: true },
            $unset: { otp: 1 },
          },
        );

        res.send({ message: "OTP verified successfully", success: true });
      } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });

    // login api
    app.post("/api/login", async (req, res) => {
      try {
        const { email, pin } = req.body;

        // 1. Input Validation
        if (!email || !pin) {
          return res
            .status(400)
            .send({ message: "Email and pin are required" });
        }

        // 2. Find user by email
        const user = await userCollection.findOne({ email });
        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }

        // 3. Check if verified
        if (!user.isVerified) {
          return res.status(400).send({ message: "User is not verified" });
        }

        // 4. Check pin
        const isPinMatch = await bcrypt.compare(pin, user.pin);
        if (!isPinMatch) {
          return res.status(400).send({ message: "Invalid credentials" });
        }

        // 5. Generate JWT Token
        const token = jwt.sign(
          {
            email: user.email,
            name: user.name,
            phone: user.phone,
            businessName: user.businessName,
            businessId: user.businessId,
          },
          process.env.JWT_SECRET, // .env ফাইলে থাকা সিক্রেট কি
          { expiresIn: "7d" },
        );

        // 6. httpOnly Cockie
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // 👈 ডায়নামিক করে দিলাম
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // 6. Send Response
        res.send({
          success: true,
          message: "Login successful",
          user: {
            email: user.email,
            name: user.name,
            phone: user.phone,
            businessName: user.businessName,
            d,
          }, // পাসওয়ার্ড/পিন বাদে ইউজারের বেসিক ইনফো পাঠাতে পারেন
        });
      } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });

    app.post("/api/parties", authMiddleware, async (req, res) => {
      try {
        const party = req.body;
        const user = req.user;
        const nuwParty = {
          ...party,
          userEmail: user.email,
          userPhone: user.phone,
          businessId: user.businessId,
          businessName: user.businessName,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        console.log("Received party data:", nuwParty);
        await partiesCollection.insertOne(nuwParty);
        res
          .status(201)
          .send({ message: "Party created successfully", party: nuwParty });
      } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });

    // GET all parties for the logged-in user's business
    app.get("/api/parties", authMiddleware, async (req, res) => {
      try {
        const user = req.user;

        // শুধুমাত্র সেই party-গুলো খোঁজা হচ্ছে যা এই ব্যবহারকারীর businessId-এর সাথে যুক্ত
        const query = { businessId: user.businessId };

        const parties = await partiesCollection.find(query).toArray();

        res.status(200).send(parties);
      } catch (error) {
        console.error("❌ Error fetching parties:", error);
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });

    // GET a single party by its ID
    // GET a single party by its unique MongoDB _id
    // প্রস্তাবিত URL: /api/parties/69f56b698289cba5f4957fa6
    app.get("/api/parties/:partyId", authMiddleware, async (req, res) => {
      try {
        const { partyId } = req.params;
        const user = req.user;

        if (!ObjectId.isValid(partyId)) {
          return res.status(400).send({ message: "Invalid party ID format" });
        }

        const query = {
          _id: new ObjectId(partyId),
          businessId: user.businessId, // নিরাপত্তা নিশ্চিত করার জন্য
        };

        const party = await partiesCollection.findOne(query);

        if (!party) {
          return res.status(404).send({ message: "Party not found" });
        }

        res.status(200).send(party);
      } catch (error) {
        console.error("❌ Error fetching single party:", error);
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });

    // await client.db("admin").command({ ping: 1 });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}

run();

// ======================
// ROUTES
// ======================
app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

// ======================
// SERVER START
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
