import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { SKU_LIST } from '../utils/skus';
import { useFetch } from '../hooks/useFetch';

Chart.register(...registerables);

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const s = {
  header: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 },
  sectionTitle: { fontSize:14, fontWeight:500 },
  select: {
    fontSize:13, padding:'5px 12px', borderRadius:8,
    border:'0.5px solid rgba(0,0,0,0.18)', background:'#f0efe9',
    color:'#1a1a18', cursor:'pointer', outline:'none',
  },
  section: {
    background:'#fff', border:'0.5px solid rgba(0,0,0,0.08)',
    borderRadius:14, padding:'1.25rem', marginBottom:'1rem',
  },
  legend: { display:'flex', gap:16, flexWrap:'wrap', fontSize:12, color:'#8a8981', marginBottom:12 },
  dot: { width:10, height:10, borderRadius:2, display:'inline-block', marginRight:4 },
  table: { width:'100%', borderCollapse:'collapse', fontSize:13 },
  th: { textAlign:'left', padding:'8px 12px', color:'#8a8981', fontWeight:400, fontSize:12, borderBottom:'0.5px solid rgba(0,0,0,0.08)' },
  td: { padding:'9px 12px', borderBottom:'0.5px solid rgba(0,0,0,0.06)' },
};

function confStyle(conf) {
  if (conf === 'High') return { color:'#3B6D11', fontWeight:500 };
  if (conf === 'Low')  return { color:'#A32D2D', fontWeight:500 };
  return { color:'#854F0B', fontWeight:500 };
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
            borderColor: 'transparent', backgroundColor: 'rgba(99,153,34,0.10)',
            fill: '+1', pointRadius: 0, tension: 0.4,
          },
          {
            label: 'Conf low', data: fcLo,
            borderColor: 'transparent', backgroundColor: 'rgba(99,153,34,0.10)',
            fill: false, pointRadius: 0, tension: 0.4,
          },
          {
            label: 'Historical', data: histData,
            borderColor: '#378ADD', backgroundColor: 'transparent',
            borderWidth: 1.5, pointRadius: 0, tension: 0.4,
          },
          {
            label: 'Forecast', data: fcData,
            borderColor: '#639922', backgroundColor: 'transparent',
            borderWidth: 2, borderDash: [5, 3],
            pointRadius: 3, pointBackgroundColor: '#639922', tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            ticks: { maxTicksLimit: 10, font: { size: 11 }, color: '#8a8981' },
            grid: { color: 'rgba(0,0,0,0.04)' },
          },
          y: {
            ticks: { font: { size: 11 }, color: '#8a8981' },
            grid: { color: 'rgba(0,0,0,0.04)' },
          },
        },
      },
    });
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [data]);

  const forecast = data?.forecast || [];
  const summary  = data?.summary  || {};

  return (
    <div>
      <div style={s.section}>
        <div style={s.header}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <span style={s.sectionTitle}>Next 7 days forecast</span>
            <select style={s.select} value={histDays} onChange={e => setHistDays(Number(e.target.value))}>
              <option value={30}>30d history</option>
              <option value={60}>60d history</option>
              <option value={90}>90d history</option>
            </select>
          </div>
          <select style={s.select} value={skuIdx} onChange={e => setSkuIdx(Number(e.target.value))}>
            {SKU_LIST.map(sku => (
              <option key={sku.index} value={sku.index}>{sku.name}</option>
            ))}
          </select>
        </div>

        {loading && <div style={{ color:'#8a8981', fontSize:13, padding:'2rem 0', textAlign:'center' }}>Loading...</div>}

        {!loading && (
          <>
            <div style={s.legend}>
              <span><span style={{ ...s.dot, background:'#378ADD' }}></span>Historical</span>
              <span><span style={{ ...s.dot, background:'#639922' }}></span>Forecast</span>
              <span><span style={{ ...s.dot, background:'rgba(99,153,34,0.25)', border:'0.5px solid #639922' }}></span>Confidence band</span>
            </div>
            <div style={{ position:'relative', width:'100%', height:260 }}>
              <canvas ref={chartRef} />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginTop:16 }}>
              <div style={{ background:'#f0efe9', borderRadius:8, padding:'10px 14px' }}>
                <div style={{ fontSize:11, color:'#8a8981' }}>7-day total forecast</div>
                <div style={{ fontSize:20, fontWeight:500, marginTop:2 }}>{summary.forecast7dTotal} units</div>
              </div>
              <div style={{ background:'#f0efe9', borderRadius:8, padding:'10px 14px' }}>
                <div style={{ fontSize:11, color:'#8a8981' }}>Stock on hand</div>
                <div style={{ fontSize:20, fontWeight:500, marginTop:2 }}>{summary.stockOnHand?.toLocaleString()}</div>
              </div>
              <div style={{ background: summary.stockoutRisk === 'critical' ? '#fcebeb' : summary.stockoutRisk === 'warning' ? '#faeeda' : '#eaf3de', borderRadius:8, padding:'10px 14px' }}>
                <div style={{ fontSize:11, color:'#8a8981' }}>Stock cover</div>
                <div style={{ fontSize:20, fontWeight:500, marginTop:2,
                  color: summary.stockoutRisk === 'critical' ? '#A32D2D' : summary.stockoutRisk === 'warning' ? '#854F0B' : '#3B6D11'
                }}>{summary.stockCoverDays}d</div>
              </div>
            </div>
          </>
        )}
      </div>

      {!loading && forecast.length > 0 && (
        <div style={s.section}>
          <div style={s.header}><span style={s.sectionTitle}>Daily breakdown</span></div>
          <table style={s.table}>
            <thead>
              <tr>
                {['Date','Day','Forecast','Low','High','Confidence'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {forecast.map((f, i) => {
                const dow = DAYS[new Date(f.date).getDay()];
                const baseVal = data?.sku?.base || 20;
                const conf = f.forecast > baseVal * 1.1 ? 'High' : f.forecast < baseVal * 0.9 ? 'Low' : 'Med';
                return (
                  <tr key={i}>
                    <td style={s.td}>{f.date.slice(5)}</td>
                    <td style={s.td}>{dow}</td>
                    <td style={{ ...s.td, fontWeight:500 }}>{f.forecast}</td>
                    <td style={{ ...s.td, color:'#8a8981' }}>{f.low}</td>
                    <td style={{ ...s.td, color:'#8a8981' }}>{f.high}</td>
                    <td style={{ ...s.td, ...confStyle(conf) }}>{conf}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
