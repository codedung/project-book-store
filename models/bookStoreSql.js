const bookStoreSql = {
  select: {
    getUser: `SELECT * FROM users WHERE id = ?`,
    getBooksDefault: `SELECT b.idx, title, category_id, image_path as main_image, summary, author, price, pub_date, likes FROM books AS b LEFT JOIN (SELECT * FROM book_images WHERE main = 1) AS bi ON b.idx = bi.book_id LEFT JOIN (SELECT *, count(*) AS likes from likes GROUP BY book_id) AS bl ON b.idx = bl.book_id`,
    getBookIsUser: `SELECT idx, title, (SELECT category_ko FROM categories WHERE categories.idx = books.category_id) AS category, form, isbn, summary, detail, author, pages, contents, price, pub_date, (SELECT count(*) FROM likes WHERE book_id = idx ) AS likes, (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND book_id = idx)) AS liked FROM books where idx = ?`,
    getBookNotUser: `SELECT idx, title, (SELECT category_ko FROM categories WHERE categories.idx = books.category_id) AS category, form, isbn, summary, detail, author, pages, contents, price, pub_date, (SELECT count(*) FROM likes WHERE book_id = idx ) AS likes FROM books where idx = ?`,
    getBookImages: `SELECT image_path, main FROM book_images WHERE book_id = ?`,
    getCartDefault: `SELECT c.idx, book_id, title, summary, count, price FROM carts AS c LEFT JOIN books AS b ON c.book_id = b.idx WHERE user_id = ?`,
    getCategory: `SELECT * FROM categories`,
    getOrderInfo: `SELECT o.idx as id, create_at, address, receiver, contact, (SELECT title FROM books WHERE idx = (SELECT book_id FROM order_books where order_id = o.idx  LIMIT 1)) as title, total_count, total_price FROM orders as o LEFT JOIN deliveries as d ON o.delivery_id = d.id WHERE o.user_id = ? ORDER BY idx DESC`,
    getOrderSelectedData: `SELECT book_id, count FROM carts WHERE idx IN (?)`,
    getOrderUser: `SELECT user_id FROM orders WHERE idx = ?`,
    getOrderDetailData: `SELECT book_id, title, author, price, count FROM order_books LEFT JOIN books ON order_books.book_id = books.idx WHERE order_id = ?`,
  },
  insert: {
    createUser: `INSERT INTO users (id, password, name, salt) values ( ?,?,?,? )`,
    insertCart: `INSERT INTO carts (user_id, book_id, count) VALUES (?,?,?)`,
    insertLike: `INSERT INTO likes (user_id, book_id) VALUES (?,?)`,
    insertDelivery: `INSERT INTO deliveries (user_id, delivery_name, receiver, address, contact) VALUES (?,?,?,?,?)`,
    insertOrder: `INSERT INTO orders (user_id, delivery_id, total_count, total_price) VALUES (?,?,?,?)`,
    insertOrderBooks: `INSERT INTO order_books (order_id, book_id, count) VALUES ?`,
  },
  delete: {
    deleteLike: `DELETE FROM likes WHERE user_id = ? AND book_id = ?`,
    deleteCartOneItem: `DELETE FROM carts WHERE idx = ?`,
    deleteCartItem: `DELETE FROM carts WHERE idx IN (?)`,
  },
  update: {
    resetUserPassword: `UPDATE users SET password = ?, salt =? WHERE idx = ?`,
  },
  addsql: {
    addCategoryAndNew: ` WHERE category_id = ? AND b.pub_date >= date_sub(now(), interval 30 day)`,
    addCategory: ` WHERE category_id = ?`,
    addNew: ` WHERE b.pub_date >= date_sub(now(), interval 30 day)`,
    addSortRecent: ` ORDER BY b.pub_date DESC`,
    addSortReverseRecent: ` ORDER BY b.pub_date ASC`,
    addSortHighPop: ` ORDER BY bl.likes DESC`,
    addSortLowPop: ` ORDER BY bl.likes ASC`,
    addSortPublish: ` ORDER BY b.idx DESC`,
    addPageLimitAndOffset: ` LIMIT ? OFFSET ?`,
    addCartSelectedList: ` AND c.idx IN (?)`,
  },
};

module.exports = bookStoreSql;
