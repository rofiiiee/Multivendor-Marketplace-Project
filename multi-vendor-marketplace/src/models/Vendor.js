const mongoose = require("mongoose");

/**
 * Vendor Profile Schema
 * Manages store branding, account status, and financial records for marketplace sellers
 */
const vendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vendor profile must be linked to a registered user"],
      unique: true, // Ensures one vendor profile per user account
    },
    storeName: {
      type: String,
      required: [true, "Please provide a store name"],
      trim: true,
      minlength: [3, "Store name must be at least 3 characters long"],
    },
    status: {
      type: String,
      enum: ["pending", "active", "suspended"],
      default: "pending",
      lowercase: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: [0, "Account balance cannot be negative"],
    },
    earnings: {
      type: Number,
      default: 0,
      min: [0, "Total earnings cannot be negative"],
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model("Vendor", vendorSchema);