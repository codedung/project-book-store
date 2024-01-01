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

## 프로젝트 기간

2023.12.28 ~

## 프로젝트 구조

app.js : 서버 구동
routes : controller의 일부로 API 경로를 설정하는 코드

```
project-book-store
├─ .env
├─ app.js
└─ routes
   ├─ books.routes.js
   ├─ carts.routes.js
   ├─ likes.routes.js
   ├─ orders.routes.js
   └─ users.routes.js
```

## 이슈

- 2024.01.01 : [테이블 생성이 안되는 이슈 발견](https://code-dung.tistory.com/111)
