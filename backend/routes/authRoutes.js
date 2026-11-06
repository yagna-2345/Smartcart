const express = require("express");
const router = express.Router();

const {
  registerCustomer,
  registerSeller,
  login,
  logout,
  getMe
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const {
  customerRegistrationRules,
  sellerRegistrationRules,
  loginRules
} = require("../validators/authValidator");

router.post("/register", customerRegistrationRules, registerCustomer);

router.post("/register-seller", sellerRegistrationRules, registerSeller);

router.post("/login", loginRules, login);

// LOGOUT ROUTE
router.post("/logout", logout);

router.get("/me", protect, getMe);

module.exports = router;