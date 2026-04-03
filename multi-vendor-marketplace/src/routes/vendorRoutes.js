const express = require("express");
const router = express.Router();
const { createVendor, getVendorProfile } = require("../controllers/vendorController");
const { protect, authorize } = require("../middlewares/authMiddleware");

/**
 * All vendor routes require authentication
 */
router.use(protect);

/**
 * @route   POST /api/v1/vendors
 * @desc    Create a new vendor profile for the logged-in user
 * @access  Private (Registered Users)
 */
router.post("/", createVendor);

/**
 * @route   GET /api/v1/vendors/me
 * @desc    Get current vendor profile details (Store name, balance, etc.)
 * @access  Private (Vendor only)
 */
router.get("/me", authorize("vendor", "admin"), getVendorProfile);

module.exports = router;