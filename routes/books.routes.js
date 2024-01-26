const express = require("express");
const router = express.Router();

const { booksOutput } = require("../controllers/books.controller");

router.get("/", booksOutput.getAllBooks);
router.get("/:id", booksOutput.getDetailBook);

module.exports = router;
