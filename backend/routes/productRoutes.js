const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
  publishProduct,
  publishAllProducts
} = require("../controllers/productController");
const {
  protect,
  authorize,
  requireApprovedSeller
} = require("../middleware/authMiddleware");

const { validateProduct } = require("../validators/productValidator");

// Public product APIs
router.get("/", getProducts);

// Keep /my-products before /:id
router.get(
  "/my-products",
  protect,
  authorize("seller"),
  getMyProducts
);
router.post(
  "/publish-all",
  protect,
  authorize("seller"),
  requireApprovedSeller,
  publishAllProducts
);
router.get("/:id", getProductById);

// Seller product APIs
router.post(
  "/",
  protect,
  authorize("seller"),
  requireApprovedSeller,
  validateProduct,
  createProduct
);

router.put(
  "/:id",
  protect,
  authorize("seller"),
  requireApprovedSeller,
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorize("seller"),
  requireApprovedSeller,
  deleteProduct
);

router.patch(
  "/:id/publish",
  protect,
  authorize("seller"),
  requireApprovedSeller,
  publishProduct
);

module.exports = router;