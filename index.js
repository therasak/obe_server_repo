const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const sequelize_conn = require('./models/dbconnection');
const staffmaster = require('./models/staffmaster');
const studentmaster = require('./models/studentmaster');
const department = require('./models/department');
const course = require('./models/course');
const scope = require('./models/scope');
const markentry = require('./models/markentry');
const coursemapping = require('./models/coursemapping');
const xlsx = require('xlsx');
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

//         // Synchronize the staffmaster model
//         await staffmaster.sync();
//         console.log('Staffmaster Table Synced');

//         // Synchronize the studentmaster model
//         await studentmaster.sync();
//         console.log('Studentmaster Table Synced');

//         // // Synchronize the course model
//         // await course.sync();
//         // console.log('Course Table Synced');

//         // Synchronize the coursemapping model
//         await coursemapping.sync();
//         console.log('Coursemapping Table Synced');

//         // Synchronize the scope model
//         await scope.sync();
//         console.log('Scope Table Synced');

//         // // Synchronize the department model
//         // await department.sync();
//         // console.log('Deparment Table Synced');

//         // Synchronize the markentry model
//         await markentry.sync();
//         console.log('Markentry Table created');
//     } 
//     catch (error) {
//         console.log('Error Occurred:', error.message);
//     }
// }

// dbconncheck();

// ---------------------------------------------------------------------------------- //

// Import Staff Data Into Database

// const staffmasterDataXL = XLSX.readFile('C:\\Users\\Lenovo PC\\OneDrive\\Documents\\Obe Data Files\\Staff Master.xlsx');
// const staffmasterSheetNo = staffmasterDataXL.SheetNames[0];
// const staffmasterWorksheet = staffmasterDataXL.Sheets[staffmasterSheetNo];
// const staffdata = XLSX.utils.sheet_to_json(staffmasterWorksheet, { header: 1 });

// const mappedStaffData = staffdata.slice(1).map((row) => ({
//     staff_id: row[0],          
//     staff_name: row[1],           
//     staff_pass: row[2],       
//     staff_dept: row[3],    
//     category: row[4] 
// }));

// const staffImportData = async () => 
// {
//     try {
//         const staffExistingRecords = await staffmaster.findAll();

//         if (staffExistingRecords.length > 0) {
//             await staffmaster.destroy({ where: {} });
//             console.log('Existing records deleted.');
//         }
//         await staffmaster.bulkCreate(mappedStaffData, { ignoreDuplicates: true });
//         console.log('Staff Master data inserted successfully!');
//     } 
//     catch (err) {
//         console.error('Error Importing Data:', err.stack); // Log stack trace
//     }
// }

// staffImportData();


// ---------------------------------------------------------------------------------- //

// Import Course Mapping Data Into Database

// const coursemappingDataXL = XLSX.readFile('C:\\Users\\Lenovo PC\\OneDrive\\Documents\\Obe Data Files\\Staff Course Mapping.xlsx');
// const coursemappingSheetNo = coursemappingDataXL.SheetNames[0]; 
// const coursemappingWorksheet = coursemappingDataXL.Sheets[coursemappingSheetNo];
// const coursemappingdata = XLSX.utils.sheet_to_json(coursemappingWorksheet, { header: 1 });

// const mappedCourseMappingData = coursemappingdata.slice(1).map((row) => ({
//     category: row[0],          
//     batch: row[1],  
//     course_id: row[2],         
//     degree: row[3],       
//     branch: row[4],    
//     semester: row[5],       
//     section: row[6],         
//     course_code: row[7],           
//     staff_id: row[8],          
//     staff_name: row[9],
//     course_title: row[10]            
// }));

// const courseMappingImportData = async () => 
// {
//     try {
//         const coursemappingExistingRecords = await coursemapping.findAll();
//         if (coursemappingExistingRecords.length > 0) {
//             await coursemapping.destroy({ where: {} });
//             console.log('Existing records deleted.');
//         }
//         await sequelize_conn.query('ALTER TABLE coursemapping AUTO_INCREMENT = 1');
//         await coursemapping.bulkCreate(mappedCourseMappingData, { ignoreDuplicates: true });
//         console.log('Course Mapping data inserted successfully!');
//     } 
//     catch (err) {
//         console.error('Error Importing Data :', err);
//     }
// };

// courseMappingImportData();

// ---------------------------------------------------------------------------------- //

// Import Student Tables Data Into Database

// const studentmasterDataXL = XLSX.readFile('C:\\Users\\Lenovo PC\\OneDrive\\Documents\\Obe Data Files\\Student Master.xlsx');
// const studentmasterSheetNo = studentmasterDataXL.SheetNames[0];
// const studentmasterWorksheet = studentmasterDataXL.Sheets[studentmasterSheetNo];
// const studentdata = XLSX.utils.sheet_to_json(studentmasterWorksheet, { header: 1 });

// const mappedStudentData = studentdata.slice(1).map((row) => ({
//     reg_no: row[0],          
//     stu_name: row[1],           
//     course_id: row[2],       
//     category: row[3],    
//     semester: row[4],       
//     section: row[5],         
//     batch: row[6],           
//     mentor: row[7],          
//     emis: row[8]             
// }));

// const studentImportData = async () => 
// {
//     try {
//         const studentExistingRecords = await studentmaster.findAll();

//         if (studentExistingRecords.length > 0) {
//             await studentmaster.destroy({ where: {} });
//             console.log('Existing records deleted.');
//         }
//         await studentmaster.bulkCreate(mappedStudentData, { ignoreDuplicates: true });
//         console.log('Student Master data inserted successfully!');
//     } 
//     catch (err) {
//         console.error('Error Importing Data:', err);
//     }
// }

// studentImportData();

// ---------------------------------------------------------------------------------- //

// Markenty Table Data Insertion

// const markentryDataXL = XLSX.readFile('C:\\Users\\Lenovo PC\\OneDrive\\Documents\\Obe Data Files\\Student Course Mapping.xlsx');
// const markentrySheetNo = markentryDataXL.SheetNames[0]; 
// const markentryWorksheet = markentryDataXL.Sheets[markentrySheetNo];
// const markentryData = XLSX.utils.sheet_to_json(markentryWorksheet, { header: 1 });

// const mappedMarkEntryData = markentryData.slice(1).map((row) => ({
//     batch: row[0],          
//     category: row[1],       
//     course_id: row[2],      
//     reg_no: row[3],        
//     course_code: row[4],    
//     semester: row[5],       
//     c1_lot: row[6],         
//     c1_hot: row[7],         
//     c1_mot: row[8],         
//     c1_total: row[9],       
//     c2_lot: row[10],        
//     c2_hot: row[11],       
//     c2_mot: row[12],        
//     c2_total: row[13],      
//     a1_lot: row[14],        
//     a2_lot: row[15],       
//     ese_lot: row[16],       
//     ese_hot: row[17],       
//     ese_mot: row[18],      
//     ese_total: row[19]      
// }));

// const markEntryImportData = async () => 
// {
//     try {
//         const markEntryExistingRecords = await markentry.findAll();
//         if (markEntryExistingRecords.length > 0) {
//             await markentry.destroy({ where: {} });
//             console.log('Existing records deleted.');
//         }
//         await sequelize_conn.query('ALTER TABLE markentry AUTO_INCREMENT = 1');
//         await markentry.bulkCreate(mappedMarkEntryData, { ignoreDuplicates: true });
//         console.log('Mark Entry data inserted successfully!');
//     } 
//     catch (err) {
//         console.error('Error Importing Data :', err);
//     }
// };

// markEntryImportData();

// ---------------------------------------------------------------------------------- //

// Scope Table Data Insertion

// const scopeDataXL = XLSX.readFile('C:\\Users\\Lenovo PC\\OneDrive\\Documents\\Obe Data Files\\Scope.xlsx');
// const scopeSheetNo = scopeDataXL.SheetNames[0];
// const scopeWorksheet = scopeDataXL.Sheets[scopeSheetNo];
// const scopedata = XLSX.utils.sheet_to_json(scopeWorksheet, { header: 1 });

// const mappedScopeData = scopedata.slice(1).map((row) => ({
//     staff_id: row[0],        
//     dashboard: row[1],       
//     course_list: row[2],     
//     report: row[3],          
//     upload_files: row[4],   
//     logout: row[5]           
// }));

// const scopeImportData = async () => {
//     try {
//         const scopeExistingRecords = await scope.findAll();

//         if (scopeExistingRecords.length > 0) {
//             await scope.destroy({ where: {} });
//             console.log('Existing scope records deleted.');
//         }

//         await scope.bulkCreate(mappedScopeData, { ignoreDuplicates: true });
//         console.log('Scope data inserted successfully!');
//     } catch (err) {
//         console.error('Error Importing Scope Data:', err.stack);
//     }
// }

// scopeImportData();

// ---------------------------------------------------------------------------------- //

// Validation Coding

app.post('/login', async (req, res) => {
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

app.post('/coursemap', async (req, res) => {
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

app.post('/studentdetails', async (req, res) => {
    const { course_id, stu_section, stu_semester, stu_category, stu_course_code } = req.body;

    try {
        const studentDetails = await studentmaster.findAll({
            where: {
                course_id: course_id,
                semester: stu_semester,
                section: stu_section,
                category: stu_category
            }
        });

        const registerNumbers = studentDetails.map(student => student.reg_no);

        const stud_reg = await markentry.findAll({
            where: {
                course_code: stu_course_code,
                reg_no: registerNumbers
            }
        });

        const stu_reg = stud_reg.map(register => register.reg_no);

        const stud_name = await studentmaster.findAll({
            where: {
                reg_no: stu_reg
            }
        });

        res.json(stud_name);

        if (!registerNumbers) {
            console.error("Error: No register numbers found");
        }
    }
    catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

// ---------------------------------------------------------------------------------- //

// Scope Options Validating Coding

app.get('/scope/:staffId', async (req, res) => {
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

// Mark Updation Coding

app.put('/updateMark', async (req, res) => {
    const { updates, activeSection, courseCode } = req.body;

    const examType = activeSection;
    const regNumbers = Object.keys(updates);

    try {
        for (const regNo of regNumbers) {
            const updateData = updates[regNo];

            let updateFields = {};

            switch (examType) {
                case '1':
                    updateFields = {
                        c1_lot: updateData.lot || 0,
                        c1_hot: updateData.hot || 0,
                        c1_mot: updateData.mot || 0,
                        c1_total: (updateData.lot || 0) + (updateData.hot || 0) + (updateData.mot || 0)
                    };
                    // console.log("CIA 1 marks being updated for", regNo);
                    break;

                case '2':
                    updateFields = {
                        c2_lot: updateData.lot || 0,
                        c2_hot: updateData.hot || 0,
                        c2_mot: updateData.mot || 0,
                        c2_total: (updateData.lot || 0) + (updateData.hot || 0) + (updateData.mot || 0)
                    };
                    // console.log("CIA 2 marks being updated for", regNo);
                    break;

                case '3':
                    updateFields = {
                        a1_lot: updateData.lot || 0
                    };
                    // console.log("ASS-1 marks being updated for", regNo);
                    break;

                case '4':
                    updateFields = {
                        a2_lot: updateData.lot || 0
                    };
                    // console.log("ASS-2 marks being updated for", regNo);
                    break;

                case '5':
                    updateFields = {
                        ese_lot: updateData.lot || 0,
                        ese_hot: updateData.hot || 0,
                        ese_mot: updateData.mot || 0,
                        ese_total: (updateData.lot || 0) + (updateData.hot || 0) + (updateData.mot || 0)
                    };
                    // console.log("ESE marks being updated for", regNo);
                    break;

                default:
                    console.log('Invalid section');
                    res.status(400).send({ error: "Invalid section" });
                    return;
            }

            await markentry.update(updateFields, {
                where: {
                    reg_no: regNo,
                    course_code: courseCode
                }
            });
        }
        res.status(200).send({ success: true, message: 'Marks updated successfully' });
    }
    catch (error) {
        console.error("Error updating marks:", error);
        res.status(500).send({ success: false, error: "Failed to update marks" });
    }
});

// ---------------------------------------------------------------------------------- //

// Database Authenticate Coding

sequelize_conn.authenticate()
    .then(() => {
        console.log('Database Connected');
        app.listen(5000, () => {
            console.log('Server running on http://localhost:5000');
        });
    })
    .catch(err => {
        console.error('Unable to connect to the Database:', err);
    });





const upload = multer({ dest: 'uploads' })

// Route to handle Course Mapping file upload
app.post('/upload1', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(worksheet);

        const course = rows.map(row => ({
            category: row.category,
            batch: row.batch,
            course_id: row.course_id,
            degree: row.degree,
            branch: row.branch,
            semester: row.semester,
            section: row.section,
            course_code: row.course_code,
            staff_id: row.staff_id,
            staff_name: row.staff_name,
            course_title: row.course_title
        }));

        // Replace with your database logic
        await coursemapping.bulkCreate(course, {});

        res.status(200).send('Course Mapping Data imported successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

// Route to handle Staff Master file upload
app.post('/upload2', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(worksheet);

        const staff = rows.map(row => ({
            staff_id: row.staff_id,
            staff_name: row.staff_name,
            staff_pass: row.staff_pass,
            staff_dept: row.staff_dept,
            category: row.category
        }));

        // Replace with your database logic
        await staffmaster.bulkCreate(staff, {});

        res.status(200).send('Staff Master Data imported successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

// Route to handle Student Master file upload
app.post('/upload3', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(worksheet);

        const students = rows.map(row => ({
            reg_no: row.reg_no,
            stu_name: row.stu_name,
            course_id: row.course_id,
            category: row.category,
            semester: row.semester,
            section: row.section,
            batch: row.batch,
            mentor: row.mentor,
            emis: row.emis
        }));

        // Replace with your database logic
        await studentmaster.bulkCreate(students, {});

        res.status(200).send('Student Master Data imported successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});



app.post('/upload4', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(worksheet);

        const scopes = rows.map(row => ({
            staff_id: row.staff_id,
            dashboard: row.dashboard,
            course_list: row.course_list,
            report: row.report,
            upload_files: row.upload_files,
            logout: row.logout
        }));

        // Replace with your database logic
        await scope.bulkCreate(scopes, {});

        res.status(200).send('Student Master Data imported successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});


app.post('/upload5', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(worksheet);

        const mark = rows.map(row => ({
            batch: row.batch,
            category: row.category,
            course_id: row.course_id,
            reg_no: row.reg_no,
            course_code: row.course_code,
            semester: row.semester,
            c1_lot: row.c1_lot,
            c1_hot: row.c1_hot,
            c1_mot: row.c1_mot,
            c1_total: row.c1_total,
            c2_lot: row.c2_lot,
            c2_hot: row.c2_hot,
            c2_mot: row.c2_mot,
            c2_total: row.c2_total,
            a1_lot: row.a1_lot,
            a2_lot: row.a2_lot,
            ese_lot: row.ese_lot,
            ese_hot: row.ese_hot,
            ese_mot: row.ese_mot,
            ese_total: row.ese_total

        }));

        // Replace with your database logic
        await markentry.bulkCreate(mark, {});

        res.status(200).send('Student Master Data imported successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});



