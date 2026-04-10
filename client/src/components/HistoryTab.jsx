import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Chart, registerables } from 'chart.js';
import { useFetch } from '../hooks/useFetch';

Chart.register(...registerables);

const DAY_OPTIONS = [30, 60, 90];

export default function HistoryTab() {
  const [days, setDays] = useState(90);
  const [hoveredSku, setHoveredSku] = useState(null); // null = all visible

  const { data: allSkus, loading: loadingSkus } = useFetch(`/api/history?days=${days}`);
  const { data: monthly, loading: loadingMonthly } = useFetch('/api/history/monthly');
  const { data: channels, loading: loadingChannels } = useFetch('/api/history/channels');

  const multiRef     = useRef(null);
  const monthRef     = useRef(null);
  const channelRef   = useRef(null);
  const multiChart   = useRef(null);
  const monthChart   = useRef(null);
  const channelChart = useRef(null);

  // ─── Multi-SKU line chart (all SKUs) ───────────────────────────────────────
  useEffect(() => {
    if (!allSkus || !multiRef.current) return;

    const labels = allSkus[0].data.map((d, i) =>
      i % Math.ceil(allSkus[0].data.length / 6) === 0 ? (d?.date?.slice(5) || '') : ''
    );

    if (multiChart.current) multiChart.current.destroy();
    multiChart.current = new Chart(multiRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: allSkus.map(sku => ({
          label: sku.name.split(' ').slice(0, 2).join(' '),
          data: sku.data.map(d => d.units_sold),
          borderColor: sku.color,
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.5,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: sku.color,
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(17, 17, 17, 0.92)',
            titleFont: { size: 12, family: 'sans-serif', weight: '600' },
            bodyFont:  { size: 11, family: 'sans-serif' },
            padding: 12,
            cornerRadius: 10,
            boxPadding: 4,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { font: { size: 11, family: 'sans-serif' }, color: '#a1a1aa' },
          },
          y: {
            border: { display: false },
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: { font: { size: 11, family: 'sans-serif' }, color: '#a1a1aa', padding: 8 },
          },
        },
      },
    });
    return () => { if (multiChart.current) multiChart.current.destroy(); };
  }, [allSkus]);

  // ─── Apply hover dimming whenever hoveredSku changes ───────────────────────
  useEffect(() => {
    if (!multiChart.current || !allSkus) return;
    multiChart.current.data.datasets.forEach((ds, idx) => {
      if (hoveredSku === null) {
        ds.borderWidth = 2;
        ds.borderColor = allSkus[idx].color;
      } else if (allSkus[idx].name.split(' ').slice(0, 2).join(' ') === hoveredSku) {
        ds.borderWidth = 3.5;
        ds.borderColor = allSkus[idx].color;
      } else {
        ds.borderWidth = 1;
        ds.borderColor = allSkus[idx].color + '30'; // dim: add alpha
      }
    });
    multiChart.current.update('none');
  }, [hoveredSku, allSkus]);

  // ─── Monthly bar ────────────────────────────────────────────────────────────
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
          backgroundColor: '#4285f4',
          borderRadius: 6,
          hoverBackgroundColor: '#1a73e8',
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: 'rgba(17,17,17,0.92)', padding: 12, cornerRadius: 10 },
        },
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 11, family: 'sans-serif' }, color: '#a1a1aa' } },
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false }, ticks: { font: { size: 11, family: 'sans-serif' }, color: '#a1a1aa', padding: 8 } },
        },
      },
    });
    return () => { if (monthChart.current) monthChart.current.destroy(); };
  }, [monthly]);

  // ─── Channel donut ──────────────────────────────────────────────────────────
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
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(17,17,17,0.92)', padding: 12, cornerRadius: 10,
            callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw}%` },
          },
        },
      },
    });
    return () => { if (channelChart.current) channelChart.current.destroy(); };
  }, [channels]);

  return (
    <div className="flex flex-col gap-6">
      {/* ── Historical Velocity Card ──────────────────────────────────────── */}
      <div className="bg-white border border-zinc-200/80 rounded-[1.5rem] p-6 md:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.02)]">
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-[17px] font-semibold tracking-tight text-zinc-900">
            Historical velocity —{' '}
            <span className="text-zinc-400 font-medium">Last {days} days</span>
          </h2>

          {/* Day selector */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-full">
            {DAY_OPTIONS.map(d => (
              <button
                key={d}
                onClick={() => setDays(d)}
                style={{
                  padding: '4px 16px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: days === d ? '#18181b' : 'transparent',
                  color: days === d ? '#fff' : '#71717a',
                }}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {/* Legend — all SKUs, hover to highlight */}
        {!loadingSkus && allSkus && (
          <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5">
            {allSkus.map(sku => {
              const label = sku.name.split(' ').slice(0, 2).join(' ');
              const isHovered = hoveredSku === label;
              const isDimmed  = hoveredSku !== null && !isHovered;
              return (
                <button
                  key={sku.id}
                  onMouseEnter={() => setHoveredSku(label)}
                  onMouseLeave={() => setHoveredSku(null)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '12px', fontWeight: isHovered ? '700' : '500',
                    color: isDimmed ? '#d4d4d8' : '#52525b',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    backgroundColor: isDimmed ? '#d4d4d8' : sku.color,
                    transition: 'background-color 0.15s',
                    flexShrink: 0,
                  }} />
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Chart */}
        {loadingSkus
          ? <div className="h-[300px] flex items-center justify-center text-[13px] text-zinc-400 font-medium tracking-wide">Loading historical data...</div>
          : (
            <div
              className="relative w-full h-[300px]"
              onMouseLeave={() => setHoveredSku(null)}
            >
              <canvas ref={multiRef} />
            </div>
          )
        }
      </div>

      {/* ── Bottom row: Monthly + Channel ────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-zinc-200/80 rounded-[1.5rem] p-6 lg:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.02)]">
          <h2 className="text-[17px] font-semibold tracking-tight text-zinc-900 mb-8">Monthly aggregates</h2>
          {loadingMonthly
            ? <div className="h-[200px] flex items-center justify-center text-[13px] text-zinc-400 font-medium">Aggregating...</div>
            : <div className="relative w-full h-[200px]"><canvas ref={monthRef} /></div>
          }
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-[1.5rem] p-6 lg:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.02)]">
          <h2 className="text-[17px] font-semibold tracking-tight text-zinc-900 mb-8">Volume by Channel</h2>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative w-[160px] h-[160px] flex-shrink-0">
              {loadingChannels
                ? <div className="absolute inset-0 flex items-center justify-center text-[12px] text-zinc-400">Loading...</div>
                : <canvas ref={channelRef} />
              }
            </div>
            {channels && (
              <div className="flex flex-col gap-3">
                {channels.map(c => (
                  <span key={c.channel} className="flex items-center gap-3">
                    <div style={{ backgroundColor: c.color }} className="w-3 h-3 rounded-full flex-shrink-0" />
                    <span className="text-[14px] text-zinc-600 font-medium w-20">{c.channel}</span>
                    <span className="text-[14px] text-zinc-900 font-bold">{c.units}%</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
