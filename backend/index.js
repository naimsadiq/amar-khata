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
