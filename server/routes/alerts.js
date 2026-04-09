const express = require("express");
const router = express.Router();
const { SKUS, generateForecast } = require("../data/skus");

// GET /api/alerts — all stockout + overstock alerts
router.get("/", (req, res) => {
  const stockout = [];
  const overstock = [];

  SKUS.forEach((sku, i) => {
    const fc = generateForecast(i);
    const fc7total = fc.reduce((a, f) => a + f.forecast, 0);
    const stockCoverDays = Math.round(sku.stock / (sku.base * sku.trend));
    const weeksCover = Math.round(sku.stock / (sku.base * sku.trend * 7));

    if (stockCoverDays <= sku.lead) {
      stockout.push({
        index: i,
        id: sku.id,
        name: sku.name,
        severity: "critical",
        stock: sku.stock,
        forecast7d: fc7total,
        leadTime: sku.lead,
        stockCoverDays,
        message: `Only ${stockCoverDays}d stock remaining — lead time is ${sku.lead}d`,
      });
    } else if (stockCoverDays <= sku.lead * 2) {
      stockout.push({
        index: i,
        id: sku.id,
        name: sku.name,
        severity: "warning",
        stock: sku.stock,
        forecast7d: fc7total,
        leadTime: sku.lead,
        stockCoverDays,
        message: `${stockCoverDays}d cover — monitor closely`,
      });
    }

    if (weeksCover > 20) {
      const discountPct = weeksCover > 40 ? 35 : 20;
      overstock.push({
        index: i,
        id: sku.id,
        name: sku.name,
        severity: "warning",
        stock: sku.stock,
        weeksCover,
        avgWeeklySales: Math.round(sku.base * sku.trend * 7),
        suggestedDiscount: discountPct,
        message: `${weeksCover} weeks of stock at current velocity`,
      });
    }
  });

  // Healthy SKUs (not in either list)
  const alertedIds = new Set([...stockout, ...overstock].map((a) => a.id));
  const healthy = SKUS.filter((s) => !alertedIds.has(s.id)).map((s, i) => ({
    id: s.id,
    name: s.name,
    index: SKUS.indexOf(s),
  }));

  res.json({ stockout, overstock, healthy });
});

module.exports = router;
