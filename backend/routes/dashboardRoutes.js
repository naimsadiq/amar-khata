const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Import controllers (You will create these functions in controllers/dashboardController.js)
const { 
  getDashboardSummary, getRecentTransactions, getDueList, 
  getStockAlerts, getTopProducts, getWeeklyChart,
  getSummaryCards, getIncomeExpenseChart, getExpenseCategories, getTopCustomers
} = require("../controllers/dashboardController");

// Dashboard Routes
router.get("/dashboard/summary", authMiddleware, getDashboardSummary);
router.get("/dashboard/recent-transactions", authMiddleware, getRecentTransactions);
router.get("/dashboard/due-list", authMiddleware, getDueList);
router.get("/dashboard/stock-alerts", authMiddleware, getStockAlerts);
router.get("/dashboard/top-products", authMiddleware, getTopProducts);
router.get("/dashboard/weekly-chart", authMiddleware, getWeeklyChart);

// Report Routes
router.get("/reports/summary-cards", authMiddleware, getSummaryCards);
router.get("/reports/income-expense-chart", authMiddleware, getIncomeExpenseChart);
router.get("/reports/expense-categories", authMiddleware, getExpenseCategories);
router.get("/reports/top-customers", authMiddleware, getTopCustomers);

module.exports = router;