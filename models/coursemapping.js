const { DataTypes } = require('sequelize');
const sequelize_conn = require('./dbconnection');

const coursemapping = sequelize_conn.define('coursemapping',
    {
        s_no: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        batch: {
            type: DataTypes.STRING,
            allowNull: false
        },
        degree: {
            type: DataTypes.STRING,
            allowNull: false
        },
        branch: {
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
        },
        staff_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        staff_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        course_title: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    });

module.exports = coursemapping;