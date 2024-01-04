const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();
const conn = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 10,
  dateStrings: true
});

module.exports = conn;
