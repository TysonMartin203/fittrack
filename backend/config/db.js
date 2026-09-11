const mysql = require('mysql2/promise');

// dateStrings: DATE columns come back as plain 'YYYY-MM-DD' strings instead of
// JS Date objects. Without this, a stored date like '2026-09-11' becomes a Date
// representing UTC midnight, which then displays as the *previous* day for
// anyone west of UTC once rendered with toLocaleDateString() — a classic
// off-by-one-day bug. Plain strings sidestep the whole class of problem.
const dateStrings = ['DATE'];

// Railway provides MYSQL_URL as a connection string, or individual vars
// Locally you use HOST/PORT/USER/PASSWORD/DATABASE from .env
const pool = mysql.createPool(
  process.env.MYSQL_URL
    ? { uri: process.env.MYSQL_URL, waitForConnections: true, connectionLimit: 10, dateStrings }
    : {
        host:     process.env.DB_HOST     || 'localhost',
        port:     parseInt(process.env.DB_PORT || '3306'),
        user:     process.env.DB_USER     || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME     || 'workout_tracker',
        waitForConnections: true,
        connectionLimit:    10,
        dateStrings,
      }
);

module.exports = pool;
