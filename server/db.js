const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'admin_project',
  waitForConnections: true,
  connectionLimit: 1000,
  queueLimit: 0
});



module.exports = pool;
