import React from 'react';
import { useFetch } from '../hooks/useFetch';

const s = {
  section: { background:'#fff', border:'0.5px solid rgba(0,0,0,0.08)', borderRadius:14, padding:'1.25rem', marginBottom:'1rem' },
  title:   { fontSize:14, fontWeight:500, marginBottom:14 },
  list:    { display:'flex', flexDirection:'column', gap:8 },
  item:    { display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:10, border:'0.5px solid rgba(0,0,0,0.08)' },
  icon:    { width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:500, flexShrink:0 },
  name:    { fontSize:13, fontWeight:500, marginBottom:2 },
  detail:  { fontSize:12, color:'#8a8981' },
  badge:   { fontSize:11, padding:'3px 10px', borderRadius:20, whiteSpace:'nowrap', flexShrink:0 },
};

function severityColors(severity) {
  if (severity === 'critical') return { icon: { background:'#fcebeb', color:'#A32D2D' }, badge: { background:'#fcebeb', color:'#A32D2D' } };
  if (severity === 'warning')  return { icon: { background:'#faeeda', color:'#854F0B' }, badge: { background:'#faeeda', color:'#854F0B' } };
  return { icon: { background:'#eaf3de', color:'#3B6D11' }, badge: { background:'#eaf3de', color:'#3B6D11' } };
}

function AlertItem({ item, badgeText, iconChar }) {
  const colors = severityColors(item.severity || 'ok');
  return (
    <div style={s.item}>
      <div style={{ ...s.icon, ...colors.icon }}>{iconChar}</div>
      <div style={{ flex:1 }}>
        <div style={s.name}>{item.name}</div>
        <div style={s.detail}>{item.message}</div>
      </div>
      <span style={{ ...s.badge, ...colors.badge }}>{badgeText}</span>
    </div>
  );
}

export default function AlertsTab() {
  const { data, loading } = useFetch('/api/alerts');

  if (loading) return <div style={{ color:'#8a8981', fontSize:13, padding:'2rem', textAlign:'center' }}>Loading alerts...</div>;
  if (!data)   return null;

  const { stockout, overstock, healthy } = data;

  return (
    <div>
      <div style={s.section}>
        <div style={s.title}>Stockout risk — reorder urgently</div>
        {stockout.length === 0
          ? <div style={{ fontSize:13, color:'#8a8981' }}>No stockout risks detected.</div>
          : (
            <div style={s.list}>
              {stockout.map(item => (
                <AlertItem
                  key={item.id}
                  item={item}
                  iconChar="!"
                  badgeText={item.severity === 'critical' ? `Stockout in ${item.stockCoverDays}d` : `Watch — ${item.stockCoverDays}d`}
                />
              ))}
            </div>
          )
        }
      </div>

      <div style={s.section}>
        <div style={s.title}>Overstock risk — clearance advised</div>
        {overstock.length === 0
          ? <div style={{ fontSize:13, color:'#8a8981' }}>No overstock risks detected.</div>
          : (
            <div style={s.list}>
              {overstock.map(item => (
                <AlertItem
                  key={item.id}
                  item={{ ...item, severity:'warning' }}
                  iconChar="↑"
                  badgeText={`${item.suggestedDiscount}% discount advised`}
                />
              ))}
            </div>
          )
        }
      </div>

      <div style={s.section}>
        <div style={s.title}>Healthy SKUs</div>
        <div style={s.list}>
          {healthy.map(item => (
            <AlertItem
              key={item.id}
              item={{ ...item, severity:'ok', message:'Stock levels and demand velocity are balanced.' }}
              iconChar="✓"
              badgeText="Healthy"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
