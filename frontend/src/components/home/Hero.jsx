import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";

/**
 * Hero Component
 * A high-end minimalist hero section using Framer Motion for entrance animations.
 * Features a balanced grid layout with refined typography and a primary CTA area.
 */
const Hero = () => {
  const navigate = useNavigate();

  // Animation variants for synchronized entrance effects
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay, duration: 1, ease: [0.19, 1, 0.22, 1] },
    }),
  };

  return (
    <section
className="relative min-h-screen flex items-center bg-white overflow-hidden pt-24 "      dir="ltr"
    >
      {/* --- Main Content Container --- */}
<div className="container mx-auto px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start lg:items-center">        
        {/* Left Column: Branding, Typography & Actions */}
        <div className="flex flex-col items-start text-left space-y-12">
          <div className="space-y-6 max-w-xl">
            {/* Sub-headline / Brand Tagline */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.5em]"
            >
              The New Standard
            </motion.div>

            {/* Main Headline with mixed font-styles for premium feel */}
            <motion.h1
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="text-6xl md:text-[7.5rem] font-black text-slate-900 leading-[0.9] tracking-tighter"
            >
              Modern <br />
              <span className="italic font-serif font-light text-slate-300">
                Aesthetics.
              </span>
            </motion.h1>

            {/* Supportive descriptive text */}
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="text-slate-400 text-lg md:text-xl font-light leading-relaxed max-w-md"
            >
              Carefully selected objects for a refined lifestyle. Simple,
              functional, and timeless pieces designed for your home.
            </motion.p>
          </div>

          {/* Call to Action (CTA) Group */}
          <motion.div 
            variants={fadeInUp} 
            initial="hidden" 
            animate="visible" 
            custom={0.4}
            className="flex flex-wrap items-center gap-5 md:gap-8"
          >
            {/* Primary Action: Shop Collection */}
            <button 
              onClick={() => navigate('/products')}
              className="relative group overflow-hidden bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl hover:shadow-emerald-200/50 active:scale-95"
            >
              <span className="relative z-10">Shop Collection</span>
              <div className="absolute inset-0 bg-emerald-500 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
            </button>

            {/* Secondary Action: Login (Cohesive Emerald Gradient) */}
            <button 
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_15px_30px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.7)] hover:-translate-y-1 transition-all active:scale-95"
            >
              Login Now
            </button>

          
          </motion.div>
        </div>

        {/* Right Column: Visual Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          className="relative flex justify-center lg:justify-end"
        >
          {/* Hero Image Container with hover transition */}
          <div className="relative w-full max-w-[500px] aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.05)]">
            <img
              src="https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
              alt="Minimalist Lifestyle Interior"
            />

            {/* Interactive Floating Product Card */}
            <div className="absolute bottom-8 left-8 right-8 bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white/20 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Featured item
                </p>
                <h3 className="text-slate-900 font-bold">
                  Minimalist Oak Chair
                </h3>
              </div>
              <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-emerald-600 transition-colors">
                <ShoppingBag size={16} />
              </div>
            </div>
          </div>

          {/* Decorative Background Element (Ambient Glow) */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-50/40 rounded-full blur-[100px] pointer-events-none" />
        </motion.div>
      </div>

      {/* --- Pagination / Progress Indicator --- */}
      {/* <div className="absolute bottom-12 left-16 hidden lg:flex items-center gap-4">
        <span className="text-[10px] font-black text-slate-900">01</span>
        <div className="w-20 h-[1px] bg-slate-200">
          <div className="w-1/3 h-full bg-emerald-500" />
        </div>
        <span className="text-[10px] font-black text-slate-200">03</span>
      </div> */}
    </section>
  );
};

export default Hero;