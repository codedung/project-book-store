const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const usersRouter = require("./routes/users.routes");
const booksRouter = require("./routes/books.routes");
const categoryRouter = require("./routes/category.routes");
const ordersRouter = require("./routes/orders.routes");
const cartsRouter = require("./routes/carts.routes");
const likesRouter = require("./routes/likes.routes");
const { auth } = require("./middleware/auth");

app.use(auth);
app.use(express.json());
app.use(cookieParser());
app.use("/", usersRouter);
app.use("/books", booksRouter);
app.use("/category", categoryRouter);
app.use("/orders", ordersRouter);
app.use("/carts", cartsRouter);
app.use("/likes", likesRouter);

app.listen(process.env.PORT, () => console.log(`PORT${process.env.PORT} 접속`));
