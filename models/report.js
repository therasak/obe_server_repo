const { DataTypes } = require('sequelize');
const sequelize_conn = require('./dbconnection');

const report = sequelize_conn.define('report', 
{
	s_no: {
		type: DataTypes.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	course_code: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	category: {
		type: DataTypes.STRING,
		allowNull: true
	},
	section: {
		type: DataTypes.STRING,
		allowNull: true
	},
	dept_name: {
		type: DataTypes.STRING,
		allowNull: true
	},
	cia_1: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	cia_2: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	ass_1: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	ass_2: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	ese: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	active_sem: {
        type: DataTypes.STRING,
        allowNull: true
    }
},
{
	timestamps: false,
	freezeTableName: true
});

module.exports = report;