const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize_conn = require('./models/dbconnection');
const staffmaster = require('./models/staffmaster');
const studentmaster = require('./models/studentmaster');
const department = require('./models/department');
const course = require('./models/course');
const coursemapping = require('./models/coursemapping');

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

        // Synchronize the course model
        await course.sync();

        // Synchronize the coursemapping model
        await coursemapping.sync();

        // Synchronize the department model
        await department.sync();
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

// const app = express();
// app.use(bodyParser.json());
// app.use(cors());

// app.post('/login', async (req, res) => {
//     const { staff_id, staff_password } = req.body;

//     try {
//         const user = await staffmaster.findOne({
//             where: {
//                 staff_id: staff_id,
//                 staff_password: staff_password
//             }
//         });

//         if (user) {
//             return res.status(200).json({ success: true, message: "Login Successful" });
//         } else {
//             return res.status(401).json({ success: false, message: "Invalid Credentials" });
//         }
//     } catch (error) {
//         console.error('Error during Login:', error);
//         return res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// });


// sequelize_conn.authenticate()

// .then(() => {
//     console.log('Database connected');
//     app.listen(5000, () => {
//         console.log('Server running on http://localhost:5000');
//     });
// })

// .catch(err => {
//     console.error('Unable to connect to the Database:', err);
// });