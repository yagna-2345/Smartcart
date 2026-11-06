require("dotenv").config();

const mongoose = require("mongoose");
const Category = require("../models/Category");

const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    description: "Mobiles, laptops and electronic accessories"
  },
  {
    name: "Fashion",
    slug: "fashion",
    description: "Clothing and fashion products"
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Everyday personal accessories"
  },
  {
    name: "Home & Living",
    slug: "home-living",
    description: "Home furniture and household products"
  },
  {
    name: "Sports",
    slug: "sports",
    description: "Sports and fitness products"
  },
  {
    name: "Beauty",
    slug: "beauty",
    description: "Beauty and personal care products"
  }
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    for (const category of categories) {
      await Category.updateOne(
        { slug: category.slug },
        { $setOnInsert: category },
        { upsert: true }
      );
    }

    console.log("SmartCart categories seeded successfully");

    const savedCategories = await Category.find({
      isActive: true
    });

    console.table(
      savedCategories.map(category => ({
        name: category.name,
        slug: category.slug,
        id: category._id.toString()
      }))
    );

  } catch (error) {
    console.error("Category seeding failed:", error.message);
    process.exitCode = 1;

  } finally {
    await mongoose.connection.close();
  }
}

seedCategories();