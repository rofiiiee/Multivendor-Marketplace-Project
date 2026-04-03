import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; 
import { 
  Package, ShoppingCart, DollarSign, PlusCircle, Loader2, 
  LayoutDashboard, LogOut, BarChart3, Menu, X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import StatCard from "../components/VendorDashboard/StatCard";
import InventoryTable from "../components/VendorDashboard/InventoryTable";
import OrdersTable from "../components/VendorDashboard/OrdersTable";
import ProductModal from "../components/VendorDashboard/ProductModal";

const VendorDashboard = () => {
  const navigate = useNavigate();
  
  // --- States ---
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); 
  const [modalMode, setModalMode] = useState({ open: false, data: null });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * 1. Logic: Fetch All Data
   * Retrieves products and orders concurrently for the authenticated vendor.
   */
  const fetchVendorData = useCallback(async () => {
    try {
      setLoading(true);
      const [resProducts, resOrders] = await Promise.all([
        api.get("/products/vendor"),
        api.get("/orders/vendor/all")
      ]);

      // Data Mapping: Ensures compatibility with potential variations in API response schemas
      const productsData = resProducts.data?.data?.products || resProducts.data?.products || [];
      const ordersData = resOrders.data?.data?.orders || resOrders.data?.orders || [];

      setProducts(productsData);
      setOrders(ordersData);
    } catch (err) {
      console.error("Error fetching vendor dashboard data:", err);
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchVendorData();
  }, [fetchVendorData]);

  /**
   * 2. Logic: Delete Product
   * Removes a product from the database and updates local state for immediate UI feedback.
   */
  const handleDeleteProduct = async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      setProducts(prev => prev.filter(p => p._id !== productId));
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting product");
    }
  };

  /**
   * 3. Logic: Calculations
   * Aggregates total revenue from the current orders list.
   */
  const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

  // Navigation Items Configuration
  const navItems = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={18}/> },
    { id: "inventory", label: "Inventory", icon: <Package size={18}/> },
    { id: "orders", label: "Logistics", icon: <ShoppingCart size={18}/> },
  ];

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-slate-900 mb-4" size={40} />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Control Center</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row pt-20 lg:pt-24" dir="ltr">
      
      {/* --- Mobile Header --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-white border-b border-slate-100 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xs">T</div>
          <span className="font-black text-slate-900 tracking-tighter">Tradify Vendor</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-slate-50 rounded-xl">
          {isMobileMenuOpen ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </div>

      {/* --- Sidebar: Conditional Rendering for Responsive Layout --- */}
      <AnimatePresence>
        {(isMobileMenuOpen || window.innerWidth > 1024) && (
          <motion.aside 
            initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
            className="fixed lg:sticky top-20 lg:top-24 left-0 w-72 lg:w-80 h-[calc(100vh-80px)] lg:h-[calc(100vh-96px)] bg-white border-r border-slate-100 z-40 p-8 flex flex-col"
          >
            <nav className="space-y-2">
              {navItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    activeTab === item.id ? 'bg-slate-900 text-white shadow-xl translate-x-2' : 'text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </nav>

            <button 
              onClick={() => { localStorage.clear(); navigate("/login"); }} 
              className="mt-auto flex items-center gap-4 px-6 py-4 text-slate-300 font-black text-[11px] uppercase tracking-widest hover:text-red-500 transition-all border-t border-slate-50 pt-8"
            >
              <LogOut size={16} /> Terminate
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* --- Main Dashboard Content --- */}
      <main className="flex-1 p-6 lg:p-16 max-w-[1400px] w-full mx-auto overflow-hidden">
        
        <AnimatePresence mode="wait">
          
          {/* Section: Overview (Business KPIs) */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <header className="mb-16 text-left">
                <p className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2">Live Insights</p>
                <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
                  Business <span className="text-slate-200 italic font-serif font-light">Overview.</span>
                </h1>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <StatCard title="Total Revenue" value={totalRevenue} isCurrency icon={DollarSign} colorClass="bg-emerald-50 text-emerald-600 border border-emerald-100" />
                <StatCard title="Orders Count" value={orders.length} icon={ShoppingCart} colorClass="bg-blue-50 text-blue-600 border border-blue-100" />
                <StatCard title="Active Stock" value={products.length} icon={Package} colorClass="bg-purple-50 text-purple-600 border border-purple-100" />
              </div>

              <div className="bg-white p-12 rounded-[3rem] border border-slate-100 h-80 flex flex-col items-center justify-center text-center shadow-sm">
                <BarChart3 className="text-slate-100 mb-4" size={60} />
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Advanced Analytics Engine Coming Soon</p>
              </div>
            </motion.div>
          )}

          {/* Section: Inventory (Product Management) */}
          {activeTab === "inventory" && (
            <motion.div key="inventory" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 text-left">
                <div>
                  <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2">Stock Control</p>
                  <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Global <span className="text-slate-200 italic font-serif font-light">Inventory.</span></h1>
                </div>
                <button 
                  onClick={() => setModalMode({ open: true, data: null })} 
                  className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-emerald-600 transition-all flex items-center gap-3"
                >
                  <PlusCircle size={18} /> New Product
                </button>
              </header>

              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <InventoryTable 
                  products={products} 
                  onEdit={(p) => setModalMode({ open: true, data: p })} 
                  onDelete={handleDeleteProduct} 
                />
              </div>
            </motion.div>
          )}

          {/* Section: Logistics (Order Fulfillment) */}
          {activeTab === "orders" && (
            <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <header className="mb-12 text-left">
                <p className="text-amber-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2">Fulfillment Station</p>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Order <span className="text-slate-200 italic font-serif font-light">Logistics.</span></h1>
              </header>

              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <OrdersTable orders={orders} onOrderUpdate={fetchVendorData} />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* --- Modal Management: Create/Update Logic --- */}
      {modalMode.open && (
        <ProductModal 
          initialData={modalMode.data} // Passing existing data triggers Edit mode; null triggers Create mode
          onClose={() => { 
            setModalMode({ open: false, data: null }); 
            fetchVendorData(); // Refresh list after successful submission
          }} 
        />
      )}
    </div>
  );
};

export default VendorDashboard;