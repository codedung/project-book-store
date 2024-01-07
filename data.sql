-- 도서 삽입 SQL
INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("어린왕자들", "종이책", 0, "어리다..", "많이 어리다..", "김어림", 100, "목차입니다", "20000", "2019-01-01");

-- books와 categories 테이블 JOIN → 도서상세조회
SELECT b.idx, b.title, c.category_ko as category, b.form, b.isbn, b.summary, b.detail, b.author, b.pages, b.contents, b.price, b.pub_date 
FROM books as b left 
JOIN categories as c 
ON b.category_id = c.idx 
WHERE b.idx = ?

-- 전체 조회 시 main이 1인 이미지만 노출이 되게 설정, 없으면...?
SELECT b.idx, b.title, bi.path as main_image, b.summary, b.author, b.price, b.pub_date 
FROM Bookstore.books as b LEFT 
JOIN Bookstore.book_images as bi 
ON b.idx = bi.book_id 
WHERE bi.main = 1;

-- 오늘날짜로부터 한달전 데이터만 불러오기
SELECT * FROM books WHERE pub_date >= date_add(now(), interval -30 day);
-- SELECT * FROM books WHERE pub_date >= date_sub(now(), interval 30 day);


-- 전체 도서 조회
select b.idx, b.title, bi.path as main_image, b.summary, b.author, b.price, b.pub_date, likes
FROM books as b LEFT JOIN (select book_id, path from book_images where main = 1) as bi ON b.idx = bi.book_id 
left join (select book_id ,count(*) as likes from likes group by likes.book_id) as bl ON b.idx = bl.book_id WHERE bi.main = 1 
ORDER BY idx DESC
-- 전체/최신 도서 조회 (전체)
select b.idx, b.title, bi.path as main_image, b.summary, b.author, b.price, b.pub_date, likes
FROM books as b LEFT JOIN (select book_id, path from book_images where main = 1) as bi ON b.idx = bi.book_id 
left join (select book_id ,count(*) as likes from likes group by book_id) as bl ON b.idx = bl.book_id WHERE bi.main = 1
ORDER BY pub_date DESC
-- 전체/좋아요 도서 조회
select b.idx, b.title, bi.path as main_image, b.summary, b.author, b.price, b.pub_date, likes
FROM books as b LEFT JOIN (select book_id, path from book_images where main = 1) as bi ON b.idx = bi.book_id 
left join (select book_id ,count(*) as likes from likes group by book_id) as bl ON b.idx = bl.book_id WHERE bi.main = 1 
ORDER BY likes DESC
-- 전체/신간 도서 조회 (30일이내)
select b.idx, b.title, b.category_id,  bi.path as main_image, b.summary, b.author, b.price, b.pub_date, likes
FROM books as b LEFT JOIN (select book_id, path from book_images where main = 1) as bi ON b.idx = bi.book_id 
left join (select book_id ,count(*) as likes from likes group by book_id) as bl ON b.idx = bl.book_id 
WHERE b.pub_date >= date_sub(now(), interval 30 day)
ORDER BY pub_date DESC

-- 좋아요 추가
INSERT INTO likes (user_id, book_id) VALUES (1,1);
-- 좋아요 삭제
DELETE FROM likes WHERE user_id = 1 AND book_id = 2;

-- 전체 목록 join을 사용하지 않고 likes 추가하기 -> 비추천 (스칼라쿼리)
SELECT idx, title, category_id, (SELECT image_path FROM book_images WHERE main = 1 and book_id = idx) AS main_image, summary, author, price, pub_date, (SELECT count(*) FROM likes WHERE book_id = idx ) AS likes FROM books;

-- 전체목록은 join을 사용하여 likes와 image_path를 전달하도록 하자
SELECT b.idx, title, category_id, image_path as main_image, summary, author, price, pub_date, likes 
FROM books AS b LEFT JOIN (SELECT * FROM book_images WHERE main = 1) AS bi ON b.idx = bi.book_id 
LEFT JOIN (SELECT *, count(*) AS likes from likes GROUP BY book_id) AS bl ON b.idx = bl.book_id

-- join을 사용하지 않고, likes와 liked 추가 AND category가 한국어로 나올 수 있게 category_ko를 category로 명칭을 수정함
SELECT idx, title, (SELECT category_ko FROM categories WHERE categories.idx = books.category_id) AS category, 
form, isbn, summary, detail, author, pages, contents, price, pub_date, (SELECT count(*) FROM likes WHERE book_id = idx ) AS likes, (SELECT EXISTS (SELECT * FROM likes WHERE user_id = 1 AND book_id = idx)) AS liked FROM books where idx = 1