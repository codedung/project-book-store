const pool = require("../config/database");
const bookStoreSql = require("./bookStoreSql");

const likeModel = {
  addLikeModel: async (bookId, userId) => {
    const conn = await pool.getConnection(async (conn) => conn);
    const addSql = bookStoreSql.insert.insertLike;
    const values = [userId, bookId];

    try {
      const [result] = await conn.query(addSql, values);
      if (result.affectedRows == 0) throw new Error("좋아요 실패");
      else return { success: true, msg: "좋아요 성공" };
    } catch (err) {
      return { success: false, msg: err.message };
    } finally {
      conn.release();
    }
  },
  removeLikeModel: async (bookId, userId) => {
    const conn = await pool.getConnection(async (conn) => conn);
    const removeSql = bookStoreSql.delete.deleteLike;
    const values = [userId, bookId];

    try {
      const [result] = await conn.query(removeSql, values);
      if (result.affectedRows == 0) {
        throw new Error("좋아요 해제 실패");
      }
      return { success: true, msg: "좋아요 해제 성공" };
    } catch (err) {
      return { success: false, msg: err.message };
    } finally {
      conn.release();
    }
  },
};

module.exports = { likeModel };
