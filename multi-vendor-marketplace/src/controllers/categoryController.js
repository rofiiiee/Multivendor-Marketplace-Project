const Category = require("../models/Category");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

/**
 * Create a new product category
 */
exports.createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  // 1) Validate name presence
  if (!name) {
    return next(new AppError("Please provide a category name", 400));
  }

  // 2) Check if category already exists to avoid duplicates
  const existingCategory = await Category.findOne({ name: name.trim() });
  if (existingCategory) {
    return next(new AppError("This category already exists", 400));
  }

  // 3) Create and save new category
  const category = await Category.create({ name: name.trim() });

  res.status(201).json({
    status: "success",
    data: {
      category
    },
  });
});

/**
 * Get all available categories
 * Results are sorted alphabetically for better UI presentation
 */
exports.getCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find().sort("name");

  res.status(200).json({
    status: "success",
    results: categories.length,
    data: {
      categories
    },
  });
});