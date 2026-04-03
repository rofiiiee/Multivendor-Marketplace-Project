import React, { useState } from "react";
import { Edit3, Trash2, Box, AlertTriangle, PackageCheck, X, Check } from "lucide-react";

const InventoryTable = ({ products, onEdit, onDelete }) => {
  // حالة لتخزين الـ ID بتاع المنتج اللي بنأكد حذفه حالياً
  const [deletingId, setDeletingId] = useState(null);

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: "Out of Stock", color: "bg-red-50 text-red-600 border-red-100", icon: <AlertTriangle size={12}/> };
    if (stock <= 5) return { label: "Low Stock", color: "bg-orange-50 text-orange-600 border-orange-100", icon: <Box size={12}/> };
    return { label: "In Stock", color: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: <PackageCheck size={12}/> };
  };

  const getImageUrl = (image) => {
    if (!image || image === "") return "https://placehold.co/400x400?text=Product";
    if (typeof image === 'string' && image.startsWith('http')) return image;
    return `http://localhost:5000/img/products/${image}`;
  };

  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center">
        <div className="bg-slate-50 p-6 rounded-full mb-4 text-slate-300"><Box size={48} /></div>
        <h3 className="text-slate-900 font-black text-xl">Inventory Empty</h3>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/30 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
              <th className="px-10 py-6">Product Details</th>
              <th className="px-8 py-6 text-center">Price</th>
              <th className="px-8 py-6 text-center">Stock</th>
              <th className="px-10 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.map((p) => {
              const status = getStockStatus(p.stock);
              const isConfirming = deletingId === p._id;

              return (
                <tr key={p._id} className="group hover:bg-slate-50/40 transition-all duration-200">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-[1.25rem] overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                        <img src={getImageUrl(p.image)} className="w-full h-full object-cover" alt={p.name} />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-black text-slate-900 text-sm tracking-tight">{p.name}</span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase">ID: {p._id.substring(p._id.length - 6)}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center font-black text-slate-900 text-sm">
                      <span className="text-[9px] text-slate-400 uppercase mb-0.5">EGP</span>
                      {Number(p.price).toLocaleString()}
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border font-black text-[9px] uppercase tracking-wider ${status.color}`}>
                        {status.icon} {status.label}
                      </div>
                    </div>
                  </td>

            <td className="px-10 py-6 text-right">
  <div className="flex justify-end items-center gap-2">
    {!isConfirming ? (
      <>
        <button onClick={() => onEdit(p)} className="p-2.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"><Edit3 size={18}/></button>
        {/* الزرار ده دلوقتي بيفتح الـ Confirm state بس، مفيش أي أرت */}
        <button onClick={() => setDeletingId(p._id)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18}/></button>
      </>
    ) : (
      <div className="flex items-center gap-2 bg-red-50 p-1 rounded-2xl animate-in slide-in-from-right-2 duration-300">
        <span className="text-[9px] font-black text-red-600 px-2 uppercase">Sure?</span>
        <button 
          onClick={() => { onDelete(p._id); setDeletingId(null); }} // هنا المسح الفعلي
          className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-sm"
        >
          <Check size={14}/>
        </button>
        <button 
          onClick={() => setDeletingId(null)} // هنا الإلغاء
          className="p-2 bg-white text-slate-400 rounded-xl hover:text-slate-600 transition-all border border-red-100"
        >
          <X size={14}/>
        </button>
      </div>
    )}
  </div>
</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;