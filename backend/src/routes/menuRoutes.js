const express = require("express");
const router = express.Router();
const { getAll, addItem, updateItem, deleteItem } = require("../controllers/menuController");

router.get("/", getAll);
router.post("/", addItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

module.exports = router;
