import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../../api';

/**
 * Categories Component
 * Renders a horizontally scrollable collection gallery.
 * Features: Professional LTR layout, side fading effects, and dynamic routing.
 */
const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Curated imagery for category cards (fallback cycle)
  const categoryImages = [
    "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/3965557/pexels-photo-3965557.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=600",
  ];

  // Fetch all categories from backend on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  /**
   * Navigates to the products page filtered by the selected category ID
   * @param {string} categoryId 
   */
  const handleCategoryClick = (categoryId) => {
    navigate(`/products?category=${categoryId}`);
  };

  if (loading) return null;

  return (
    <section className="py-24 bg-white overflow-hidden" dir="ltr">
      {/* --- Section Header --- */}
      <div className="container mx-auto px-6 mb-12 flex items-center justify-between">
        <div className="space-y-3">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight lowercase first-letter:uppercase">
            Categories
          </h2>
          <div className="h-1.5 w-16 bg-emerald-500 rounded-full" />
        </div>
        <p className="hidden md:block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          Scroll to Explore →
        </p>
      </div>

      {/* --- Horizontal Scroll Wrapper --- */}
      <div className="relative group px-6">
        
        {/* Aesthetic Side Fades (Left) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-20" />
        
        {/* Aesthetic Side Fades (Right) */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-20" />

        {/* Scrollable Container */}
        <div 
          className="flex gap-8 overflow-x-auto scroll-smooth scrollbar-hide pb-10 active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat, index) => (
            <motion.div 
              key={cat._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              onClick={() => handleCategoryClick(cat._id)}
              className="flex-shrink-0 w-[240px] md:w-[300px] group/item cursor-pointer"
            >
              {/* Card Media Container */}
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-50 mb-6 border border-slate-100 transition-all duration-700 group-hover/item:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.12)] group-hover/item:-translate-y-2">
                <img 
                  src={categoryImages[index % categoryImages.length]} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover/item:scale-110"
                  alt={cat.name}
                />
                {/* Visual Overlay on Hover */}
                <div className="absolute inset-0 bg-emerald-950/0 group-hover/item:bg-emerald-950/5 transition-colors duration-500" />
              </div>

              {/* Card Metadata */}
              <div className="px-4 text-center">
                <h3 className="text-xl font-black text-slate-900 group-hover/item:text-emerald-600 transition-colors tracking-tight">
                  {cat.name}
                </h3>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 opacity-0 group-hover/item:opacity-100 transition-all duration-500">
                  Browse Collection
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;