import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { ChevronDown, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { SKU_LIST } from '../utils/skus';
import { useFetch } from '../hooks/useFetch';

Chart.register(...registerables);

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function ConfBadge({ conf }) {
  if (conf === 'High') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 text-[11px] font-bold tracking-wide uppercase">
        <CheckCircle2 className="w-3 h-3" /> High
      </span>
    );
  }
  if (conf === 'Low') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-100 text-red-700 text-[11px] font-bold tracking-wide uppercase">
        <AlertCircle className="w-3 h-3" /> Low
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[11px] font-bold tracking-wide uppercase">
      <TrendingUp className="w-3 h-3" /> Med
    </span>
  );
}

export default function ForecastTab() {
  const [skuIdx, setSkuIdx] = useState(0);
  const [histDays, setHistDays] = useState(30);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const { data, loading } = useFetch(`/api/forecast?sku=${skuIdx}&days=${histDays}`);

  useEffect(() => {
    if (!data || !chartRef.current) return;

    const { historical, forecast, sku } = data;
    const histLabels = historical.map(h => h.date.slice(5));
    const fcLabels   = forecast.map(f => f.date.slice(5));
    const allLabels  = [...histLabels, ...fcLabels];

    const histData = [...historical.map(h => h.units_sold), ...Array(7).fill(null)];
    const fcData   = [...Array(historical.length).fill(null), ...forecast.map(f => f.forecast)];
    const fcHi     = [...Array(historical.length).fill(null), ...forecast.map(f => f.high)];
    const fcLo     = [...Array(historical.length).fill(null), ...forecast.map(f => f.low)];

    if (chartInstance.current) chartInstance.current.destroy();
    chartInstance.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: allLabels,
        datasets: [
          {
            label: 'Conf high', data: fcHi,
            borderColor: 'transparent', backgroundColor: 'rgba(71, 85, 105, 0.04)',
            fill: '+1', pointRadius: 0, tension: 0.5,
          },
          {
            label: 'Conf low', data: fcLo,
            borderColor: 'transparent', backgroundColor: 'rgba(71, 85, 105, 0.04)',
            fill: false, pointRadius: 0, tension: 0.5,
          },
          {
            label: 'Historical', data: histData,
            borderColor: '#94a3b8', backgroundColor: 'transparent',
            borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#94a3b8', tension: 0.5,
            pointHoverRadius: 5, pointHoverBackgroundColor: '#94a3b8'
          },
          {
            label: 'Forecast', data: fcData,
            borderColor: '#334155', backgroundColor: 'transparent',
            borderWidth: 2, borderDash: [0, 0], // The reference has a solid thin line
            pointRadius: 3, pointBackgroundColor: '#334155', pointHoverRadius: 5, pointHoverBackgroundColor: '#334155', tension: 0.5,
          },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { 
           legend: { display: false },
           tooltip: {
             backgroundColor: 'rgba(24, 24, 27, 0.9)',
             titleFont: { size: 13, family: 'sans-serif' },
             bodyFont: { size: 12, family: 'sans-serif' },
             padding: 12, cornerRadius: 8,
             displayColors: true,
           }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { maxTicksLimit: 8, font: { size: 11, family: 'sans-serif' }, color: '#a1a1aa' },
          },
          y: {
            border: { display: false },
            grid: { color: 'rgba(0,0,0,0.03)' },
            ticks: { font: { size: 11, family: 'sans-serif' }, color: '#a1a1aa', padding: 10 },
          },
        },
      },
    });
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [data]);

  const forecast = data?.forecast || [];
  const summary  = data?.summary  || {};

  return (
    <div className="flex flex-col gap-6">
      
      {/* CHART SECTION */}
      <div className="bg-white border border-zinc-200/80 rounded-[1.5rem] p-6 md:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.02)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-[17px] font-semibold tracking-tight text-zinc-900">Next 7 days forecast</h2>
            <div className="relative">
               <select 
                 className="appearance-none bg-zinc-50 border border-zinc-200 text-zinc-700 text-[13px] font-medium py-1.5 pl-3 pr-8 rounded-lg outline-none cursor-pointer hover:bg-zinc-100 transition-colors"
                 value={histDays} onChange={e => setHistDays(Number(e.target.value))}
               >
                 <option value={30}>30d history</option>
                 <option value={60}>60d history</option>
                 <option value={90}>90d history</option>
               </select>
               <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          
          <div className="relative w-full lg:w-64">
             <select 
               className="w-full appearance-none bg-zinc-900 text-white border border-zinc-800 text-[13px] font-medium py-2.5 pl-4 pr-10 rounded-xl outline-none cursor-pointer shadow-lg hover:bg-black transition-colors"
               value={skuIdx} onChange={e => setSkuIdx(Number(e.target.value))}
             >
               {SKU_LIST.map(sku => (
                 <option key={sku.index} value={sku.index}>{sku.name}</option>
               ))}
             </select>
             <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {loading && <div className="h-[280px] w-full flex items-center justify-center text-[13px] text-zinc-400 font-medium tracking-wide">Synthesizing network telemetry...</div>}

        {!loading && (
          <div className="animate-in fade-in duration-500">
            <div className="flex gap-6 flex-wrap text-[11px] font-bold tracking-widest uppercase text-zinc-500 mb-6">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#94a3b8]" /> Historical</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#334155]" /> Forecast</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#e2e8f0]" /> Confidence band</span>
            </div>
            
            <div className="relative w-full h-[280px]">
              <canvas ref={chartRef} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-zinc-100">
              <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-5 hover:bg-zinc-100/80 transition-colors">
                <div className="text-[11px] font-bold tracking-widest uppercase text-zinc-400 mb-2">7-Day Projection</div>
                <div className="text-2xl font-medium tracking-tight text-zinc-900">{summary.forecast7dTotal} <span className="text-[13px] text-zinc-400 font-normal ml-1">units</span></div>
              </div>
              <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-5 hover:bg-zinc-100/80 transition-colors">
                <div className="text-[11px] font-bold tracking-widest uppercase text-zinc-400 mb-2">Stock On Hand</div>
                <div className="text-2xl font-medium tracking-tight text-zinc-900">{summary.stockOnHand?.toLocaleString()} <span className="text-[13px] text-zinc-400 font-normal ml-1">units</span></div>
              </div>
              <div className={`rounded-2xl p-5 border transition-colors ${
                 summary.stockoutRisk === 'critical' ? 'bg-red-50/50 border-red-100' : 
                 summary.stockoutRisk === 'warning' ? 'bg-amber-50/50 border-amber-100' : 'bg-green-50/50 border-green-100'
              }`}>
                <div className="text-[11px] font-bold tracking-widest uppercase text-zinc-400 mb-2">Days of Cover</div>
                <div className={`text-2xl font-medium tracking-tight ${
                   summary.stockoutRisk === 'critical' ? 'text-red-600' : 
                   summary.stockoutRisk === 'warning' ? 'text-amber-600' : 'text-green-600'
                }`}>{summary.stockCoverDays} <span className="text-[13px] opacity-60 font-normal ml-1">days remaining</span></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TABLE SECTION */}
      {!loading && forecast.length > 0 && (
        <div className="bg-white border border-zinc-200/80 rounded-[1.5rem] pt-6 pb-2 px-6 md:px-8 shadow-[0_2px_12px_rgb(0,0,0,0.02)] animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-[17px] font-semibold tracking-tight text-zinc-900 mb-6">Daily Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px] text-zinc-600 min-w-[600px]">
              <thead>
                <tr>
                  {['Date','Day','Forecast Volume','Lower Bound','Upper Bound','AI Confidence'].map((h, i) => (
                    <th key={h} className={`pb-4 font-semibold text-zinc-400 tracking-wide border-b border-zinc-100 ${i === 0 ? 'text-left' : 'text-left pl-4'}`}>
                       {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {forecast.map((f, i) => {
                  const dow = DAYS[new Date(f.date).getDay()];
                  const baseVal = data?.sku?.base || 20;
                  const conf = f.forecast > baseVal * 1.1 ? 'High' : f.forecast < baseVal * 0.9 ? 'Low' : 'Med';
                  
                  return (
                    <tr key={i} className="group hover:bg-zinc-50/50 transition-colors">
                      <td className="py-4 border-b border-zinc-50 group-last:border-0 text-zinc-900 font-medium">
                         {f.date.slice(5).replace('-', ' / ')}
                      </td>
                      <td className="py-4 pl-4 border-b border-zinc-50 group-last:border-0 text-zinc-500">
                         {dow}
                      </td>
                      <td className="py-4 pl-4 border-b border-zinc-50 group-last:border-0">
                         <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold">{f.forecast}</span>
                      </td>
                      <td className="py-4 pl-4 border-b border-zinc-50 group-last:border-0 text-zinc-400 font-medium">
                         {f.low}
                      </td>
                      <td className="py-4 pl-4 border-b border-zinc-50 group-last:border-0 text-zinc-400 font-medium">
                         {f.high}
                      </td>
                      <td className="py-4 pl-4 border-b border-zinc-50 group-last:border-0">
                         <ConfBadge conf={conf} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
