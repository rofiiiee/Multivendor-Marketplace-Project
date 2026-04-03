import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getProducts } from '../api'; 
import api from '../api';
import {
  ShoppingBag, Heart, ArrowLeft, ShieldCheck, Truck, Star,
  Minus, Plus, Share2, CheckCircle2, Award, Clock, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [shareStatus, setShareStatus] = useState(null);

  // --- Notification Toast Logic ---
  const [toast, setToast] = useState({ show: false, message: "", isError: false });

  const showToast = (msg, isError = false) => {
    setToast({ show: true, message: msg, isError });
    setTimeout(() => setToast({ show: false, message: "", isError: false }), 3000);
  };

  useEffect(() => {
    // If product data wasn't passed via state, fetch it from the API
    if (!product) {
      getProducts().then((allProducts) => {
        const found = allProducts.find((p) => p._id === id);
        setProduct(found);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }

    // Check if the item already exists in the local wishlist
    const favorites = JSON.parse(localStorage.getItem('wishlist')) || [];
    const foundInWishlist = favorites.find((item) => item._id === id);
    if (foundInWishlist) setIsFavorite(true);

    window.scrollTo(0, 0);
  }, [id, product]);

  const toggleWishlist = () => {
    let favorites = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (isFavorite) {
      favorites = favorites.filter((item) => item._id !== product._id);
      setIsFavorite(false);
      showToast("Removed from Wishlist", false);
    } else {
      favorites.push(product);
      setIsFavorite(true);
      showToast("Added to Wishlist! ❤️", false);
    }
    localStorage.setItem('wishlist', JSON.stringify(favorites));
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus('copied');
        showToast("Link copied to clipboard!", false);
        setTimeout(() => setShareStatus(null), 2000);
      }
    } catch (err) { console.error(err); }
  };

  const handleAddToCart = async () => {
    try {
      await api.post("/cart", { productId: product._id, quantity: quantity });
      showToast(`${quantity} Item(s) added to your bag! 🛒`, false);
      
      // Dispatch a custom event so the Navbar can react to cart changes
      window.dispatchEvent(new Event("cartUpdated"));

      // Small delay to allow the user to see the success toast before navigation
      setTimeout(() => navigate("/cart"), 1200);
    } catch (error) {
      console.error("Add To Cart Error:", error.response?.data);
      if (error.response?.status === 401) {
        showToast("Please login to add items to cart!", true);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        showToast("Failed to add to cart. Try again.", true);
      }
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full" />
    </div>
  );

  if (!product) return <div className="h-screen flex items-center justify-center font-bold text-xl">Product Not Found</div>;

  return (
    <>
      {/* Dynamic Toast Message */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -100, x: "-50%" }}
            animate={{ opacity: 1, y: 100, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-0 left-1/2 z-[100] px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 border ${
              toast.isError ? "bg-red-50/90 border-red-100 text-red-600" : "bg-emerald-900/90 border-emerald-800 text-white"
            }`}
          >
            {toast.isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} className="text-emerald-400" />}
            <span className="text-[11px] font-black uppercase tracking-widest">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-slate-50 pt-24 pb-20 font-sans" dir="ltr">
        <div className="container mx-auto px-6 max-w-[1200px]">
          
          {/* Navigation & Header Actions */}
          <div className="flex justify-between items-center mb-10">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-bold transition-all bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
            
            <div className="flex gap-3">
               <button 
                onClick={handleShare}
                className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
              >
                {shareStatus === 'copied' ? <CheckCircle2 className="text-emerald-500" /> : <Share2 size={20} />}
              </button>
              <button 
                onClick={toggleWishlist}
                className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-red-50 group transition-all"
              >
                <Heart size={20} className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-400 group-hover:text-red-500"} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left: Product Image Showcase */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-white flex items-center justify-center relative overflow-hidden group"
            >
               <div className="absolute top-6 left-6 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                 Official Store
               </div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[450px] object-contain transform group-hover:scale-105 transition-transform duration-700"
              />
            </motion.div>

            {/* Right: Product Details & Purchase Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-lg text-xs font-black uppercase tracking-tighter">
                  <Star size={14} fill="currentColor" /> 4.9 Rating
                </div>
                <h1 className="text-5xl font-black text-gray-900 leading-tight">{product.name}</h1>
                <p className="text-gray-500 text-lg leading-relaxed max-w-md">{product.description}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-emerald-600">EGP {product.price}</span>
                <span className="text-gray-400 line-through text-lg">EGP {Math.floor(product.price * 1.2)}</span>
              </div>

              <hr className="border-gray-100" />

              {/* Quantity Management */}
              <div className="space-y-4">
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Select Quantity</p>
                <div className="flex items-center bg-white border border-gray-200 w-fit rounded-2xl p-2 shadow-sm">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-600"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center font-black text-xl text-gray-800">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-3 hover:bg-slate-50 rounded-xl transition-colors text-emerald-600"
                    aria-label="Increase quantity"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Purchase Button */}
              <button
                onClick={handleAddToCart}
                className="group w-full bg-slate-900 hover:bg-emerald-600 text-white py-6 rounded-[1.5rem] shadow-xl hover:shadow-emerald-200 transition-all duration-300 flex items-center justify-center gap-4 active:scale-[0.98]"
              >
                <ShoppingBag size={24} className="group-hover:rotate-12 transition-transform" />
                <span className="text-lg font-black uppercase tracking-widest">Add to Cart</span>
                <div className="h-6 w-[1px] bg-white/20 mx-2" />
                <span className="text-lg font-bold">EGP {product.price * quantity}</span>
              </button>

              {/* Security & Trust Badges */}
              <div className="flex items-center justify-center gap-6 pt-4 text-gray-400 border-t border-gray-50">
                 <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-tighter"><Award size={14}/> Top Quality</div>
                 <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-tighter"><Clock size={14}/> 14-Day Returns</div>
              </div>

            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;