const mongoose = require("mongoose");

const sellerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    storeName: {
      type: String,
      required: true,
      trim: true
    },

    storeDescription: {
      type: String,
      default: ""
    },

    storeLogo: {
      type: String,
      default: ""
    },

    businessAddress: {
      type: String,
      default: ""
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending"
    },

    commissionRate: {
      type: Number,
      default: 10,
      min: 0,
      max: 100
    },

    totalSalesPaise: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "SellerProfile",
  sellerProfileSchema
);