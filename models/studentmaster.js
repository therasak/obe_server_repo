const { DataTypes } = require('sequelize');
const sequelize_conn = require('./dbconnection');

const studentmaster = sequelize_conn.define('studentmaster',
{
    reg_no : {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    stu_name : {
        type: DataTypes.STRING,
        allowNull: false
    },
    course_id : {
        type: DataTypes.STRING,
        allowNull: false
    },
    college_code : {
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
    batch : {
        type: DataTypes.STRING,
        allowNull: false
    },
    mentor : {
        type: DataTypes.STRING,
        allowNull: false
    },
    emis : {
        type: DataTypes.STRING,
        allowNull: false
    }
}, 
{
    timestamps: false,
    freezeTableName: true
});

module.exports = studentmaster;