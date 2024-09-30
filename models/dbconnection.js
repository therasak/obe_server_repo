const { Sequelize } = require('sequelize');

<<<<<<< HEAD
const sequelize_conn = new Sequelize('obev2', 'root', 'Therasak.9025',
=======
const sequelize_conn = new Sequelize('obev2', 'root', 'hamdhan2003',
>>>>>>> b5c722226a926dbeb962de851ac922a7d1f537ef
    {
        host: 'localhost',
        dialect: 'mysql',
        logging: false
    });

module.exports = sequelize_conn;