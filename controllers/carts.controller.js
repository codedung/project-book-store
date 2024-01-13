const { StatusCodes } = require("http-status-codes");
const pool = require("../config/database");

const addToCart = async (req, res) => {
  const { user_id, book_id, count } = req.body;
  const addSql = `INSERT INTO carts (user_id, book_id, count) VALUES (?,?,?);`;
  const values = [user_id, book_id, count];

  try {
    const [result] = await pool.query(addSql, values);
    if (result.affectedRows == 0)
      return res.status(StatusCodes.BAD_REQUEST).end();
    else return res.status(StatusCodes.OK).end();
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

const getCartItem = async (req, res) => {
  let { user_id, selected } = req.body;
  // selected = [1,3];

  let getItemSql = `SELECT c.idx, book_id, title, summary, count, price FROM carts AS c LEFT JOIN books AS b ON c.book_id = b.idx WHERE user_id = ?`;
  let values = [user_id];
  if (selected) {
    values.push(selected);
    getItemSql += ` AND c.idx IN (?)`;
  }

  try {
    const [data] = await pool.query(getItemSql, values);

    if (data.length) return res.status(StatusCodes.OK).json(data);
    else return res.status(StatusCodes.NOT_FOUND).end();
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

const deleteCartItem = async (req, res) => {
  const { id } = req.params;

  const deleteItemSql = `DELETE FROM carts WHERE idx = ?`;
  try {
    const [deleteResult] = await pool.query(deleteItemSql, id);
    if (deleteResult.affectedRows == 0)
      return res.status(StatusCodes.NOT_FOUND).end();
    else return res.status(StatusCodes.OK).end();
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

module.exports = { addToCart, getCartItem, deleteCartItem };
