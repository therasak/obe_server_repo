const { DataTypes } = require('sequelize');
const sequelize_conn = require('./dbconnection');

const studentmaster = sequelize_conn.define('studentmaster',
{
    Reg_no : {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    Name : {
        type: DataTypes.STRING,
        allowNull: false
    },
    Course_Id : {
        type: DataTypes.STRING,
        allowNull: false
    },
    College_code : {
        type: DataTypes.STRING,
        allowNull: false
    },
    Semester: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Section: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Batch : {
        type: DataTypes.STRING,
        allowNull: false
    },
    Mentor : {
        type: DataTypes.STRING,
        allowNull: false
    },
    EMIS : {
        type: DataTypes.STRING,
        allowNull: false
    }
}, 
{
    timestamps: false,
    freezeTableName: true
});

module.exports = studentmaster;