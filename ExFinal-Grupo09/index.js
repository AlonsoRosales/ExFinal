const mysql = require('mysql2');

const pool = mysql.createPool({
    host:
    user:
    password:
    database:
    port: 3306,
    ssl:{
        rejectUnauthorized:
        ca:
    }
});





module.exports = async function (context, req) {
   
}