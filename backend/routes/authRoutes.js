const express = require("express");
const router = express.Router();
const { getMe, logout, register, verifyOtp, login, resendOtp } = require("../controllers/authController");

// Auth Routes
router.get("/me", getMe);
router.post("/logout", logout);
router.post("/register", register);
router.post("/login", login);
// Note: Verify OTP was directly on /verify-otp in your old code. We moved it to /api/auth/verify-otp for structure.
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp); 

module.exports = router;