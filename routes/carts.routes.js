const express = require("express");
const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.send("장바구니조회");
  })
  .post((req, res) => {
    res.send("장바구니추가");
  });

router.delete("/:id", (req, res) => {
  res.send("장바구니삭제");
});

router.get("/test", (req, res) => {});

module.exports = router;
