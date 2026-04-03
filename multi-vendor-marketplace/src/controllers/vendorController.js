const Vendor = require("../models/Vendor");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

/**
 * Create a new vendor profile for an existing user
 */
exports.createVendor = catchAsync(async (req, res, next) => {
  const { storeName, address, phoneNumber } = req.body;
  const userId = req.user.id;

  // 1) Check if the user already has a registered vendor profile
  const existingVendor = await Vendor.findOne({ user: userId });
  if (existingVendor) {
    return next(new AppError("You already have a registered store with this account", 400));
  }

  // 2) Create the vendor record
  const vendor = await Vendor.create({
    user: userId,
    storeName,
    address,
    phoneNumber,
    status: "active", // Default status is active; can be changed to 'pending' for admin review
  });

  res.status(201).json({
    status: "success",
    data: {
      vendor
    },
  });
});

/**
 * Get the vendor profile details for the current logged-in user
 */
exports.getVendorProfile = catchAsync(async (req, res, next) => {
  const vendor = await Vendor.findOne({ user: req.user.id })
    .populate("user", "name email role");

  if (!vendor) {
    return next(new AppError("Vendor profile not found for this user. Please complete setup.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      vendor
    },
  });
});

/**
 * Fetch all orders containing products belonging to the current vendor
 */
exports.getVendorOrders = catchAsync(async (req, res, next) => {
  // 1) Identify the vendor profile
  const vendor = await Vendor.findOne({ user: req.user.id });
  if (!vendor) {
    return next(new AppError("Vendor profile not found", 404));
  }

  // 2) Retrieve all Product IDs owned by this specific vendor
  const vendorProductIds = await Product.find({ vendor: vendor._id }).distinct("_id");

  // 3) Find all orders that include any of these vendor-specific products
  const orders = await Order.find({ 
    "items.product": { $in: vendorProductIds } 
  })
  .populate("user", "name email")
  .populate("items.product", "name price image")
  .sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders
    },
  });
});