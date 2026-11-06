const User = require("../models/user");
const SellerProfile = require("../models/SellerProfile");
const jwt = require("jsonwebtoken");

const createToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    }
  );
};

const setTokenCookie = (res, token) => {
  res.cookie("smartcart_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/"
  });
};

// CUSTOMER REGISTRATION
const registerCustomer = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "customer"
    });

    const token = createToken(user._id);

    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    next(error);
  }
};

// SELLER REGISTRATION
const registerSeller = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      storeName
    } = req.body;

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "seller"
    });

    await SellerProfile.create({
      userId: user._id,
      storeName,
      approvalStatus: "pending"
    });

    const token = createToken(user._id);

    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      message: "Seller application submitted for approval",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      approvalStatus: "pending"
    });

  } catch (error) {
    next(error);
  }
};

// LOGIN
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase()
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const passwordMatches =
      await user.comparePassword(password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive"
      });
    }

    const token = createToken(user._id);

    setTokenCookie(res, token);

    let approvalStatus = null;

    if (user.role === "seller") {
      const seller = await SellerProfile.findOne({
        userId: user._id
      });

      approvalStatus = seller?.approvalStatus || "pending";
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      approvalStatus
    });

  } catch (error) {
    next(error);
  }
};

// LOGOUT
const logout = (req, res) => {
  res.clearCookie("smartcart_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};

// CURRENT USER
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role
    }
  });
};

module.exports = {
  registerCustomer,
  registerSeller,
  login,
  logout,
  getMe
};