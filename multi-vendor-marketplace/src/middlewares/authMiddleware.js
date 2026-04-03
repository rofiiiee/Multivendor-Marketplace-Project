const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protect routes - Verify JWT token and attach user to request
 */
exports.protect = async (req, res, next) => {
  let token;

  // 1) Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // 2) Extract token from header
      token = req.headers.authorization.split(" ")[1];

      // 3) Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4) Check if user still exists and attach to request (excluding password)
      req.user = await User.findById(decoded.id).select("-password");
      
      return next();
    } catch (error) {
      return res.status(401).json({ 
        status: "fail",
        message: "Not authorized, token failed" 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      status: "fail",
      message: "Not authorized, no token provided" 
    });
  }
};

/**
 * Restrict access based on user roles (Admin, Vendor, User)
 * @param  {...String} roles - Allowed roles
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // 1) Ensure req.user exists (from protect middleware)
    // 2) Check if user role is included in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        status: "fail",
        message: `Access denied. Your account role (${req.user.role}) is not authorized to access this resource.` 
      });
    }
    next();
  };
};