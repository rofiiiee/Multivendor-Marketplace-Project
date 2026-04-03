import React from "react";

const StatCard = ({ title, value, icon: Icon, colorClass, isCurrency = false }) => {
  // دالة لتنسيق الأرقام بشكل احترافي
  const formatValue = (val) => {
    const numericValue = typeof val === 'number' ? val : 0;
    
    if (isCurrency) {
      return (
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] md:text-sm font-black text-slate-300 uppercase tracking-tighter">EGP</span>
          <span className="tabular-nums tracking-tighter">{numericValue.toLocaleString()}</span>
        </div>
      );
    }
    return <span className="tabular-nums tracking-tighter">{numericValue.toLocaleString()}</span>;
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
      
      {/* Background Decor - لمسة Luxury خفيفة */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.03] transition-transform duration-700 group-hover:scale-150 ${colorClass.split(' ')[0]}`}></div>

      <div className="flex flex-col items-start relative z-10">
        {/* Icon Container - خليته أصغر شوية في الموبايل */}
        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-[1.2rem] md:rounded-[1.5rem] flex items-center justify-center mb-6 md:mb-8 transition-all duration-500 group-hover:rotate-[10deg] shadow-sm ${colorClass}`}>
          <Icon size={window.innerWidth < 768 ? 20 : 28} className="drop-shadow-sm" />
        </div>

        {/* Label */}
        <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-1 md:mb-2">
          {title}
        </p>

        {/* Value */}
        <div className="text-3xl md:text-4xl font-black text-slate-900 leading-none">
          {formatValue(value)}
        </div>
      </div>
    </div>
  );
};

export default StatCard;