const { body, validationResult } = require("express-validator");

const validateProduct = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("Product name must contain 3–150 characters"),

  body("categoryId")
    .isMongoId()
    .withMessage("Select a valid category"),

  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must contain at least 10 characters"),

  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than zero"),

  body("compareAtPrice")
    .optional({ values: "falsy" })
    .isFloat({ gt: 0 })
    .withMessage("Compare price must be greater than zero"),

  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock cannot be negative"),

  body("sku")
    .trim()
    .notEmpty()
    .withMessage("SKU is required"),

  body("images")
    .isArray({ min: 1, max: 8 })
    .withMessage("Add between 1 and 8 product images"),

  body("images.*")
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("Each product image must be a valid HTTP or HTTPS URL"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg
        }))
      });
    }

    next();
  }
];

module.exports = { validateProduct };