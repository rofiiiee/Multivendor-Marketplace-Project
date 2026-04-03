import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  ArrowLeft, Truck, ShieldCheck, MapPin, 
  Mail, Phone, User, Package, Loader2, AlertCircle 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

// 1. Comprehensive Validation Schema (English)
const checkoutSchema = z.object({
  name: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^[0-9]{10,15}$/, "Enter a valid phone number (10-15 digits)"),
  address: z.string().min(10, "Address is too short, please provide more details"),
  city: z.string().min(2, "City name is required"),
});

// --- HELPER FUNCTION TO HANDLE IMAGE URLS ---
// This function ensures the image URL is correct, whether it's full, relative, or missing.
const getProductImageUrl = (imagePath) => {
  if (!imagePath) return null; // No image provided

  // If it's already a full URL (starts with http or https), return it
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it's a relative path (e.g., /uploads/image.jpg), prepend the API base URL
  // Assumes your api.js has a baseURL defined. Replace 'http://localhost:5000' with your actual backend URL if needed.
  const baseURL = api.defaults.baseURL || 'http://localhost:5000'; 
  
  // Make sure there's only one slash between baseURL and imagePath
  const cleanBaseURL = baseURL.replace(/\/+$/, ''); // Remove trailing slashes
  const cleanImagePath = imagePath.replace(/^\/+/, ''); // Remove leading slashes
  
  return `${cleanBaseURL}/${cleanImagePath}`;
};

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: "onTouched", 
  });

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      // Handle different possible response structures
      const items = res.data?.cart?.items || res.data?.data?.cart?.items || res.data?.data?.items || [];
      setCartItems(items);
    } catch (err) {
      toast.error("Could not load your cart. Please refresh.");
      console.error("Cart Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      // Handle productId nested structure or direct price
      const price = item.productId?.price || item.price || 0;
      return total + price * (item.quantity || 1);
    }, 0);
  };

const onFormSubmit = async (data) => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Processing your order...");

    try {
      const orderData = {
        // Ensure backend expects 'items' array structure
        items: cartItems.map((item) => ({
          product: item.productId?._id || item.product?._id, // Fallback to secure product ID
          quantity: item.quantity,
          price: item.productId?.price || item.price 
        })),
        totalPrice: calculateTotal(),
        shippingAddress: {
          fullName: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city
        },
      };

      // 1. تنفيذ الأوردر
      const response = await api.post("/orders", orderData);
      
      // 2. لو نجح، حدثي العداد في الناف بار فوراً
      window.dispatchEvent(new Event("cartUpdated"));

      // 3. النجاح (شيلنا المسح اليدوي للكارت لأنه غالباً بيتم في الباك)
      toast.success("Order placed successfully!", { id: toastId });
      
      // تحويل لصفحة النجاح أو الأوردرات
      setTimeout(() => navigate("/orders"), 2000);

    } catch (error) {
      console.error("Submission Error Details:", error.response?.data);
      const serverMessage = error.response?.data?.message || "Server connection issue.";
      toast.error(`Order Failed: ${serverMessage}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-emerald-500" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-6 lg:px-20 font-sans" dir="ltr">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold text-xs uppercase tracking-widest transition-all mb-10 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Shopping
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: FORM SECTION */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7"
          >
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <Truck size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Shipping Details</h2>
                  <p className="text-slate-400 text-sm">Please enter your delivery information accurately.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
                  
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-black uppercase text-slate-400 ml-1 mb-2 block tracking-widest">Full Name</label>
                    <div className="relative">
                      <User className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.name ? 'text-red-400' : 'text-slate-300'}`} size={18} />
                      <input 
                        {...register("name")}
                        placeholder="e.g. Ahmed Ali"
                        className={`w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 transition-all ${errors.name ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-emerald-500/20 focus:bg-white'}`}
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-[10px] mt-2 font-bold flex items-center gap-1"><AlertCircle size={12}/> {errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-[11px] font-black uppercase text-slate-400 ml-1 mb-2 block tracking-widest">Email Address</label>
                    <div className="relative">
                      <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.email ? 'text-red-400' : 'text-slate-300'}`} size={18} />
                      <input 
                        {...register("email")}
                        placeholder="name@company.com"
                        className={`w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 transition-all ${errors.email ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-emerald-500/20 focus:bg-white'}`}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-[10px] mt-2 font-bold flex items-center gap-1"><AlertCircle size={12}/> {errors.email.message}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-[11px] font-black uppercase text-slate-400 ml-1 mb-2 block tracking-widest">Phone Number</label>
                    <div className="relative">
                      <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.phone ? 'text-red-400' : 'text-slate-300'}`} size={18} />
                      <input 
                        {...register("phone")}
                        placeholder="01xxxxxxxxx"
                        className={`w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 transition-all ${errors.phone ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-emerald-500/20 focus:bg-white'}`}
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-[10px] mt-2 font-bold flex items-center gap-1"><AlertCircle size={12}/> {errors.phone.message}</p>}
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-black uppercase text-slate-400 ml-1 mb-2 block tracking-widest">Delivery Address</label>
                    <div className="relative">
                      <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.address ? 'text-red-400' : 'text-slate-300'}`} size={18} />
                      <input 
                        {...register("address")}
                        placeholder="House no, Street name, Landmark"
                        className={`w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 transition-all ${errors.address ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-emerald-500/20 focus:bg-white'}`}
                      />
                    </div>
                    {errors.address && <p className="text-red-500 text-[10px] mt-2 font-bold flex items-center gap-1"><AlertCircle size={12}/> {errors.address.message}</p>}
                  </div>

                  {/* City */}
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-black uppercase text-slate-400 ml-1 mb-2 block tracking-widest">City</label>
                    <input 
                      {...register("city")}
                      placeholder="e.g. Cairo"
                      className={`w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 transition-all ${errors.city ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-emerald-500/20 focus:bg-white'}`}
                    />
                    {errors.city && <p className="text-red-500 text-[10px] mt-2 font-bold flex items-center gap-1"><AlertCircle size={12}/> {errors.city.message}</p>}
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Complete Purchase"}
                </button>
              </form>
            </div>
          </motion.div>

          {/* RIGHT: ORDER SUMMARY */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-emerald-200/50 sticky top-32">
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center justify-between">
                Order Summary
                <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest font-black">{cartItems.length} items</span>
              </h3>

              {/* PRODUCT LIST WITH IMAGES */}
              <div className="space-y-6 max-h-[380px] overflow-y-auto pr-2 mb-8 custom-scrollbar border-b border-slate-50 pb-8">
                {cartItems.map((item, index) => {
                  // Attempt to get the image path from different possible fields
                  const rawImagePath = item.productId?.image || item.image;
                  const finalImageUrl = getProductImageUrl(rawImagePath);

                  return (
                    <div key={index} className="flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 relative group-hover:border-emerald-200 transition-colors">
                          {finalImageUrl ? (
                            <img 
                                src={finalImageUrl} 
                                alt={item.productId?.name || "Product"} 
                                className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                                // Fallback if the processed URL still fails to load
                                onError={(e) => { 
                                  e.target.onerror = null; // Prevent infinite loop
                                  e.target.src = 'https://via.placeholder.com/150?text=Error';
                                }}
                            />
                          ) : (
                            // Placeholder if no image path exists at all
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Package size={24} />
                            </div>
                          )}
                          <div className="absolute top-0 right-0 bg-slate-900 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-bl-xl font-bold z-10">
                            {item.quantity}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 line-clamp-1">{item.productId?.name || "Product"}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter italic">EGP {(item.productId?.price || item.price || 0).toLocaleString()}</p>
                        </div>
                      </div>
                      <p className="text-sm font-black text-slate-900">EGP {((item.productId?.price || item.price || 0) * item.quantity).toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>

              {/* PRICES */}
              <div className="space-y-4">
                <div className="flex justify-between text-slate-400 text-xs font-black uppercase tracking-widest">
                  <span>Shipping Fee</span>
                  <span className="text-emerald-500 tracking-normal">Complimentary</span>
                </div>
                <div className="flex justify-between items-end pt-6 border-t border-slate-100">
                  <span className="text-slate-900 font-black uppercase tracking-[0.2em] text-xs underline decoration-emerald-400 decoration-4 underline-offset-8">Total</span>
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">
                    <span className="text-sm font-medium mr-1 uppercase">EGP</span>
                    {calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* SECURITY BADGE */}
            <div className="bg-emerald-50/50 rounded-[2rem] p-6 border border-emerald-100/50 flex items-center gap-5">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-50">
                <ShieldCheck size={28} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Encrypted Checkout</p>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">Your payment information is processed securely. We never store your credit card details.</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;