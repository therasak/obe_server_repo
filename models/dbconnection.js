const { Sequelize } = require('sequelize');

const sequelize_conn = new Sequelize('obev2', 'root', 'haneef9498',
    {
        host: 'localhost',
        dialect: 'mysql',
        logging: false
    });

module.exports = sequelize_conn;