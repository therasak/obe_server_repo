const { DataTypes } = require('sequelize');
const sequelize_conn = require('./dbconnection');

const coursemapping = sequelize_conn.define('coursemapping',
{
    staff_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
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