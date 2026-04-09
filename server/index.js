const express = require("express");
const cors = require("cors");

const forecastRoutes = require("./routes/forecast");
const historyRoutes  = require("./routes/history");
const alertsRoutes   = require("./routes/alerts");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/api/forecast", forecastRoutes);
app.use("/api/history",  historyRoutes);
app.use("/api/alerts",   alertsRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`DemandIQ server running on http://localhost:${PORT}`);
});
