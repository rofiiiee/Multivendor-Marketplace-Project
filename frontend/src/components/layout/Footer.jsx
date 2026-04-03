import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

// Import  PNG logo
import LogoPng from '../../assets/tradify-logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800/50">
      <div className="container mx-auto px-6 max-w-[1200px]">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-12">
          
          {/* 1. Brand Identity */}
          <div className="space-y-5">
            <Link to="/" className="inline-block">
              <img 
                src={LogoPng} 
                alt="Tradify Market" 
                className="h-12 w-auto object-contain brightness-110" 
              />
            </Link>
            <p className="text-[13px] leading-relaxed text-slate-400/80 max-w-xs">
              Premium Egyptian products from the heart of Aswan. 
              Authentic quality, global standards, delivered to you.
            </p>
          </div>

          {/* 2. Simple Navigation */}
          <div className="flex flex-col gap-5">
            <h4 className="text-white font-bold text-[11px] uppercase tracking-[0.2em]">Navigation</h4>
            <div className="flex flex-col gap-3 text-[13px]">
              {['Home', 'Products', 'Categories', 'Our Story'].map((link) => (
                <Link 
                  key={link} 
                  to={`/${link.toLowerCase().replace(' ', '-')}`}
                  className="hover:text-[#27A376] transition-colors w-fit"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* 3. Direct Contact */}
          <div className="flex flex-col gap-5">
            <h4 className="text-white font-bold text-[11px] uppercase tracking-[0.2em]">Contact Us</h4>
            <div className="space-y-4 text-[13px]">
              <div className="flex items-center gap-3 group cursor-pointer">
                <Mail size={16} className="text-[#27A376]" />
                <span className="group-hover:text-white transition-colors">hello@tradify-aswan.com</span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <Phone size={16} className="text-[#27A376]" />
                <span dir="ltr" className="group-hover:text-white transition-colors">+20 123 456 7890</span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <MapPin size={16} className="text-[#27A376]" />
                <span className="group-hover:text-white transition-colors">Aswan, Egypt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
          <p>© {currentYear} Tradify Market. Proudly Egyptian.</p>
          <div className="flex gap-8">
            <button className="hover:text-white transition-colors">Privacy</button>
            <button className="hover:text-white transition-colors">Terms</button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;