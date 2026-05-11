const express = require("express");
const cors    = require("cors");
const path    = require("path");
const orderRoutes = require("./src/routes/orderRoutes");
const { errorHandler, notFound } = require("./src/middleware/errorHandler");

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve frontend static files (css, js, images, etc.)
const frontendDir = path.join(__dirname, "../frontend");
app.use(express.static(frontendDir));

// Request logger (dev)
app.use((req, _res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  next();
});

// ── Frontend Routes ───────────────────────────────────────────
app.get("/", (_req, res) =>
  res.sendFile(path.join(frontendDir, "index.html"))
);
app.get("/dashboard", (_req, res) =>
  res.sendFile(path.join(frontendDir, "dashboard.html"))
);

// ── API Routes ────────────────────────────────────────────────
app.use("/api/orders", orderRoutes);

// ── Error Handling ────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
