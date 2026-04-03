import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Globe, ShieldCheck, Zap, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * About Page Component
 * Implements a high-contrast, editorial layout with advanced Framer Motion sequences.
 */
const About = () => {
  const navigate = useNavigate();

  // Animation Variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <div className="min-h-screen bg-white pt-48 pb-32 overflow-hidden" dir="ltr">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1400px]">
        
        {/* --- 1. HERO SECTION (Typography Focus) --- */}
        <section className="relative mb-64">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-6 mb-20"
          >
            <span className="text-emerald-600 font-black text-[11px] uppercase tracking-[0.8em] block">
              Established 2026
            </span>
            <h1 className="text-[12vw] lg:text-[9vw] font-[900] text-slate-900 leading-[0.85] tracking-tighter uppercase">
              The Global <br /> 
              <span className="text-emerald-600 italic font-serif font-light lowercase px-4 tracking-normal">standard</span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-end">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="lg:col-span-5"
            >
              <p className="text-2xl text-slate-400 font-light leading-snug italic border-l-[3px] border-emerald-500 pl-8 max-w-md">
                Redefining the connection between world-class vendors and conscious collectors.
              </p>
            </motion.div>
            
            <div className="lg:col-span-7 flex justify-end">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, rotate: -1 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, duration: 1.2 }}
                className="w-full lg:w-[90%] aspect-video bg-slate-50 rounded-[4rem] overflow-hidden relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] group"
              >
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format" 
                  className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-[2s] group-hover:scale-105" 
                  alt="Marketplace Vision" 
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-1000" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- 2. CORE VALUES SECTION (Grid & Sticky) --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-24 mb-64 items-start">
          <div className="lg:col-span-7 space-y-32">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-8 max-w-2xl"
            >
              <h2 className="text-6xl font-[900] text-slate-900 tracking-tighter uppercase leading-[0.9]">
                Curating the <br /> <span className="text-slate-200">Extraordinary.</span>
              </h2>
              <p className="text-slate-500 text-xl leading-relaxed font-medium">
                We don't just host vendors; we vet excellence. Our platform is a filtered ecosystem where every item tells a story of craftsmanship and premium utility.
              </p>
            </motion.div>

            {/* Values Grid with Staggered Animation */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {[
                { title: "Vetted Network", desc: "Rigorous standards for every global vendor.", icon: <Globe size={22}/> },
                { title: "Authentic Only", desc: "Verified traceability for every premium artifact.", icon: <ShieldCheck size={22}/> },
                { title: "Instant Logistics", desc: "Custom-built network for global-speed delivery.", icon: <Zap size={22}/> },
                { title: "Elite Support", desc: "Dedicated concierge for your shopping journey.", icon: <Plus size={22}/> }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  className="group p-12 rounded-[3rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-emerald-200 hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.1)] transition-all duration-700"
                >
                  <div className="text-emerald-600 mb-8 group-hover:scale-125 group-hover:rotate-[10deg] transition-transform duration-500">{item.icon}</div>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 mb-4">{item.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Sticky Brand Card */}
          <div className="lg:col-span-5 sticky top-32">
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="aspect-[4/5] bg-slate-900 rounded-[4rem] p-14 text-white flex flex-col justify-between overflow-hidden shadow-2xl relative"
            >
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/10 blur-[120px] rounded-full" />
              
              <div className="space-y-8 relative z-10">
                <div className="w-16 h-[1px] bg-emerald-500" />
                <h3 className="text-5xl font-black uppercase tracking-tighter leading-tight">
                  Driven by <br /> <span className="text-emerald-500 italic font-serif font-light lowercase tracking-normal">vision</span>, <br /> Built for <br /> <span className="text-slate-400">collectors.</span>
                </h3>
              </div>

              <div className="space-y-8 relative z-10">
                <p className="text-lg text-slate-400 font-light leading-relaxed">Join the movement of thousands redefining the standard of digital shopping.</p>
                <div className="h-[1px] w-full bg-white/5" />
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500">
                  <span>Trusted by 10k+</span>
                  <span className="text-slate-600 tracking-widest italic font-serif">Est. 2024</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- 3. CALL TO ACTION SECTION --- */}
        <section className="text-center py-40">
          <motion.div 
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="inline-block"
          >
            <h2 className="text-[10vw] font-[900] text-slate-900 tracking-tighter uppercase mb-16 leading-[0.8]">
              Start Your <br /> <span className="text-emerald-600 italic font-serif font-light lowercase tracking-normal">legacy.</span>
            </h2>
            
            <button 
              onClick={() => navigate('/products')}
              className="group relative inline-flex items-center gap-12 bg-slate-900 text-white pl-16 pr-5 py-5 rounded-full transition-all hover:bg-emerald-600 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] active:scale-95"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.5em] relative z-10">Explore Collection</span>
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-slate-900 group-hover:rotate-45 transition-transform duration-500 relative z-10">
                <ArrowUpRight size={22} />
              </div>
            </button>
          </motion.div>
        </section>

      </div>
    </div>
  );
};

export default About;