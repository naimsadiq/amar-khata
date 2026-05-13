const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getProfile, updateProfile } = require("../controllers/userController");

// User Profile Routes
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

module.exports = router;