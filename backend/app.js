const express = require("express");
const cors    = require("cors");
const path    = require("path");
const orderRoutes = require("./src/routes/orderRoutes");
const menuRoutes = require("./src/routes/menuRoutes");
const { errorHandler, notFound } = require("./src/middleware/errorHandler");

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── API Routes ────────────────────────────────────────────────
const supabase = require("./src/config/supabase");

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: supabase ? "connected" : "missing_keys",
    time: new Date().toISOString()
  });
});

app.use("/api/orders", orderRoutes);
app.use("/api/menu", menuRoutes);

// ── Error Handling ────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
