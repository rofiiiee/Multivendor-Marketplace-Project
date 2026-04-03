const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

// Utils & Error Handlers
const AppError = require("./utils/appError");
const globalErrorHandler = require("./middlewares/errorMiddleware");

// Route Imports
const authRoutes = require("./routes/authRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const path = require("path");

const app = express();

// 1) GLOBAL MIDDLEWARES
// Security headers
app.use(helmet());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Enable CORS for cross-origin requests
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// 2) ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).send("Marketplace API Running 🚀");
});

// 3) HANDLING UNHANDLED ROUTES
// Catch-all for undefined routes
app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 4) GLOBAL ERROR HANDLING MIDDLEWARE
// Centralized error handling for all routes
app.use(globalErrorHandler);

module.exports = app;