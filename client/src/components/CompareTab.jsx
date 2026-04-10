import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useFetch } from '../hooks/useFetch';

Chart.register(...registerables);

export default function CompareTab() {
  const { data, loading } = useFetch('/api/forecast/all');
  const coverRef   = useRef(null);
  const coverChart = useRef(null);

  useEffect(() => {
    if (!data || !coverRef.current) return;
    const sorted = [...data].sort((a, b) => b.forecast7dTotal - a.forecast7dTotal);
    const h = Math.max(380, sorted.length * 45 + 60);
    coverRef.current.parentElement.style.height = h + 'px';

    if (coverChart.current) coverChart.current.destroy();
    coverChart.current = new Chart(coverRef.current, {
      type: 'bar',
      data: {
        labels: sorted.map(s => s.name.split(' ').slice(0,2).join(' ')),
        datasets: [
          { label: 'Stock cover (days)', data: sorted.map(s => s.stockCoverDays), backgroundColor: '#4285f4', borderRadius: 6, barPercentage: 0.7 },
          { label: 'Lead time (days)',   data: sorted.map(s => s.leadTimeDays),   backgroundColor: '#e4e4e7', borderRadius: 6, barPercentage: 0.7, hoverBackgroundColor: '#d4d4d8' },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        plugins: { 
          legend: { display: false },
          tooltip: {
             backgroundColor: 'rgba(24, 24, 27, 0.9)',
             padding: 12, cornerRadius: 8,
          }
        },
        scales: {
          x: { grid: { color:'rgba(0,0,0,0.03)' }, ticks: { font:{size:11, family: 'sans-serif'}, color:'#a1a1aa', padding:8 }, border: { display: false } },
          y: { grid: { display:false }, ticks: { font:{size:12, family: 'sans-serif', weight: '500'}, color:'#52525b' }, border: { display: false } },
        },
      },
    });
    return () => { if (coverChart.current) coverChart.current.destroy(); };
  }, [data]);

  if (loading) return <div className="h-[200px] flex items-center justify-center text-[13px] text-zinc-400 font-medium tracking-wide">Computing matrices...</div>;
  if (!data)   return null;

  const sorted = [...data].sort((a, b) => b.forecast7dTotal - a.forecast7dTotal);
  const maxFc  = sorted[0]?.forecast7dTotal || 1;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="bg-white border border-zinc-200/80 rounded-[1.5rem] p-6 lg:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.02)]">
        <h2 className="text-[17px] font-semibold tracking-tight text-zinc-900 mb-8">7-Day Global Forecast Rankings</h2>
        <div className="flex flex-col">
          <div className="flex items-center gap-4 pb-3 border-b border-zinc-100 mb-3 px-2">
            <div className="w-[160px] md:w-[200px] text-[11px] font-bold tracking-widest uppercase text-zinc-400 shrink-0">SKU</div>
            <div className="flex-1 text-[11px] font-bold tracking-widest uppercase text-zinc-400">Velocity Pattern</div>
            <div className="w-[80px] text-right text-[11px] font-bold tracking-widest uppercase text-zinc-400 shrink-0">7D Volume</div>
            <div className="w-[70px] text-right text-[11px] font-bold tracking-widest uppercase text-zinc-400 shrink-0">Trend</div>
          </div>
          {sorted.map((sku, i) => {
            const pct = Math.round((sku.forecast7dTotal / maxFc) * 100);
            const trendPct = Math.round((sku.trend - 1) * 100);
            const trendColor = sku.trend >= 1 ? 'text-green-600' : 'text-red-500';
            return (
              <div key={sku.id} className="group flex items-center gap-4 py-3.5 px-2 border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 rounded-xl transition-colors">
                <div className="w-[160px] md:w-[200px] text-[13px] font-semibold tracking-tight text-zinc-800 shrink-0 truncate">
                   {sku.name.split(' ').slice(0,2).join(' ')}
                </div>
                <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width:`${pct}%`, backgroundColor: sku.color }} />
                </div>
                <div className="w-[80px] text-right text-[14px] font-bold text-zinc-600 shrink-0">{sku.forecast7dTotal}</div>
                <div className={`w-[70px] text-right text-[13px] font-bold shrink-0 ${trendColor}`}>
                  {trendPct >= 0 ? '+' : ''}{trendPct}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-[1.5rem] p-6 lg:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.02)]">
        <h2 className="text-[17px] font-semibold tracking-tight text-zinc-900 mb-8">Stock Cover vs Replenishment Lead Time</h2>
        <div className="flex items-center gap-6 mb-8">
          <span className="flex items-center gap-2 text-[12px] font-medium tracking-wide text-zinc-500 uppercase"><div className="w-3 h-3 rounded bg-[#4285f4]"></div> Stock Cover Capacity</span>
          <span className="flex items-center gap-2 text-[12px] font-medium tracking-wide text-zinc-500 uppercase"><div className="w-3 h-3 rounded bg-zinc-300"></div> Supplier Lead Time</span>
        </div>
        <div className="relative w-full overflow-hidden pr-4">
          <canvas ref={coverRef} />
        </div>
      </div>
    </div>
  );
}
