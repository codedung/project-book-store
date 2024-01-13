const express = require("express");
const router = express.Router();

const {
  allBooks,
  bookDetail,
  addBook
} = require("../controllers/books.controller");

router.get("/", allBooks);
router.get("/:id", bookDetail);
router.post("/", addBook);

module.exports = router;
