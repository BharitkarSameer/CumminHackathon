import React, { useState } from 'react';
import MetricCard from '../components/MetricCard';
import ForecastTab from '../components/ForecastTab';
import HistoryTab from '../components/HistoryTab';
import AlertsTab from '../components/AlertsTab';
import CompareTab from '../components/CompareTab';
import { useFetch } from '../hooks/useFetch';

const TABS = ['7-Day Forecast', 'Historical Trend', 'Alerts', 'SKU Comparison'];

const s = {
  page: { maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 3rem' },
  topbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1.25rem 0 1.5rem',
  },
  logo: { fontSize: 18, fontWeight: 500, letterSpacing: '-0.3px', color: '#1a1a18' },
  logoSub: { fontSize: 12, color: '#8a8981', marginLeft: 8 },
  liveBadge: {
    fontSize: 11, padding: '3px 10px', borderRadius: 20,
    background: '#eaf3de', color: '#3B6D11', marginLeft: 10,
  },
  dateLabel: { fontSize: 13, color: '#8a8981' },
  metrics: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 10, marginBottom: '1.25rem' },
  tabBar: {
    display: 'flex', gap: 2, marginBottom: '1.25rem',
    borderBottom: '0.5px solid rgba(0,0,0,0.08)',
  },
  tab: {
    fontSize: 13, padding: '8px 16px', cursor: 'pointer',
    border: 'none', background: 'none', color: '#8a8981',
    borderBottom: '2px solid transparent', marginBottom: -1,
    transition: 'color 0.15s',
    fontFamily: "'DM Sans', sans-serif",
  },
  tabActive: {
    color: '#1a1a18', fontWeight: 500,
    borderBottom: '2px solid #1a1a18',
  },
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const { data: alerts } = useFetch('/api/alerts');

  const stockoutCount = alerts?.stockout?.length || 0;
  const overstockCount = alerts?.overstock?.length || 0;

  return (
    <div style={s.page}>
      <div style={s.topbar}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={s.logo}>DemandIQ</span>
          <span style={s.logoSub}>Retail Forecast</span>
          <span style={s.liveBadge}>Live</span>
        </div>
        <span style={s.dateLabel}>Apr 9, 2026</span>
      </div>

      <div style={s.metrics}>
        <MetricCard label="Total SKUs tracked"  value="10"           sub="across 4 stores & 4 channels" />
        <MetricCard label="Forecast horizon"    value="7 days"       sub="next week demand" />
        <MetricCard
          label="Stockout risk"
          value={`${stockoutCount} SKU${stockoutCount !== 1 ? 's' : ''}`}
          sub="need reorder now"
          valueColor={stockoutCount > 0 ? '#A32D2D' : '#3B6D11'}
        />
        <MetricCard
          label="Overstock risk"
          value={`${overstockCount} SKU${overstockCount !== 1 ? 's' : ''}`}
          sub="clearance advised"
          valueColor={overstockCount > 0 ? '#854F0B' : '#3B6D11'}
        />
      </div>

      <div style={s.tabBar}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            style={{ ...s.tab, ...(activeTab === i ? s.tabActive : {}) }}
            onClick={() => setActiveTab(i)}
          >
            {tab}
            {tab === 'Alerts' && stockoutCount > 0 && (
              <span style={{
                marginLeft: 6, fontSize: 10, background: '#fcebeb',
                color: '#A32D2D', borderRadius: 20, padding: '1px 6px',
              }}>
                {stockoutCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 0 && <ForecastTab />}
      {activeTab === 1 && <HistoryTab />}
      {activeTab === 2 && <AlertsTab />}
      {activeTab === 3 && <CompareTab />}
    </div>
  );
}
