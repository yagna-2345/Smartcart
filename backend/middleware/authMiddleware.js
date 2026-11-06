const jwt = require("jsonwebtoken");
const User = require("../models/user");
const SellerProfile = require("../models/SellerProfile");

// Verify login
const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.smartcart_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to continue"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid or inactive account"
      });
    }

    req.user = user;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Session expired or invalid. Please login again."
    });

  }
};

// Role-based authorization
const authorize = (...roles) => {

  return (req, res, next) => {

    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resource"
      });
    }

    next();
  };
};

// Approved seller verification
const requireApprovedSeller = async (req, res, next) => {
  try {

    const seller = await SellerProfile.findOne({
      userId: req.user._id
    });

    if (!seller || seller.approvalStatus !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Your seller account is awaiting approval"
      });
    }

    req.seller = seller;

    next();

  } catch (error) {
    next(error);
  }
};

module.exports = {
  protect,
  authorize,
  requireApprovedSeller
};