const { DataTypes } = require('sequelize');
const sequelize_conn = require('./dbconnection');

const staffmaster = sequelize_conn.define('staffmaster', 
{
    staff_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    staff_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    staff_pass: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dept_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, 
{
    timestamps: false,
    freezeTableName: true
});

module.exports = staffmaster;