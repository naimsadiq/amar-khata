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
const allowedOrigins = [
  "http://localhost:3000",
  "https://your-frontend-project.vercel.app" 
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
// app.use(cors());
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
    const productsCollection = db.collection("products");
    const transactionsCollection = db.collection("transactions");
    const cashbookCollection = db.collection("cashbook");

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
            businessId: user.businessId,
          }, // পাসওয়ার্ড/পিন বাদে ইউজারের বেসিক ইনফো পাঠাতে পারেন
        });
      } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });

    // ইউজারের প্রোফাইল পাওয়ার API
    // ইউজারের প্রোফাইল পাওয়ার API
    app.get("/api/users/profile", async (req, res) => {
      const token = req.cookies.token;

      if (!token)
        return res
          .status(401)
          .send({ message: "No token found, please login" });

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = decoded.email;

        // ইউজার কালেকশন থেকে তথ্য নেওয়া (এখানে 'email' ফিল্ডই আছে আপনার ইউজার ডাটাতে)
        const user = await userCollection.findOne(
          { email: userEmail },
          { projection: { pin: 0 } }, // সিকিউরিটির জন্য pin বাদ দেওয়া হয়েছে
        );

        if (!user) return res.status(404).send({ message: "User not found" });

        // অন্যান্য কালেকশন থেকে Stats কাউন্ট করা (আপনার ডাটাবেস ফিল্ড অনুযায়ী আপডেট করা হলো)

        // ১. মোট বিক্রয় (transactions কালেকশনে ফিল্ডের নাম 'userEmail' এবং 'type')
        const totalSales = await transactionsCollection.countDocuments({
          userEmail: userEmail,
          type: "sale",
        });

        // ২. গ্রাহক সংখ্যা (parties কালেকশনে ফিল্ডের নাম 'userEmail' এবং 'type')
        const customers = await partiesCollection.countDocuments({
          userEmail: userEmail,
          type: "customer",
        });

        // ৩. পণ্য মজুদ (products কালেকশনে ফিল্ডের নাম 'userEmail')
        const inventory = await productsCollection.countDocuments({
          userEmail: userEmail,
        });

        // ৪. কাশবুক (আপনার স্যাম্পল ডাটায় status: 'pending' নামে কিছু নেই, তাই আপাতত শুধু userEmail দিয়ে সব কাউন্ট করা হলো। যদি নির্দিষ্ট কোনো শর্ত থাকে, তবে সেটা যুক্ত করে নিবেন)
        const pendingCash = await cashbookCollection.countDocuments({
          userEmail: userEmail,
          // status: "pending"  <-- আপনার স্কিমায় যদি পেন্ডিং এর কোনো ফিল্ড থাকে তবে এটা আনকমেন্ট করে ঠিক করে নিবেন
        });

        // সব ডাটা একসাথে পাঠানো
        res.send({
          ...user,
          stats: {
            totalSales: totalSales || 0,
            customers: customers || 0,
            inventory: inventory || 0,
            pendingCash: pendingCash || 0,
          },
        });
      } catch (err) {
        res.status(401).send({ message: "Invalid token" });
      }
    });

    // ইউজারের প্রোফাইল আপডেট করার API
    app.put("/api/users/profile", async (req, res) => {
      const token = req.cookies.token;

      if (!token)
        return res
          .status(401)
          .send({ message: "No token found, please login" });

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = decoded.email;

        // ফ্রন্টএন্ড থেকে আসা আপডেটেড ডাটা
        const { name, phone, businessName, dob, gender, address } = req.body;

        const filter = { email: userEmail };
        const updateDoc = {
          $set: {
            name: name,
            phone: phone,
            businessName: businessName, // নতুন যুক্ত করা হয়েছে
            dob: dob, // ডাটাবেসে না থাকলে নতুন তৈরি হবে
            gender: gender, // ডাটাবেসে না থাকলে নতুন তৈরি হবে
            address: address, // ডাটাবেসে না থাকলে নতুন তৈরি হবে
            updatedAt: new Date(),
          },
        };

        const result = await userCollection.updateOne(filter, updateDoc);
        res.send({ message: "Profile updated successfully", result });
      } catch (err) {
        res
          .status(500)
          .send({ message: "Failed to update profile", error: err.message });
      }
    });

    app.post("/api/parties", authMiddleware, async (req, res) => {
      try {
        const party = req.body;
        const user = req.user;
        const nuwParty = {
          ...party,
          currentDue: party.openingBalance,
          userEmail: user.email,
          userPhone: user.phone,
          businessId: user.businessId,
          businessName: user.businessName,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // console.log("Received party data:", nuwParty);
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

    // POST: নতুন পণ্য (Product) যোগ করার API
    app.post("/api/inventory", authMiddleware, async (req, res) => {
      try {
        const product = req.body;
        const user = req.user;

        // নতুন প্রোডাক্ট অবজেক্ট তৈরি এবং নাম্বার ফিল্ডগুলো নিশ্চিত করা
        const newProduct = {
          name: product.name,
          category: product.category,
          unit: product.unit,
          buyPrice: Number(product.buyPrice) || 0,
          sellPrice: Number(product.sellPrice) || 0,
          openingStock: Number(product.openingStock) || 0,
          stockQuantity: Number(product.openingStock) || 0,
          lowStockAlert: Number(product.lowStockAlert) || 5,

          // ইউজারের ইনফরমেশন (Multi-tenant এর জন্য)
          userEmail: user.email,
          userPhone: user.phone,
          businessId: user.businessId,
          businessName: user.businessName,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        console.log("Received product data:", newProduct);

        // productsCollection এ ডাটা সেভ করা (আপনার ডাটাবেস কালেকশনের নাম অনুযায়ী বদলাতে পারেন)
        await productsCollection.insertOne(newProduct);

        res.status(201).send({
          message: "Product created successfully",
          product: newProduct,
        });
      } catch (error) {
        console.error("❌ Error adding product:", error);
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });

    // GET: ইউজারের সব পণ্য দেখার API
    app.get("/api/inventory", authMiddleware, async (req, res) => {
      try {
        const user = req.user;

        // শুধুমাত্র ঐ ইউজারের/দোকানের প্রোডাক্টগুলো আনা হবে
        const query = { businessId: user.businessId };

        // লেটেস্ট প্রোডাক্ট উপরে রাখার জন্য .sort({ createdAt: -1 }) ব্যবহার করা হয়েছে
        const products = await productsCollection
          .find(query)
          .sort({ createdAt: -1 })
          .toArray();

        res.status(200).send(products);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });

    app.post("/api/purchases", authMiddleware, async (req, res) => {
      try {
        const data = req.body;
        const user = req.user;
        const supplierObjectId = new ObjectId(data.supplierId);

        // ১. একটি রেন্ডম বা সিরিয়াল ইনভয়েস নম্বর তৈরি করা
        const invoiceNo = `PUR-${Date.now().toString().slice(-6)}`;

        // ২. মালের লিস্টকে ডাটাবেজে সেভ করার জন্য ফরম্যাট করা
        const formattedItems = data.items.map((item) => ({
          productId: new ObjectId(item.productId),
          quantity: Number(item.quantity) || 0,
          price: Number(item.buyPriceAtPurchase) || 0,
          totalLineAmount: Number(item.totalLineAmount) || 0,
        }));

        // ৩. নতুন Purchase ট্রানজেকশন অবজেক্ট তৈরি
        const newPurchase = {
          type: "purchase",
          invoiceNo: invoiceNo,
          partyId: supplierObjectId,
          date: new Date(data.purchaseDate || Date.now()),
          items: formattedItems,
          subTotal: Number(data.subTotal) || 0,
          discount: Number(data.discount) || 0,
          grandTotal: Number(data.grandTotal) || 0,
          paidAmount: Number(data.paidAmount) || 0,
          dueAmount: Number(data.dueAmount) || 0,
          userEmail: user.email,
          userPhone: user.phone,
          businessId: user.businessId,
          businessName: user.businessName,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // ৪. transactionsCollection এ ডাটা সেভ করা
        const result = await transactionsCollection.insertOne(newPurchase);

        // ৫. সাপ্লায়ারের বকেয়া (Due Balance) আপডেট করা
        if (newPurchase.dueAmount > 0) {
          await partiesCollection.updateOne(
            { _id: supplierObjectId },
            {
              $inc: { currentDue: newPurchase.dueAmount },
              $set: { updatedAt: new Date() },
            },
          );
        }

        // নতুন: ক্যাসবুক আপডেট (যদি নগদ টাকা দেওয়া হয়)
        if (newPurchase.paidAmount > 0) {
          // সাপ্লায়ারের নাম ও ফোন খুঁজে নেওয়া
          let partyName = "অজ্ঞাত সাপ্লায়ার";
          let partyPhone = "";

          const supplierInfo = await partiesCollection.findOne({
            _id: supplierObjectId,
          });
          if (supplierInfo) {
            partyName = supplierInfo.name;
            partyPhone = supplierInfo.phone;
          }

          await cashbookCollection.insertOne({
            transactionType: "OUT",
            category: "Supplier_Payment",
            partyId: supplierObjectId,
            partyName: partyName, // আপডেট করা হলো
            partyPhone: partyPhone, // আপডেট করা হলো
            partyModel: "Supplier",
            amount: newPurchase.paidAmount,
            date: newPurchase.date,
            referenceNo: newPurchase.invoiceNo,
            note: `ক্রয় বাবদ পেমেন্ট (ইনভয়েস: ${newPurchase.invoiceNo})`,
            userEmail: user.email,
            businessId: user.businessId,
            createdAt: new Date(),
          });
        }

        // ৬. প্রোডাক্টের স্টক এবং মাস্টার ডাটা আপডেট করা
        for (const item of data.items) {
          await productsCollection.updateOne(
            { _id: new ObjectId(item.productId) },
            {
              $inc: { stockQuantity: Number(item.quantity) || 0 },
              $set: {
                buyPrice: Number(item.buyPriceAtPurchase) || 0,
                sellPrice: Number(data.updateMasterData?.newSellPrice) || 0,
                unit: data.updateMasterData?.unit || "পিস",
                updatedAt: new Date(),
              },
            },
          );
        }

        res.status(201).send({
          message: "Purchase completed and stock updated successfully",
          purchaseId: result.insertedId,
        });
      } catch (error) {
        console.error("❌ Error adding purchase:", error);
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });

    // ==========================================
    // Sales (বিক্রয়) API
    // ==========================================
    app.post("/api/sales", authMiddleware, async (req, res) => {
      try {
        const data = req.body;
        const user = req.user;

        // ১. ইনভয়েস নম্বর
        const invoiceNo =
          data.invoiceNo || `INV-${Date.now().toString().slice(-6)}`;

        // ২. মালের লিস্ট ফরম্যাট করা
        const formattedItems = data.items.map((item) => ({
          productId: new ObjectId(item.productId),
          name: item.name,
          quantity: Number(item.quantity) || 0,
          price: Number(item.price) || 0,
          totalLineAmount: Number(item.totalLineAmount) || 0,
        }));

        // ৩. নতুন Sale ট্রানজেকশন অবজেক্ট তৈরি
        const newSale = {
          type: "sale",
          invoiceNo: invoiceNo,
          partyId: data.partyId ? new ObjectId(data.partyId) : null,
          date: new Date(),
          items: formattedItems,
          subTotal: Number(data.subTotal) || 0,
          discount: Number(data.discount) || 0,
          grandTotal: Number(data.grandTotal) || 0,
          paidAmount: Number(data.paidAmount) || 0,
          dueAmount: Number(data.dueAmount) || 0,
          userEmail: user.email,
          userPhone: user.phone,
          businessId: user.businessId,
          businessName: user.businessName,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // ৪. transactionsCollection এ ডাটা সেভ করা
        const result = await transactionsCollection.insertOne(newSale);

        // ৫. কাস্টমারের বকেয়া আপডেট করা (যদি বাকিতে বিক্রি হয়)
        if (newSale.dueAmount > 0 && newSale.partyId) {
          await partiesCollection.updateOne(
            { _id: newSale.partyId },
            {
              $inc: { currentDue: newSale.dueAmount },
              $set: { updatedAt: new Date() },
            },
          );
        }

        // ৬. ক্যাসবুক আপডেট (যদি নগদ টাকা পাওয়া যায়)
        if (newSale.paidAmount > 0) {
          // কাস্টমারের নাম ও ফোন ডাটাবেস থেকে খুঁজে নেওয়া
          let partyName = "নগদ বিক্রয়";
          let partyPhone = "";

          if (newSale.partyId) {
            const partyInfo = await partiesCollection.findOne({
              _id: newSale.partyId,
            });
            if (partyInfo) {
              partyName = partyInfo.name;
              partyPhone = partyInfo.phone;
            }
          }

          await cashbookCollection.insertOne({
            transactionType: "IN",
            category: "Direct_Sale",
            partyId: newSale.partyId,
            partyName: partyName, // ডাটাবেস থেকে পাওয়া নাম
            partyPhone: partyPhone, // ডাটাবেস থেকে পাওয়া ফোন
            partyModel: "Customer",
            amount: newSale.paidAmount,
            date: newSale.date,
            referenceNo: newSale.invoiceNo,
            note: `বিক্রয় বাবদ প্রাপ্তি (ইনভয়েস: ${newSale.invoiceNo})`,
            userEmail: user.email,
            businessId: user.businessId,
            createdAt: new Date(),
          });
        }

        // ৭. প্রোডাক্টের স্টক আপডেট করা
        for (const item of formattedItems) {
          await productsCollection.updateOne(
            { _id: item.productId },
            {
              $inc: { stockQuantity: -Math.abs(item.quantity) },
              $set: { updatedAt: new Date() },
            },
          );
        }

        res.status(201).send({
          message: "Sale completed successfully",
          saleId: result.insertedId,
        });
      } catch (error) {
        console.error("❌ Error adding sale:", error);
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });

    // Get Transactions by Party ID API
    // ==========================================
    app.get("/api/transactions/:partyId", authMiddleware, async (req, res) => {
      try {
        const { partyId } = req.params;
        const user = req.user;

        // Party ID ভ্যালিড কিনা চেক করা
        if (!ObjectId.isValid(partyId)) {
          return res.status(400).send({ message: "Invalid Party ID" });
        }

        // ইউজারের নিজের ডাটা এবং নির্দিষ্ট partyId এর ডাটা ফিল্টার করা
        const query = {
          partyId: new ObjectId(partyId),
          businessId: user.businessId, // মাল্টি-ট্যানেন্ট সিকিউরিটি
        };

        // লেনদেনের লিস্ট নিয়ে আসা (নতুন তারিখের ডাটা আগে দেখাবে - descending order)
        const transactions = await transactionsCollection
          .find(query)
          .sort({ date: -1 })
          .toArray();

        res.status(200).send(transactions);
      } catch (error) {
        console.error("❌ Error fetching transactions:", error);
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });

    // ==========================================
    // Cashbook (টাকা গ্রহণ বা প্রদান) API
    // ==========================================
    app.post("/api/cashbook", authMiddleware, async (req, res) => {
      try {
        const data = req.body;
        const user = req.user;

        // ১. নতুন ক্যাসবুক এন্ট্রি তৈরি করা
        const newCashEntry = {
          transactionType: data.transactionType, // 'IN' (টাকা পেলাম) বা 'OUT' (টাকা দিলাম)
          category: data.category,
          partyId: data.partyId ? new ObjectId(data.partyId) : null,
          partyModel: data.partyModel, // 'Customer' বা 'Supplier'
          amount: Number(data.amount) || 0,
          date: new Date(data.date || Date.now()),
          referenceNo: data.referenceNo || "",
          note: data.note || "",

          partyName: data.partyName || null,
          partyPhone: data.partyPhone || null,

          // ইউজারের ইনফরমেশন
          userEmail: user.email,
          businessId: user.businessId,
          createdAt: new Date(),
        };

        // ২. ক্যাসবুক কালেকশনে ডাটা সেভ করা
        const result = await cashbookCollection.insertOne(newCashEntry);
        // console.log(newCashEntry)

        // ৩. যদি PartyId থাকে, তবে কাস্টমার বা সাপ্লায়ারের বর্তমান বকেয়া আপডেট করা
        if (data.partyId) {
          // টাকা পেলে (Cash In) বকেয়া কমবে, টাকা দিলে (Cash Out) বকেয়া বাড়বে
          // কিন্তু যদি সাপ্লায়ারের ক্ষেত্রে হয়, তবে সাপ্লায়ারকে টাকা দেওয়া মানে বকেয়া কমানো

          let updateValue = 0;
          if (data.transactionType === "IN") {
            // সাধারণত কাস্টমার থেকে টাকা পেলে বকেয়া কমে
            updateValue = -Math.abs(data.amount);
          } else {
            // সাপ্লায়ারকে টাকা দিলে বকেয়া কমে, অন্যান্য খরচ হলে বকেয়া বিষয় নয়
            if (data.category === "Supplier_Payment") {
              updateValue = -Math.abs(data.amount);
            } else {
              // যদি সাপ্লায়ার পেমেন্ট ছাড়া অন্য খরচ হয়, তবে পার্টি আপডেট করার দরকার নেই
              updateValue = 0;
            }
          }

          if (updateValue !== 0) {
            await partiesCollection.updateOne(
              { _id: new ObjectId(data.partyId) },
              {
                $inc: { currentDue: updateValue },
                $set: { updatedAt: new Date() },
              },
            );
          }
        }

        res.status(201).send({
          message: "Transaction successful",
          transactionId: result.insertedId,
        });
      } catch (error) {
        console.error("❌ Error in Cashbook API:", error);
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });

    // ==========================================
    // GET Cashbook Records API
    // ==========================================
    app.get("/api/cashbook", authMiddleware, async (req, res) => {
      try {
        const user = req.user;
        const query = { businessId: user.businessId };

        // ক্যাসবুক রেকর্ডগুলো তারিখ অনুযায়ী সাজানো
        const records = await cashbookCollection
          .find(query)
          .sort({ date: -1 })
          .toArray();

        res.status(200).send(records);
      } catch (error) {
        console.error("❌ Error fetching cashbook:", error);
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });

    app.get("/api/dashboard/summary", authMiddleware, async (req, res) => {
      try {
        const user = req.user;
        const businessId = user.businessId;

        // চলতি মাসের প্রথম এবং শেষ তারিখ বের করা
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(startOfMonth.getMonth() + 1);

        // Promise.all ব্যবহার করে ৫টি কুয়েরি একসাথে রান করানো (খুবই ফাস্ট হবে)
        const [
          receivableResult,
          payableResult,
          cashbookResult,
          monthlySalesResult,
          monthlyPurchasesResult,
        ] = await Promise.all([
          // ১. মোট পাওনা (Customer দের থেকে যা পাবো)
          partiesCollection
            .aggregate([
              { $match: { businessId, type: "customer" } },
              {
                $group: { _id: null, totalReceivable: { $sum: "$currentDue" } },
              },
            ])
            .toArray(),

          // ২. মোট দেনা (Supplier দের যা দিবো)
          partiesCollection
            .aggregate([
              { $match: { businessId, type: "supplier" } },
              { $group: { _id: null, totalPayable: { $sum: "$currentDue" } } },
            ])
            .toArray(),

          // ৩. হাতে নগদ (Cashbook এর IN - OUT)
          cashbookCollection
            .aggregate([
              { $match: { businessId } },
              {
                $group: {
                  _id: "$transactionType",
                  totalAmount: { $sum: "$amount" },
                },
              },
            ])
            .toArray(),

          // ৪. এই মাসের মোট আয় (Sales)
          transactionsCollection
            .aggregate([
              {
                $match: {
                  businessId,
                  type: "sale",
                  date: { $gte: startOfMonth, $lt: endOfMonth },
                },
              },
              { $group: { _id: null, totalIncome: { $sum: "$grandTotal" } } },
            ])
            .toArray(),

          // ৫. এই মাসের মোট ব্যয় (Purchases)
          transactionsCollection
            .aggregate([
              {
                $match: {
                  businessId,
                  type: "purchase",
                  date: { $gte: startOfMonth, $lt: endOfMonth },
                },
              },
              { $group: { _id: null, totalExpense: { $sum: "$grandTotal" } } },
            ])
            .toArray(),
        ]);

        // ডাটা এক্সট্রাক্ট করা (যদি ডাটা না থাকে তবে ০ হবে)
        const totalReceivable = receivableResult[0]?.totalReceivable || 0;
        const totalPayable = payableResult[0]?.totalPayable || 0;

        // Cash Calculation
        let cashIn = 0;
        let cashOut = 0;
        cashbookResult.forEach((item) => {
          if (item._id === "IN") cashIn = item.totalAmount;
          if (item._id === "OUT") cashOut = item.totalAmount;
        });
        const cashInHand = cashIn - cashOut;

        // Monthly Profit/Loss Calculation
        const monthlyIncome = monthlySalesResult[0]?.totalIncome || 0;
        const monthlyExpense = monthlyPurchasesResult[0]?.totalExpense || 0;
        const netProfit = monthlyIncome - monthlyExpense;

        // মোট ব্যালেন্স = হাতে নগদ + পাওনা - দেনা
        const totalBalance = cashInHand + totalReceivable - totalPayable;

        res.status(200).send({
          totalBalance,
          cashInHand,
          totalReceivable,
          totalPayable,
          monthlyIncome,
          monthlyExpense,
          netProfit,
        });
      } catch (error) {
        console.error("❌ Error fetching dashboard summary:", error);
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });

    app.get(
      "/api/dashboard/recent-transactions",
      authMiddleware,
      async (req, res) => {
        try {
          const user = req.user;

          // সর্বশেষ ৬টি সেলস বা পারচেজ আনবে।
          // Aggregate এ $lookup ব্যবহার করা হয়েছে যাতে Party এর নাম পাওয়া যায়।
          const recentTransactions = await transactionsCollection
            .aggregate([
              { $match: { businessId: user.businessId } },
              { $sort: { date: -1, createdAt: -1 } },
              { $limit: 5 },
              {
                $lookup: {
                  from: "parties", // আপনার ডাটাবেসের কালেকশনের সঠিক নাম দিবেন
                  localField: "partyId",
                  foreignField: "_id",
                  as: "partyInfo",
                },
              },
              {
                $unwind: {
                  path: "$partyInfo",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $project: {
                  type: 1,
                  invoiceNo: 1,
                  grandTotal: 1,
                  dueAmount: 1,
                  date: 1,
                  partyName: "$partyInfo.name",
                  partyType: "$partyInfo.type",
                },
              },
            ])
            .toArray();

          res.status(200).send(recentTransactions);
        } catch (error) {
          res
            .status(500)
            .send({ message: "Server error", error: error.message });
        }
      },
    );

    app.get("/api/dashboard/due-list", authMiddleware, async (req, res) => {
      try {
        const user = req.user;

        const dueList = await partiesCollection
          .find({
            businessId: user.businessId,
            type: "customer",
            currentDue: { $gt: 0 },
          })
          .sort({ currentDue: -1 }) // সবচেয়ে বেশি বকেয়া উপরে
          .limit(5)
          .project({ name: 1, phone: 1, currentDue: 1, updatedAt: 1 }) // শুধু প্রয়োজনীয় ডাটা পাঠাচ্ছি
          .toArray();

        res.status(200).send(dueList);
      } catch (error) {
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });

    app.get("/api/dashboard/stock-alerts", authMiddleware, async (req, res) => {
      try {
        const user = req.user;

        const stockAlerts = await productsCollection
          .find({
            businessId: user.businessId,
            $expr: { $lte: ["$stockQuantity", "$lowStockAlert"] }, // stock <= alert
          })
          .sort({ stockQuantity: 1 }) // যার স্টক সবচেয়ে কম সে উপরে
          .limit(5)
          .project({ name: 1, category: 1, stockQuantity: 1, lowStockAlert: 1 })
          .toArray();

        res.status(200).send(stockAlerts);
      } catch (error) {
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });

    app.get("/api/dashboard/top-products", authMiddleware, async (req, res) => {
      try {
        const user = req.user;

        const topProducts = await transactionsCollection
          .aggregate([
            { $match: { businessId: user.businessId, type: "sale" } },
            { $unwind: "$items" }, // items অ্যারের প্রতিটি অবজেক্টকে আলাদা করবে
            {
              $group: {
                _id: "$items.productId",
                name: { $first: "$items.name" },
                totalQuantitySold: { $sum: "$items.quantity" },
                totalRevenue: { $sum: "$items.totalLineAmount" },
              },
            },
            { $sort: { totalQuantitySold: -1 } }, // সবচেয়ে বেশি বিক্রিত আগে
            { $limit: 5 },
          ])
          .toArray();

        res.status(200).send(topProducts);
      } catch (error) {
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });

    app.get("/api/dashboard/weekly-chart", authMiddleware, async (req, res) => {
      try {
        const user = req.user;

        // ৭ দিন আগের তারিখ বের করা
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // আজ সহ ৭ দিন
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const chartData = await transactionsCollection
          .aggregate([
            {
              $match: {
                businessId: user.businessId,
                type: "sale",
                date: { $gte: sevenDaysAgo },
              },
            },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, // তারিখ অনুযায়ী গ্রুপ
                totalSales: { $sum: "$grandTotal" },
                totalDue: { $sum: "$dueAmount" },
              },
            },
            { $sort: { _id: 1 } }, // তারিখ অনুযায়ী সোজা করে সাজানো (পুরোনো থেকে নতুন)
          ])
          .toArray();

        res.status(200).send(chartData);
      } catch (error) {
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });

    app.get("/api/reports/summary-cards", authMiddleware, async (req, res) => {
      try {
        const user = req.user;
        const businessId = user.businessId;

        const now = new Date();
        // চলতি মাস
        const startOfCurrentMonth = new Date(
          now.getFullYear(),
          now.getMonth(),
          1,
        );
        const endOfCurrentMonth = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59,
        );
        // গত মাস
        const startOfPrevMonth = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1,
        );
        const endOfPrevMonth = new Date(
          now.getFullYear(),
          now.getMonth(),
          0,
          23,
          59,
          59,
        );

        const [currentMonthData, prevMonthData] = await Promise.all([
          // চলতি মাসের হিসাব
          transactionsCollection
            .aggregate([
              {
                $match: {
                  businessId,
                  date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
                },
              },
              {
                $group: {
                  _id: "$type",
                  totalAmount: { $sum: "$grandTotal" },
                  invoiceCount: { $sum: 1 },
                },
              },
            ])
            .toArray(),

          // গত মাসের হিসাব
          transactionsCollection
            .aggregate([
              {
                $match: {
                  businessId,
                  date: { $gte: startOfPrevMonth, $lte: endOfPrevMonth },
                },
              },
              {
                $group: { _id: "$type", totalAmount: { $sum: "$grandTotal" } },
              },
            ])
            .toArray(),
        ]);

        // ডেটা প্রসেসিং
        let currentIncome = 0,
          currentExpense = 0,
          currentInvoices = 0;
        currentMonthData.forEach((item) => {
          if (item._id === "sale") {
            currentIncome = item.totalAmount;
            currentInvoices = item.invoiceCount;
          }
          if (item._id === "purchase") currentExpense = item.totalAmount;
        });

        let prevIncome = 0,
          prevExpense = 0;
        prevMonthData.forEach((item) => {
          if (item._id === "sale") prevIncome = item.totalAmount;
          if (item._id === "purchase") prevExpense = item.totalAmount;
        });

        const currentNetProfit = currentIncome - currentExpense;
        const prevNetProfit = prevIncome - prevExpense;

        // পার্সেন্টেজ ক্যালকুলেশন ফাংশন
        const calcGrowth = (current, prev) =>
          prev === 0 ? 100 : (((current - prev) / prev) * 100).toFixed(1);

        res.status(200).send({
          totalIncome: currentIncome,
          incomeGrowth: calcGrowth(currentIncome, prevIncome),

          totalExpense: currentExpense,
          expenseGrowth: calcGrowth(currentExpense, prevExpense),

          netProfit: currentNetProfit,
          profitGrowth: calcGrowth(currentNetProfit, prevNetProfit),

          totalInvoices: currentInvoices,
        });
      } catch (error) {
        console.error("❌ Error fetching summary cards:", error);
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });

    app.get(
      "/api/reports/income-expense-chart",
      authMiddleware,
      async (req, res) => {
        try {
          const user = req.user;
          const currentYear = new Date().getFullYear();
          const startOfYear = new Date(currentYear, 0, 1);
          const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

          const chartData = await transactionsCollection
            .aggregate([
              {
                $match: {
                  businessId: user.businessId,
                  date: { $gte: startOfYear, $lte: endOfYear },
                },
              },
              {
                $group: {
                  _id: {
                    month: { $month: "$date" },
                    type: "$type",
                  },
                  total: { $sum: "$grandTotal" },
                },
              },
            ])
            .toArray();

          // ১২ মাসের জন্য ডিফল্ট এরে তৈরি করা
          const monthlyData = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            income: 0,
            expense: 0,
          }));

          // ডাটাবেস থেকে পাওয়া ডাটা ম্যাপিং করা
          chartData.forEach((item) => {
            const monthIndex = item._id.month - 1;
            if (item._id.type === "sale") {
              monthlyData[monthIndex].income = item.total;
            } else if (item._id.type === "purchase") {
              monthlyData[monthIndex].expense = item.total;
            }
          });

          res.status(200).send(monthlyData);
        } catch (error) {
          console.error("❌ Error fetching chart data:", error);
          res
            .status(500)
            .send({ message: "Server error", error: error.message });
        }
      },
    );

    app.get(
      "/api/reports/expense-categories",
      authMiddleware,
      async (req, res) => {
        try {
          const user = req.user;
          const businessId = user.businessId;

          const startOfMonth = new Date();
          startOfMonth.setDate(1);
          startOfMonth.setHours(0, 0, 0, 0);

          // ১. পণ্য ক্রয় (Purchases থেকে)
          const purchaseExpenses = await transactionsCollection
            .aggregate([
              {
                $match: {
                  businessId,
                  type: "purchase",
                  date: { $gte: startOfMonth },
                },
              },
              { $group: { _id: "পণ্য ক্রয়", total: { $sum: "$grandTotal" } } },
            ])
            .toArray();

          // ২. অন্যান্য খরচ (Cashbook থেকে - OUT transaction)
          const otherExpenses = await cashbookCollection
            .aggregate([
              {
                $match: {
                  businessId,
                  transactionType: "OUT",
                  date: { $gte: startOfMonth },
                  category: { $ne: "Supplier_Payment" }, // সাপ্লায়ার পেমেন্ট বাদ, কারণ তা Purchases এ ধরেছি
                },
              },
              { $group: { _id: "$category", total: { $sum: "$amount" } } },
            ])
            .toArray();

          // সব ডেটা একসাথে করা
          const allExpenses = [...purchaseExpenses, ...otherExpenses].map(
            (item) => ({
              category: item._id, // Frontend এ 'বেতন', 'ভাড়া', 'অন্যান্য' হিসেবে ম্যাপ করবেন
              amount: item.total,
            }),
          );

          res.status(200).send(allExpenses);
        } catch (error) {
          console.error("❌ Error fetching expense categories:", error);
          res
            .status(500)
            .send({ message: "Server error", error: error.message });
        }
      },
    );

    app.get("/api/reports/top-customers", authMiddleware, async (req, res) => {
      try {
        const user = req.user;
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const topCustomers = await transactionsCollection
          .aggregate([
            {
              $match: {
                businessId: user.businessId,
                type: "sale",
                date: { $gte: startOfMonth },
              },
            },
            {
              $group: {
                _id: "$partyId",
                totalPurchaseAmount: { $sum: "$grandTotal" }, // মোট কত টাকার কিনেছে
                totalTransactions: { $sum: 1 }, // কয়বার কিনেছে
              },
            },
            { $sort: { totalPurchaseAmount: -1 } }, // সবচেয়ে বেশি কেনা গ্রাহক উপরে
            { $limit: 5 }, // শীর্ষ ৫ জন
            {
              $lookup: {
                from: "parties",
                localField: "_id",
                foreignField: "_id",
                as: "customerInfo",
              },
            },
            {
              $unwind: {
                path: "$customerInfo",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                name: { $ifNull: ["$customerInfo.name", "নগদ বিক্রয়"] },
                phone: "$customerInfo.phone",
                totalPurchaseAmount: 1,
                totalTransactions: 1,
              },
            },
          ])
          .toArray();

        res.status(200).send(topCustomers);
      } catch (error) {
        console.error("❌ Error fetching top customers:", error);
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
