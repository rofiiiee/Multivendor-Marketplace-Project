import React from 'react';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, RotateCcw, Headset } from 'lucide-react';

/**
 * Features Component
 * * Showcases the store's core value propositions using interactive cards.
 * Utilizes Framer Motion for scroll-triggered entrance animations and 
 * Lucide-react for consistent iconography.
 */
const Features = () => {
  // Data-driven approach for feature items to ensure clean logic
  const items = [
    { icon: <Truck size={28} />, title: "Premium Delivery", desc: "Worldwide concierge service", id: "01" },
    { icon: <ShieldCheck size={28} />, title: "Secure Vault", desc: "Military-grade encryption", id: "02" },
    { icon: <RotateCcw size={28} />, title: "Grace Period", desc: "30-day effortless returns", id: "03" },
    { icon: <Headset size={28} />, title: "Elite Support", desc: "24/7 Dedicated assistance", id: "04" },
  ];

  return (
    <section className="relative py-32 bg-white overflow-hidden border-y border-slate-50" dir="ltr">
      
      {/* --- Ambient Background Typography (Watermark Effect) --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center select-none pointer-events-none opacity-[0.03]">
        <h2 className="text-[15vw] font-black uppercase tracking-[0.2em] text-slate-900">
          Experience
        </h2>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="group relative p-10 rounded-[3rem] bg-white border border-slate-100 hover:border-emerald-500/20 transition-all duration-700 cursor-default"
            >
              {/* Subtle Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[3rem]" />

              <div className="relative z-10 space-y-8">
                {/* Icon Container with dynamic rotation effect */}
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white group-hover:rotate-[15deg] transition-all duration-500 shadow-sm">
                    {item.icon}
                  </div>
                  {/* Item index with emerald accent */}
                  <span className="text-[10px] font-black text-slate-200 group-hover:text-emerald-500/60 transition-colors duration-500 tracking-widest">
                    {item.id}
                  </span>
                </div>

                {/* Text Content with strict typography */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider">
                    {item.desc}
                  </p>
                </div>

                {/* Animated progress-style divider */}
                <div className="pt-2">
                  <div className="w-8 h-[2px] bg-slate-100 group-hover:w-full group-hover:bg-emerald-500 transition-all duration-700 rounded-full" />
                </div>
              </div>

              {/* External Ambient Glow */}
              <div className="absolute -inset-1 bg-emerald-400/5 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;