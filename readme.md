# Book Store

### 사용스킬

<a href="링크" target="_blank">
  <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=fff" />
</a>
<a href="링크" target="_blank">
  <img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=fff" />
</a>
<a href="링크" target="_blank">
  <img src="https://img.shields.io/badge/mariadb-003545?style=for-the-badge&logo=mariadb&logoColor=fff" />
</a>

## 프로젝트 목적

book store 사이트 개발을 위한 서버 및 API 구축

## 기능

- 회원 : 로그인시, JWT토큰을 이용한 인증/인가
- 장바구니
- 좋아요
- 결제
- 전체/카테고리별/신간 도서 조회
  - 전체도서는 category_id가 붙지 않으면 나옵니다.
  - query : category_id = 카테고리별로,
  - query : new = true 값일떄 신간 리스트,
  - query : sort = 정렬
  - ?category_id=0&new=true&sort=recent → 카테고리0번, 신간, 최신순으로
- 개별 도서 조회

## 프로젝트 기간

2023.12.28 ~

## 프로젝트 구조

app.js : 서버 구동
routes : API 경로를 설정
controller : 경로에 들어오면 작성한 코드 결과를 response로 전달

```
Bookstore
├─ app.js
├─ config
│  └─ database.js
├─ controllers
│  ├─ books.controller.js
│  ├─ carts.controller.js
│  ├─ category.controller.js
│  ├─ likes.controller.js
│  ├─ orders.controller.js
│  └─ users.controller.js
├─ data.sql
├─ middleware
│  └─ auth.js
├─ models
│  ├─ books.model.js
│  ├─ bookStoreSql.js
│  ├─ cart.model.js
│  ├─ category.model.js
│  ├─ likes.model.js
│  ├─ order.model.js
│  └─ users.model.js
├─ package-lock.json
├─ package.json
├─ readme.md
├─ services
│  ├─ books.service.js
│  ├─ cart.service.js
│  ├─ category.service.js
│  ├─ likes.service.js
│  ├─ order.service.js
│  └─ users.service.js
└─ utils
   └─ user.utils.js
```

## 이슈

- 2024.01.01 : [테이블 생성이 안되는 이슈 발견](https://code-dung.tistory.com/111)
- 2024.01.04 : [SubQuery 코드 작성 오류](https://code-dung.tistory.com/116)
