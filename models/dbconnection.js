const { Sequelize } = require('sequelize');

const sequelize_conn = new Sequelize('obev2', 'root', 'haneef9498', 
{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize_conn;