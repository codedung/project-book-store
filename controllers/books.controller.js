const { StatusCodes } = require("http-status-codes");
const conn = require("../config/database");
const dotevn = require("dotenv");
dotevn.config();

/* 
구현하고 싶은것,
1. 전체 목록조회 > books 테이블과 book_images 테이블 JOIN 후 main 이미지 가 1인 데이터만 select, 
2. 상세 도서 조회 > books테이블과, book_categories를 join하고, book_images 테이블에서 book_id값을 받아 이미지를 배열에 넣어서 data에 추가
3. 카테고리별 도서 조회 > 쿼리로 받을지 파람스로 받을지 잘 모르겠음..
4. 정렬 (최신순 ORDER BY IDX, 인기순 ORDER BY likes, 판매순 미정), 정렬은 전체에 해당하기 때문에 고민을 좀 해봐야할것같음. 
  - 정렬은 일단 query로 받아서 sort=recent 출판 역순, sort=popular, sort=sale 판매량 역순, sort=new 신간역순 default값은 idx 역순값
*/
const allBooks = async (req, res) => {
  let { sort, news, category_id, pages, limit } = req.query;
  pages = parseInt(pages);
  limit = parseInt(limit);

  let allSelectSql = `SELECT b.idx, b.title, b.category_id, bi.path as main_image, b.summary, b.author, b.price, b.pubDate, bl.likes FROM books as b LEFT JOIN (SELECT book_id, path, main FROM book_images WHERE main = 1) as bi ON b.idx = bi.book_id left join (select book_id ,count(*) as likes from likes group by book_id) as bl ON b.idx = bl.book_id`;
  let values = [];
  if (category_id && news) {
    allSelectSql += ` WHERE category_id = ? b.pubDate >= date_sub(now(), interval 30 day)`;
    values = [category_id];
  } else if (category_id) {
    allSelectSql += ` WHERE category_id = ?`;
    values = [category_id];
  } else if (news) {
    allSelectSql += ` WHERE b.pubDate >= date_sub(now(), interval 30 day)`;
    values = [];
  }

  if (sort) {
    if (sort === "recent") allSelectSql += ` ORDER BY b.pubDate DESC`;
    else if (sort === "reverseRecent")
      allSelectSql += ` ORDER BY b.pubDate ASC`;
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

  console.log(allSelectSql);

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
  let { id } = req.params;
  try {
    const bookDetailSql = `SELECT b.idx, b.title, c.category_ko as category, b.form, b.isbn, b.summary, b.detail, b.author, b.pages, b.contents, b.price, b.pubDate 
      FROM books as b left 
      JOIN categories as c 
      ON b.category_id = c.idx 
      WHERE b.idx = ?`;
    const [[data]] = await conn.query(bookDetailSql, [id]);

    const imageSql = "SELECT path, main FROM book_images WHERE book_id = ?";
    const [img] = await conn.query(imageSql, id);

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
