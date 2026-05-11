require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n✅  Fastfood API running → http://localhost:${PORT}`);
  console.log(`   Endpoints:`);
  console.log(`   POST   /api/orders/place`);
  console.log(`   GET    /api/orders/all`);
  console.log(`   GET    /api/orders/stats`);
  console.log(`   PATCH  /api/orders/pay/:id\n`);
});
