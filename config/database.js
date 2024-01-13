const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

const pool = mysql.createPool({
  host: DB_HOST || "localhost",
  user: DB_USER || "root",
  password: DB_PASSWORD,
  database: DB_DATABASE,
  connectionLimit: 10,
  dateStrings: true
});

module.exports = pool;
