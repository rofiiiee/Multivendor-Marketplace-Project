const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Vendor = require("../models/Vendor");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const COMMISSION_RATE = 0.1; // 10%

/**
 * Update order status to delivered (Shipped)
 */
exports.updateOrderToDelivered = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError("Order not found", 404));

  const vendor = await Vendor.findOne({ user: req.user.id });
  if (!vendor) return next(new AppError("Vendor profile not found", 404));

  let vendorTotalEarning = 0;
  let updatedSomething = false;

  // 1) نلف على المنتجات ونحدث حالة منتجات التاجر ده بس
  order.items.forEach((item) => {
    if (item.vendor.toString() === vendor._id.toString() && item.status === "pending") {
      item.status = "shipped"; // تحديث حالة المنتج الداخلي
      vendorTotalEarning += item.vendorEarning;
      updatedSomething = true;
    }
  });

  if (!updatedSomething) {
    return next(new AppError("No pending items for your store in this order", 400));
  }

  // 2) تحديث حالة الأوردر الكبيرة "فقط" لو كل المنتجات من كل التجار اتشحنت
  const allItemsShipped = order.items.every(item => item.status === "shipped");
  if (allItemsShipped) {
    order.status = "shipped";
  } else {
    order.status = "processing"; // يفضل "جاري التحضير" لو لسه فيه منتجات تانية
  }

  await order.save();

  // 3) تحديث الرصيد
  vendor.balance += vendorTotalEarning;
  vendor.earnings += vendorTotalEarning;
  await vendor.save();

  res.status(200).json({ status: "success", data: order });
});

/**
 * Get orders for vendor (المعدلة لفلترة المنتجات)
 */
exports.getVendorOrders = catchAsync(async (req, res, next) => {
  // 1) تحديد التاجر
  const vendor = await Vendor.findOne({ user: req.user.id });
  if (!vendor) {
    return next(new AppError("Vendor profile not found", 404));
  }

  // 2) البحث عن الأوردرات التي تحتوي على منتجات لهذا التاجر
  const orders = await Order.find({ "items.vendor": vendor._id })
    .populate("user", "name email")
    .populate("items.product", "name image price")
    .sort("-createdAt");

  // 3) الـ Filter السحري: نمر على كل أوردر ونشيل منه أي منتج مش بتاع التاجر ده
  const filteredOrders = orders.map(order => {
    const orderObj = order.toObject(); // تحويله لـ Object عشان نقدر نعدل في المصفوفة
    
    // فلترة المنتجات: خلي اللي الـ vendor ID بتاعها يطابق التاجر الحالي بس
    orderObj.items = orderObj.items.filter(
      item => item.vendor.toString() === vendor._id.toString()
    );

    // حساب إجمالي خاص بالتاجر ده بس للأوردر ده (عشان يعرضه في الجدول)
    orderObj.totalPrice = orderObj.items.reduce(
      (acc, item) => acc + (item.price * item.quantity), 0
    );

    return orderObj;
  });

  res.status(200).json({
    status: "success",
    results: filteredOrders.length,
    data: { 
      orders: filteredOrders 
    },
  });
});

/**
 * Create a new order
 */
exports.createOrder = catchAsync(async (req, res, next) => {
  const { shippingAddress } = req.body;

  if (!shippingAddress || !shippingAddress.address) {
    return next(new AppError("Please provide a complete shipping address to proceed", 400));
  }

  const cart = await Cart.findOne({ user: req.user.id }).populate({
    path: "items.product",
    select: "price vendor name",
  });

  if (!cart || cart.items.length === 0) {
    return next(new AppError("Your cart is empty. Cannot create an order", 400));
  }

  const validItems = cart.items.filter((item) => item.product !== null);

  const orderItems = validItems.map((item) => {
    const price = item.product.price;
    const quantity = item.quantity;
    const commission = price * COMMISSION_RATE;
    const vendorEarning = price - commission;

    return {
      product: item.product._id,
      vendor: item.product.vendor,
      quantity,
      price,
      commission,
      vendorEarning,
    };
  });

  const totalAmount = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalCommission = orderItems.reduce((acc, item) => acc + item.commission * item.quantity, 0);

  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    totalPrice: totalAmount,
    totalCommission,
  });

  await Cart.findOneAndDelete({ user: req.user.id });

  res.status(201).json({
    status: "success",
    data: { order },
  });
});

/**
 * Get all orders for logged-in user
 */
exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .populate("items.product", "name image price")
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: { orders },
  });
});