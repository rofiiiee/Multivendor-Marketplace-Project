import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { ShoppingCart, Star, Heart, ArrowUpRight, AlertCircle, CheckCircle2 } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { addToCartAPI } from "../../api";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  
  // State for on-screen Toast notifications
  const [toast, setToast] = useState({ show: false, message: "", isError: false });

  // Function to trigger and auto-hide the toast
  const showToast = (msg, isError = false) => {
    setToast({ show: true, message: msg, isError });
    setTimeout(() => setToast({ show: false, message: "", isError: false }), 3000);
  };

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('wishlist')) || [];
    setIsFavorite(favorites.some((item) => item._id === product._id));
  }, [product._id]);

  const handleWishlist = (e) => {
    e.stopPropagation();
    let favorites = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (isFavorite) {
      favorites = favorites.filter((item) => item._id !== product._id);
    } else {
      favorites.push(product);
    }
    localStorage.setItem('wishlist', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      await addToCartAPI(product._id, 1); 
      showToast(`Added ${product.name} to your bag! 🛍️`);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Cart Add Error:", err);
      if (err.response?.status === 401) {
        showToast("Please Login First to start shopping!", true);
        // Redirect to login after the user sees the message
        setTimeout(() => navigate('/login'), 2000); 
      } else {
        showToast("Something went wrong, please try again.", true);
      }
    }
  };

  const imageUrl = product.image || 'https://via.placeholder.com/400x500?text=Premium+Artifact';

  return (
    <>
      {/* High-end Toast Notification fixed at the top */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -100, x: "-50%" }} // Start above the screen
            animate={{ opacity: 1, y: 100, x: "-50%" }}   // Drop 100px to clear the Navbar
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-0 left-1/2 z-[100] px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 border ${
              toast.isError 
                ? "bg-red-50/90 border-red-100 text-red-600" 
                : "bg-emerald-900/90 border-emerald-800 text-white"
            }`}
          >
            {toast.isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} className="text-emerald-400" />}
            <span className="text-[11px] font-black uppercase tracking-widest">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        onClick={() => navigate(`/product/${product._id}`, { state: { product } })}
        className="group cursor-pointer bg-white"
      >
        {/* 1. Visual Showcase Container (Balanced Frame) */}
        <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-50 border border-slate-50 transition-all duration-700 group-hover:shadow-3xl group-hover:shadow-emerald-200">
          
          <div className="w-full h-full p-6 flex items-center justify-center">
            <img 
              src={imageUrl} 
              alt={product.name} 
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-[1.5s] ease-out group-hover:scale-110 pointer-events-none" 
            />
          </div>

          {/* Top Actions: Navigation & Wishlist */}
          <div className="absolute inset-x-0 top-0 p-5 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-y-2 group-hover:translate-y-0 z-20">
            <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl shadow-sm">
              <ArrowUpRight size={18} className="text-slate-900" strokeWidth={3} />
            </div>
            
            <button 
              onClick={handleWishlist}
              className={`w-12 h-12 rounded-2xl transition-all duration-500 backdrop-blur-md shadow-sm flex items-center justify-center ${
                isFavorite ? 'bg-red-500 text-white shadow-xl shadow-red-500/30' : 'bg-white/80 text-slate-500 hover:bg-white hover:text-red-500'
              }`}
            >
              <Heart size={18} fill={isFavorite ? "currentColor" : "none"} strokeWidth={2.5} />
            </button>
          </div>

          {/* Bottom Action: Add to Cart */}
          <div className="absolute inset-x-0 bottom-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-20">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-600 transition-colors shadow-2xl active:scale-95"
            >
              <ShoppingCart size={14} />
              Add To Bag
            </button>
          </div>
        </div>

        {/* 2. Product Metadata & Transaction Area */}
        <div className="mt-7 px-3 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">
                {product.category?.name || 'Exclusive artifact'}
              </span>
              {product.ratingsAverage > 0 && (
                <div className="flex items-center gap-1.5 bg-slate-100/70 px-2 py-1 rounded-full">
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  <span className="text-[9px] font-black text-slate-500">{product.ratingsAverage}</span>
                </div>
              )}
            </div>

            <h3 className="text-xl font-[900] text-slate-900 tracking-tight leading-none group-hover:text-emerald-600 transition-colors duration-300 uppercase">
              {product.name}
            </h3>

            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              By {product.vendor?.storeName || 'Tradify Curator'}
            </p>
          </div>

          <div className="flex items-baseline gap-1 pt-2 border-t border-slate-50">
            <span className="text-[11px] font-black text-slate-300 uppercase tracking-tighter">EGP</span>
            <span className="text-2xl font-[900] text-slate-900 tracking-tighter">{product.price}</span>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProductCard;