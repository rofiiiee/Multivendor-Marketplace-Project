import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "../api"; 
import { Link, useNavigate } from "react-router-dom";
import { User, Store, Mail, Lock, UserCircle, ArrowRight, MapPin, Phone, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 1. Validation Schema
 * Defines the structure and constraints for the registration form.
 */
const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["customer", "vendor"]), // API expects 'customer' for standard users
  storeName: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
}).refine((data) => {
  if (data.role === "vendor") {
    return !!data.storeName && data.storeName.trim() !== "" && !!data.phoneNumber;
  }
  return true;
}, {
  message: "Store Name and Phone are required for vendors",
  path: ["storeName"], 
});

const Register = () => {
  const navigate = useNavigate();
  const [serverMsg, setServerMsg] = useState({ text: "", isError: false });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ 
    resolver: zodResolver(schema),
    defaultValues: { role: "customer" } 
  });

  const currentRole = watch("role");

  /**
   * Logic: Submit Function
   * Handles API interaction and local storage of user credentials.
   */
  const onSubmit = async (formData) => {
    setServerMsg({ text: "", isError: false });
    
    const payload = { ...formData };
    // Cleanup payload: remove vendor-specific fields if the role is 'customer'
    if (formData.role === "customer") {
      delete payload.storeName;
      delete payload.phoneNumber;
      delete payload.address;
    }

    try {
      const res = await api.post("/auth/register", payload);
      
      const token = res.data.token;
      const userData = res.data.user || res.data.data?.user;

      if (token && userData) {
        // Persist session data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("role", userData.role); 

        // Set default auth header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setServerMsg({ text: "Account created! Redirecting...", isError: false });

        // Conditional redirect based on user role
        setTimeout(() => {
          if (userData.role === "vendor") {
            navigate("/dashboard-vendor"); 
          } else {
            navigate("/products"); 
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Registration Error:", error.response?.data);
      setServerMsg({ 
        text: error.response?.data?.message || "Registration failed. Try again.", 
        isError: true 
      });
    }
  };

  const inputStyle = (error) => `
    w-full bg-slate-50 border p-4 pl-12 rounded-2xl focus:outline-none focus:ring-2 transition-all text-sm font-medium
    ${error ? "border-red-400 focus:ring-red-100" : "border-slate-100 focus:ring-emerald-500/20 focus:border-emerald-500"}
  `;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start p-6 pt-24 font-sans relative overflow-hidden" dir="ltr">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl shadow-emerald-200/50 p-10 border border-slate-100"
      >
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-100">
            <Store className="text-white" size={36} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Join Tradify</h2>
          <p className="text-slate-400 text-sm mt-2 font-black uppercase tracking-widest text-[10px]">Premium Marketplace Membership</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Role Selection Toggle */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
            <button
              type="button"
              onClick={() => setValue("role", "customer")} 
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${currentRole === 'customer' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
            >
              <User size={16} /> Customer
            </button>
            <button
              type="button"
              onClick={() => setValue("role", "vendor")}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${currentRole === 'vendor' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
            >
              <Store size={16} /> Vendor
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input {...register("name")} placeholder="Full Name" className={inputStyle(errors.name)} />
              {errors.name && <p className="text-[10px] text-red-500 font-bold mt-1 ml-4 uppercase tracking-tighter">{errors.name.message}</p>}
            </div>
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input {...register("email")} placeholder="Email Address" className={inputStyle(errors.email)} />
              {errors.email && <p className="text-[10px] text-red-500 font-bold mt-1 ml-4 uppercase tracking-tighter">{errors.email.message}</p>}
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="password" {...register("password")} placeholder="Create Password" className={inputStyle(errors.password)} />
              {errors.password && <p className="text-[10px] text-red-500 font-bold mt-1 ml-4 uppercase tracking-tighter">{errors.password.message}</p>}
            </div>
          </div>

          {/* Conditional Vendor Fields */}
          <AnimatePresence>
            {currentRole === "vendor" && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-6 mt-6 border-t border-dashed border-slate-100 space-y-4"
              >
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.3em] ml-2 mb-4">Professional Identity</p>
                <div className="relative">
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input {...register("storeName")} placeholder="Legal Store Name" className={inputStyle(errors.storeName)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input {...register("address")} placeholder="Hub Location" className={inputStyle(errors.address)} />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input {...register("phoneNumber")} placeholder="Business Phone" className={inputStyle(errors.phoneNumber)} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Server Response Messages */}
          {serverMsg.text && (
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className={`p-4 rounded-2xl text-[11px] text-center font-black uppercase tracking-widest ${serverMsg.isError ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}
            >
              {serverMsg.text}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 bg-slate-900 hover:bg-emerald-600 text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-3 transform active:scale-[0.98] disabled:opacity-50 mt-6"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <>Initialize Account <ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-10 text-[10px] font-black uppercase tracking-widest">
          Existing Member? <Link to="/login" className="text-emerald-600 hover:underline">Access Portal</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;