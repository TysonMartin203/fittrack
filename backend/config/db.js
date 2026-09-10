const mysql = require('mysql2/promise');

// Railway provides MYSQL_URL as a connection string, or individual vars
// Locally you use HOST/PORT/USER/PASSWORD/DATABASE from .env
const pool = mysql.createPool(
  process.env.MYSQL_URL
    ? { uri: process.env.MYSQL_URL, waitForConnections: true, connectionLimit: 10 }
    : {
        host:     process.env.DB_HOST     || 'localhost',
        port:     parseInt(process.env.DB_PORT || '3306'),
        user:     process.env.DB_USER     || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME     || 'workout_tracker',
        waitForConnections: true,
        connectionLimit:    10,
      }
);

module.exports = pool;
