const mongoose = require("mongoose");

/**
 * Order Schema
 * Stores purchase history, shipping details, commission, and vendor earnings
 */
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Order must belong to a user"],
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product ID is required"],
        },

        vendor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Vendor",
          required: [true, "Vendor is required"],
        },

        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity cannot be less than 1"],
        },

        price: {
          type: Number,
          required: [true, "Price at the time of purchase is required"],
        },

        // ✅ إضافة حالة لكل منتج (عشان كل تاجر يشحن حاجته بس)
        status: {
          type: String,
          enum: ["pending", "shipped", "delivered"],
          default: "pending",
          lowercase: true,
        },

        // 💰 Commission per item (platform profit)
        commission: {
          type: Number,
          required: true,
          default: 0,
        },

        // 💸 What vendor actually earns per item
        vendorEarning: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],

    shippingAddress: {
      city: {
        type: String,
        required: [true, "Shipping city is required"],
        trim: true,
      },
      address: {
        type: String,
        required: [true, "Shipping address is required"],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, "Contact phone number is required"],
        trim: true,
      },
    },

    totalPrice: {
      type: Number,
      required: [true, "Total price must be calculated"],
    },

    // 💰 Total commission from entire order
    totalCommission: {
      type: Number,
      default: 0,
    },

    // 🚦 الحالة العامة للأوردر (بتتغير لـ shipped لما "كل" التجار يشحنوا)
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);