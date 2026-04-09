const express = require("express");
const router = express.Router();
const { SKUS, generateHistorical, generateForecast } = require("../data/skus");

// GET /api/forecast?sku=0&days=30
// Returns historical + 7-day forecast for a single SKU
router.get("/", (req, res) => {
  const skuIdx = parseInt(req.query.sku) || 0;
  const histDays = parseInt(req.query.days) || 30;

  if (skuIdx < 0 || skuIdx >= SKUS.length) {
    return res.status(400).json({ error: "Invalid sku index" });
  }

  const historical = generateHistorical(skuIdx, histDays);
  const forecast = generateForecast(skuIdx);
  const sku = SKUS[skuIdx];
  const totalForecast7d = forecast.reduce((a, f) => a + f.forecast, 0);
  const avgDaily = Math.round(historical.reduce((a, h) => a + h.units_sold, 0) / histDays);
  const stockCoverDays = Math.round(sku.stock / (sku.base * sku.trend));
  const stockoutRisk = stockCoverDays <= sku.lead ? "critical" : stockCoverDays <= sku.lead * 2 ? "warning" : "safe";

  res.json({
    sku: { ...sku, index: skuIdx },
    historical,
    forecast,
    summary: {
      avgDailySales: avgDaily,
      forecast7dTotal: totalForecast7d,
      stockOnHand: sku.stock,
      stockCoverDays,
      leadTimeDays: sku.lead,
      stockoutRisk,
    },
  });
});

// GET /api/forecast/all — summary for all 10 SKUs (used by comparison tab)
router.get("/all", (req, res) => {
  const summaries = SKUS.map((sku, i) => {
    const fc = generateForecast(i);
    const totalFc = fc.reduce((a, f) => a + f.forecast, 0);
    const stockCoverDays = Math.round(sku.stock / (sku.base * sku.trend));
    const stockoutRisk = stockCoverDays <= sku.lead ? "critical" : stockCoverDays <= sku.lead * 2 ? "warning" : "safe";
    return {
      index: i,
      id: sku.id,
      name: sku.name,
      category: sku.category,
      color: sku.color,
      forecast7dTotal: totalFc,
      stockOnHand: sku.stock,
      stockCoverDays,
      leadTimeDays: sku.lead,
      trend: sku.trend,
      stockoutRisk,
      forecast: fc,
    };
  });
  res.json(summaries);
});

module.exports = router;
