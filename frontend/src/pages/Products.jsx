import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts, getCategories } from '../api';
import ProductCard from '../components/home/ProductCard';
import { SlidersHorizontal, Loader2, Sparkles, PackageSearch } from 'lucide-react';

/**
 * Products Gallery Component
 * Handles dynamic filtering via URL queries and category bar selection.
 * Features staggered animations and responsive grid layouts.
 */
const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const location = useLocation();

  // Fetch initial data and sync with URL category parameters
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodData, catData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        
        setProducts(prodData);
        setCategories(catData);

        // Sync state with URL category parameter for deep linking
        const queryParams = new URLSearchParams(location.search);
        const categoryIdFromUrl = queryParams.get('category');

        if (categoryIdFromUrl) {
          setActiveCategory(categoryIdFromUrl);
          setFilteredProducts(prodData.filter(p => p.category?._id === categoryIdFromUrl));
        } else {
          setActiveCategory('all');
          setFilteredProducts(prodData);
        }
      } catch (error) {
        console.error("Data fetching sequence failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location.search]);

  /**
   * Filters product list based on category ID
   * @param {string} categoryId 
   */
  const handleFilter = (categoryId) => {
    setActiveCategory(categoryId);
    if (categoryId === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category?._id === categoryId));
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-[#27A376]" size={40} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Loading Collection</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pt-32 pb-24" dir="ltr">
      <div className="container mx-auto px-8 max-w-[1400px]">
        
        {/* --- Page Header --- */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2 text-[#27A376] font-black text-[10px] uppercase tracking-[0.4em]">
               Tradify Collections
            </div>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter">
              Explore  <span className="italic font-serif font-light text-slate-300">our range</span>
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 shadow-sm"
          >
            <SlidersHorizontal size={14} className="text-[#27A376]" />
            Showing {filteredProducts.length} Results
          </motion.div>
        </header>

        {/* --- Category Navigation Filter --- */}
        <div className="flex items-center gap-3 overflow-x-auto pb-10 mb-12 border-b border-slate-50 scrollbar-hide">
          <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

          {/* "All" Toggle */}
          <button
            onClick={() => handleFilter('all')}
            className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap active:scale-95 ${
              activeCategory === 'all' 
              ? 'bg-slate-900 text-white shadow-2xl shadow-emerald-900/20' 
              : 'bg-white text-slate-400 border border-slate-100 hover:border-emerald-200 hover:text-emerald-600'
            }`}
          >
            All Items
          </button>
          
          {/* Dynamic Categories */}
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleFilter(cat._id)}
              className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap active:scale-95 ${
                activeCategory === cat._id 
                ? 'bg-slate-900 text-white shadow-2xl shadow-emerald-900/20' 
                : 'bg-white text-slate-400 border border-slate-100 hover:border-emerald-200 hover:text-emerald-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* --- Product Grid with Animated Presence --- */}
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <motion.div 
              key={activeCategory}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 }
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
            >
              {filteredProducts.map(product => (
                <motion.div 
                  key={product._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-40 flex flex-col items-center justify-center bg-slate-50/40 rounded-[4rem] border border-dashed border-slate-200"
            >
              <PackageSearch size={48} className="text-slate-200 mb-6" />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
                Collection Currently Empty
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Products;