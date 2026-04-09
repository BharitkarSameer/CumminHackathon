import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useFetch } from '../hooks/useFetch';

Chart.register(...registerables);

const s = {
  section:  { background:'#fff', border:'0.5px solid rgba(0,0,0,0.08)', borderRadius:14, padding:'1.25rem', marginBottom:'1rem' },
  title:    { fontSize:14, fontWeight:500, marginBottom:14 },
  row:      { display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'0.5px solid rgba(0,0,0,0.06)' },
  rowName:  { width:160, fontSize:13, flexShrink:0 },
  barWrap:  { flex:1, height:6, background:'#f0efe9', borderRadius:3, overflow:'hidden' },
  bar:      { height:'100%', borderRadius:3 },
  rowVal:   { width:70, textAlign:'right', fontSize:12, color:'#8a8981' },
  rowTrend: { width:52, textAlign:'right', fontSize:12 },
};

export default function CompareTab() {
  const { data, loading } = useFetch('/api/forecast/all');
  const coverRef   = useRef(null);
  const coverChart = useRef(null);

  useEffect(() => {
    if (!data || !coverRef.current) return;
    const sorted = [...data].sort((a, b) => b.forecast7dTotal - a.forecast7dTotal);
    const h = Math.max(320, sorted.length * 38 + 60);
    coverRef.current.parentElement.style.height = h + 'px';

    if (coverChart.current) coverChart.current.destroy();
    coverChart.current = new Chart(coverRef.current, {
      type: 'bar',
      data: {
        labels: sorted.map(s => s.name.split(' ').slice(0,2).join(' ')),
        datasets: [
          { label: 'Stock cover (days)', data: sorted.map(s => s.stockCoverDays), backgroundColor: '#B5D4F4', borderRadius: 3 },
          { label: 'Lead time (days)',   data: sorted.map(s => s.leadTimeDays),   backgroundColor: '#E24B4A', borderRadius: 3 },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { font:{size:11}, color:'#8a8981' }, grid: { color:'rgba(0,0,0,0.04)' } },
          y: { ticks: { font:{size:11}, color:'#8a8981' }, grid: { display:false } },
        },
      },
    });
    return () => { if (coverChart.current) coverChart.current.destroy(); };
  }, [data]);

  if (loading) return <div style={{ color:'#8a8981', fontSize:13, padding:'2rem', textAlign:'center' }}>Loading...</div>;
  if (!data)   return null;

  const sorted = [...data].sort((a, b) => b.forecast7dTotal - a.forecast7dTotal);
  const maxFc  = sorted[0]?.forecast7dTotal || 1;

  return (
    <div>
      <div style={s.section}>
        <div style={s.title}>7-day forecast — all SKUs ranked</div>
        <div>
          <div style={{ ...s.row, borderBottom:'0.5px solid rgba(0,0,0,0.1)', paddingBottom:6, marginBottom:4 }}>
            <div style={{ ...s.rowName, fontSize:11, color:'#8a8981' }}>SKU</div>
            <div style={{ flex:1, fontSize:11, color:'#8a8981' }}>Volume</div>
            <div style={{ ...s.rowVal, fontSize:11, color:'#8a8981' }}>7d units</div>
            <div style={{ ...s.rowTrend, fontSize:11, color:'#8a8981' }}>Trend</div>
          </div>
          {sorted.map((sku, i) => {
            const pct = Math.round((sku.forecast7dTotal / maxFc) * 100);
            const trendPct = Math.round((sku.trend - 1) * 100);
            const trendColor = sku.trend >= 1 ? '#3B6D11' : '#A32D2D';
            return (
              <div key={sku.id} style={{ ...s.row, ...(i === sorted.length - 1 ? { borderBottom:'none' } : {}) }}>
                <div style={s.rowName}>{sku.name.split(' ').slice(0,2).join(' ')}</div>
                <div style={s.barWrap}>
                  <div style={{ ...s.bar, width:`${pct}%`, background: sku.color }} />
                </div>
                <div style={s.rowVal}>{sku.forecast7dTotal}</div>
                <div style={{ ...s.rowTrend, color: trendColor }}>
                  {trendPct >= 0 ? '+' : ''}{trendPct}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={s.section}>
        <div style={s.title}>Stock cover vs lead time (days)</div>
        <div style={{ display:'flex', gap:16, fontSize:12, color:'#8a8981', marginBottom:12 }}>
          <span><span style={{ width:10, height:10, borderRadius:2, display:'inline-block', background:'#B5D4F4', marginRight:4 }}></span>Stock cover</span>
          <span><span style={{ width:10, height:10, borderRadius:2, display:'inline-block', background:'#E24B4A', marginRight:4 }}></span>Lead time</span>
        </div>
        <div style={{ position:'relative', width:'100%', height:320 }}>
          <canvas ref={coverRef} />
        </div>
      </div>
    </div>
  );
}
