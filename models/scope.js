const { DataTypes } = require('sequelize');
const sequelize_conn = require('./dbconnection');

const scope = sequelize_conn.define('scope',
{
    staff_id : {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    dashboard : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    mark_entry: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    report : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    logout: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, 
{
    timestamps: false,
    freezeTableName: true
});

module.exports = scope;