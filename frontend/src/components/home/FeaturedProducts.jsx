import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProducts } from '../../api';
import ProductCard from './ProductCard';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts()
      .then(data => {
        if (data && Array.isArray(data)) {
        
          const selection = data.filter(p => p.isFeatured).length > 0 
            ? data.filter(p => p.isFeatured).slice(0, 8) 
            : data.slice(0, 8);
            
          setProducts(selection);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="container mx-auto px-6 py-24 pb-32 overflow-hidden" dir="ltr">
      <div className="flex flex-col md:flex-row items-end justify-between mb-16 max-w-7xl mx-auto gap-4 text-left">
        <div className="space-y-2">
          <h4 className="text-[#27A376] font-black text-[10px] uppercase tracking-[0.4em]">The Selection</h4>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter lowercase first-letter:uppercase">
            Featured <span className="italic font-serif font-light text-slate-300">Products</span>
          </h2>
        </div>
        <button 
          onClick={() => navigate('/products')}
          className="text-[10px] font-black text-slate-400 hover:text-[#27A376] transition-all uppercase tracking-[0.2em] border-b-2 border-transparent hover:border-[#27A376] pb-1"
        >
          View Full Collection
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-[4/5] bg-slate-50 animate-pulse rounded-[2.5rem]"></div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10 max-w-7xl mx-auto"
        >
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </motion.div>
      )}
    </main>
  );
};

export default FeaturedProducts;