const Product = require("../models/Product");
const Vendor = require("../models/Vendor");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

/**
 * Create a new product linked to the current vendor
 */
exports.createProduct = catchAsync(async (req, res, next) => {
  // 1) Ensure vendor profile exists for the logged-in user
  const vendor = await Vendor.findOne({ user: req.user.id });
  if (!vendor) {
    return next(new AppError("Vendor profile not found. Please complete your profile first.", 404));
  }

  const { name, description, price, stock, category } = req.body;

  // 2) Validate category selection
  if (!category || category === "undefined") {
    return next(new AppError("Please provide a valid category for the product.", 400));
  }

  // 3) Handle product image path if uploaded
  const imageUrl = req.file ? req.file.path : "";

  // 4) Create product record
  const product = await Product.create({
    name,
    description,
    price: Number(price),
    stock: Number(stock),
    category: category.trim(),
    image: imageUrl,
    vendor: vendor._id,
  });

  res.status(201).json({
    status: "success",
    data: {
      product
    },
  });
});

/**
 * Fetch all products for the marketplace (Customer View)
 */
exports.getProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find()
    .populate("category", "name")
    .populate("vendor", "storeName email");

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products
    },
  });
});

/**
 * Fetch products belonging only to the current vendor (Dashboard View)
 */
exports.getVendorProducts = catchAsync(async (req, res, next) => {
  const vendor = await Vendor.findOne({ user: req.user.id });
  if (!vendor) return next(new AppError("Vendor profile not found", 404));

  const products = await Product.find({ vendor: vendor._id }).populate("category", "name");

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products
    },
  });
});

/**
 * Update an existing product (Authorized for product owner only)
 */
exports.updateProduct = catchAsync(async (req, res, next) => {
  const vendor = await Vendor.findOne({ user: req.user.id });
  let product = await Product.findById(req.params.id);

  if (!product) return next(new AppError("Product not found", 404));

  // Authorization Check: Only the product owner can edit
  if (product.vendor.toString() !== vendor._id.toString()) {
    return next(new AppError("You do not have permission to edit this product", 403));
  }

  const updateData = { ...req.body };
  if (req.file) updateData.image = req.file.path;

  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      product: updatedProduct
    },
  });
});

/**
 * Delete a product (Authorized for product owner only)
 */
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const vendor = await Vendor.findOne({ user: req.user.id });
  const product = await Product.findById(req.params.id);

  if (!product) return next(new AppError("Product not found", 404));

  // Authorization Check: Only the product owner can delete
  if (product.vendor.toString() !== vendor._id.toString()) {
    return next(new AppError("You do not have permission to delete this product", 403));
  }

  await product.deleteOne();

  // Status 204: No Content (Standard for successful deletions)
  res.status(204).json({
    status: "success",
    data: null,
  });
});