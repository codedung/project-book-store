const dotevn = require("dotenv");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
dotevn.config();

const { userModel } = require("../models/users.model");
const { userUtil } = require("../utils/user.utils");

const { NODEMAILER_USER, NODEMAILER_PASS } = process.env;

const transporter = nodemailer.createTransport({
  service: "naverworks",
  host: "smtp.naver.com",
  port: 465,
  secure: true,
  auth: {
    user: NODEMAILER_USER,
    pass: NODEMAILER_PASS,
  },
});

const userService = {
  userSignup: async (userData) => {
    const matchResult = await userMatch(userData);
    if (matchResult.success) {
      return { success: false, msg: matchResult.msg };
    }
    const signupResult = await userModel.userSignup(userData);
    return signupResult;
  },
  userSignin: async (userData) => {
    const matchResult = await userMatch(userData);
    if (matchResult.success) {
      return { success: false, msg: matchResult.msg };
    }
    const hashResult = userUtil.hashPassword(userData, matchResult.data);
    if (matchResult.data.password !== hashResult.hashPw) {
      return { success: false, msg: "아이디와 비밀번호를 확인하세요." };
    }
    return { success: true, data: matchResult.data };
  },
  getToken: (userData) => {
    const accessToken = jwt.sign(
      {
        idx: userData.idx,
        id: userData.id,
        name: userData.name,
      },
      process.env.JWT_SECRET_STRING,
      {
        expiresIn: "5m",
        issuer: "admin",
      }
    );
    const refreshToken = jwt.sign(
      {
        idx: userData.idx,
        id: userData.id,
        name: userData.name,
      },
      process.env.JWT_SECRET_STRING,
      {
        expiresIn: "1d",
        issuer: "admin",
      }
    );

    return { accessToken: accessToken, refreshToken: refreshToken };
  },
  sendMailToUser: async (requsetData, userIdx) => {
    const mailOptions = {
      from: NODEMAILER_USER,
      to: requsetData.toEmail,
      subject: "비밀번호 재설정",
      html: `
        <h1>비밀번호 재설정</h1>
        <a href="/reset/${userIdx}">비밀번호 변경하러 가기</a>
      `,
    };

    const sendMailResult = await transporter.sendMail(mailOptions);
    return sendMailResult;
  },
  resetPassword: async (userIdx, resetPassword) => {
    const updateResult = await userModel.resetPassword(userIdx, resetPassword);
    return updateResult;
  },
};

const userMatch = async (userData) => {
  const userMatch = await userModel.userMatch(userData);
  return userMatch;
};

module.exports = { userService, userMatch };
