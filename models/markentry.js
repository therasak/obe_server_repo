const { DataTypes } = require('sequelize');
const sequelize_conn = require('./dbconnection');

const markentry = sequelize_conn.define('markentry',
{
    s_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    batch: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    course_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reg_no: {
        type: DataTypes.STRING,
        allowNull: false
    },
    course_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    c1_lot: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    c1_hot: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    c1_mot: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    c1_total: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    c2_lot: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    c2_hot: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    c2_mot: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    c2_total: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    a1_lot: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    a2_lot: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ese_lot: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ese_hot: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ese_mot: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ese_total: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
{
    timestamps: false,
    freezeTableName: true
});

module.exports = markentry;