const express = require("express");
const router = express.Router();
const { 
  createOrder, 
  getMyOrders, 
  getVendorOrders,
  updateOrderToDelivered
} = require("../controllers/orderController");

const { protect, authorize } = require("../middlewares/authMiddleware");

/**
 * All order routes require authentication
 */
router.use(protect);

/**
 * @route   POST /api/v1/orders
 * @desc    Place a new order from current cart
 * @access  Private (Customer/Vendor/Admin)
 */
router.post("/", createOrder);

/**
 * @route   GET /api/v1/orders/my
 * @desc    Get order history for the logged-in user
 * @access  Private (Owner only)
 */
router.get("/my", getMyOrders);


/**
 * @route   GET /api/v1/orders/vendor/all
 * @desc    Get orders containing items from the vendor's store
 * @access  Private (Vendor only)
 */
router.get("/vendor/all", authorize("vendor", "admin"), getVendorOrders);
router.put("/:id/deliver", authorize("vendor", "admin"), updateOrderToDelivered);

module.exports = router;