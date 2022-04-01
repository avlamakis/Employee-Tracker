const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

// Connect to database
const db = mysql.createConnection(
  {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  }
);

db.connect(function(err){
  if(err) throw err;
  console.log("SQL Connected!")
});


module.exports = db;