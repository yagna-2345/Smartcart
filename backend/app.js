const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const {
  notFound,
  errorHandler
} = require("./middleware/errorMiddleware");

// Register database models
require("./models");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    project: "SmartCart",
    message: "API running successfully",
    database: "Connected"
  });
});

// API information
app.get("/api", (req, res) => {
  res.json({
    project: "SmartCart",
    version: "1.0.0",
    modules: [
      "Authentication",
      "Products",
      "Categories",
      "Cart",
      "Orders",
      "Payments",
      "Seller",
      "Admin"
    ]
  });
});
app.use("/api/auth", authRoutes);


app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
// 404 and error handlers must be last
app.use(notFound);
app.use(errorHandler);

module.exports = app;