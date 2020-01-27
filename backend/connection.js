const mysql = require("mysql");

var mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "userdb",
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (err) {
        console.log('Database is not Connected', err)
    }
    else {
        console.log('Database is connected.')
    }
});

module.exports = mysqlConnection;