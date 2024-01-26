const express = require("express");
const router = express.Router();
const { body, query, param, validationResult } = require("express-validator");
const { userOutput, userProcess } = require("../controllers/users.controller");

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
    body("name").notEmpty().withMessage("이름을 입력하세요"),
    validate,
  ],
  userProcess.signup
);

router
  .route("/signin")
  .get(userOutput.signin)
  .post(
    [
      body("id").notEmpty().withMessage("아이디를 입력하세요"),
      body("password").notEmpty().withMessage("비밀번호를 입력하세요"),
      validate,
    ],
    userProcess.signin
  );

// 초기화 요청 유효성검사는 process안에서 동작합니다.
router.post("/reset/:step", userProcess.requestResetPassword);

router.put(
  "/reset/:id",
  [body("password").notEmpty().withMessage("비밀번호를 입력하세요"), validate],
  userProcess.resetPassword
);
module.exports = router;
