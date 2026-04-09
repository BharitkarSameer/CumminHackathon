import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useFetch } from '../hooks/useFetch';

Chart.register(...registerables);

const s = {
  section: { background:'#fff', border:'0.5px solid rgba(0,0,0,0.08)', borderRadius:14, padding:'1.25rem', marginBottom:'1rem' },
  header:  { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 },
  title:   { fontSize:14, fontWeight:500 },
  legend:  { display:'flex', gap:14, flexWrap:'wrap', fontSize:12, color:'#8a8981', marginBottom:12 },
  dot:     { width:10, height:10, borderRadius:2, display:'inline-block', marginRight:4 },
  grid2:   { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' },
};

function LineChart({ canvasRef, height = 280 }) {
  return (
    <div style={{ position:'relative', width:'100%', height }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default function HistoryTab() {
  const { data: allSkus, loading: loadingSkus } = useFetch('/api/history?days=90');
  const { data: monthly, loading: loadingMonthly } = useFetch('/api/history/monthly');
  const { data: channels } = useFetch('/api/history/channels');

  const multiRef   = useRef(null);
  const monthRef   = useRef(null);
  const channelRef = useRef(null);
  const multiChart   = useRef(null);
  const monthChart   = useRef(null);
  const channelChart = useRef(null);

  // Multi-SKU line chart (top 5)
  useEffect(() => {
    if (!allSkus || !multiRef.current) return;
    const top5 = allSkus.slice(0, 5);
    const labels = top5[0].data.map((_, i) => i % 15 === 0 ? top5[0].data[i]?.date?.slice(5) || '' : '');
    if (multiChart.current) multiChart.current.destroy();
    multiChart.current = new Chart(multiRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: top5.map(sku => ({
          label: sku.name.split(' ')[0],
          data: sku.data.map(d => d.units_sold),
          borderColor: sku.color,
          backgroundColor: 'transparent',
          borderWidth: 1.5, pointRadius: 0, tension: 0.4,
        })),
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { font:{size:11}, color:'#8a8981' }, grid: { color:'rgba(0,0,0,0.04)' } },
          y: { ticks: { font:{size:11}, color:'#8a8981' }, grid: { color:'rgba(0,0,0,0.04)' } },
        },
      },
    });
    return () => { if (multiChart.current) multiChart.current.destroy(); };
  }, [allSkus]);

  // Monthly bar
  useEffect(() => {
    if (!monthly || !monthRef.current) return;
    if (monthChart.current) monthChart.current.destroy();
    monthChart.current = new Chart(monthRef.current, {
      type: 'bar',
      data: {
        labels: monthly.map(m => m.label),
        datasets: [{
          label: 'Units sold',
          data: monthly.map(m => m.units),
          backgroundColor: '#378ADD',
          borderRadius: 4,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { font:{size:11}, color:'#8a8981' }, grid: { display:false } },
          y: { ticks: { font:{size:11}, color:'#8a8981' }, grid: { color:'rgba(0,0,0,0.04)' } },
        },
      },
    });
    return () => { if (monthChart.current) monthChart.current.destroy(); };
  }, [monthly]);

  // Channel donut
  useEffect(() => {
    if (!channels || !channelRef.current) return;
    if (channelChart.current) channelChart.current.destroy();
    channelChart.current = new Chart(channelRef.current, {
      type: 'doughnut',
      data: {
        labels: channels.map(c => c.channel),
        datasets: [{
          data: channels.map(c => c.units),
          backgroundColor: channels.map(c => c.color),
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        cutout: '65%',
        plugins: { legend: { display: false } },
      },
    });
    return () => { if (channelChart.current) channelChart.current.destroy(); };
  }, [channels]);

  const top5 = allSkus ? allSkus.slice(0, 5) : [];

  return (
    <div>
      <div style={s.section}>
        <div style={s.header}><span style={s.title}>Historical sales — last 90 days (top 5 SKUs)</span></div>
        {!loadingSkus && (
          <div style={s.legend}>
            {top5.map(sku => (
              <span key={sku.id}>
                <span style={{ ...s.dot, background: sku.color }}></span>
                {sku.name.split(' ').slice(0,2).join(' ')}
              </span>
            ))}
          </div>
        )}
        {loadingSkus
          ? <div style={{ color:'#8a8981', fontSize:13, padding:'2rem 0', textAlign:'center' }}>Loading...</div>
          : <LineChart canvasRef={multiRef} height={280} />
        }
      </div>

      <div style={s.grid2}>
        <div style={s.section}>
          <div style={s.header}><span style={s.title}>Monthly units sold</span></div>
          {loadingMonthly
            ? <div style={{ color:'#8a8981', fontSize:13, padding:'1rem 0', textAlign:'center' }}>Loading...</div>
            : <div style={{ position:'relative', width:'100%', height:200 }}><canvas ref={monthRef} /></div>
          }
        </div>

        <div style={s.section}>
          <div style={s.header}><span style={s.title}>Sales by channel</span></div>
          <div style={{ position:'relative', width:'100%', height:160 }}><canvas ref={channelRef} /></div>
          {channels && (
            <div style={{ ...s.legend, marginTop:12, marginBottom:0 }}>
              {channels.map(c => (
                <span key={c.channel}>
                  <span style={{ ...s.dot, background: c.color }}></span>
                  {c.channel} {c.units}%
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
