const { StatusCodes } = require("http-status-codes");
const pool = require("../config/database");
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
    const [data] = await pool.query(allSelectSql, values);

    if (data.length) {
      return res.status(StatusCodes.OK).json(data);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.NOT_FOUND).end();
  }
};

const bookDetail = async (req, res) => {
  let { id: book_id } = req.params;
  const { user_id } = req.body;
  try {
    const bookDetailSql = `SELECT idx, title, (SELECT category_ko FROM categories WHERE categories.idx = books.category_id) AS category, 
    form, isbn, summary, detail, author, pages, contents, price, pub_date, (SELECT count(*) FROM likes WHERE book_id = idx ) AS likes, (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND book_id = idx)) AS liked FROM books where idx = ?`;
    const [[data]] = await pool.query(bookDetailSql, [user_id, book_id]);

    const imageSql =
      "SELECT image_path, main FROM book_images WHERE book_id = ?";
    const [img] = await pool.query(imageSql, book_id);

    data["img"] = img;

    if (data) return res.status(StatusCodes.OK).json(data);
    else return res.status(StatusCodes.NOT_FOUND).end();
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

const addBook = async (req, res) => {
  const {
    title,
    form,
    author,
    isbn,
    pages,
    summary,
    detail,
    contents,
    price,
    pub_date,
    images,
    category
  } = req.body;
  // 도서 등록하면 category로 category_id를 받아온다.

  const categorySelectSql = `SELECT idx FROM categories WHERE category_ko = ?`;
  let category_id;
  try {
    [[category_id]] = await pool.query(categorySelectSql, category);
    category_id = category_id.idx;
  } catch (err) {
    console.log(err);
  }

  // 받아온 id값을 추가하여 books 테이블에 정보 입력,
  const addBookSql = `INSERT INTO books (title, category_id, form, author, isbn, pages, summary, detail, contents, price, pub_date) VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
  const addValues = [
    title,
    category_id,
    form,
    author,
    isbn,
    pages,
    summary,
    detail,
    contents,
    price,
    pub_date
  ];
  let addResult;
  try {
    [addResult] = await pool.query(addBookSql, addValues);
  } catch (err) {
    console.log("books 등록 오류", err);
  }

  const addBookImagesSql = `INSERT INTO book_images (book_id, image_path, main) VALUES ?`;
  const addBookImagesValues = [];
  images.forEach((item) => {
    addBookImagesValues.push([addResult.insertId, item.image_path, item.main]);
  });

  try {
    await pool.query(addBookImagesSql, [addBookImagesValues]);
  } catch (err) {
    console.log(err);
  }
  // 정보 입력하면 해당 insertId 값을 받아와 book_images에 images 파일들 넣기
  res.json({
    message: "도서 등록"
  });
};
module.exports = { allBooks, bookDetail, addBook };
