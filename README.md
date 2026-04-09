# DemandIQ — Retail Demand Forecast Dashboard

A MERN-stack dashboard for retail demand forecasting with 7-day predictions, historical trend analysis, stockout/overstock alerts, and SKU comparison across 10 product categories.

## Project Structure

```
demandiq/
├── package.json          ← root (runs both servers with concurrently)
├── server/
│   ├── index.js          ← Express server on port 5001
│   ├── package.json
│   ├── data/
│   │   └── skus.js       ← SKU master data + data generation logic
│   └── routes/
│       ├── forecast.js   ← GET /api/forecast, /api/forecast/all
│       ├── history.js    ← GET /api/history, /monthly, /channels
│       └── alerts.js     ← GET /api/alerts
└── client/
    ├── package.json
    └── src/
        ├── App.jsx
        ├── pages/
        │   └── Dashboard.jsx
        ├── components/
        │   ├── ForecastTab.jsx   ← 7-day forecast chart + daily table
        │   ├── HistoryTab.jsx    ← 90-day multi-SKU + monthly + channel
        │   ├── AlertsTab.jsx     ← stockout/overstock alerts
        │   ├── CompareTab.jsx    ← SKU ranking + stock cover chart
        │   └── MetricCard.jsx    ← reusable summary card
        ├── hooks/
        │   └── useFetch.js       ← data fetching hook
        └── utils/
            └── skus.js           ← shared SKU list
```

## Setup & Run

### Step 1 — Install all dependencies
```bash
npm run install-all
```

### Step 2 — Start both servers
```bash
npm run dev
```

This starts:
- **Node.js API server** on http://localhost:5001
- **React frontend** on http://localhost:3000

Open http://localhost:3000 in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/forecast?sku=0&days=30` | Historical + 7-day forecast for one SKU |
| GET | `/api/forecast/all` | Summary for all 10 SKUs |
| GET | `/api/history?days=90` | Historical data for all SKUs |
| GET | `/api/history/monthly` | Monthly aggregated totals |
| GET | `/api/history/channels` | Channel split percentages |
| GET | `/api/alerts` | Stockout + overstock alerts |
| GET | `/api/health` | Server health check |

---

## Connecting Your ML Model

When your LSTM/XGBoost model is ready, replace the data generation functions in `server/data/skus.js` with real model predictions:

```js
// In server/routes/forecast.js — replace generateForecast(skuIdx) with:
const mlResponse = await axios.post('http://localhost:5000/predict', {
  sku_id: SKUS[skuIdx].id,
  horizon: 7
});
const forecast = mlResponse.data.predictions;
```

The frontend components don't need any changes — they just consume the same JSON shape.

---

## Connecting MongoDB

Install mongoose and replace the in-memory data generation with real DB queries:

```bash
cd server && npm install mongoose
```

Then in `server/index.js`:
```js
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/demandiq');
```

## Tech Stack
- **Frontend**: React 18, Chart.js 4, react-chartjs-2
- **Backend**: Node.js, Express
- **Data**: In-memory generation (swap with MongoDB + ML model)
