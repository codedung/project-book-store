const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const { JWT_SECRET_STRING } = process.env;
const auth = async (req, res, next) => {
  const receivedJwt = req.headers["authorization"];
  if (receivedJwt) {
    try {
      const jwtDecoded = await jwt.verify(receivedJwt, JWT_SECRET_STRING);

      req.tokenData = jwtDecoded;
      next();
    } catch (err) {
      // jwt가 존재하지 않음
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "로그인 세션이 만료되었습니다."
        });
      }
    }
  } else {
    next();
  }
};

module.exports = { auth };
