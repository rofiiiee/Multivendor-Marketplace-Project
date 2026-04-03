const mongoose = require("mongoose");

/**
 * Product Schema
 * Defines the structure for marketplace products, including stock and vendor references
 */
const productSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Product name is required"], 
      trim: true 
    },
    description: { 
      type: String, 
      required: [true, "Product description is required"] 
    },
    price: { 
      type: Number, 
      required: [true, "Product price is required"],
      min: [0, "Price cannot be less than 0"]
    },
    image: { 
      type: String, 
      default: "" 
    },
    stock: { 
      type: Number, 
      default: 0,
      min: [0, "Stock cannot be negative"]
    },
    category: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Category", 
      required: [true, "Product must belong to a category"] 
    },
    vendor: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Vendor", // Linked to Vendor profile for marketplace logic
      required: [true, "Product must have an owner (Vendor)"] 
    },
    ratings: { 
      type: Number, 
      default: 4.5,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"]
    },
  },
  { 
    timestamps: true, 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
  }
);

module.exports = mongoose.model("Product", productSchema);