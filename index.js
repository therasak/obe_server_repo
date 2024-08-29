const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize_conn = require('./models/dbconnection');
const staffmaster = require('./models/staffmaster');
const studentmaster = require('./models/studentmaster');
const department = require('./models/department');
const course = require('./models/course');
const coursemapping=require('./models/coursemapping');

// async function dbconncheck() 
// {
//     try {
//         // Authenticate the connection
//         await sequelize_conn.authenticate();
//         console.log('Database Synced');

//         // Synchronize the staffmaster model
//         await staffmaster.sync();

//         // Synchronize the studentmaster model
//         await studentmaster.sync();

//         // Synchronize the course model
//         await course.sync();

//         // Synchronize the coursemapping model
//         await coursemapping.sync();

//         // Synchronize the department model
//         await department.sync();
//     } 

//     catch (error) {
//         console.log('Error Occurred:', error.message);
//     } 

//     finally {
//         // Close the database connection
//         await sequelize_conn.close();
//     }
// }

// dbconncheck();

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/login', async (req, res) => {
    const { staff_id, staff_pass } = req.body;

    try {
        const user = await staffmaster.findOne({
            where: { staff_id: staff_id }
        });
        const user1=coursemapping.findAll({
            where :{staff_id : staff_id}
        }
        );
        
        if (user) {
            if (user.staff_pass === staff_pass) {
                return res.json({ success: true, message: "Login Successful" });
            } 
            else {
                return res.json({ success: false, message: "Invalid Password" });
            }
        } 
        else {
            return res.json({ success: false, message: "User Not Found" });
        }
    } 
    catch (error) {
        console.error('Error during Login:', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

app.post('/login', async (req, res) => {
    const { staff_id } = req.body;

try{
    const user1=coursemapping.findAll({
        where :{staff_id : staff_id}
    }
    )
    console.log(user1);
}catch(error)
{
    console.error('Error during Login:', error);
    // return res.status(500).json({ success: false, message: "Internal Server Error" });
}
})
sequelize_conn.authenticate()
    .then(() => {
        console.log('Database connected');
        app.listen(5000, () => {
            console.log('Server running on http://localhost:5000');
        });
    })
    .catch(err => {
        console.error('Unable to connect to the Database:', err);
    });


app.get('/coursemap', async (req, res) => {
    try {
        const courseMappings = await coursemapping.findAll();
        res.json(courseMappings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});