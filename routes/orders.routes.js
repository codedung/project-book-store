const express = require("express");
const router = express.Router();

const {
  getOrderList,
  toOrder,
  getOrderDetail
} = require("../controllers/orders.controller");

router.route("/").get(getOrderList).post(toOrder);

router.get("/:id", getOrderDetail);

module.exports = router;
