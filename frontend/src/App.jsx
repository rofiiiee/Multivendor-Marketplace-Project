import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";

// --- Layout Components ---
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// --- Page Components ---
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import About from "./pages/About";
import Register from "./components/Register";
import Login from "./components/Login";
import Cart from "./components/Cart";
import Checkout from "./components/Cheakout";
import VendorDashboard from "./pages/VendorDashboard";
import Order from "./components/Order";

/**
 * ScrollToTop Component
 * Resets the window scroll position to the top on every route change.
 * Essential for maintaining high-end UX across navigation.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Ensures immediate jump for clean transitions
    });
  }, [pathname]);

  return null;
};

/**
 * Main Application Component
 * Handles Global Routing, Layout Structure, and Core Styles.
 */
function App() {
  return (
    <Router>
      {/* Ensures users start at the top of every new page */}
      <ScrollToTop />
      
      <div className="min-h-screen bg-white flex flex-col font-sans antialiased selection:bg-emerald-50 selection:text-emerald-900">
        {/* Persistent Navigation */}
        <Navbar />
        
        {/* Dynamic Page Content Area */}
        <main className="flex-grow">
          <Routes>
            {/* Primary Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} /> 
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} /> 
            <Route path="/dashboard-vendor" element={<VendorDashboard />} />
            <Route path="/orders" element={<Order />} />

            {/* Custom 404 - Not Found Page (Editorial Style) */}
            <Route path="*" element={
              <div className="h-[75vh] flex flex-col items-center justify-center text-center">
                <h1 className="text-[15vw] font-[900] text-slate-50 italic tracking-tighter select-none">404</h1>
                <div className="space-y-4 -mt-16 relative z-10">
                   <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400">
                     Lost in Excellence
                   </p>
                   <button 
                     onClick={() => window.location.href = "/"}
                     className="mt-8 px-10 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-200/30 active:scale-95"
                   >
                     Return to Home
                   </button>
                </div>
              </div>
            } />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;