const pool = require("../config/database");
const bookStoreSql = require("./bookStoreSql");

const orderModel = {
  getOrderList: async (userId) => {
    const conn = await pool.getConnection(async (conn) => conn);
    const getOrderDataSql = bookStoreSql.select.getOrderInfo;
    try {
      const [getOrderData] = await conn.query(getOrderDataSql, userId);

      if (getOrderData.length) {
        return {
          success: true,
          msg: "데이터를 읽어오는데 성공했습니다.",
          data: getOrderData,
        };
      }
      throw new Error("데이터를 읽어오는데 실패했습니다.");
    } catch (err) {
      return { success: false, msg: err.message };
    } finally {
      conn.release();
    }
  },
  toOrder: async (orderData, userId) => {
    const { delivery, orderItems, totalPrice, totalCount } = orderData;
    const conn = await pool.getConnection(async (conn) => conn);
    conn.beginTransaction();
    let deliveryResult = "";
    let orderResult = "";

    try {
      const deliverySql = bookStoreSql.insert.insertDelivery;
      const deliveryValues = [
        userId,
        delivery.delivery_name,
        delivery.receiver,
        delivery.address,
        delivery.contact,
      ];

      [deliveryResult] = await conn.query(deliverySql, deliveryValues);
    } catch (err) {
      conn.rollback();
      return { success: false, msg: "배송지 오류", err: err.message };
    }

    try {
      const orderSql = bookStoreSql.insert.insertOrder;
      const orderValues = [
        userId,
        deliveryResult.insertId,
        totalCount,
        totalPrice,
      ];

      [orderResult] = await conn.query(orderSql, orderValues);
    } catch (err) {
      conn.rollback();
      return { success: false, msg: "주문 추가 오류", err: err.message };
    }

    const orderItemsArr = [];

    orderItems.forEach((item) => {
      orderItemsArr.push(item.cart_item_id);
    });
    try {
      const OrderData = bookStoreSql.select.getOrderSelectedData;
      const addOrderBook = bookStoreSql.insert.insertOrderBooks;
      const addOrderValues = [];
      const [addBooksResult] = await conn.query(OrderData, [orderItemsArr]);

      addBooksResult.forEach((item) => {
        addOrderValues.push([orderResult.insertId, item.book_id, item.count]);
      });

      const [addOrderBookResult] = await conn.query(addOrderBook, [
        addOrderValues,
      ]);
      if (addOrderBookResult.affectedRows == 0) {
        throw new Error("도서 주문 추가 실패");
      }
    } catch (err) {
      conn.rollback();
      return { success: false, msg: "도서 주문 추가 실패", err: err.message };
    }

    try {
      const deleteCartSql = bookStoreSql.delete.deleteCartItem;
      const [deleteResult] = await conn.query(deleteCartSql, [orderItemsArr]);
      if (deleteResult.affectedRows) {
        conn.commit();
        return { success: true, msg: "구매에 성공하였습니다." };
      }
      throw new Error("장바구니 삭제에 실패했습니다");
    } catch (err) {
      conn.rollback();
      return { success: false, msg: err.message };
    }
  },
  orderUserMatch: async (orderId) => {
    const conn = await pool.getConnection(async (conn) => conn);
    try {
      const getOrderUser = bookStoreSql.select.getOrderUser;
      const [[orderUserData]] = await conn.query(getOrderUser, orderId);
      if (orderUserData)
        return {
          success: true,
          msg: "데이터 조회 성공",
          data: orderUserData,
        };
      throw new Error("데이터 조회 실패");
    } catch (err) {
      return { success: false, msg: err.message };
    } finally {
      conn.release();
    }
  },
  getDetailOrderList: async (orderId) => {
    const conn = await pool.getConnection(async (conn) => conn);
    try {
      const getDetailOrderSql = bookStoreSql.select.getOrderDetailData;
      const [detailOrderData] = await conn.query(getDetailOrderSql, orderId);
      if (detailOrderData.length) {
        return {
          success: true,
          msg: "주문 상세 조회 성공",
          data: detailOrderData,
        };
      }
      throw new Error("주문 상세 조회 실패");
    } catch (err) {
      return { success: false, msg: err.message };
    } finally {
      conn.release();
    }
  },
};

module.exports = { orderModel };
