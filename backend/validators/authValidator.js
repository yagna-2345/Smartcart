const { body, validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {

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
};

const customerRegistrationRules = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Name must contain 2 to 80 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Enter a valid email address"),

  body("password")
    .isLength({ min: 8, max: 72 })
    .withMessage("Password must contain 8 to 72 characters"),

  body("phone")
    .optional()
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone number must contain 10 digits"),

  validateRequest
];

const sellerRegistrationRules = [
  ...customerRegistrationRules.slice(0, 3),

  body("phone")
    .optional()
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone number must contain 10 digits"),

  body("storeName")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Store name must contain 2 to 100 characters"),

  validateRequest
];

const loginRules = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Enter a valid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  validateRequest
];

module.exports = {
  customerRegistrationRules,
  sellerRegistrationRules,
  loginRules
};