const Category = require("../models/Category");

// GET ACTIVE CATEGORIES
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({
      isActive: true
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      categories
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories };