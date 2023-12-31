const { StatusCodes } = require("http-status-codes");
const conn = require("../config/database");

const allCategory = async (req, res) => {
  try {
    const categorySql = "SELECT * FROM categories";
    const [result] = await conn.query(categorySql);

    if (result.length) return res.status(StatusCodes.OK).json(result);
    else return res.status(StatusCodes.NOT_FOUND).end();
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  } finally {
    conn.releaseConnection();
  }
};

module.exports = { allCategory };
