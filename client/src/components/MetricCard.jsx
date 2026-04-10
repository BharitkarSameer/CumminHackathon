import React from 'react';
import { ArrowUpRight, ArrowDownRight, Package, TrendingUp, AlertCircle, AlertTriangle } from 'lucide-react';

export default function MetricCard({ label, value, subtitle, trend, isRisk, isWarning }) {
  const isDown = trend.includes('-');
  
  // High-end SaaS alert colors
  const valueColor = isRisk ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-zinc-900';
  const trendColor = isRisk ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-emerald-600';
  const trendBg = isRisk ? 'bg-red-50 border border-red-100' : isWarning ? 'bg-amber-50 border border-amber-100' : 'bg-emerald-50 border border-emerald-100';

  return (
    <div className="bg-white border border-zinc-200/80 p-6 md:p-8 rounded-[1.25rem] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col justify-between h-[160px] md:h-[180px] group">
       <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-zinc-500 uppercase tracking-widest">{label}</span>
       </div>

       <div className="flex flex-col mt-auto">
          <div className="flex items-center gap-3">
             <span className={`text-[46px] md:text-[52px] font-medium tracking-tighter leading-none ${valueColor}`}>{value}</span>
             <span className={`flex items-center gap-0.5 text-[11px] font-bold uppercase tracking-wide ${trendColor} ${trendBg} px-2.5 py-1 rounded-lg`}>
                {isDown ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                {trend.replace('+', '').replace('-', '')}
             </span>
          </div>
          {subtitle && (
            <span className="text-[13px] font-medium text-zinc-400 mt-3 block">{subtitle}</span>
          )}
       </div>
    </div>
  );
}
