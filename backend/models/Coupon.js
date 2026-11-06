const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true
    },

    discountValue: {
      type: Number,
      required: true,
      min: 1
    },

    minimumOrderPaise: {
      type: Number,
      default: 0
    },

    maximumDiscountPaise: {
      type: Number,
      default: null
    },

    usageLimit: {
      type: Number,
      default: null
    },

    usedCount: {
      type: Number,
      default: 0
    },

    expiryDate: {
      type: Date,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);