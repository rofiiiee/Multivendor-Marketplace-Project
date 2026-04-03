const express = require("express");
const router = express.Router();
const { createCategory, getCategories } = require("../controllers/categoryController");
const { protect, authorize } = require("../middlewares/authMiddleware");

/**
 * @route   GET /api/v1/categories
 * @desc    Get all available categories for product filtering
 * @access  Public
 */
router.get("/", getCategories);

/**
 * @route   POST /api/v1/categories
 * @desc    Create a new product category
 * @access  Private (Admin/Vendor only)
 */
router.post("/", protect, authorize("admin", "vendor"), createCategory);

module.exports = router;