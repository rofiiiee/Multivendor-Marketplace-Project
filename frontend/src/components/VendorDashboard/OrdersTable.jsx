import React, { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Box, User, Phone, Truck, CheckCircle, Package, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateOrderToDeliveredAPI } from "../../api"; 

const OrdersTable = ({ orders, onOrderUpdate }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const toggleRow = (id) => setExpandedId(expandedId === id ? null : id);

  const handleShipOrder = async (orderId) => {
    try {
      setLoadingId(orderId);
      await updateOrderToDeliveredAPI(orderId);
      if (onOrderUpdate) onOrderUpdate();
      // استبدال الـ alert بـ console أو toast ليكون احترافي أكثر
      console.log("Order status updated successfully");
    } catch (err) {
      console.error("Update Error:", err);
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="w-full p-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
        <Package className="mx-auto text-slate-200 mb-4" size={48} />
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]">No orders found</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm" dir="ltr">
      <table className="w-full border-collapse">
        <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
          <tr>
            <th className="px-8 py-5 text-left">Ref ID</th>
            <th className="px-8 py-5 text-left">Customer</th>
            <th className="px-8 py-5 text-center">Your Status</th>
            <th className="px-8 py-5 text-right">Earning</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {orders.map((order) => {
            // ✅ التعديل الجوهري: التاجر يشوف حالة منتجاته هو بس
            // بنشيك لو "كل" المنتجات اللي مبعوتة للفيندور ده في الأوردر ده حالتها shipped
            const isVendorItemsShipped = order.items?.every(item => item.status === "shipped");

            return (
              <React.Fragment key={order._id}>
                <tr 
                  onClick={() => toggleRow(order._id)} 
                  className={`cursor-pointer transition-all ${expandedId === order._id ? 'bg-blue-50/30' : 'hover:bg-slate-50'}`}
                >
                  <td className="px-8 py-7 font-mono text-[11px] font-bold text-slate-400">
                    #{order._id?.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-8 py-7">
                    <span className="text-sm font-black text-slate-900">{order.user?.name || "Guest"}</span>
                  </td>
                  <td className="px-8 py-7 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 w-fit mx-auto border ${
                      isVendorItemsShipped 
                        ? 'bg-blue-50 text-blue-600 border-blue-100' 
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {isVendorItemsShipped ? <Truck size={12}/> : <Clock size={12}/>}
                      {isVendorItemsShipped ? 'Shipped' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-8 py-7 text-right font-black text-slate-900">
                    {order.totalPrice} <small className="text-slate-400 ml-1">EGP</small>
                  </td>
                </tr>

                <AnimatePresence>
                  {expandedId === order._id && (
                    <tr>
                      <td colSpan="4" className="p-0">
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="bg-slate-50/40 border-b border-slate-100 overflow-hidden"
                        >
                          <div className="p-8 grid grid-cols-12 gap-6">
                            {/* المنتجات */}
                            <div className="col-span-7 bg-white p-6 rounded-[2rem] border border-slate-100">
                              <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Box size={14} /> Package Contents
                              </h6>
                              <div className="space-y-4">
                                {order.items?.map((item, idx) => (
                                  <div key={idx} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0">
                                    <div className="flex items-center gap-3">
                                      <div className="relative">
                                        <img src={item.product?.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                                        {item.status === 'shipped' && (
                                          <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 shadow-sm">
                                            <CheckCircle size={8} />
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <p className="text-xs font-black text-slate-800">{item.product?.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Qty: {item.quantity}</p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs font-black">{item.price * item.quantity} EGP</p>
                                      <p className="text-[8px] text-emerald-500 font-bold uppercase">{item.status}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* الشحن والتحكم */}
                            <div className="col-span-5 space-y-4">
                              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 text-[11px] font-bold text-slate-600 shadow-sm">
                                <p className="mb-3 flex items-center gap-2"><MapPin size={14} className="text-blue-500" /> {order.shippingAddress?.city}, {order.shippingAddress?.address}</p>
                                <p className="flex items-center gap-2"><Phone size={14} className="text-blue-500" /> {order.shippingAddress?.phone}</p>
                              </div>

                              {!isVendorItemsShipped ? (
                                <button 
                                  disabled={loadingId === order._id}
                                  onClick={(e) => { e.stopPropagation(); handleShipOrder(order._id); }}
                                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-emerald-200/30"
                                >
                                  {loadingId === order._id ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                  ) : (
                                    <><Truck size={16} /> Confirm My Items Shipment</>
                                  )}
                                </button>
                              ) : (
                                <div className="w-full bg-blue-50 text-blue-600 py-5 rounded-2xl font-black uppercase text-[10px] text-center border border-blue-100 flex items-center justify-center gap-2">
                                  <CheckCircle size={16} /> Shipped by You
                                </div>
                              )}
                              
                              <p className="text-[9px] text-slate-400 text-center font-bold px-4">
                                * Shipping this order will update your balance and notify the customer.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;