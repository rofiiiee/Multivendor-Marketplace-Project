const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware"); 
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
  createProduct,
  getProducts,
  getVendorProducts,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

/**
 * @route   GET /api/v1/products
 * @desc    Get all available products for customers
 * @access  Public
 */
router.get("/", getProducts);

/**
 * @route   GET /api/v1/products/vendor
 * @desc    Get only products belonging to the logged-in vendor
 * @access  Private (Vendor only)
 */
router.get("/vendor", protect, authorize("vendor", "admin"), getVendorProducts);

/**
 * @route   POST /api/v1/products
 * @desc    Create a new product with image upload
 * @access  Private (Vendor only)
 */
router.post("/", protect, authorize("vendor", "admin"), upload.single("image"), createProduct);

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Update product details and/or product image
 * @access  Private (Owner only)
 */
router.put("/:id", protect, authorize("vendor", "admin"), upload.single("image"), updateProduct);

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Remove a product from the marketplace
 * @access  Private (Owner only)
 */
router.delete("/:id", protect, authorize("vendor", "admin"), deleteProduct);

module.exports = router;