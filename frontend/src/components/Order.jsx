import React, { useEffect, useState } from "react";
import { 
  Package, Calendar, ChevronRight, Clock, CheckCircle2, 
  Truck, AlertCircle, Hash, ArrowLeft, MapPin, Phone, CreditCard 
} from "lucide-react";
import { getMyOrdersAPI } from "../api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrdersAPI();
        // Ensure data is handled correctly whether it's a direct array or wrapped in an object
        setOrders(Array.isArray(data) ? data : data?.orders || []);
      } catch (error) {
        console.error("Orders Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { style: "bg-amber-50 text-amber-600 border-amber-100", icon: <Clock size={12} />, label: "Processing" };
      case "shipped":
        return { style: "bg-blue-50 text-blue-600 border-blue-100", icon: <Truck size={12} />, label: "On The Way" };
      case "delivered":
        return { style: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: <CheckCircle2 size={12} />, label: "Delivered" };
      default:
        return { style: "bg-slate-50 text-slate-600 border-slate-100", icon: <AlertCircle size={12} />, label: status };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Retrieving History</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-32 px-6 lg:px-20 font-sans" dir="ltr">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={() => navigate("/")} className="flex items-center gap-2 text-slate-400 hover:text-emerald-500 font-black text-[9px] uppercase tracking-[0.3em] mb-4 transition-colors">
              <ArrowLeft size={14} /> Back to Store
            </button>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
              My <span className="italic font-serif font-light text-slate-400">Purchases.</span>
            </h1>
          </motion.div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Total Orders</p>
                <p className="text-xl font-black text-slate-900">{orders.length}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                <Package size={20} />
              </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-20 rounded-[2.5rem] border border-slate-100 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No orders found</h3>
            <button onClick={() => navigate("/")} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] mt-4 hover:bg-emerald-600 transition-all">
              Start Shopping
            </button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {orders.map((order, index) => {
              const status = getStatusConfig(order.status);
              return (
                <motion.div 
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden"
                >
                  {/* Order Metadata Top Bar */}
                  <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <div className="flex items-center gap-3">
                      <Hash size={14} className="text-slate-300" />
                      <span className="font-mono text-xs font-bold text-slate-500 uppercase">
                        ID: {order._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${status.style}`}>
                      {status.icon} {status.label}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Left Column: List of Ordered Items */}
                    <div className="lg:col-span-7 p-8 border-r border-slate-50">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">Ordered Items</p>
                      <div className="space-y-4">
                        {/* Mapping items based on Backend naming convention */}
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                                <img 
                                  // Accessing filtered product image from Backend
                                  src={item.product?.image || 'https://placehold.co/100x100'} 
                                  className="w-full h-full object-cover"
                                  alt={item.product?.name}
                                />
                              </div>
                              <div>
                                <p className="font-black text-slate-800 text-xs">{item.product?.name}</p>
                                <p className="text-[10px] text-emerald-500 font-bold uppercase">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="font-black text-slate-900 text-xs">EGP {item.price * item.quantity}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Logistics & Shipping Info */}
                    <div className="lg:col-span-5 p-8 bg-slate-50/20">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">Delivery Details</p>
                      
                      <div className="space-y-5">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-red-400 border border-slate-100 flex-shrink-0">
                            <MapPin size={14} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</p>
                            <p className="text-xs font-bold text-slate-700 leading-relaxed">
                              {order.shippingAddress?.city}, {order.shippingAddress?.address}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-blue-400 border border-slate-100 flex-shrink-0">
                            <Phone size={14} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</p>
                            <p className="text-xs font-bold text-slate-700">{order.shippingAddress?.phone || "No phone provided"}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-emerald-400 border border-slate-100 flex-shrink-0">
                            <CreditCard size={14} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Status</p>
                            <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">
                              {order.isPaid ? 'Paid Online' : 'Cash on Delivery'}
                              <span className={`ml-2 text-[8px] px-2 py-0.5 rounded ${order.isPaid ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                                {order.isPaid ? 'SUCCESS' : 'PENDING'}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Footer: Summary & Date */}
                  <div className="px-8 py-6 bg-slate-900 flex justify-between items-center text-white">
                    <div className="flex items-center gap-4 opacity-60">
                       <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                          <Calendar size={12}/> {new Date(order.createdAt).toLocaleDateString()}
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">Final Amount</p>
                       <p className="text-2xl font-black tracking-tighter">
                          <span className="text-xs mr-1 opacity-50">EGP</span>
                          {order.totalPrice || order.totalOrderPrice}
                       </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;