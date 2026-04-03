const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

/**
 * Cloudinary Configuration
 * Credentials fetched from environment variables for security
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Cloudinary Storage Settings
 * Defines destination folder and restricted file formats
 */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "market_products", 
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

/**
 * Multer Middleware Instance
 * Used in routes to handle multipart/form-data (Image uploads)
 */
const upload = multer({ storage: storage });

module.exports = upload;