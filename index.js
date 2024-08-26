const sequelize_conn = require('./models/dbconnection');
const staffmaster = require('./models/staffmaster');
const studentmaster = require('./models/studentmaster');

async function dbconncheck() 
{
    try {
        // Authenticate the connection
        await sequelize_conn.authenticate();
        console.log('Database Synced');

        // Synchronize the staffmaster model
        await staffmaster.sync();

        // Synchronize the studentmaster model
        await studentmaster.sync();
    } 

    catch (error) {
        console.log('Error Occurred:', error.message);
    } 

    finally {
        // Close the database connection
        await sequelize_conn.close();
    }
}

dbconncheck();