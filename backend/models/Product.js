const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    slug: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    brand: {
      type: String,
      default: ""
    },

    pricePaise: {
      type: Number,
      required: true,
      min: 1
    },

    compareAtPricePaise: {
      type: Number,
      default: null
    },

    images: [{
      type: String
    }],

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },

    sku: {
      type: String,
      required: true,
      trim: true
    },

    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    reviewCount: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "draft"
    }
  },
  { timestamps: true }
);

productSchema.index(
  { sellerId: 1, sku: 1 },
  { unique: true }
);

productSchema.index({ categoryId: 1, status: 1 });
productSchema.index({ pricePaise: 1 });

productSchema.index(
  { name: "text", description: "text", brand: "text" }
);

module.exports = mongoose.model("Product", productSchema);