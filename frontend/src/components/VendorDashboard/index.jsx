// import React, { useEffect, useState, useCallback } from "react";
// import { Package, ShoppingCart, LogOut, PlusCircle, Loader2, DollarSign, LayoutDashboard } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";

// import StatCard from "./StatCard";
// import InventoryTable from "./InventoryTable";
// import OrdersTable from "./OrdersTable";
// import ProductModal from "./ProductModal";

// const VendorDashboard = () => {
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState(null);
//   const [myProducts, setMyProducts] = useState([]);
//   const [myOrders, setMyOrders] = useState([]);
//   const [activeTab, setActiveTab] = useState("inventory");
//   const [loading, setLoading] = useState(true);
//   const [modalMode, setModalMode] = useState({ open: false, data: null });

//   const fetchData = useCallback(async () => {
//     const token = localStorage.getItem("token");
//     if (!token) { navigate("/login"); return; }
//     const config = { headers: { Authorization: `Bearer ${token}` } };
    
//     try {
//       setLoading(true);
//       const profileRes = await axios.get("http://localhost:5000/api/vendors/me", config);
//       const vendorData = profileRes.data.data?.vendor || profileRes.data.vendor;
//       setProfile(vendorData);

//       const [productsRes, ordersRes] = await Promise.all([
//         axios.get("http://localhost:5000/api/products", config),
//         axios.get("http://localhost:5000/api/orders", config).catch(() => ({ data: { data: [] } }))
//       ]);

//       if (vendorData) {
//         const myId = (vendorData._id || vendorData.id).toString();
        
//         // Products filtering
//         const allProducts = productsRes.data.data?.products || productsRes.data.products || [];
//         setMyProducts(allProducts.filter(p => (p.vendor?._id || p.vendor || "").toString() === myId));

//         // Orders filtering
//         const allOrders = ordersRes.data.data?.orders || ordersRes.data.orders || [];
//         setMyOrders(allOrders.filter(order => 
//           order.cartItems?.some(item => (item.product?.vendor?._id || item.product?.vendor || "").toString() === myId)
//         ));
//       }
//     } catch (error) {
//       console.error("Fetch Error:", error);
//     } finally { setLoading(false); }
//   }, [navigate]);

//   useEffect(() => { fetchData(); }, [fetchData]);

//   const handleDelete = async (id) => {
//     // تم حذف window.confirm لأن التأكيد أصبح Inline داخل InventoryTable
//     try {
//       await axios.delete(`http://localhost:5000/api/products/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//       });
//       setMyProducts(prev => prev.filter(p => p._id !== id));
//     } catch (err) {
//       console.error("Delete failed");
//     }
//   };

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center bg-white">
//       <motion.div 
//         animate={{ rotate: 360 }} 
//         transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//       >
//         <Loader2 className="text-slate-900" size={40} />
//       </motion.div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#FAFAFA] flex" dir="ltr">
//       {/* Sidebar Navigation */}
//       <aside className="w-80 border-r border-slate-100 bg-white h-screen sticky top-0 hidden lg:flex flex-col p-10">
//         <div className="flex items-center gap-3 mb-16">
//           <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
//             <LayoutDashboard size={20} />
//           </div>
//           <span className="font-black text-xl tracking-tighter text-slate-900">Console.</span>
//         </div>

//         <nav className="space-y-3">
//           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] ml-4 mb-4">Management</p>
//           <button 
//             onClick={() => setActiveTab("inventory")}
//             className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === "inventory" ? 'bg-slate-900 text-white shadow-xl translate-x-2' : 'text-slate-400 hover:bg-slate-50'}`}
//           >
//             <Package size={16}/> Inventory
//           </button>
//           <button 
//             onClick={() => setActiveTab("orders")}
//             className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === "orders" ? 'bg-slate-900 text-white shadow-xl translate-x-2' : 'text-slate-400 hover:bg-slate-50'}`}
//           >
//             <ShoppingCart size={16}/> Logistics
//           </button>
//         </nav>

//         <button 
//           onClick={() => { localStorage.clear(); navigate("/login"); }} 
//           className="mt-auto group flex items-center gap-4 px-6 py-4 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-red-500 transition-all"
//         >
//           <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> 
//           Terminate Session
//         </button>
//       </aside>

//       <main className="flex-1 p-8 lg:p-16 max-w-[1600px] mx-auto w-full">
//         <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
//           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
//             <div className="flex items-center gap-2 mb-3">
//               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
//               <p className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em]">{profile?.storeName || "Vendor Store"}</p>
//             </div>
//             <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-none">
//               Control <span className="italic font-serif font-light text-slate-300 underline decoration-1 underline-offset-8">Center.</span>
//             </h1>
//           </motion.div>
          
//           <button 
//             onClick={() => setModalMode({ open: true, data: null })} 
//             className="bg-slate-900 text-white px-8 py-5 rounded-[1.25rem] font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-emerald-600 transition-all flex items-center gap-3 active:scale-95"
//           >
//             <PlusCircle size={18} /> Add New Product
//           </button>
//         </header>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
//           <StatCard 
//             title="Revenue Balance" 
//             value={profile?.balance || 0} 
//             isCurrency={true}
//             icon={DollarSign} 
//             colorClass="bg-emerald-50 text-emerald-600 border border-emerald-100" 
//           />
//           <StatCard 
//             title="Active Shipments" 
//             value={myOrders.length} 
//             icon={ShoppingCart} 
//             colorClass="bg-blue-50 text-blue-600 border border-blue-100" 
//           />
//         </div>

//         {/* Content Section */}
//         <motion.div 
//           layout
//           className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
//         >
//           <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-sm">
//             <div className="flex items-center gap-3">
//               <div className="w-2 h-8 bg-slate-900 rounded-full" />
//               <h2 className="text-2xl font-black text-slate-900 tracking-tight">
//                 {activeTab === "inventory" ? "Global Inventory" : "Order Logistics"}
//               </h2>
//             </div>
//             <span className="px-4 py-2 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
//               {activeTab === "inventory" ? `${myProducts.length} Items` : `${myOrders.length} Records`}
//             </span>
//           </div>

//           <div className="p-2">
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={activeTab}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 {activeTab === "inventory" ? (
//                    <InventoryTable 
//                      products={myProducts} 
//                      onEdit={(p) => setModalMode({ open: true, data: p })} 
//                      onDelete={handleDelete} 
//                    />
//                 ) : (
//                   <OrdersTable orders={myOrders} />
//                 )}
//               </motion.div>
//             </AnimatePresence>
//           </div>
//         </motion.div>
//       </main>

//       {/* Modal Render */}
//       {modalMode.open && (
//         <ProductModal 
//           onClose={() => {
//             setModalMode({ open: false, data: null });
//             fetchData(); // تحديث البيانات فوراً بعد غلق المودال
//           }} 
//           initialData={modalMode.data} 
//         />
//       )}
//     </div>
//   );
// };

// export default VendorDashboard;