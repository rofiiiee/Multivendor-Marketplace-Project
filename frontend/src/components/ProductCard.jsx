import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  // Normalize and resolve image source
  const fixImageUrl = (image) => {
    if (!image) return 'https://via.placeholder.com/400x500?text=No+Data';

    // Case 1: full URL
    if (typeof image === 'string' && image.startsWith('http')) {
      return image;
    }

    // Case 2: Cloudinary public ID
    const cloudName = 'YOUR_CLOUD_NAME';
    if (typeof image === 'string') {
      return `https://res.cloudinary.com/${cloudName}/image/upload/${image}`;
    }

    // Case 3: object response
    if (image?.secure_url) return image.secure_url;
    if (image?.url) return image.url;

    return 'https://via.placeholder.com/400x500?text=Format+Error';
  };

  const imageUrl =
    product.image && product.image.trim() !== ''
      ? product.image
      : 'https://via.placeholder.com/400x500?text=No+Image+Uploaded';

  // Check if product exists in wishlist
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('wishlist')) || [];
    const exists = stored.find((item) => item.id === product._id);
    setIsFavorite(!!exists);
  }, [product._id]);

  // Toggle wishlist state
  const handleWishlist = (e) => {
    e.stopPropagation(); // Prevent card click navigation

    const stored = JSON.parse(localStorage.getItem('wishlist')) || [];

    const exists = stored.find((item) => item.id === product._id);

    let updated;

    if (exists) {
      // Remove from wishlist
      updated = stored.filter((item) => item.id !== product._id);
      setIsFavorite(false);
    } else {
      // Add to wishlist
      const newItem = {
        id: product._id,
        name: product.name,
        price: product.price,
        image: imageUrl,
      };

      updated = [...stored, newItem];
      setIsFavorite(true);
    }

    localStorage.setItem('wishlist', JSON.stringify(updated));
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  return (
    <motion.div
      onClick={() =>
        navigate(`/product/${product._id}`, { state: { product } })
      }
      className="group relative bg-white rounded-[1.5rem] sm:rounded-[2rem] p-3 shadow-sm hover:shadow-xl transition-all cursor-pointer"
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-md p-2 rounded-full shadow hover:scale-110 transition"
      >
        <Heart
          size={18}
          className={`transition-colors ${
            isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400'
          }`}
        />
      </button>

      {/* Image */}
      <div className="relative aspect-[4/5] rounded-[1.2rem] sm:rounded-[1.5rem] overflow-hidden bg-slate-100">
        <img
          src={fixImageUrl(imageUrl)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            if (!e.target.src.includes('localhost')) {
              e.target.src = `http://localhost:5000/img/products/${product.image}`;
            }
          }}
        />
      </div>

      {/* Content */}
      <div className="mt-4 px-2 space-y-1">
        <h3 className="text-slate-900 font-bold truncate text-left text-sm sm:text-base">
          {product.name}
        </h3>

        <div className="flex justify-between items-center pt-2">
          <span className="text-emerald-600 font-black text-sm sm:text-base">
            EGP {product.price}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              // Add to cart logic goes here
            }}
            className="bg-slate-900 text-white p-2 rounded-lg hover:bg-emerald-600 transition"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;