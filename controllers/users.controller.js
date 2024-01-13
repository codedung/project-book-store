const { StatusCodes } = require("http-status-codes");
const pool = require("../config/database");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const dotevn = require("dotenv");
dotevn.config();

const signup = async (req, res) => {
  // 아이디가 중복이 되면 안된다 = user 테이블에 id값이 존재하는가?
  // 아이디가 존재한다면 =>  "중복된 아이디 입니다."
  const { id, password, name } = req.body;
  try {
    const userCheckSql = "SELECT * FROM users where id = ?";
    const [result] = await pool.query(userCheckSql, id);
    if (result.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "중복된 아이디 입니다."
      });
    }
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
  // 비밀번호 암호화
  const salt = crypto.randomBytes(10).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");
  // 존재하지 않는다면 => INSERT
  try {
    const userInsertSql =
      "INSERT INTO users (id, password, name, salt) values ( ?,?,?,? )";
    const userValues = [id, hashPassword, name, salt];
    const [result] = await pool.query(userInsertSql, userValues);

    return res.status(StatusCodes.CREATED).json({
      message: `${name}님 회원가입을 환영합니다.`
    });
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

const signin = async (req, res) => {
  const { id, password } = req.body;

  try {
    const userSelectSql = "SELECT * FROM users where id = ? ";
    const [[user]] = await pool.query(userSelectSql, id);

    const matchPassword = crypto
      .pbkdf2Sync(password, user.salt, 10000, 10, "sha512")
      .toString("base64");

    if (user && user.password === matchPassword) {
      const token = jwt.sign(
        {
          idx: user.idx,
          id: user.id,
          name: user.name
        },
        process.env.JWT_SECRET_STRING,
        {
          expiresIn: "5m",
          issuer: "dung"
        }
      );
      res.cookie("token", token, {
        httpOnly: true
      });
      return res.status(StatusCodes.OK).json({
        message: `${user.name}님 환영합니다.`
      });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "아이디와 비밀번호를 확인하세요."
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.NOT_FOUND).end();
  }
};
const passwordResetRequest = async (req, res) => {
  const { id } = req.body;

  try {
    const userSelectSql = "SELECT * FROM users where id = ? ";
    const [[user]] = await pool.query(userSelectSql, id);
    if (user)
      return res.status(StatusCodes.OK).json({
        id: user.id
      });
    return res.status(StatusCodes.NOT_FOUND).end();
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).end();
  }
};
const passwrordReset = async (req, res) => {
  const { id, password } = req.body;
  // 누가 하는지 어떻게 아는가? passwordResetRequest에서 response 할때 id 값도 넘기면 input hidden으로 받아서 같이 넘길수 있음
  const salt = crypto.randomBytes(10).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");
  try {
    const passwordResetSql =
      "UPDATE users SET password =? , salt = ? where id = ? ";
    const values = [hashPassword, salt, id];
    const [result] = await pool.query(passwordResetSql, values);

    console.log(result.affectedRows);
    if (result.affectedRows) {
      return res.status(StatusCodes.OK).json({
        message: "비밀번호가 변경되었습니다."
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

module.exports = { signup, signin, passwordResetRequest, passwrordReset };
