const mysql = require('mysql2');


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

 pool.getConnection((err, connection) => { 
  if(err) console.log(err)
  console.log("Connected successfully")})

module.exports = pool.promise();

