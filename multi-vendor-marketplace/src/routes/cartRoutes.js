const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { 
  addToCart, 
  getCart, 
  updateCartQuantity, 
  removeItemFromCart 
} = require("../controllers/cartController");

/**
 * All cart routes are protected and require a valid user token
 */
router.use(protect);

/**
 * @route   GET /api/v1/cart
 * @desc    Get the current user's shopping cart
 * @access  Private (Authenticated User)
 */
router.get("/", getCart);

/**
 * @route   POST /api/v1/cart
 * @desc    Add a product to the cart
 * @access  Private (Authenticated User)
 */
router.post("/", addToCart);

/**
 * @route   PUT /api/v1/cart
 * @desc    Update quantity for a product in the cart
 * @access  Private (Authenticated User)
 */
router.put("/", updateCartQuantity);

/**
 * @route   DELETE /api/v1/cart/:productId
 * @desc    Remove a specific product from the cart
 * @access  Private (Authenticated User)
 */
router.delete("/:productId", removeItemFromCart);

module.exports = router;