const { Sequelize } = require('sequelize');

const sequelize_conn = new Sequelize('obev2', 'root', 'Therasak.9025',
    {
        host: 'localhost',
        dialect: 'mysql',
        logging: false
    });

module.exports = sequelize_conn;