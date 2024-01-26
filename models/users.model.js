const pool = require("../config/database");
const { userUtil } = require("../utils/user.utils");
const bookStoreSql = require("./bookStoreSql");

const userModel = {
  userSignup: async (userData) => {
    const conn = await pool.getConnection(async (conn) => conn);

    try {
      const hashResult = userUtil.hashPassword(userData);
      const userInsertSql = bookStoreSql.insert.createUser;
      const userInsertValues = [
        userData.id,
        hashResult.hashPw,
        userData.name,
        hashResult.salt,
      ];
      const [result] = await conn.query(userInsertSql, userInsertValues);
      if (result.affectedRows == 0) {
        throw new Error("회원가입에 실패하였습니다.");
      }
      return { success: true, msg: "회원가입에 성공하였습니다." };
    } catch (err) {
      return { success: false, msg: err.message };
    } finally {
      conn.release();
    }
  },
  userMatch: async (userData) => {
    const conn = await pool.getConnection(async (conn) => conn);
    try {
      const matchSql = bookStoreSql.select.getUser;
      const [[result]] = await conn.query(matchSql, userData.id);
      if (result) {
        return {
          success: false,
          data: result,
          msg: "이미 가입된 유저입니다.",
        };
      } else {
        return {
          success: true,
          data: undefined,
          msg: "존재하지 않는 유저입니다.",
        };
      }
    } catch (err) {
      return { success: false, msg: "MySQL ERROR" };
    } finally {
      conn.release();
    }
  },
  resetPassword: async (userIdx, resetPassword) => {
    const conn = await pool.getConnection(async (conn) => conn);
    const userData = { password: resetPassword };
    try {
      const hashResult = userUtil.hashPassword(userData);
      const passwordUpdateSql = bookStoreSql.update.resetUserPassword;
      const updateValues = [hashResult.hashPw, hashResult.salt, userIdx];
      const [updateResult] = await conn.query(passwordUpdateSql, updateValues);
      if (updateResult.affectedRows == 1) {
        return { success: true, msg: "비밀번호 변경을 완료했습니다." };
      } else {
        throw new Error("비밀번호 변경에 실패했습니다.");
      }
    } catch (err) {
      return { success: false, msg: err.message };
    } finally {
      conn.release();
    }
  },
};

module.exports = { userModel };
