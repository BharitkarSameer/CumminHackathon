const SKUS = [
  { id: "SKU-001", name: "Air Conditioner 1.5T",  category: "Cooling",   base: 42, trend: 1.18, stock: 240,  lead: 14, color: "#378ADD", channels: ["Physical","Online","Wholesale"] },
  { id: "SKU-002", name: "Room Heater 2000W",      category: "Heating",   base: 22, trend: 0.72, stock: 1860, lead: 10, color: "#E24B4A", channels: ["Physical","Online","Wholesale"] },
  { id: "SKU-003", name: "Mosquito Repellent Set", category: "Health",    base: 31, trend: 1.08, stock: 820,  lead: 7,  color: "#1D9E75", channels: ["Physical","Online","Wholesale","QuickComm"] },
  { id: "SKU-004", name: "Mixer Grinder 750W",     category: "Kitchen",   base: 19, trend: 0.95, stock: 540,  lead: 12, color: "#EF9F27", channels: ["Physical","Online","Wholesale"] },
  { id: "SKU-005", name: "Water Purifier RO",      category: "Purifier",  base: 12, trend: 0.61, stock: 4100, lead: 10, color: "#7F77DD", channels: ["Physical","Online"] },
  { id: "SKU-006", name: "Electric Kettle 1.5L",   category: "Kitchen",   base: 28, trend: 0.88, stock: 960,  lead: 8,  color: "#D4537E", channels: ["Physical","Online","Wholesale","QuickComm"] },
  { id: "SKU-007", name: "Cricket Kit",            category: "Sports",    base: 36, trend: 1.34, stock: 180,  lead: 14, color: "#639922", channels: ["Physical","Online"] },
  { id: "SKU-008", name: "Air Purifier",           category: "Health",    base: 24, trend: 1.02, stock: 730,  lead: 9,  color: "#BA7517", channels: ["Physical","Online","Wholesale"] },
  { id: "SKU-009", name: "Refrigerator 300L",      category: "Cooling",   base: 15, trend: 0.97, stock: 1200, lead: 21, color: "#185FA5", channels: ["Physical","Online","Wholesale"] },
  { id: "SKU-010", name: "Ethnic Wear Combo",      category: "Fashion",   base: 20, trend: 0.91, stock: 440,  lead: 7,  color: "#D85A30", channels: ["Physical","Online","QuickComm"] },
];

// Seeded pseudo-random so data is consistent across requests
function seededRand(seed) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateHistorical(skuIdx, nDays) {
  const sku = SKUS[skuIdx];
  const rand = seededRand(skuIdx * 1000 + nDays);
  const today = new Date("2026-04-09");
  return Array.from({ length: nDays }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - nDays + i + 1);
    const dow = d.getDay();
    const weekend = dow === 0 || dow === 6 ? 1.25 : 1.0;
    const noise = 0.7 + rand() * 0.6;
    const units = Math.round(sku.base * noise * weekend);
    return {
      date: d.toISOString().split("T")[0],
      units_sold: units,
      revenue: units * getPriceForSku(skuIdx),
    };
  });
}

function generateForecast(skuIdx) {
  const sku = SKUS[skuIdx];
  const rand = seededRand(skuIdx * 777);
  const today = new Date("2026-04-09");
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i + 1);
    const dow = d.getDay();
    const weekend = dow === 0 || dow === 6 ? 1.2 : 1.0;
    const val = Math.round(sku.base * sku.trend * weekend * (0.9 + i * 0.018) * (0.92 + rand() * 0.16));
    return {
      date: d.toISOString().split("T")[0],
      forecast: val,
      low: Math.round(val * 0.78),
      high: Math.round(val * 1.22),
    };
  });
}

function getPriceForSku(idx) {
  const prices = [34500, 2800, 450, 3200, 12000, 1200, 8500, 9500, 28000, 2200];
  return prices[idx] || 1000;
}

module.exports = { SKUS, generateHistorical, generateForecast, getPriceForSku };
