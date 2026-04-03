const User = require("../models/User");
const Vendor = require("../models/Vendor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

/**
 * Helper function to sign JWT Token
 */
const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

// 1) REGISTER CONTROLLER
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, role, storeName, address, phoneNumber } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("This email address is already registered", 400));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "user",
  });

  if (role === "vendor") {
    await Vendor.create({
      user: user._id,
      storeName: storeName || `${name}'s Store`,
      address: address || "Not specified",
      phoneNumber: phoneNumber || "0000000000"
    });
  }

  const token = signToken(user._id, user.role);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

// 2) LOGIN CONTROLLER
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // 2) Check if user exists and password is correct
  // FIX: Explicitly select the password field because it's hidden by default in the Schema
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  // 3) If everything is okay, send token to client
  const token = signToken(user._id, user.role);

  res.status(200).json({
    status: "success",
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});