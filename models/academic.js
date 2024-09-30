const { DataTypes } = require('sequelize');
const sequelize_conn = require('./dbconnection');

const academic = sequelize_conn.define('academic', 
{
	s_no: {
		type: DataTypes.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	academic_year: {
		type: DataTypes.STRING,
		allowNull: false,
	},
    sem: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	active_sem:{
		type: DataTypes.INTEGER,
		allowNull: false
	}
}, 
{
    timestamps: false,
    freezeTableName: true
});

module.exports = academic;    
