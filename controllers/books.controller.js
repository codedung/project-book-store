const { StatusCodes } = require("http-status-codes");
const { bookService } = require("../services/books.service");

/* 
  sort=recent 출판순, sort=popular 인기순, sort=sale 판매량, default값은 등록번호
*/
const booksOutput = {
  getAllBooks: async (req, res) => {
    const bookListInfo = req.query; // sort, news, category, pages, limit

    const allBooksData = await bookService.allbooksData(bookListInfo);
    if (allBooksData.success) {
      return res.status(StatusCodes.OK).json(allBooksData.data);
    }
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: allBooksData.msg,
    });
  },
  getDetailBook: async (req, res) => {
    let { id: bookId } = req.params;
    const tokenData = req.tokenData;

    let bookData;
    if (tokenData) {
      bookData = await bookService.bookData(bookId, tokenData);
    } else {
      bookData = await bookService.bookData(bookId);
    }
    if (bookData.success) {
      return res.status(StatusCodes.OK).json(bookData.data);
    }

    return res.status(StatusCodes.NOT_FOUND).json({ msg: bookData.msg });
  },
};

module.exports = { booksOutput };
