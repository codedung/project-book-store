const pool = require("../config/database");
const bookStoreSql = require("./bookStoreSql");

const categoryModel = {
  getCategoryList: async () => {
    const conn = await pool.getConnection(async (conn) => conn);
    try {
      const categorySql = bookStoreSql.select.getCategory;
      const [result] = await conn.query(categorySql);

      if (!result.length) {
        throw new Error("리스트 불러오기 실패");
      }
      return { success: true, msg: "카테고리 리스트", data: result };
    } catch (err) {
      return { success: false, msg: err.message };
    } finally {
      conn.release();
    }
  },
};

module.exports = { categoryModel };
