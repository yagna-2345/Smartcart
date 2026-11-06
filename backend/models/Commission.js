const mongoose = require("mongoose");

const commissionSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    orderSubtotalPaise: {
      type: Number,
      required: true
    },

    commissionRate: {
      type: Number,
      required: true
    },

    commissionAmountPaise: {
      type: Number,
      required: true
    },

    sellerAmountPaise: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "settled", "reversed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

commissionSchema.index(
  { orderId: 1, sellerId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Commission", commissionSchema);