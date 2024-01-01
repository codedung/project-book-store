const express = require("express");
const router = express.Router();

router.post("/signup", (req, res) => {
  //회원가입
  res.json("회원가입");
});

router.post("/signin", (req, res) => {
  //로그인
  res.json("로그인");
});

router
  .route("/reset")
  .post((req, res) => {
    //비밀번호 초기화 요청
    res.json("비밀번호 초기화 요청");
  })
  .put((req, res) => {
    //비밀번호 초기화(수정)
    res.json("비밀번호 초기화");
  });
module.exports = router;
