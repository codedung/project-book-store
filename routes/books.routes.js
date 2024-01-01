const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("전체도서조회");
});
router.get("/:id", (req, res) => {
  res.send("상세도서조회");
});
// router.get("/books?categoryId={categoryId}&new={true}", (req, res) => {
//   res.send("카테고리별 도서 조회");
// });

module.exports = router;
