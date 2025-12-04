const mysql = require('mysql2');

const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME
} = process.env;

if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    throw new Error('Database environment variables are not set. Please set DB_HOST, DB_USER, DB_PASSWORD and DB_NAME.');
}

const pool = mysql.createPool({
    connectionLimit: 10,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
});

let cart = [];

module.exports = {
    pool: pool.promise(),
    cart: cart
};