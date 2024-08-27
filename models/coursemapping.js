const { DataTypes } = require('sequelize');
const sequelize_conn = require('./dbconnection');

const coursemapping = sequelize_conn.define('coursemapping',
{
    s_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement:true
    },
    staff_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dept_id: {
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
    course_code: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, 
{
    timestamps: false,
    freezeTableName: true
});

module.exports = coursemapping;