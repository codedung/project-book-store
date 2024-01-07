const { StatusCodes } = require("http-status-codes");
const conn = require("../config/database");
const dotevn = require("dotenv");
dotevn.config();

/* 
  sort=recent 출판순, sort=popular 인기순, sort=sale 판매량, default값은 등록번호
*/
const allBooks = async (req, res) => {
  let { sort, news, category_id, pages, limit } = req.query;
  pages = parseInt(pages);
  limit = parseInt(limit);
  let allSelectSql = `SELECT b.idx, title, category_id, image_path as main_image, summary, author, price, pub_date, likes 
  FROM books AS b LEFT JOIN (SELECT * FROM book_images WHERE main = 1) AS bi ON b.idx = bi.book_id 
  LEFT JOIN (SELECT *, count(*) AS likes from likes GROUP BY book_id) AS bl ON b.idx = bl.book_id`;
  let values = [];
  if (category_id && news) {
    allSelectSql += ` WHERE category_id = ? b.pub_date >= date_sub(now(), interval 30 day)`;
    values = [category_id];
  } else if (category_id) {
    allSelectSql += ` WHERE category_id = ?`;
    values = [category_id];
  } else if (news) {
    allSelectSql += ` WHERE b.pub_date >= date_sub(now(), interval 30 day)`;
    values = [];
  }

  if (sort) {
    if (sort === "recent") allSelectSql += ` ORDER BY b.pub_date DESC`;
    else if (sort === "reverseRecent")
      allSelectSql += ` ORDER BY b.pub_date ASC`;
    else if (sort === "highPopular") allSelectSql += ` ORDER BY bl.likes DESC`;
    else if (sort === "lowPopular") allSelectSql += ` ORDER BY bl.likes ASC`;
  } else {
    allSelectSql += ` ORDER BY b.idx DESC`;
  }

  const offset = (pages - 1) * limit;
  if (pages && limit) {
    allSelectSql += ` LIMIT ? OFFSET ?`;
    values.push(limit, offset);
  }
  try {
    const [data] = await conn.query(allSelectSql, values);

    if (data.length) {
      return res.status(StatusCodes.OK).json(data);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.NOT_FOUND).end();
  } finally {
    conn.releaseConnection();
  }
};

const bookDetail = async (req, res) => {
  let { id: book_id } = req.params;
  const { user_id } = req.body;
  try {
    const bookDetailSql = `SELECT idx, title, (SELECT category_ko FROM categories WHERE categories.idx = books.category_id) AS category, 
    form, isbn, summary, detail, author, pages, contents, price, pub_date, (SELECT count(*) FROM likes WHERE book_id = idx ) AS likes, (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND book_id = idx)) AS liked FROM books where idx = ?`;
    const [[data]] = await conn.query(bookDetailSql, [user_id, book_id]);

    const imageSql =
      "SELECT image_path, main FROM book_images WHERE book_id = ?";
    const [img] = await conn.query(imageSql, book_id);

    data["img"] = img;

    if (data) return res.status(StatusCodes.OK).json(data);
    else return res.status(StatusCodes.NOT_FOUND).end();
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  } finally {
    conn.releaseConnection();
  }
};

module.exports = { allBooks, bookDetail };
