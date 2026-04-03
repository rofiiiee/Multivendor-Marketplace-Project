const mongoose = require("mongoose");

/**
 * User Schema
 * Manages authentication and roles for Customers, Vendors, and Admins
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      trim: true,
      lowercase: true, // Prevents duplicate accounts with different casing
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Prevents password from being returned in API queries by default
    },
    role: {
      type: String,
      enum: ["customer", "vendor", "admin"],
      default: "customer",
      lowercase: true,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model("User", userSchema);