const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Student',
    database: process.env.DB_NAME || 'AutoSalon'
});

let cart = [];

module.exports = {
    pool: pool.promise(),
    cart: cart
};