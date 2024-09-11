const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize_conn = require('./models/dbconnection');
const staffmaster = require('./models/staffmaster');
const studentmaster = require('./models/studentmaster');
const department = require('./models/department');
const course = require('./models/course');
const scope = require('./models/scope');
const coursemapping = require('./models/coursemapping');
const XLSX = require('xlsx');
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------------- //

// Tables ( Model ) Synchronization Coding

async function dbconncheck() 
{
    try {
        // Authenticate the connection
        await sequelize_conn.authenticate();
        console.log('Database Synced');

        // Synchronize the staffmaster model
        await staffmaster.sync();
        console.log('Staffmaster Table Synced');

        // Synchronize the studentmaster model
        await studentmaster.sync();
        console.log('Studentmaster Table Synced');

        // Synchronize the course model
        await course.sync();
        console.log('Course Table Synced');

        // Synchronize the coursemapping model
        await coursemapping.sync();
        console.log('Coursemapping Table Synced');

        // Synchronize the scope model
        await scope.sync();
        console.log('Scope Table Synced');

        // Synchronize the department model
        await department.sync();
        console.log('Deparment Table Synced');
    } 
    catch (error) {
        console.log('Error Occurred:', error.message);
    }
}

dbconncheck();

// ---------------------------------------------------------------------------------- //

// Import Staff Data Into Database

const staffmasterDataXL = XLSX.readFile('D:\\OBE ORIGINALS\\Staff Master.xlsx');
const staffmasterSheetNo = staffmasterDataXL.SheetNames[0];
const staffmasterWorksheet = staffmasterDataXL.Sheets[staffmasterSheetNo];
const staffdata = XLSX.utils.sheet_to_json(staffmasterWorksheet, { header: 1 });

const mappedStaffData = staffdata.slice(1).map((row) => ({
    staff_id: row[0],          
    staff_name: row[1],           
    staff_pass: row[2],       
    staff_dept: row[3],    
    category: row[4] 
}));

const staffImportData = async () => {
    try {
        const staffExistingRecords = await staffmaster.findAll();

        if (staffExistingRecords.length > 0) {
            await staffmaster.destroy({ where: {} });
            console.log('Existing records deleted.');
        }
        await staffmaster.bulkCreate(mappedStaffData, { ignoreDuplicates: true });
        console.log('Staff Master data inserted successfully!');
    } 
    catch (err) {
        console.error('Error Importing Data:', err.stack); // Log stack trace
    }
}

staffImportData();




// ---------------------------------------------------------------------------------- //

// Import Course Mapping Data Into Database

const coursemappingDataXL = XLSX.readFile('D:\\OBE ORIGINALS\\Staff Course Mapping.xlsx');
const coursemappingSheetNo = coursemappingDataXL.SheetNames[0]; 
const coursemappingWorksheet = coursemappingDataXL.Sheets[coursemappingSheetNo];
const coursemappingdata = XLSX.utils.sheet_to_json(coursemappingWorksheet, { header: 1 });

const mappedCourseMappingData = coursemappingdata.slice(1).map((row) => ({
    category: row[0],          
    batch: row[1],  
    course_id: row[2],         
    degree: row[3],       
    branch: row[4],    
    semester: row[5],       
    section: row[6],         
    course_code: row[7],           
    staff_id: row[8],          
    staff_name: row[9],
    course_title: row[10]            
}));

const courseMappingImportData = async () => 
{
    try {
        const coursemappingExistingRecords = await coursemapping.findAll();
        if (coursemappingExistingRecords.length > 0) {
            await coursemapping.destroy({ where: {} });
            console.log('Existing records deleted.');
        }
        await sequelize_conn.query('ALTER TABLE coursemapping AUTO_INCREMENT = 1');
        await coursemapping.bulkCreate(mappedCourseMappingData, { ignoreDuplicates: true });
        console.log('Course Mapping data inserted successfully!');
    } 
    catch (err) {
        console.error('Error Importing Data :', err);
    }
};

courseMappingImportData();

// ---------------------------------------------------------------------------------- //
 
// Import Student Tables Data Into Database

const studentmasterDataXL = XLSX.readFile('D:\\OBE ORIGINALS\\Student Master.xlsx');
const studentmasterSheetNo = studentmasterDataXL.SheetNames[0];
const studentmasterWorksheet = studentmasterDataXL.Sheets[studentmasterSheetNo];
const studentdata = XLSX.utils.sheet_to_json(studentmasterWorksheet, { header: 1 });

const mappedStudentData = studentdata.slice(1).map((row) => ({
    reg_no: row[0],          
    stu_name: row[1],           
    course_id: row[2],       
    category: row[3],    
    semester: row[4],       
    section: row[5],         
    batch: row[6],           
    mentor: row[7],          
    emis: row[8]             
}));

const studentImportData = async () => 
{
    try {
        const studentExistingRecords = await studentmaster.findAll();

        if (studentExistingRecords.length > 0) {
            await studentmaster.destroy({ where: {} });
            console.log('Existing records deleted.');
        }
        await studentmaster.bulkCreate(mappedStudentData, { ignoreDuplicates: true });
        console.log('Student Master data inserted successfully!');
    } 
    catch (err) {
        console.error('Error Importing Data:', err);
    }
}

studentImportData();

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

// Students Data Fetching Coding

app.post('/studentdetails', async (req, res) => 
{
    const { course_id, stu_section, stu_semester, stu_category } = req.body;

    try {
        const studentDetails = await studentmaster.findAll({
            where: { 
                course_id: course_id, 
                semester: stu_semester, 
                section: stu_section,
                category: stu_category
            }
        });
        res.json(studentDetails);
    } 
    catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

// ---------------------------------------------------------------------------------- //

// Scope Options Validating Coding

app.get('/scope/:staffId', async (req, res) => 
{
    const { staffId } = req.params;

    try {
        const scopeDetails = await scope.findOne({
            where: { staff_id: staffId }
        });
        if (scopeDetails.length === 0) {
            return res.status(404).json({ error: 'No records found for the given staff ID.' });
        }
        res.json(scopeDetails);
    } 
    catch (err) {
        console.error('Error fetching scope details:', err);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

// ---------------------------------------------------------------------------------- //

// Database Authenticate Coding

sequelize_conn.authenticate()
.then(() => 
{
    console.log('Database Connected');
    app.listen( 5000 , () => {
        console.log('Server running on http://localhost:5000');
    });
})
.catch (err => 
{
    console.error('Unable to connect to the Database:', err);
});