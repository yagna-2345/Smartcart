const Product = require("../models/Product");
const Category = require("../models/Category");

// Generate product slug
const createSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

// GET ALL PRODUCTS - PUBLIC
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort = "newest",
      page = 1,
      limit = 12
    } = req.query;

    const currentPage = Math.max(1, Number(page) || 1);
    const pageLimit = Math.min(50, Math.max(1, Number(limit) || 12));

    const filter = { status: "active" };

    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    if (category) {
      const categoryDoc = await Category.findOne({
        $or: [
          { slug: category.toLowerCase() },
          { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }
        ],
        isActive: true
      });

      if (!categoryDoc) {
        return res.status(200).json({
          success: true,
          products: [],
          pagination: {
            total: 0,
            page: currentPage,
            pages: 0
          }
        });
      }

      filter.categoryId = categoryDoc._id;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.pricePaise = {};

      if (minPrice !== undefined) {
        const minimum = Number(minPrice);
        if (!Number.isFinite(minimum) || minimum < 0) {
          return res.status(400).json({
            success: false,
            message: "Invalid minimum price"
          });
        }

        filter.pricePaise.$gte = Math.round(minimum * 100);
      }

      if (maxPrice !== undefined) {
        const maximum = Number(maxPrice);
        if (!Number.isFinite(maximum) || maximum < 0) {
          return res.status(400).json({
            success: false,
            message: "Invalid maximum price"
          });
        }

        filter.pricePaise.$lte = Math.round(maximum * 100);
      }
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      priceLow: { pricePaise: 1 },
      priceHigh: { pricePaise: -1 },
      rating: { rating: -1 }
    };

    const sortBy = sortOptions[sort] || sortOptions.newest;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("categoryId", "name slug")
        .select("-__v")
        .sort(sortBy)
        .skip((currentPage - 1) * pageLimit)
        .limit(pageLimit)
        .lean(),

      Product.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        total,
        page: currentPage,
        limit: pageLimit,
        pages: Math.ceil(total / pageLimit)
      }
    });

  } catch (error) {
    next(error);
  }
};

// GET SINGLE PRODUCT - PUBLIC
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      status: "active"
    })
      .populate("categoryId", "name slug")
      .populate("sellerId", "name")
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      product
    });

  } catch (error) {
    next(error);
  }
};

// CREATE PRODUCT - APPROVED SELLER ONLY
const createProduct = async (req, res, next) => {
  try {
    const {
      categoryId,
      name,
      description,
      brand,
      price,
      compareAtPrice,
      images,
      stock,
      sku,
      specifications
    } = req.body;

    const category = await Category.findOne({
      _id: categoryId,
      isActive: true
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid active category"
      });
    }

    const product = await Product.create({
      sellerId: req.user._id,
      categoryId,
      name,
      slug: `${createSlug(name)}-${Date.now()}`,
      description,
      brand,
      pricePaise: Math.round(Number(price) * 100),
      compareAtPricePaise:
        compareAtPrice
          ? Math.round(Number(compareAtPrice) * 100)
          : null,
      images,
      stock: Number(stock),
      sku,
      specifications,
      status: "draft"
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully as draft",
      product
    });

  } catch (error) {
    next(error);
  }
};

// GET SELLER'S OWN PRODUCTS
const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      sellerId: req.user._id
    })
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products
    });

  } catch (error) {
    next(error);
  }
};

// UPDATE OWN PRODUCT
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      sellerId: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or access denied"
      });
    }

    const allowedFields = [
      "categoryId",
      "name",
      "description",
      "brand",
      "price",
      "compareAtPrice",
      "images",
      "stock",
      "sku",
      "specifications"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "price") {
          product.pricePaise = Math.round(Number(req.body.price) * 100);
        } else if (field === "compareAtPrice") {
          product.compareAtPricePaise =
            req.body.compareAtPrice === null ||
            req.body.compareAtPrice === ""
              ? null
              : Math.round(Number(req.body.compareAtPrice) * 100);
        } else {
          const schemaField = field === "categoryId"
            ? "categoryId"
            : field;

          product[schemaField] = req.body[field];
        }
      }
    });

    if (req.body.categoryId) {
      const category = await Category.findOne({
        _id: req.body.categoryId,
        isActive: true
      });

      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Invalid category"
        });
      }
    }

    if (req.body.name) {
      product.slug = `${createSlug(req.body.name)}-${Date.now()}`;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product
    });

  } catch (error) {
    next(error);
  }
};

// DELETE OWN PRODUCT
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      sellerId: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or access denied"
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};

// PUBLISH OWN DRAFT PRODUCT
const publishProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      sellerId: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (!product.name || !product.description ||
        !product.images.length || product.stock < 0 ||
        !product.pricePaise) {
      return res.status(400).json({
        success: false,
        message: "Complete the product information before publishing"
      });
    }

    product.status = "active";

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product published successfully",
      product
    });

  } catch (error) {
    next(error);
  }
};
// PUBLISH ALL VALID DRAFT PRODUCTS
const publishAllProducts = async (req, res, next) => {
  try {

    const drafts = await Product.find({
      sellerId: req.user._id,
      status: "draft"
    });

    const validProducts = drafts.filter(product => {

      return (
        product.name &&
        product.description &&
        product.images &&
        product.images.length > 0 &&
        product.pricePaise > 0 &&
        product.stock >= 0
      );

    });

    const validIds = validProducts.map(
      product => product._id
    );

    if (validIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No valid draft products available to publish",
        publishedCount: 0
      });
    }

    const result = await Product.updateMany(
      {
        _id: { $in: validIds },
        sellerId: req.user._id,
        status: "draft"
      },
      {
        $set: { status: "active" }
      }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} products published successfully`,
      publishedCount: result.modifiedCount
    });

  } catch (error) {
    next(error);
  }
};
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
  publishProduct,
  publishAllProducts
};