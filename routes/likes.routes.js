const express = require("express");
const router = express.Router();

router
  .route("/:id")
  .post((req, res) => {
    res.send("좋아요 추가");
  })
  .delete((req, res) => {
    res.send("좋아요 삭제");
  });

module.exports = router;
