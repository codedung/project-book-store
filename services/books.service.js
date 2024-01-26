const { bookModel } = require("../models/books.model");

const bookService = {
  allbooksData: async (bookListInfo) => {
    const allBooksResult = await bookModel.getAllBooks(bookListInfo);
    return allBooksResult;
  },
  bookData: async (bookId, tokenData) => {
    const detailBookResult = await bookModel.getBook(bookId, tokenData);
    return detailBookResult;
  },
};

module.exports = { bookService };
