const express = require("express");
const router = express.Router();
const { placeOrder, getAllOrders, getStats, markAsPaid, deleteOrder, resetStats } = require("../controllers/orderController");

router.post("/place", placeOrder);
router.get("/all", getAllOrders);
router.get("/stats", getStats);
router.delete("/reset", resetStats);
router.patch("/pay/:id", markAsPaid);
router.delete("/:id", deleteOrder);

module.exports = router;
