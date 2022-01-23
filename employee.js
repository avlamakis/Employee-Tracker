// List the dependencies here.
const Sequelize = require('sequelize');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const util = require('util');


// Create the connection to MySQL WorkBench
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW,{
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    database: 'employees_db'
});
sequelize.connect(err => {
    if (err) throw err;
    prompt();
});