const { MongoClient, ServerApiVersion } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Vercel serverless-এর জন্য db অবজেক্টটি আগে থেকেই তৈরি করে রাখা ভালো
const db = client.db("amar_khata_db");

const connectDB = async () => {
  try {
    await client.connect();
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

const getCollections = () => {
  return {
    userCollection: db.collection("users"),
    partiesCollection: db.collection("parties"),
    productsCollection: db.collection("products"),
    transactionsCollection: db.collection("transactions"),
    cashbookCollection: db.collection("cashbook"),
  };
};

module.exports = { connectDB, getCollections };
