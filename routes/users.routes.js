const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const {
  signup,
  signin,
  passwrordReset,
  passwordResetRequest
} = require("../controllers/users.controller");

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) return next();
  return res.status(400).json(err.array());
};

router.post(
  "/signup",
  [
    body("id").notEmpty().withMessage("아이디를 입력하세요"),
    body("password").notEmpty().withMessage("비밀번호를 입력하세요"),
    body("name").notEmpty().withMessage("이름을 입력하세요")
  ],
  signup
);

router.post(
  "/signin",
  [
    body("id").notEmpty().withMessage("아이디를 입력하세요"),
    body("password").notEmpty().withMessage("비밀번호를 입력하세요"),
    validate
  ],
  signin
);

router
  .route("/reset")
  .post([body("id").notEmpty(), validate], passwordResetRequest)
  .put(
    [
      body("id").notEmpty().withMessage("아이디를 입력하지 않았습니다."),
      body("password").notEmpty().withMessage("비밀번호를 입력하지 않았습니다"),
      validate
    ],
    passwrordReset
  );
module.exports = router;
