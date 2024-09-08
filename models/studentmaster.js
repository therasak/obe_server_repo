const { DataTypes } = require('sequelize');
const sequelize_conn = require('./dbconnection');

const studentmaster = sequelize_conn.define('studentmaster',
{
    s_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    stu_regno: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stu_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dept_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    section: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mentor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    emis: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, 
{
    timestamps: false,
    freezeTableName: true
});

module.exports = studentmaster;