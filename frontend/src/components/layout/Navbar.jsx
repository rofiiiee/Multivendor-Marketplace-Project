import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LogoPng from '../../assets/tradify-logo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Retrieve user data from localStorage and normalize role
  const checkUser = () => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({ ...parsed, role: storedRole || parsed.role });
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // Handle navbar style on scroll
    const handleScroll = () => setIsScrolled(window.scrollY > 20);

    checkUser();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Clear session and redirect to home
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Orders', path: '/orders', authRequired: true },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Home', path: '/' },
  ];

  // Filter links based on authentication state
  const filteredLinks = navLinks.filter(
    (link) => !link.authRequired || user
  );

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl py-3 border-b border-slate-100 shadow-sm'
          : 'bg-white py-4 md:py-5 border-b border-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-[1440px] flex items-center justify-between">

        {/* LEFT SIDE: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-5 order-1 lg:order-none">

          {/* Vendor Dashboard Button */}
          {user?.role === 'vendor' && (
            <button
              onClick={() => navigate('/dashboard-vendor')}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-all duration-300 shadow-lg group relative"
            >
              <LayoutDashboard size={18} />
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                Dashboard
              </div>
            </button>
          )}

          {/* User Profile / Login */}
          <div className="relative">
            <button
              onClick={() =>
                user
                  ? setIsUserMenuOpen(!isUserMenuOpen)
                  : navigate('/login')
              }
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-slate-50 text-slate-900 rounded-xl hover:bg-white hover:shadow-md transition-all border border-slate-100"
            >
              <User size={18} />
            </button>

            {/* User Dropdown */}
            <AnimatePresence>
              {isUserMenuOpen && user && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-14 right-0 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 z-[110]"
                >
                  <div className="px-4 py-3 border-b border-slate-50 mb-2 text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Signed in as
                    </p>
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {user.name || user.email}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full text-left px-4 py-2 text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    Profile Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-[10px] font-black uppercase text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
            
          

          {/* Cart Button */}
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 sm:gap-3 bg-slate-900 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-emerald-600 transition-all duration-500 shadow-xl group"
          >
            
            <ShoppingBag size={16} />
          </button>
        </div>

        {/* CENTER: Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-10">
          {filteredLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all relative py-2 ${
                pathname === link.path
                  ? 'text-emerald-600'
                  : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              {link.name}

              {pathname === link.path && (
                <motion.div
                  layoutId="navActive"
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-600"
                />
              )}
            </Link>
          ))}
        </div>

        {/* RIGHT: Logo */}
        <Link
          to="/"
          className="flex items-center shrink-0 order-2 lg:order-none group ml-2 sm:ml-4"
        >
          <img
            src={LogoPng}
            alt="Tradify"
            className="h-8 sm:h-10 md:h-12 w-auto object-contain transform group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden ml-2 sm:ml-4 p-2 text-slate-950 order-3"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="lg:hidden fixed top-0 right-0 w-[85%] sm:w-[75%] h-full bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.05)] z-[120] p-6 sm:p-10 flex flex-col"
          >
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="self-end mb-8 p-2 bg-slate-50 rounded-xl"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col gap-6 sm:gap-8">
              {filteredLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base sm:text-lg font-black uppercase tracking-widest text-slate-900 border-b border-slate-50 pb-3"
                >
                  {link.name}
                </Link>
              ))}

              {user?.role === 'vendor' && (
                <Link
                  to="/dashboard-vendor"
                  className="text-emerald-600 font-black uppercase tracking-widest border-b border-slate-50 pb-3"
                >
                  Vendor Station
                </Link>
              )}
            </div>

            {user && (
              <button
                onClick={handleLogout}
                className="mt-auto flex items-center gap-4 text-red-500 font-black text-xs uppercase tracking-[0.2em]"
              >
                <LogOut size={18} /> Sign Out
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;