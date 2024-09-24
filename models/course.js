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
        allowNull: true
    },
    dept_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    course_part: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cia_mark: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    ese_mark: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, 
{
    timestamps: false,
    freezeTableName: true
});

module.exports = course;