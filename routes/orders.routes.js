const express = require("express");
const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.send("주문내역 조회");
  })
  .post((req, res) => {
    res.send("결제하기");
  });

router.get("/:id", (req, res) => {
  res.send("상세주문내역 조회");
});

module.exports = router;
