const { StatusCodes } = require("http-status-codes");
const pool = require("../config/database");
const jwt = require("jsonwebtoken");

const getOrderList = async (req, res) => {
  const { idx: user_id } = req.tokenData;

  const getOrderDataSql = `SELECT o.idx as id, create_at, address, receiver, contact, 
  (SELECT title FROM books WHERE idx = (SELECT book_id FROM order_books where order_id = o.idx  LIMIT 1)) as title, 
  total_count, total_price FROM orders as o LEFT JOIN deliveries as d ON o.delivery_id = d.id WHERE o.user_id = ? ORDER BY idx DESC`;
  try {
    const [getOrderData] = await pool.query(getOrderDataSql, user_id);

    if (getOrderData.length) {
      return res.status(StatusCodes.OK).json(getOrderData);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

const toOrder = async (req, res) => {
  const { delivery, orderItems, totalPrice, totalCount } = req.body;
  const { idx: user_id } = req.tokenData;
  let deliveryResult = "";
  let orderResult = "";

  const deliverySql = `INSERT INTO deliveries (user_id, delivery_name, receiver, address, contact) VALUES (?,?,?,?,?)`;
  const deliveryValues = [
    user_id,
    delivery.delivery_name,
    delivery.receiver,
    delivery.address,
    delivery.contact
  ];

  try {
    [deliveryResult] = await pool.query(deliverySql, deliveryValues);
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "배송지 오류"
    });
  }

  const orderSql = `INSERT INTO orders (user_id, delivery_id, total_count, total_price) VALUES (?,?,?,?)`;
  const orderValues = [
    user_id,
    deliveryResult.insertId,
    totalCount,
    totalPrice
  ];

  try {
    [orderResult] = await pool.query(orderSql, orderValues);
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "주문 추가 오류"
    });
  }

  const OrderData = `SELECT book_id, count FROM carts WHERE idx IN (?)`;
  const addOrderBook = `INSERT INTO order_books (order_id, book_id, count) VALUES ?`;
  const addOrderValues = [];
  let addBooksResult;

  try {
    [addBooksResult] = await pool.query(OrderData, [orderItems]);
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).end();
  }

  addBooksResult.forEach((item) => {
    addOrderValues.push([orderResult.insertId, item.book_id, item.count]);
  });

  try {
    const [addOrderResult] = await pool.query(addOrderBook, [addOrderValues]);
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "주문 도서 추가 오류"
    });
  }

  let deleteResult = deleteCartItems(orderItems);
  deleteResult.then(
    (result) => {
      if (result) {
        return res.status(StatusCodes.OK).json({
          message: "주문에 성공하였습니다."
        });
      } else {
        return res.status(StatusCodes.NOT_FOUND).end();
      }
    },
    () => {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
  );
};

const deleteCartItems = async (orderItems) => {
  let cartItem = orderItems;
  let deleteCartSql = `DELETE FROM carts WHERE idx IN (?)`;
  let deleteResult;
  try {
    [deleteResult] = await pool.query(deleteCartSql, [cartItem]);
    return deleteResult.affectedRows;
  } catch (err) {
    throw err;
  }
};

const getOrderDetail = async (req, res) => {
  const { idx: user_id } = req.tokenData;
  const { id: order_id } = req.params;
  try {
    const getOrderUser = `SELECT user_id FROM orders WHERE idx = ?`;
    const [[orderUserData]] = await pool.query(getOrderUser, order_id);
    if (orderUserData.user_id != user_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "잘못된 접근입니다."
      });
    }

    const getDetailOrderSql = `SELECT book_id, title, author, price, count FROM order_books LEFT JOIN books ON order_books.book_id = books.idx WHERE order_id = ?`;
    const [detailOrderData] = await pool.query(getDetailOrderSql, order_id);
    if (detailOrderData.length) {
      return res.status(StatusCodes.OK).json(detailOrderData);
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "주문내역 없음"
      });
    }
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

module.exports = { getOrderList, toOrder, getOrderDetail };
