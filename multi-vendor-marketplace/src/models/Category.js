const mongoose = require("mongoose");

/**
 * Product Category Schema
 * Defines unique categories for marketplace products
 */
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a category name"],
      unique: true,
      trim: true, // Removes extra whitespace from beginning and end
      lowercase: true, // Ensures consistency in database queries
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model("Category", categorySchema);