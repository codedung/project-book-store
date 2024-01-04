const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const { allCategory } = require("../controllers/category.controller");

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) return next();
  return res.status(400).json(err.array());
};

router.get("/", allCategory);

module.exports = router;
