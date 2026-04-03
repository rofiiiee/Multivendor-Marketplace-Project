import React, { useEffect, useState } from "react";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, CreditCard, Truck, ShieldCheck } from "lucide-react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Cart Component
 * Manages the shopping cart lifecycle including fetching, updating quantities, 
 * and removing items. Designed with a premium minimalist aesthetic.
 */
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Optimized Animation Variant for smooth UI entrance
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay, duration: 1, ease: [0.19, 1, 0.22, 1] },
    }),
  };

  /**
   * Fetches cart items from the backend API.
   * Includes fallback logic for different API response structures.
   */
  const fetchCartItems = async () => {
    try {
      const response = await api.get("/cart");
      const items = response.data?.data?.cart?.items || response.data?.data?.items || response.data?.items || [];
      setCartItems(items);
    } catch (error) {
      console.error("Cart Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  /**
   * Calculates the total price of all items in the cart.
   */
  const calculateTotal = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => {
      const price = item.productId?.price || item.price || 0;
      const quantity = item.quantity || 1;
      return total + price * quantity;
    }, 0);
  };

  /**
   * Updates product quantity via PUT request.
   * @param {string} productId - Unique identifier for the product.
   * @param {number} newQuantity - The updated quantity value.
   */
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await api.put("/cart", { productId, quantity: newQuantity });
      fetchCartItems();
    } catch (error) {
      console.error("Update Error:", error.response?.data);
    }
  };

  /**
   * Deletes an item from the cart.
   * @param {string} productId - Unique identifier for the product to remove.
   */
  const removeItem = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);
      fetchCartItems();
    } catch (error) {
      console.error("Delete Error:", error.response?.data);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 overflow-hidden" dir="ltr">
      <div className="container mx-auto px-8 lg:px-16">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={0.1}>
            <button
              onClick={() => navigate("/products")}
              className="group flex items-center gap-2 text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px] mb-6 hover:text-emerald-800 transition-all"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Store
            </button>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
              Your <span className="italic font-serif font-light text-slate-300">Selection.</span>
            </h1>
          </motion.div>
          <motion.p variants={fadeInUp} initial="hidden" animate="visible" custom={0.2} className="text-slate-400 font-light text-lg">
            {cartItems.length} curated items
          </motion.p>
        </div>

        {cartItems.length === 0 ? (
          /* --- Empty Cart State --- */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-50 py-32 rounded-[3rem] text-center border border-slate-100"
          >
            <ShoppingBag size={48} className="text-slate-200 mx-auto mb-8" />
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">The cart is waiting.</h2>
            <p className="text-slate-400 font-light mb-10 max-w-xs mx-auto">Discover timeless pieces to fill your space.</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-emerald-600 transition-all shadow-xl active:scale-95"
            >
              Explore Collection
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* --- Cart Items List --- */}
            <div className="lg:col-span-7 space-y-10">
              <AnimatePresence>
                {cartItems.map((item, index) => {
                  const product = item.productId || item.product || item;
                  const productId = product._id || item._id;
                  const productName = product.name || "Unnamed Product";
                  const productPrice = product.price || 0;
                  const productImage = product.image || product.imageUrl || "https://via.placeholder.com/150";

                  return (
                    <motion.div
                      key={item._id || index}
                      variants={fadeInUp} initial="hidden" animate="visible" custom={index * 0.1}
                      exit={{ opacity: 0, x: -20 }}
                      className="group flex flex-col sm:flex-row items-center gap-8 pb-10 border-b border-slate-100 last:border-0"
                    >
                      {/* Product Visual */}
                      <div className="w-32 h-40 bg-slate-50 rounded-[2rem] overflow-hidden flex-shrink-0 border border-slate-100 relative group-hover:shadow-lg transition-all duration-700">
                        <img
                          src={productImage}
                          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                          alt={productName}
                        />
                      </div>

                      {/* Product Metadata */}
                      <div className="flex-1 space-y-4 text-center sm:text-left">
                        <div>
                          <h3 className="font-black text-slate-900 text-2xl tracking-tight leading-tight">
                            {productName}
                          </h3>
                          <p className="text-emerald-600 font-black text-sm uppercase tracking-widest mt-1">
                            EGP {productPrice.toLocaleString()}
                          </p>
                        </div>

                        {/* Quantity & Removal Controls */}
                        <div className="flex items-center justify-center sm:justify-start gap-6">
                          <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                            <button
                              onClick={() => updateQuantity(productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-slate-400 hover:text-emerald-600 shadow-sm disabled:opacity-30 transition-all"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-black text-slate-900 w-4 text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(productId, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm hover:bg-emerald-50 transition-all"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(productId)}
                            className="text-slate-300 hover:text-red-500 transition-colors duration-300"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal Display */}
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Subtotal</p>
                         <p className="font-black text-slate-900 text-xl tracking-tighter">
                            EGP {(productPrice * item.quantity).toLocaleString()}
                         </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* --- Order Summary Sticky Card --- */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 1 }}
              className="lg:col-span-5 bg-slate-900 rounded-[3rem] p-10 text-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] lg:sticky lg:top-32"
            >
              <div className="flex items-center gap-4 mb-12">
                <h2 className="text-2xl font-black tracking-tight whitespace-nowrap">Order Summary</h2>
                <div className="h-[1px] w-full bg-white/10" />
              </div>

              <div className="space-y-6 mb-12">
                <div className="flex justify-between font-light text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white font-bold">EGP {calculateTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-light text-slate-400">
                  <span>Shipping</span>
                  <span className="text-emerald-400 font-black text-[10px] uppercase tracking-widest bg-emerald-400/10 px-3 py-1 rounded-full">Complimentary</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-8 mb-12">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-400 font-light">Total</span>
                  <span className="text-4xl font-black text-white tracking-tighter">EGP {calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              {/* Action Button: Checkout */}
              <button
                onClick={() => navigate("/checkout", { state: { cartItems } })}
                className="group w-full bg-gradient-to-r from-emerald-400 to-emerald-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-2xl shadow-emerald-500/20"
              >
                Checkout Now
                <CreditCard size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Trust Badges */}
              <div className="mt-10 flex flex-col gap-4 border-t border-white/5 pt-8">
                <div className="flex items-center gap-3 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  <ShieldCheck size={14} className="text-emerald-500/50" /> Fully Secured Checkout
                </div>
                <div className="flex items-center gap-3 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  <Truck size={14} className="text-emerald-500/50" /> Timeless Delivery
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;