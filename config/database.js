const mysql = require('mysql2');

const dbConfig = {
  host: 'bjkqndthgwwust4zkcgg-mysql.services.clever-cloud.com',
  user: 'ukoig7bwicd8xc3i',
  password: 'FM3BtpNBuNbtRffxa5ub',
  database: 'bjkqndthgwwust4zkcgg'
};

// Crea un pool de conexiones
const pool = mysql.createPool(dbConfig);

// Exporta el pool de conexiones para que puedas usarlo en otros módulos
module.exports = pool.promise();

