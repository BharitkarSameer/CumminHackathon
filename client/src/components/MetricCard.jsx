import React from 'react';

const styles = {
  card: {
    background: '#f0efe9',
    borderRadius: 10,
    padding: '14px 18px',
  },
  label: {
    fontSize: 12,
    color: '#8a8981',
    marginBottom: 6,
    textTransform: 'none',
  },
  value: {
    fontSize: 24,
    fontWeight: 500,
    lineHeight: 1.2,
  },
  sub: {
    fontSize: 12,
    color: '#8a8981',
    marginTop: 4,
  },
};

export default function MetricCard({ label, value, sub, valueColor }) {
  return (
    <div style={styles.card}>
      <div style={styles.label}>{label}</div>
      <div style={{ ...styles.value, color: valueColor || '#1a1a18' }}>{value}</div>
      {sub && <div style={styles.sub}>{sub}</div>}
    </div>
  );
}
