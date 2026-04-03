import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api'; 
import { X, Upload, DollarSign, Loader2, List, AlertCircle, CheckCircle2 } from 'lucide-react';

const ProductModal = ({ onClose, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      name: initialData?.name || "",
      price: initialData?.price || "",
      stock: initialData?.stock || "",
      description: initialData?.description || "",
      category: initialData?.category?._id || initialData?.category || "",
    }
  });

  const watchedImage = watch("image");

  useEffect(() => {
    api.get("/categories")
      .then(res => {
        const cats = res.data.data?.categories || res.data.categories || [];
        setCategories(cats);
      })
      .catch(err => console.error("Error fetching categories:", err));

    if (initialData?.image) {
      const existingImg = Array.isArray(initialData.image) ? initialData.image[0] : initialData.image;
      const imgUrl = (typeof existingImg === 'string' && existingImg.startsWith('http'))
        ? existingImg
        : `http://localhost:5000/img/products/${existingImg}`;
      setImagePreview(imgUrl);
    }
  }, [initialData]);

  useEffect(() => {
    if (watchedImage && watchedImage[0] instanceof File) {
      const objectUrl = URL.createObjectURL(watchedImage[0]);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [watchedImage]);

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("description", data.description);
    formData.append("category", data.category);
    
    if (data.image && data.image[0] instanceof File) {
      formData.append("image", data.image[0]);
    }

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const response = initialData 
        ? await api.put(`/products/${initialData._id}`, formData, config)
        : await api.post("/products", formData, config);

      if (response.status === 200 || response.status === 201) {
        setShowSuccess(true);
        setTimeout(() => {
          onClose();
          window.location.reload(); 
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[92vh] overflow-y-auto relative shadow-2xl animate-in zoom-in duration-300">
        
        {/* Success Overlay */}
        {showSuccess && (
          <div className="absolute inset-0 z-[100] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-500">
            <div className="bg-emerald-100 p-5 rounded-full mb-4">
              <CheckCircle2 size={60} className="text-emerald-600 animate-bounce" />
            </div>
            <h3 className="text-2xl font-black text-slate-800">Success!</h3>
            <p className="text-slate-500 font-medium">Product has been saved successfully.</p>
          </div>
        )}

        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur z-20 px-10 py-6 border-b border-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-none">
              {initialData ? "Edit Product" : "Create New Product"}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Inventory Management</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 text-slate-400 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-6 text-left" dir="ltr">
          
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase ml-2 tracking-widest">Media</label>
            <div className={`relative h-52 w-full rounded-[2rem] border-2 border-dashed flex items-center justify-center overflow-hidden transition-all group ${errors.image ? 'border-red-300 bg-red-50' : 'border-slate-100 bg-slate-50 hover:border-emerald-500 hover:bg-emerald-50/30'}`}>
              <input 
                type="file" id="img-upload" className="hidden" accept="image/*" 
                {...register("image", { required: !initialData ? "Product image is required" : false })} 
              />
              <label htmlFor="img-upload" className="w-full h-full cursor-pointer flex flex-col items-center justify-center text-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105" />
                ) : (
                  <>
                    <div className="bg-white p-4 rounded-full shadow-sm mb-3">
                      <Upload className="text-blue-500" size={28} />
                    </div>
                    <span className="text-slate-500 text-xs font-bold">Drop your image here or click to browse</span>
                  </>
                )}
              </label>
            </div>
            {errors.image && <p className="text-red-500 text-[10px] font-bold ml-3 flex items-center gap-1 mt-1"><AlertCircle size={12}/> {errors.image.message}</p>}
          </div>

          {/* Product Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-400 uppercase ml-2 tracking-widest">Details</label>
            <input 
              {...register("name", { required: "Name is mandatory" })} 
              placeholder="Ex: Wireless Noise Cancelling Headphones" 
              className={`w-full p-4 pl-6 rounded-2xl border font-bold outline-none transition-all ${errors.name ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-100 bg-slate-50 focus:border-blue-500 focus:bg-white'}`} 
            />
            {errors.name && <p className="text-red-500 text-[10px] font-bold ml-3">{errors.name.message}</p>}
          </div>

       {/* Price & Stock Section */}
<div className="grid grid-cols-2 gap-4">
  {/* Price Input */}
  <div className="space-y-1">
    <div className="relative">
      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
      <input 
  type="number" 
  step="0.01"
  min="0.01" // ده اللي بيخلي العداد يبدأ من 0.01
  {...register("price", { 
    required: "Price is required", 
    min: { 
      value: 0.01, 
      message: "Price must be at least 0.01" 
    } 
  })} 
  placeholder="Price" 
className={`w-full p-4 pl-10 rounded-2xl border font-bold outline-none transition-all ${errors.price ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-100 bg-slate-50 focus:border-blue-500'}`} />
    </div>
    {errors.price && <p className="text-red-500 text-[10px] font-bold ml-3">{errors.price.message}</p>}
  </div>

  {/* Stock Input */}
  <div className="space-y-1">
    <div className="relative">
      <List className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
    <input 
  type="number"
  min="1" // ده اللي بيخلي العداد يبدأ من 1 ويمنع السهم ينزل لتحت
  {...register("stock", { 
    required: "Stock quantity is required", 
    min: { 
      value: 1, 
      message: "Stock must be at least 1 unit" 
    } 
  })} 
  placeholder="Qty" 
  className={`w-full p-4 pl-10 rounded-2xl border font-bold outline-none transition-all ${errors.stock ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-100 bg-slate-50 focus:border-blue-500'}`} 
/>
    </div>
    {errors.stock && <p className="text-red-500 text-[10px] font-bold ml-3">{errors.stock.message}</p>}
  </div>
</div>

          {/* Category */}
          <div className="space-y-1">
            <select 
              {...register("category", { required: "Please select a category" })} 
              className={`w-full p-4 px-6 rounded-2xl border font-bold text-slate-600 outline-none cursor-pointer transition-all ${errors.category ? 'border-red-300' : 'border-slate-100 bg-slate-50 focus:border-blue-500'}`}
            >
              <option value="">Select Category</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-[10px] font-bold ml-3">{errors.category.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <textarea 
              {...register("description", { 
                required: "Description is required", 
                minLength: { value: 20, message: "Please provide a more detailed description (min 20 chars)" } 
              })} 
              placeholder="Describe the main features and benefits..." 
              rows="3" 
              className={`w-full p-4 px-6 rounded-2xl border font-medium outline-none transition-all resize-none ${errors.description ? 'border-red-300' : 'border-slate-100 bg-slate-50 focus:border-blue-500 focus:bg-white'}`} 
            />
            {errors.description && <p className="text-red-500 text-[10px] font-bold ml-3">{errors.description.message}</p>}
          </div>

          {/* Submit Button */}
          <button 
            disabled={loading} 
            className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-[10px] disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : (initialData ? "Update Item" : "Publish Product")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;