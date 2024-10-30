const { DataTypes } = require('sequelize');
const sequelize_conn = require('./dbconnection');

const calculation = sequelize_conn.define('calculation',
{
    s_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    active_sem: {
        type: DataTypes.STRING,
        allowNull: true
    },
    c1lot: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    c1mot: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    c1hot: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    c2lot: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    c2mot: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    c2hot: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    a1lot: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    a1mot: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    a1mhot: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    a2lot: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    a2mot: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    a2hot: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    clot: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    cmot: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    chot: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    elot: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    emmot: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    ehot: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    l1soug: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    l2soug: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    l3soug: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    l4soug: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    l1sopg: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    l2sopg: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    l3sopg: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    l4sopg: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
},
{
    timestamps: false,
    freezeTableName: true
});

module.exports = calculation;