const { DataTypes } = require('sequelize');
const sequelize_conn = require('./dbconnection');

const course = sequelize_conn.define('course',
{
    course_code: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    course_title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dept_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    course_part: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, 
{
    timestamps: false,
    freezeTableName: true
});

module.exports = course;