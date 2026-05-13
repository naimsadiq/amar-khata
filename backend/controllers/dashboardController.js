const { getCollections } = require("../config/db");

// Get Dashboard Main Summary
const getDashboardSummary = async (req, res) => {
  try {
    const { partiesCollection, cashbookCollection, transactionsCollection } =
      getCollections();
    const businessId = req.user.businessId;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1);

    const [
      receivableResult,
      payableResult,
      cashbookResult,
      monthlySalesResult,
      monthlyPurchasesResult,
    ] = await Promise.all([
      partiesCollection
        .aggregate([
          { $match: { businessId, type: "customer" } },
          { $group: { _id: null, totalReceivable: { $sum: "$currentDue" } } },
        ])
        .toArray(),
      partiesCollection
        .aggregate([
          { $match: { businessId, type: "supplier" } },
          { $group: { _id: null, totalPayable: { $sum: "$currentDue" } } },
        ])
        .toArray(),
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

    const totalReceivable = receivableResult[0]?.totalReceivable || 0;
    const totalPayable = payableResult[0]?.totalPayable || 0;

    let cashIn = 0,
      cashOut = 0;
    cashbookResult.forEach((item) => {
      if (item._id === "IN") cashIn = item.totalAmount;
      if (item._id === "OUT") cashOut = item.totalAmount;
    });
    const cashInHand = cashIn - cashOut;

    const monthlyIncome = monthlySalesResult[0]?.totalIncome || 0;
    const monthlyExpense = monthlyPurchasesResult[0]?.totalExpense || 0;
    const netProfit = monthlyIncome - monthlyExpense;
    const totalBalance = cashInHand + totalReceivable - totalPayable;

    res
      .status(200)
      .send({
        totalBalance,
        cashInHand,
        totalReceivable,
        totalPayable,
        monthlyIncome,
        monthlyExpense,
        netProfit,
      });
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

// Get Recent Transactions
const getRecentTransactions = async (req, res) => {
  try {
    const { transactionsCollection } = getCollections();
    const recentTransactions = await transactionsCollection
      .aggregate([
        { $match: { businessId: req.user.businessId } },
        { $sort: { date: -1, createdAt: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "parties",
            localField: "partyId",
            foreignField: "_id",
            as: "partyInfo",
          },
        },
        { $unwind: { path: "$partyInfo", preserveNullAndEmptyArrays: true } },
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
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

// Get Customer Due List
const getDueList = async (req, res) => {
  try {
    const { partiesCollection } = getCollections();
    const dueList = await partiesCollection
      .find({
        businessId: req.user.businessId,
        type: "customer",
        currentDue: { $gt: 0 },
      })
      .sort({ currentDue: -1 })
      .limit(5)
      .project({ name: 1, phone: 1, currentDue: 1, updatedAt: 1 })
      .toArray();

    res.status(200).send(dueList);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

// Get Stock Alerts
const getStockAlerts = async (req, res) => {
  try {
    const { productsCollection } = getCollections();
    const stockAlerts = await productsCollection
      .find({
        businessId: req.user.businessId,
        $expr: { $lte: ["$stockQuantity", "$lowStockAlert"] },
      })
      .sort({ stockQuantity: 1 })
      .limit(5)
      .project({ name: 1, category: 1, stockQuantity: 1, lowStockAlert: 1 })
      .toArray();

    res.status(200).send(stockAlerts);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

// Get Top Selling Products
const getTopProducts = async (req, res) => {
  try {
    const { transactionsCollection } = getCollections();
    const topProducts = await transactionsCollection
      .aggregate([
        { $match: { businessId: req.user.businessId, type: "sale" } },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.productId",
            name: { $first: "$items.name" },
            totalQuantitySold: { $sum: "$items.quantity" },
            totalRevenue: { $sum: "$items.totalLineAmount" },
          },
        },
        { $sort: { totalQuantitySold: -1 } },
        { $limit: 5 },
      ])
      .toArray();

    res.status(200).send(topProducts);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

// Get Last 7 Days Sales Chart Data
const getWeeklyChart = async (req, res) => {
  try {
    const { transactionsCollection } = getCollections();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const chartData = await transactionsCollection
      .aggregate([
        {
          $match: {
            businessId: req.user.businessId,
            type: "sale",
            date: { $gte: sevenDaysAgo },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            totalSales: { $sum: "$grandTotal" },
            totalDue: { $sum: "$dueAmount" },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    res.status(200).send(chartData);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

// Reports: Summary Cards (Compare this month vs last month)
const getSummaryCards = async (req, res) => {
  try {
    const { transactionsCollection } = getCollections();
    const businessId = req.user.businessId;
    const now = new Date();

    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    );
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
    );

    const [currentMonthData, prevMonthData] = await Promise.all([
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
      transactionsCollection
        .aggregate([
          {
            $match: {
              businessId,
              date: { $gte: startOfPrevMonth, $lte: endOfPrevMonth },
            },
          },
          { $group: { _id: "$type", totalAmount: { $sum: "$grandTotal" } } },
        ])
        .toArray(),
    ]);

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
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

// Reports: Yearly Income Expense Chart
const getIncomeExpenseChart = async (req, res) => {
  try {
    const { transactionsCollection } = getCollections();
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

    const chartData = await transactionsCollection
      .aggregate([
        {
          $match: {
            businessId: req.user.businessId,
            date: { $gte: startOfYear, $lte: endOfYear },
          },
        },
        {
          $group: {
            _id: { month: { $month: "$date" }, type: "$type" },
            total: { $sum: "$grandTotal" },
          },
        },
      ])
      .toArray();

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      income: 0,
      expense: 0,
    }));
    chartData.forEach((item) => {
      const monthIndex = item._id.month - 1;
      if (item._id.type === "sale") monthlyData[monthIndex].income = item.total;
      else if (item._id.type === "purchase")
        monthlyData[monthIndex].expense = item.total;
    });

    res.status(200).send(monthlyData);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

// Reports: Expense Categories breakdown
const getExpenseCategories = async (req, res) => {
  try {
    const { transactionsCollection, cashbookCollection } = getCollections();
    const businessId = req.user.businessId;
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const purchaseExpenses = await transactionsCollection
      .aggregate([
        {
          $match: {
            businessId,
            type: "purchase",
            date: { $gte: startOfMonth },
          },
        },
        { $group: { _id: "Purchases", total: { $sum: "$grandTotal" } } },
      ])
      .toArray();

    const otherExpenses = await cashbookCollection
      .aggregate([
        {
          $match: {
            businessId,
            transactionType: "OUT",
            date: { $gte: startOfMonth },
            category: { $ne: "Supplier_Payment" },
          },
        },
        { $group: { _id: "$category", total: { $sum: "$amount" } } },
      ])
      .toArray();

    const allExpenses = [...purchaseExpenses, ...otherExpenses].map((item) => ({
      category: item._id,
      amount: item.total,
    }));
    res.status(200).send(allExpenses);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

// Reports: Top Customers List
const getTopCustomers = async (req, res) => {
  try {
    const { transactionsCollection } = getCollections();
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const topCustomers = await transactionsCollection
      .aggregate([
        {
          $match: {
            businessId: req.user.businessId,
            type: "sale",
            date: { $gte: startOfMonth },
          },
        },
        {
          $group: {
            _id: "$partyId",
            totalPurchaseAmount: { $sum: "$grandTotal" },
            totalTransactions: { $sum: 1 },
          },
        },
        { $sort: { totalPurchaseAmount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "parties",
            localField: "_id",
            foreignField: "_id",
            as: "customerInfo",
          },
        },
        {
          $unwind: { path: "$customerInfo", preserveNullAndEmptyArrays: true },
        },
        {
          $project: {
            name: { $ifNull: ["$customerInfo.name", "Cash Sale"] },
            phone: "$customerInfo.phone",
            totalPurchaseAmount: 1,
            totalTransactions: 1,
          },
        },
      ])
      .toArray();

    res.status(200).send(topCustomers);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getDashboardSummary,
  getRecentTransactions,
  getDueList,
  getStockAlerts,
  getTopProducts,
  getWeeklyChart,
  getSummaryCards,
  getIncomeExpenseChart,
  getExpenseCategories,
  getTopCustomers,
};
