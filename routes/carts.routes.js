const express = require("express");
const router = express.Router();

const { cartProcess } = require("../controllers/carts.controller");

router.route("/").get(cartProcess.getCartList).post(cartProcess.addToCart);

router.delete("/:id", cartProcess.deleteCartItem);

module.exports = router;
