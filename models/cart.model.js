const pool = require("../config/database");
const bookStoreSql = require("./bookStoreSql");

const cartModel = {
  addCart: async (userId, addCartData) => {
    const conn = await pool.getConnection(async (conn) => conn);
    const addCartSql = bookStoreSql.insert.insertCart;
    const addCartValues = [userId, addCartData.bookId, addCartData.count];

    try {
      const [addCartResult] = await conn.query(addCartSql, addCartValues);
      if (addCartResult.affectedRows == 0) {
        throw new Error("장바구니에 담지 못했습니다.");
      }
      return { success: true, msg: "장바구니에 성공적으로 담겼습니다." };
    } catch (err) {
      return { success: false, msg: err.message };
    } finally {
      conn.release();
    }
  },
  getCartList: async (userId, selected) => {
    const conn = await pool.getConnection(async (conn) => conn);
    let getItemSql = bookStoreSql.select.getCartDefault;
    let values = [userId];
    if (selected) {
      values.push(selected);
      getItemSql += bookStoreSql.addsql.addCartSelectedList;
    }
    try {
      const [cartListData] = await conn.query(getItemSql, values);

      if (cartListData.length) {
        return {
          success: true,
          msg: "장바구니 리스트를 불러오는데 성공했습니다.",
          data: cartListData,
        };
      }
      throw new Error("장바구니 리스트를 불러오는데 실패했습니다.");
    } catch (err) {
      return { success: false, msg: err.message };
    } finally {
      conn.release();
    }
  },
  deleteCartItem: async (cartId) => {
    const conn = await pool.getConnection(async (conn) => conn);
    const deleteItemSql = bookStoreSql.delete.deleteCartOneItem;
    try {
      const [deleteResult] = await conn.query(deleteItemSql, cartId);
      if (deleteResult.affectedRows == 0) {
        throw new Error("해당 상품을 삭제하지 못했습니다.");
      }
      return { success: true, msg: "해당 상품을 삭제했습니다." };
    } catch (err) {
      return { success: false, msg: err.message };
    } finally {
      conn.release();
    }
  },
};

module.exports = { cartModel };
