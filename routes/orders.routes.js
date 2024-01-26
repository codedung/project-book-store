const express = require("express");
const router = express.Router();

const { orderProcess } = require("../controllers/orders.controller");

router.route("/").get(orderProcess.getOrderList).post(orderProcess.toOrder);

router.get("/:id", orderProcess.getOrderDetail);

module.exports = router;
