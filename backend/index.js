// index.js
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]); // Google and Cloudflare DNS

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { connectDB } = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://amar-khata-xi.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Connect Database
connectDB();

// API Routes setup
app.use("/api/auth", authRoutes); // handles /api/auth/login, /api/auth/register etc.
app.use("/api/users", userRoutes); // handles /api/users/profile
app.use("/api", transactionRoutes); // handles /api/sales, /api/purchases, /api/parties etc.
app.use("/api", dashboardRoutes); // handles /api/dashboard/... and /api/reports/...

// Default Route
app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
