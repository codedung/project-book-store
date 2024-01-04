const express = require("express");
const router = express.Router();

const { allBooks, bookDetail } = require("../controllers/books.controller");

router.get("/", allBooks);
router.get("/:id", bookDetail);

module.exports = router;
