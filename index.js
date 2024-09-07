const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize_conn = require('./models/dbconnection');
const staffmaster = require('./models/staffmaster');
const studentmaster = require('./models/studentmaster');
const department = require('./models/department');
const course = require('./models/course');
const coursemapping=require('./models/coursemapping');
const XLSX = require('xlsx');
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------------- //

// Tables ( Model ) Synchronization Coding

// async function dbconncheck() 
// {
//     try {
//         // // Authenticate the connection
//         // await sequelize_conn.authenticate();
//         // console.log('Database Synced');

//         // // Synchronize the staffmaster model
//         // await staffmaster.sync();
//         // console.log('Staffmaster Table Synced');

//         // // Synchronize the studentmaster model
//         // await studentmaster.sync();
//         // console.log('Studentmaster Table Synced');

//         // // Synchronize the course model
//         // await course.sync();
//         // console.log('Course Table Synced');

//         // // Synchronize the coursemapping model
//         // await coursemapping.sync();
//         // console.log('Coursemapping Table Synced');

//         // // Synchronize the department model
//         // await department.sync();
//         // console.log('Deparment Table Synced');
//     } 
//     catch (error) {
//         console.log('Error Occurred:', error.message);
//     }
// }

// dbconncheck();

// ---------------------------------------------------------------------------------- //

// Import Staff Data Into Database

// const staffmasterDataXL = XLSX.readFile('C:\\Users\\Lenovo PC\\OneDrive\\Documents\\Obe Data Files\\Staff Master Dup.xlsx');
// const staffmasterSheetNo = staffmasterDataXL.SheetNames[0]; 
// const staffmasterWorksheet = staffmasterDataXL.Sheets[staffmasterSheetNo];
// const staffdata = XLSX.utils.sheet_to_json(staffmasterWorksheet);
// const staffImportData = async () => 
// {
//     try {
//         const staffExistingRecords = await staffmaster.findAll();
//         if (staffExistingRecords.length > 0) {
//             await staffmaster.destroy({ where: {} });
//             console.log('Existing records deleted.');
//             }
//         await staffmaster.bulkCreate(staffdata, { ignoreDuplicates: true });
//         console.log('Staff Master data inserted successfully!');
//     } 
//     catch (err) {
//         console.error('Error Importing Data :', err);
//     }
// };

// staffImportData();

// ---------------------------------------------------------------------------------- //

// Import Course Mapping Data Into Database

// const coursemappingDataXL = XLSX.readFile('C:\\Users\\Lenovo PC\\OneDrive\\Documents\\Obe Data Files\\Course Mapping Dup.xlsx');
// const coursemappingSheetNo = coursemappingDataXL.SheetNames[0]; 
// const coursemappingWorksheet = coursemappingDataXL.Sheets[coursemappingSheetNo];
// const coursemappingdata = XLSX.utils.sheet_to_json(coursemappingWorksheet);
// const courseMappingImportData = async () => 
// {
//     try {
//         const coursemappingExistingRecords = await staffmaster.findAll();
//         if (coursemappingExistingRecords.length > 0) {
//             await coursemapping.destroy({ where: {} });
//             console.log('Existing records deleted.');
//         }
//         await sequelize_conn.query('ALTER TABLE coursemapping AUTO_INCREMENT = 1');
//         await coursemapping.bulkCreate(coursemappingdata, { ignoreDuplicates: true });
//         console.log('Course Mapping data inserted successfully!');
//     } 
//     catch (err) {
//         console.error('Error Importing Data :', err);
//     }
// };

// courseMappingImportData();

// ---------------------------------------------------------------------------------- //

// Validation Coding

app.post('/login', async (req, res) => 
{
    const { staff_id, staff_pass } = req.body;

    try {
        const user = await staffmaster.findOne({
            where: { staff_id: staff_id }
        });
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

// ---------------------------------------------------------------------------------- //

// Course Mapping Details Getting Coding

app.post('/coursemap', async (req, res) => 
{
    const { staff_id } = req.body;

    try {
        const courseMapping = await coursemapping.findAll({
            where: { staff_id: staff_id }
        });
        res.json(courseMapping);
    } 
    catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

// ---------------------------------------------------------------------------------- //

// Database Authenticate Coding

sequelize_conn.authenticate()
.then(() => 
{
    console.log('Database connected');
    app.listen( 5000 , () => {
        console.log('Server running on http://localhost:5000');
    });
})
.catch (err => 
{
    console.error('Unable to connect to the Database:', err);
});