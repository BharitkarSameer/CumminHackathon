const express = require("express");
const router = express.Router();
const { SKUS, generateHistorical, getPriceForSku } = require("../data/skus");

// GET /api/history?days=90 — all SKUs historical for trend chart
router.get("/", (req, res) => {
  const nDays = parseInt(req.query.days) || 90;
  const skuParam = req.query.sku;

  if (skuParam !== undefined) {
    const idx = parseInt(skuParam);
    const hist = generateHistorical(idx, nDays);
    return res.json({ sku: SKUS[idx], data: hist });
  }

  // Return all 10 SKUs
  const all = SKUS.map((sku, i) => ({
    index: i,
    id: sku.id,
    name: sku.name,
    color: sku.color,
    category: sku.category,
    data: generateHistorical(i, nDays),
  }));
  res.json(all);
});

// GET /api/history/monthly — monthly aggregated totals
router.get("/monthly", (req, res) => {
  // Generate last 6 months of monthly aggregated data
  const months = [];
  const today = new Date("2026-04-09");
  for (let m = 5; m >= 0; m--) {
    const d = new Date(today);
    d.setMonth(d.getMonth() - m);
    const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
    const units = Math.round(3200 + Math.sin(m * 0.8) * 900 + m * 120);
    const revenue = SKUS.reduce((acc, _, i) => {
      return acc + Math.round(units * 0.1 * getPriceForSku(i) * (0.8 + Math.random() * 0.4));
    }, 0);
    months.push({ label, units, revenue });
  }
  res.json(months);
});

// GET /api/history/channels — channel split
router.get("/channels", (req, res) => {
  res.json([
    { channel: "Physical Store", units: 38, color: "#378ADD" },
    { channel: "Online",         units: 32, color: "#639922" },
    { channel: "Wholesale",      units: 21, color: "#EF9F27" },
    { channel: "Quick Commerce", units: 9,  color: "#7F77DD" },
  ]);
});

module.exports = router;
