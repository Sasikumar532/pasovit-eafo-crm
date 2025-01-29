const mongoose = require('mongoose');

// Define the schema for coupons
const couponSchema = new mongoose.Schema(
  {
    couponCode: {
      type: String,
      required: true,
      unique: true, // Ensure each coupon code is unique
    },
    totalLimit: {
      type: Number,
      required: true,
      min: 1, // The total limit must be greater than or equal to 1
    },
    usageLimit: {
      type: Number,
      default: 0, // Initially starts at 0
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Create a Coupon model based on the schema
const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
