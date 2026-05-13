const { ObjectId } = require("mongodb");
const { getCollections } = require("../config/db");

// ==========================
// PARTIES
// ==========================
const addParty = async (req, res) => {
  try {
    const { partiesCollection } = getCollections();
    const party = req.body;
    const user = req.user;

    const newParty = {
      ...party,
      currentDue: party.openingBalance,
      userEmail: user.email,
      userPhone: user.phone,
      businessId: user.businessId,
      businessName: user.businessName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await partiesCollection.insertOne(newParty);
    res
      .status(201)
      .send({ message: "Party created successfully", party: newParty });
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

const getParties = async (req, res) => {
  try {
    const { partiesCollection } = getCollections();
    const parties = await partiesCollection
      .find({ businessId: req.user.businessId })
      .toArray();
    res.status(200).send(parties);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

const getPartyById = async (req, res) => {
  try {
    const { partiesCollection } = getCollections();
    const { partyId } = req.params;

    if (!ObjectId.isValid(partyId))
      return res.status(400).send({ message: "Invalid party ID format" });

    const party = await partiesCollection.findOne({
      _id: new ObjectId(partyId),
      businessId: req.user.businessId,
    });
    if (!party) return res.status(404).send({ message: "Party not found" });

    res.status(200).send(party);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

// ==========================
// INVENTORY (PRODUCTS)
// ==========================
const addProduct = async (req, res) => {
  try {
    const { productsCollection } = getCollections();
    const product = req.body;
    const user = req.user;

    const newProduct = {
      name: product.name,
      category: product.category,
      unit: product.unit,
      buyPrice: Number(product.buyPrice) || 0,
      sellPrice: Number(product.sellPrice) || 0,
      openingStock: Number(product.openingStock) || 0,
      stockQuantity: Number(product.openingStock) || 0,
      lowStockAlert: Number(product.lowStockAlert) || 5,
      userEmail: user.email,
      userPhone: user.phone,
      businessId: user.businessId,
      businessName: user.businessName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await productsCollection.insertOne(newProduct);
    res
      .status(201)
      .send({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const { productsCollection } = getCollections();
    const products = await productsCollection
      .find({ businessId: req.user.businessId })
      .sort({ createdAt: -1 })
      .toArray();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

// ==========================
// TRANSACTIONS (PURCHASE/SALE)
// ==========================
const addPurchase = async (req, res) => {
  try {
    const {
      transactionsCollection,
      partiesCollection,
      cashbookCollection,
      productsCollection,
    } = getCollections();
    const data = req.body;
    const user = req.user;
    const supplierObjectId = new ObjectId(data.supplierId);

    const invoiceNo = `PUR-${Date.now().toString().slice(-6)}`;

    const formattedItems = data.items.map((item) => ({
      productId: new ObjectId(item.productId),
      quantity: Number(item.quantity) || 0,
      price: Number(item.buyPriceAtPurchase) || 0,
      totalLineAmount: Number(item.totalLineAmount) || 0,
    }));

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

    const result = await transactionsCollection.insertOne(newPurchase);

    // Update supplier due
    if (newPurchase.dueAmount > 0) {
      await partiesCollection.updateOne(
        { _id: supplierObjectId },
        {
          $inc: { currentDue: newPurchase.dueAmount },
          $set: { updatedAt: new Date() },
        },
      );
    }

    // Cashbook update if cash paid
    if (newPurchase.paidAmount > 0) {
      const supplierInfo = await partiesCollection.findOne({
        _id: supplierObjectId,
      });
      await cashbookCollection.insertOne({
        transactionType: "OUT",
        category: "Supplier_Payment",
        partyId: supplierObjectId,
        partyName: supplierInfo?.name || "Unknown Supplier",
        partyPhone: supplierInfo?.phone || "",
        partyModel: "Supplier",
        amount: newPurchase.paidAmount,
        date: newPurchase.date,
        referenceNo: newPurchase.invoiceNo,
        note: `Purchase Payment (Invoice: ${newPurchase.invoiceNo})`,
        userEmail: user.email,
        businessId: user.businessId,
        createdAt: new Date(),
      });
    }

    // Update stock & product master data
    for (const item of data.items) {
      await productsCollection.updateOne(
        { _id: new ObjectId(item.productId) },
        {
          $inc: { stockQuantity: Number(item.quantity) || 0 },
          $set: {
            buyPrice: Number(item.buyPriceAtPurchase) || 0,
            sellPrice: Number(data.updateMasterData?.newSellPrice) || 0,
            unit: data.updateMasterData?.unit || "Piece",
            updatedAt: new Date(),
          },
        },
      );
    }

    res
      .status(201)
      .send({
        message: "Purchase completed successfully",
        purchaseId: result.insertedId,
      });
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

const addSale = async (req, res) => {
  try {
    const {
      transactionsCollection,
      partiesCollection,
      cashbookCollection,
      productsCollection,
    } = getCollections();
    const data = req.body;
    const user = req.user;

    const invoiceNo =
      data.invoiceNo || `INV-${Date.now().toString().slice(-6)}`;
    const formattedItems = data.items.map((item) => ({
      productId: new ObjectId(item.productId),
      name: item.name,
      quantity: Number(item.quantity) || 0,
      price: Number(item.price) || 0,
      totalLineAmount: Number(item.totalLineAmount) || 0,
    }));

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

    const result = await transactionsCollection.insertOne(newSale);

    // Update customer due
    if (newSale.dueAmount > 0 && newSale.partyId) {
      await partiesCollection.updateOne(
        { _id: newSale.partyId },
        {
          $inc: { currentDue: newSale.dueAmount },
          $set: { updatedAt: new Date() },
        },
      );
    }

    // Cashbook update if cash received
    if (newSale.paidAmount > 0) {
      let partyName = "Cash Sale";
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
        partyName: partyName,
        partyPhone: partyPhone,
        partyModel: "Customer",
        amount: newSale.paidAmount,
        date: newSale.date,
        referenceNo: newSale.invoiceNo,
        note: `Sale Received (Invoice: ${newSale.invoiceNo})`,
        userEmail: user.email,
        businessId: user.businessId,
        createdAt: new Date(),
      });
    }

    // Update stock deduction
    for (const item of formattedItems) {
      await productsCollection.updateOne(
        { _id: item.productId },
        {
          $inc: { stockQuantity: -Math.abs(item.quantity) },
          $set: { updatedAt: new Date() },
        },
      );
    }

    res
      .status(201)
      .send({
        message: "Sale completed successfully",
        saleId: result.insertedId,
      });
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

const getTransactionsByParty = async (req, res) => {
  try {
    const { transactionsCollection } = getCollections();
    const { partyId } = req.params;

    if (!ObjectId.isValid(partyId))
      return res.status(400).send({ message: "Invalid Party ID" });

    const transactions = await transactionsCollection
      .find({ partyId: new ObjectId(partyId), businessId: req.user.businessId })
      .sort({ date: -1 })
      .toArray();

    res.status(200).send(transactions);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

// ==========================
// CASHBOOK
// ==========================
const addCashbookEntry = async (req, res) => {
  try {
    const { cashbookCollection, partiesCollection } = getCollections();
    const data = req.body;
    const user = req.user;

    const newCashEntry = {
      transactionType: data.transactionType, // 'IN' or 'OUT'
      category: data.category,
      partyId: data.partyId ? new ObjectId(data.partyId) : null,
      partyModel: data.partyModel,
      amount: Number(data.amount) || 0,
      date: new Date(data.date || Date.now()),
      referenceNo: data.referenceNo || "",
      note: data.note || "",
      partyName: data.partyName || null,
      partyPhone: data.partyPhone || null,
      userEmail: user.email,
      businessId: user.businessId,
      createdAt: new Date(),
    };

    const result = await cashbookCollection.insertOne(newCashEntry);

    // Update Party Due based on IN/OUT
    if (data.partyId) {
      let updateValue = 0;
      if (data.transactionType === "IN") {
        updateValue = -Math.abs(data.amount); // Customer paid, due decreases
      } else if (data.category === "Supplier_Payment") {
        updateValue = -Math.abs(data.amount); // Paid supplier, due decreases
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

    res
      .status(201)
      .send({
        message: "Transaction successful",
        transactionId: result.insertedId,
      });
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

const getCashbookRecords = async (req, res) => {
  try {
    const { cashbookCollection } = getCollections();
    const records = await cashbookCollection
      .find({ businessId: req.user.businessId })
      .sort({ date: -1 })
      .toArray();
    res.status(200).send(records);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addParty,
  getParties,
  getPartyById,
  addProduct,
  getProducts,
  addPurchase,
  addSale,
  getTransactionsByParty,
  addCashbookEntry,
  getCashbookRecords,
};
