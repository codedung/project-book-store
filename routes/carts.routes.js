const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCartItem,
  deleteCartItem
} = require("../controllers/carts.controller");

router.route("/").get(getCartItem).post(addToCart);

router.delete("/:id", deleteCartItem);

module.exports = router;
