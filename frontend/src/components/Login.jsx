import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

// 1. Validation Schema
const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  
  // 2. Toast State
  const [toast, setToast] = useState({ show: false, message: "", isError: false });

  const showToast = (msg, isError = false) => {
    setToast({ show: true, message: msg, isError });
    setTimeout(() => setToast({ show: false, message: "", isError: false }), 3000);
  };

  // 3. React Hook Form with Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/auth/login", data);
      const token = response.data.token || response.data.data?.token;
      const userData = response.data.user || response.data.data?.user;

      if (token) {
        localStorage.setItem("token", token);
        if (userData) localStorage.setItem("user", JSON.stringify(userData));

        showToast("Welcome back! Redirecting...", false);
        
        setTimeout(() => {
          if (userData?.role === "vendor") {
            navigate("/dashboard-vendor");
          } else {
            navigate("/products");
          }
          window.location.reload();
        }, 1500);
      } else {
        showToast("Login issue: Token not received.", true);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login failed. Check your credentials.";
      showToast(errorMsg, true);
    }
  };

  return (
    <>
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -100, x: "-50%" }}
            animate={{ opacity: 1, y: 100, x: "-50%" }}
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

      <div className="min-h-screen flex items-center justify-center bg-emerald-50/20 p-6 pt-24 font-sans relative overflow-hidden" dir="ltr">
        {/* Decorative Circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="max-w-md w-full backdrop-blur-sm bg-white/80 rounded-[2.5rem] shadow-[0_20px_50px_rgba(16,185,129,0.1)] p-10 border border-white relative z-10">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200 rotate-3 hover:rotate-0 transition-transform duration-300">
              <ShieldCheck className="text-white" size={40} />
            </div>
            <h2 className="text-4xl font-black text-emerald-950 tracking-tight mb-2">Welcome Back</h2>
            <p className="text-emerald-600 font-medium">Great to see you again!</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field with Full Validation */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-emerald-900 ml-1 flex items-center gap-2">
                <Mail size={16} className="text-emerald-500" /> Email Address
              </label>
              <div className="relative group">
                <input
                  type="email"
                  {...register("email")}
                  placeholder="name@company.com"
                  className={`w-full px-5 py-4 rounded-2xl border bg-white/50 outline-none transition-all duration-300 placeholder:text-slate-400 ${
                    errors.email
                      ? "border-red-400 focus:ring-4 focus:ring-red-50"
                      : "border-emerald-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 shadow-sm group-hover:border-emerald-300"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 font-bold flex items-center gap-1 ml-1">
                  • {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field with Full Validation */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-emerald-900 ml-1 flex items-center gap-2">
                <Lock size={16} className="text-emerald-500" /> Password
              </label>
              <div className="relative group">
                <input
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  className={`w-full px-5 py-4 rounded-2xl border bg-white/50 outline-none transition-all duration-300 ${
                    errors.password
                      ? "border-red-400 focus:ring-4 focus:ring-red-50"
                      : "border-emerald-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 shadow-sm group-hover:border-emerald-300"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 font-bold flex items-center gap-1 ml-1">
                  • {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-5 rounded-[1.25rem] shadow-[0_10px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_15px_25px_rgba(16,185,129,0.3)] transition-all duration-300 flex items-center justify-center gap-3 group active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing In..." : (
                <>
                  Sign In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-emerald-800 font-semibold bg-emerald-50 py-4 rounded-2xl inline-block px-8 border border-emerald-100/50">
              New here?{" "}
              <Link to="/register" className="text-emerald-600 font-black hover:underline ml-1">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;