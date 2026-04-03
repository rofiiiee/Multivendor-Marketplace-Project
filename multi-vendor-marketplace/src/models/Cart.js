const mongoose = require("mongoose");

/**
 * Shopping Cart Schema
 * Stores user reference, list of products, quantities, and historical prices
 */
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Cart must belong to a user"],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product ID is required in cart items"],
        },
        quantity: {
          type: Number,
          default: 1,
          min: [1, "Quantity cannot be less than 1"],
        },
        price: {
          type: Number,
          required: [true, "Product price at the time of adding to cart is required"],
        },
      },
    ],
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model("Cart", cartSchema);