const { DataTypes } = require('sequelize');
const sequelize_conn = require('./dbconnection');

const scope = sequelize_conn.define('scope',
{
    staff_id : {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    dashboard : {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    course_list: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    report : {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    upload_files : {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    logout: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, 
{
    timestamps: false,
    freezeTableName: true
});

module.exports = scope;