const pool = require("../config/database");
const bookStoreSql = require("./bookStoreSql");

const bookModel = {
  getAllBooks: async (bookListInfo) => {
    const conn = await pool.getConnection(async (conn) => conn);
    // sort, news, category, pages, limit = bookListInfo
    let pages = parseInt(bookListInfo.pages);
    let limit = parseInt(bookListInfo.limit);
    let category_id = parseInt(bookListInfo.category_id);

    let allSelectSql = bookStoreSql.select.getBooksDefault;
    let values = [];

    if (bookListInfo.category_id && bookListInfo.news) {
      allSelectSql += bookStoreSql.addsql.addCategoryAndNew;
      values = [category_id];
    } else if (bookListInfo.category_id) {
      allSelectSql += bookStoreSql.addsql.addCategory;
      values = [category_id];
    } else if (bookListInfo.news) {
      allSelectSql += bookStoreSql.addsql.addNew;
      values = [];
    }

    if (bookListInfo.sort) {
      if (bookListInfo.sort === "recent")
        allSelectSql += bookStoreSql.addsql.addSortRecent;
      else if (bookListInfo.sort === "reverseRecent")
        allSelectSql += bookStoreSql.addsql.addSortReverseRecent;
      else if (bookListInfo.sort === "highPopular")
        allSelectSql += bookStoreSql.addsql.addSortHighPop;
      else if (bookListInfo.sort === "lowPopular")
        allSelectSql += bookStoreSql.addsql.addSortLowPop;
    } else {
      allSelectSql += bookStoreSql.addsql.addSortPublish;
    }

    const offset = (pages - 1) * limit;
    if (pages && limit) {
      allSelectSql += bookStoreSql.addsql.addPageLimitAndOffset;
      values.push(limit, offset);
    }

    try {
      const [allBooksData] = await conn.query(allSelectSql, values);

      if (allBooksData.length) {
        return {
          success: true,
          msg: "데이터를 읽어오는데 성공했습니다.",
          data: allBooksData,
        };
      } else {
        throw new Error("데이터를 읽어오는데 실패했습니다.");
      }
    } catch (err) {
      return { success: false, msg: err.message };
    } finally {
      conn.release();
    }
  },
  getBook: async (bookId, tokenData) => {
    const conn = await pool.getConnection(async (conn) => conn);
    try {
      let bookDetailSql;
      let bookData;
      if (tokenData) {
        console.log("not token");
        bookDetailSql = bookStoreSql.select.getBookIsUser;
        [[bookData]] = await conn.query(bookDetailSql, [tokenData.idx, bookId]);
      } else {
        console.log("is token");
        bookDetailSql = bookStoreSql.select.getBookNotUser;
        [[bookData]] = await conn.query(bookDetailSql, bookId);
      }
      const imageSql = bookStoreSql.select.getBookImages;
      const [img] = await conn.query(imageSql, bookId);

      bookData["img"] = img;

      if (bookData)
        return { success: true, msg: "데이터 수집 완료", data: bookData };
      else throw new Error("데이터 수집 실패");
    } catch (err) {
      return { success: false, msg: err.message };
    } finally {
      conn.release();
    }
  },
};

module.exports = { bookModel };
