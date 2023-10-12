const mysql = require('mysql2');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

// Crea un pool de conexiones
const pool = mysql.createPool(dbConfig);

// Exporta el pool de conexiones para que puedas usarlo en otros módulos
module.exports = pool.promise();

