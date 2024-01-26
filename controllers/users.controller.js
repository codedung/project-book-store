const { StatusCodes } = require("http-status-codes");
const { userService, userMatch } = require("../services/users.service");

const userOutput = {
  signup: (req, res) => {},
  signin: (req, res) => {
    const tokenData = req.tokenData;

    if (tokenData) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "로그인 된 상태입니다.",
      });
    }
  },
  requestResetPassword: (req, res) => {},
  resetPassword: (req, res) => {},
};

const userProcess = {
  signup: async (req, res) => {
    const userData = req.body;
    const signupResult = await userService.userSignup(userData);
    if (!signupResult.success) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: signupResult.msg });
    }
    return res.status(StatusCodes.OK).json({ msg: signupResult.msg });
  },
  signin: async (req, res) => {
    const userData = req.body;
    const signinResult = await userService.userSignin(userData);
    if (!signinResult.success) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: signinResult.msg });
    }
    const getToken = userService.getToken(signinResult.data);
    if (getToken) {
      return res
        .cookie("accessToken", getToken.accessToken, {
          httpOnly: true,
        })
        .cookie("refreshToken", getToken.refreshToken, {
          httpOnly: true,
        })
        .status(StatusCodes.OK)
        .json({
          msg: "로그인에 성공하였습니다.",
        });
    } else {
      return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
        msg: "토큰 발생에 실패했습니다.",
      });
    }
  },
  requestResetPassword: async (req, res) => {
    const requestResetUser = req.body;
    const validate = req.params.step;
    if (validate == "step1") {
      if (!requestResetUser.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          msg: "아이디를 입력하세요.",
        });
      }
    } else if (validate == "step2") {
      if (!requestResetUser.toEmail) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          msg: "인증받을 이메일을 입력하세요.",
        });
      }
    }
    const matchResult = await userMatch(requestResetUser);
    if (matchResult.success) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: matchResult.msg });
    }
    if (!matchResult.success && requestResetUser.toEmail) {
      const sendMailResult = await userService.sendMailToUser(
        requestResetUser,
        matchResult.data.idx
      );

      if (sendMailResult) {
        return res.status(StatusCodes.OK).json({
          msg: "전송완료",
        });
      }
    }
  },
  resetPassword: async (req, res) => {
    const { id: userIdx } = req.params;
    const { password: resetPassword } = req.body;

    const resetResult = await userService.resetPassword(userIdx, resetPassword);

    if (resetResult.success) {
      return res.status(StatusCodes.OK).json({
        msg: resetResult.msg,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: resetResult.msg,
      });
    }
  },
};

module.exports = {
  userOutput,
  userProcess,
};
