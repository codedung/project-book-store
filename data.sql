-- 도서 삽입 SQL
INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pubDate)
VALUES ("어린왕자들", "종이책", 0, "어리다..", "많이 어리다..", "김어림", 100, "목차입니다", "20000", "2019-01-01");

-- books와 categories 테이블 JOIN → 도서상세조회
SELECT b.idx, b.title, c.category_ko as category, b.form, b.isbn, b.summary, b.detail, b.author, b.pages, b.contents, b.price, b.pubDate 
FROM books as b left 
JOIN categories as c 
ON b.category_id = c.idx 
WHERE b.idx = ?

-- 전체 조회 시 main이 1인 이미지만 노출이 되게 설정, 없으면...?
SELECT b.idx, b.title, bi.path as main_image, b.summary, b.author, b.price, b.pubDate 
FROM Bookstore.books as b LEFT 
JOIN Bookstore.book_images as bi 
ON b.idx = bi.book_id 
WHERE bi.main = 1;

-- 오늘날짜로부터 한달전 데이터만 불러오기
SELECT * FROM books WHERE pubDate >= date_add(now(), interval -30 day);
-- SELECT * FROM books WHERE pubDate >= date_sub(now(), interval 30 day);


-- 전체 도서 조회
select b.idx, b.title, bi.path as main_image, b.summary, b.author, b.price, b.pubDate, likes
FROM books as b LEFT JOIN (select book_id, path from book_images where main = 1) as bi ON b.idx = bi.book_id 
left join (select book_id ,count(*) as likes from likes group by likes.book_id) as bl ON b.idx = bl.book_id WHERE bi.main = 1 
ORDER BY idx DESC
-- 전체/최신 도서 조회 (전체)
select b.idx, b.title, bi.path as main_image, b.summary, b.author, b.price, b.pubDate, likes
FROM books as b LEFT JOIN (select book_id, path from book_images where main = 1) as bi ON b.idx = bi.book_id 
left join (select book_id ,count(*) as likes from likes group by book_id) as bl ON b.idx = bl.book_id WHERE bi.main = 1
ORDER BY pubDate DESC
-- 전체/좋아요 도서 조회
select b.idx, b.title, bi.path as main_image, b.summary, b.author, b.price, b.pubDate, likes
FROM books as b LEFT JOIN (select book_id, path from book_images where main = 1) as bi ON b.idx = bi.book_id 
left join (select book_id ,count(*) as likes from likes group by book_id) as bl ON b.idx = bl.book_id WHERE bi.main = 1 
ORDER BY likes DESC
-- 전체/신간 도서 조회 (30일이내)
select b.idx, b.title, b.category_id,  bi.path as main_image, b.summary, b.author, b.price, b.pubDate, likes
FROM books as b LEFT JOIN (select book_id, path from book_images where main = 1) as bi ON b.idx = bi.book_id 
left join (select book_id ,count(*) as likes from likes group by book_id) as bl ON b.idx = bl.book_id 
WHERE b.pubDate >= date_sub(now(), interval 30 day)
ORDER BY pubDate DESC
