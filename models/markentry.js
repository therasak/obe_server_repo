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
    }
    // C1LOT: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
    // C1MOT: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
    // C1HOT: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
    // C1TOTAL: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
    // C2LOT: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
    // C2MOT: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
    // C2HOT: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
    // C2TOTAL: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
    
},
{
    timestamps: false,
    freezeTableName: true
});

module.exports = markentry;