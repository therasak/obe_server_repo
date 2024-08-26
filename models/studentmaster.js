const { DataTypes } = require('sequelize');
const sequelize_conn = require('./dbconnection');

const studentmaster = sequelize_conn.define('studentmaster',
{
    stu_regno: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    student_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stu_deptid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stu_category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stu_sem: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stud_sec: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stu_mentor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stu_emis: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, 
{
    timestamps: false,
    freezeTableName: true
});

module.exports = studentmaster;