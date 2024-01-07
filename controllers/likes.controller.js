const { StatusCodes } = require("http-status-codes");
const conn = require("../config/database");

const addLikes = async (req, res) => {
  const { id: book_id } = req.params;
  const { user_id } = req.body;
  const addSql = `INSERT INTO likes (user_id, book_id) VALUES (?,?);`;
  const values = [user_id, book_id];

  try {
    const [result] = await conn.query(addSql, values);
    if (result.affectedRows == 0)
      return res.status(StatusCodes.BAD_REQUEST).end();
    else return res.status(StatusCodes.OK).end();
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  } finally {
    conn.releaseConnection();
  }
};

const removeLikes = async (req, res) => {
  const { id: book_id } = req.params;
  const { user_id } = req.body;
  const removeSql = `DELETE FROM likes WHERE user_id = ? AND book_id = ?`;
  const values = [user_id, book_id];

  try {
    const [result] = await conn.query(removeSql, values);

    if (result.affectedRows == 0)
      return res.status(StatusCodes.BAD_REQUEST).end();
    else return res.status(StatusCodes.OK).end();
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  } finally {
    conn.releaseConnection();
  }
};

module.exports = { addLikes, removeLikes };
