const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Import controllers (You will create these functions in controllers/transactionController.js)
const {
  addPurchase,
  addSale,
  getTransactionsByParty,
  addCashbookEntry,
  getCashbookRecords,
  addParty,
  getParties,
  getPartyById,
  addProduct,
  getProducts,
} = require("../controllers/transactionController");

// Parties & Inventory Routes
router.post("/parties", authMiddleware, addParty);
router.get("/parties", authMiddleware, getParties);
router.get("/parties/:partyId", authMiddleware, getPartyById);

router.post("/inventory", authMiddleware, addProduct);
router.get("/inventory", authMiddleware, getProducts);

// Transactions Routes (Sales & Purchases)
router.post("/purchases", authMiddleware, addPurchase);
router.post("/sales", authMiddleware, addSale);
router.get("/transactions/:partyId", authMiddleware, getTransactionsByParty);

// Cashbook Routes
router.post("/cashbook", authMiddleware, addCashbookEntry);
router.get("/cashbook", authMiddleware, getCashbookRecords);

module.exports = router;
