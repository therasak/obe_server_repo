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
        allowNull: false
    },
    graduate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    programme: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dept_hod: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, 
{
    timestamps: false,
    freezeTableName: true
});

module.exports = department;