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
    staff_password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    staff_deptid: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, 
{
    timestamps: false,
    freezeTableName: true
});

module.exports = staffmaster;