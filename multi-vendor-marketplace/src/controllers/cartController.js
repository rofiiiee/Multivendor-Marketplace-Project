const Cart = require("../models/Cart");
const Product = require("../models/Product");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

/**
 * Add a product to the user's shopping cart
 */
exports.addToCart = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  // 1) Check if product exists in database
  const product = await Product.findById(productId);
  if (!product) return next(new AppError("This product no longer exists", 404));

  // 2) Find user cart
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    // Create new cart if it doesn't exist
    cart = await Cart.create({
      user: userId,
      items: [{ product: productId, quantity, price: product.price }],
    });
  } else {
    // Check if product already exists in cart
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      // If product exists, increment quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // If product doesn't exist, push to items array
      cart.items.push({ product: productId, quantity, price: product.price });
    }
  }

  await cart.save();
  
  res.status(200).json({
    status: "success",
    data: {
      cart
    },
  });
});

/**
 * Get the current user's cart with calculated totals
 */
exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id })
    .populate("items.product", "name price image");
  
  if (!cart) {
    return res.status(200).json({
      status: "success",
      results: 0,
      data: {
        cart: { items: [] }
      }
    });
  }

  // Calculate total price accurately
  const totalPrice = cart.items.reduce((acc, item) => {
    // Fallback to original price if product details are missing from system
    const price = item.product ? item.product.price : item.price;
    return acc + price * item.quantity;
  }, 0);

  res.status(200).json({
    status: "success",
    totalPrice,
    results: cart.items.length,
    data: {
      cart
    },
  });
});

/**
 * Update quantity for a specific item in cart
 */
exports.updateCartQuantity = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  
  if (quantity < 1) {
    return next(new AppError("Quantity must be at least 1", 400));
  }

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return next(new AppError("Cart not found", 404));

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    
    res.status(200).json({
      status: "success",
      data: {
        cart
      },
    });
  } else {
    return next(new AppError("Product not found in cart", 404));
  }
});

/**
 * Remove an item from the cart
 */
exports.removeItemFromCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return next(new AppError("Cart not found", 404));

  // Filter out the product to be removed
  cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);

  await cart.save();

  res.status(200).json({
    status: "success",
    data: {
      cart
    },
  });
});