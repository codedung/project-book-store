const express = require("express");
const router = express.Router();
const { categoryOutput } = require("../controllers/category.controller");

router.get("/", categoryOutput.getCategoryList);

module.exports = router;
