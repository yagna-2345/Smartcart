const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  productName: {
    type: String,
    required: true
  },

  productImage: String,

  pricePaise: {
    type: Number,
    required: true
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const sellerOrderSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [orderItemSchema],

  subtotalPaise: {
    type: Number,
    required: true
  },

  commissionPaise: {
    type: Number,
    default: 0
  },

  sellerAmountPaise: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled"
    ],
    default: "pending"
  }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    items: [orderItemSchema],

    sellerOrders: [sellerOrderSchema],

    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine: String,
      city: String,
      state: String,
      pincode: String,
      country: String
    },

    subtotalPaise: {
      type: Number,
      required: true
    },

    shippingPaise: {
      type: Number,
      default: 0
    },

    discountPaise: {
      type: Number,
      default: 0
    },

    totalAmountPaise: {
      type: Number,
      required: true
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "partially_refunded",
        "refunded"
      ],
      default: "pending"
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
      ],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);