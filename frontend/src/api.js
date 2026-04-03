import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= AUTH INTERCEPTOR ================= */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= PRODUCTS ================= */

export const getProducts = async () => {
  try {
    const response = await API.get("/products");
    return response.data?.data?.products || [];
  } catch (error) {
    console.error("API_ERROR [getProducts]:", error.message);
    throw new Error("Could not retrieve products.");
  }
};

export const getCategories = async () => {
  try {
    const response = await API.get("/categories");
    return response.data?.data?.categories || [];
  } catch (error) {
    console.error("API_ERROR [getCategories]:", error.message);
    return [];
  }
};

export const getProductDetails = async (id) => {
  if (!id) return null;
  try {
    const response = await API.get(`/products/${id}`);
    return response.data?.data?.product || null;
  } catch (error) {
    console.error("API_ERROR [getProductDetails]:", error.message);
    return null;
  }
};

/* ================= CART ================= */

export const addToCartAPI = async (productId, quantity = 1) => {
  try {
    const response = await API.post("/cart", { productId, quantity });
    return response.data;
  } catch (error) {
    console.error("API_ERROR [addToCart]:", error.response?.data);
    throw error;
  }
};

export const getCartAPI = async () => {
  try {
    const response = await API.get("/cart");

    return (
      response.data?.cart?.items ||
      response.data?.data?.cart?.items ||
      response.data?.items ||
      []
    );
  } catch (error) {
    console.error("API_ERROR [getCart]:", error.response?.data);
    throw error;
  }
};

/* ================= ORDERS  ================= */

//  create order
export const createOrderAPI = async (orderData) => {
  try {
    const response = await API.post("/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("API_ERROR [createOrder]:", error.response?.data);
    throw error;
  }
};

//  get my orders
export const getMyOrdersAPI = async () => {
  try {
    const response = await API.get("/orders/my");

    return (
      response.data?.orders ||
      response.data?.data?.orders ||
      []
    );
  } catch (error) {
    console.error("API_ERROR [getMyOrders]:", error.response?.data);
    throw error;
  }
};

//  vendor orders
export const getVendorOrdersAPI = async () => {
  try {
    const response = await API.get("/orders/vendor/all");
    return response.data?.orders || [];
  } catch (error) {
    console.error("API_ERROR [getVendorOrders]:", error.response?.data);
    throw error;
  }
};


//  Update order status to delivered (Shipped)
export const updateOrderToDeliveredAPI = async (orderId) => {
  try {
    const response = await API.put(`/orders/${orderId}/deliver`);
    return response.data;
  } catch (error) {
    console.error("API_ERROR [updateOrderToDelivered]:", error.response?.data);
    throw error;
  }
};

export default API;
