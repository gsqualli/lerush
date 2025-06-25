const mysql = require('mysql')
require('dotenv').config();


module.exports = mysql.createConnection ({
     host                : process.env.DB_HOST,
     user                : process.env.DB_USER,
     password            : process.env.DB_PWD,
     database            : process.env.DB_NAME,
     port                : 3306,
     charset             : 'utf8_general_ci',
     multipleStatements  : true
 })
