const { DataTypes } = require('sequelize');
const sequelize_conn = require('./dbconnection');

const department = sequelize_conn.define('department',
{
    dept_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    dept_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    graduate: {
        type: DataTypes.STRING,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    programme: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    dept_hod: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, 
{
    timestamps: false,
    freezeTableName: true
});

module.exports = department;