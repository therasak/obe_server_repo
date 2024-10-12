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
const report = require('./models/report');
const markentry = require('./models/markentry');
const coursemapping = require('./models/coursemapping');
const academic = require('./models/academic');


const Dash = require('./routes/dash');
const Courselist = require('./routes/courselist');
const Scopemanage = require('./routes/scopemanage');
const Fileupload = require('./routes/fileupload.');
const Filedownload = require('./routes/filedownload');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api',Dash);
app.use('/api',Courselist);
app.use('/api',Scopemanage);
app.use('/api',Fileupload);
app.use('/api',Filedownload);




const XLSX = require('xlsx');
const upload = multer({ dest: 'uploads' })
app.use(bodyParser.json({ limit: '10mb' }));


require('dotenv').config();


const port = process.env.PORT || 5000;
const clientUrl = process.env.CLIENT_URL;
const secretKey = process.env.SECRET_KEY;


// ------------------------------------------------------------------------------------------------------- //

// Tables ( Model ) Synchronization Coding

// async function dbconncheck() 
// {
//     try {
//         // Synchronize the staffmaster model
//         await staffmaster.sync();
//         console.log('Staffmaster Table Synced');

//         // Synchronize the studentmaster model
//         await studentmaster.sync();
//         console.log('Studentmaster Table Synced');

//         // // Synchronize the course model
//         // await course.sync();
//         // console.log('Course Table Synced');

//         // Synchronize the academic model
//         await academic.sync();
//         console.log('Academic Table Synced');

//         // Synchronize the coursemapping model
//         await coursemapping.sync();
//         console.log('Course Mapping Table Synced');

//         // Synchronize the scope model
//         await scope.sync();
//         console.log('Scope Table Synced');

//         // // Synchronize the department model
//         // await department.sync();
//         // console.log('Deparment Table Synced');

//         // Synchronize the markentry model
//         await markentry.sync();
//         console.log('Markentry Table Synced');

//         // Synchronize the markentry model
//         await report.sync();
//         console.log('Report Table Synced');
//     }
//     catch (error) {
//         console.log('Error Occurred:', error.message);
//     }
// }

// dbconncheck();

// ------------------------------------------------------------------------------------------------------- //

// Import Staff Data Into Database

// const staffmasterDataXL = XLSX.readFile('C:\\Users\\ACER\\Music\\Haneef\\Documents\\Obe Data Files\\Main Data\\Staff Master.xlsx');
// const staffmasterSheetNo = staffmasterDataXL.SheetNames[0];
// const staffmasterWorksheet = staffmasterDataXL.Sheets[staffmasterSheetNo];

// const staffdata = XLSX.utils.sheet_to_json(staffmasterWorksheet, { header: 1 });

// const mappedStaffData = staffdata.slice(1).map((row) => 
// {
//     if (row.length === 0) return null;
//     return {
//         staff_id: row[0],
//         staff_name: row[1],
//         staff_pass: row[2],
//         staff_dept: row[3],
//         category: row[4]
//     };
// }).filter(Boolean);

// const staffImportData = async () => 
// {
//     try {
//         const staffExistingRecords = await staffmaster.findAll();
//         if (staffExistingRecords.length > 0) {
//             await staffmaster.destroy({ where: {} });
//             console.log('Existing records deleted.');
//         }
//         await staffmaster.bulkCreate(mappedStaffData, { ignoreDuplicates: true });
//         console.log('Staff Master Data Inserted Successfully!');
//     }
//     catch (err) {
//         console.error('Error Importing Data:', err.stack);
//     }
// }

// staffImportData();

// ------------------------------------------------------------------------------------------------------- //

// Import Course Mapping Data Into Database

// const coursemappingDataXL = XLSX.readFile('C:\\Users\\Lenovo PC\\OneDrive\\Documents\\Obe Data Files\\Staff Course Mapping.XLSX');
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
//         console.log('Course Mapping Data Inserted Successfully!');
//     } 
//     catch (err) {
//         console.error('Error Importing Data :', err);
//     }
// };

// courseMappingImportData();

// ------------------------------------------------------------------------------------------------------- //

// Import Student Tables Data Into Database

// const studentmasterDataXL = XLSX.readFile('C:\\Users\\Lenovo PC\\OneDrive\\Documents\\Obe Data Files\\Student Master.XLSX');
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
//         console.log('Student Master Data Inserted Successfully!');
//     } 
//     catch (err) {
//         console.error('Error Importing Data:', err);
//     }
// }

// studentImportData();

// ------------------------------------------------------------------------------------------------------- //

// Markenty Table Data Insertion

// const markentryDataXL = XLSX.readFile('C:\\Users\\Lenovo PC\\OneDrive\\Documents\\Obe Data Files\\Student Course Mapping.XLSX');
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
//         console.log('Mark Entry Data Inserted Successfully!');
//     } 
//     catch (err) {
//         console.error('Error Importing Data :', err);
//     }
// };

// markEntryImportData();

// ------------------------------------------------------------------------------------------------------- //

// Scope Table Data Insertion

// const scopeDataXL = XLSX.readFile('C:\\Users\\ACER\\Music\\Haneef\\Documents\\Obe Data Files\\Main Data\\Scope.xlsx');
// const scopeSheetNo = scopeDataXL.SheetNames[0];
// const scopeWorksheet = scopeDataXL.Sheets[scopeSheetNo];
// const scopedata = XLSX.utils.sheet_to_json(scopeWorksheet, { header: 1 });

// const mappedScopeData = scopedata.slice(1).map((row) => ({
//     staff_id: row[0],
//     role: row[1],
//     dashboard: row[2],
//     course_list: row[3],
//     course_outcome: row[4],
//     student_outcome: row[5],
//     program_outcome: row[6],
//     program_specific_outcome: row[7],
//     mentor_report: row[8],
//     hod_report: row[9],
//     report: row[10],
//     input_files: row[11],
//     manage: row[12],
//     relationship_matrix: row[13],
//     settings: row[14]
// }));

// const scopeImportData = async () => 
// {
//     try {
//         const scopeExistingRecords = await scope.findAll();

//         if (scopeExistingRecords.length > 0) {
//             await scope.destroy({ where: {} });
//             console.log('Existing scope records deleted.');
//         }

//         await scope.bulkCreate(mappedScopeData, { ignoreDuplicates: true });
//         console.log('Scope Data Inserted Successfully!');
//     }
//     catch (err) {
//         console.error('Error Importing Scope Data:', err.stack);
//     }
// }

// scopeImportData();

// ------------------------------------------------------------------------------------------------------- //

// Validation Coding

app.post('/login', async (req, res) => 
{
    const { staff_id, staff_pass } = req.body;

    try {
        const user = await staffmaster.findOne({
            where: { staff_id: staff_id }
        });
        if (user) 
        {
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

// ------------------------------------------------------------------------------------------------------- //

// // Course Mapping Downlaod Excel 

// app.get('/download/coursemap', async (req, res) => 
// {
//     try 
//     {
//         const courseData = await coursemapping.findAll();
        
//         const formattedData = [
//             ['Category', 'Batch', 'Course ID', 'Degree', 'Department Name', 'Semester', 
//              'Section', 'Course Code', 'Staff ID', 'Staff Name', 'Course Title', 'Active Semester'],
//             ...courseData.map(course => [
//                 course.category,
//                 course.batch,
//                 course.course_id,
//                 course.degree,
//                 course.dept_name,
//                 course.semester,
//                 course.section,
//                 course.course_code,
//                 course.staff_id,
//                 course.staff_name,
//                 course.course_title,
//                 course.active_sem
//             ])
//         ];

//         const ws = XLSX.utils.aoa_to_sheet(formattedData);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'Course Mapping Data');
//         const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
//         res.setHeader('Content-Disposition', 'attachment; filename = Course Mapping Data.xlsx');
//         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//         res.send(excelBuffer);
//     } 
//     catch (error) {
//         console.error('Error generating Excel file:', error);
//         res.status(500).send('Server error');
//     }
// });

// // ------------------------------------------------------------------------------------------------------- //

// // Staff Master Download Excel

// app.get('/download/staff', async (req, res) => 
// {
//     try 
//     {
//         const staffData = await staffmaster.findAll();
//         const formattedData = [
//             ['Staff ID', 'Staff Name', 'Staff Password', 'Staff Department', 'Category'],
//             ...staffData.map(staff =>
//                 [
//                     staff.staff_id,
//                     staff.staff_name,
//                     staff.staff_pass,
//                     staff.staff_dept,
//                     staff.category
//                 ])
//         ];

//         const ws = XLSX.utils.aoa_to_sheet(formattedData);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'Staff Data');
//         const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
//         res.setHeader('Content-Disposition', 'attachment; filename = Staff Master Data.xlsx');
//         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//         res.send(excelBuffer);
//     }
//     catch (error) {
//         console.error('Error generating Excel file:', error);
//         res.status(500).send('Server error');
//     }
// });

// // ------------------------------------------------------------------------------------------------------- //

// // Student Master Excel Download


// app.get('/download/studentmaster', async (req, res) => 
// {
//     try 
//     {
//         const studentData = await studentmaster.findAll();

//         const formattedData = [
//             ['Registration No', 'Student Name', 'Course ID', 'Category', 'Semester', 
//              'Section', 'Batch', 'Mentor', 'EMIS', 'Active Semester'],
//             ...studentData.map(student => [
//                 student.reg_no,
//                 student.stu_name,
//                 student.course_id,
//                 student.category,
//                 student.semester,
//                 student.section,
//                 student.batch,
//                 student.mentor,
//                 student.emis,
//                 student.active_sem
//             ])
//         ];

//         const ws = XLSX.utils.aoa_to_sheet(formattedData);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'Student Master Data');
//         const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
//         res.setHeader('Content-Disposition', 'attachment; filename = Student Master Data.xlsx');
//         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//         res.send(excelBuffer);
//     } 
//     catch (error) {
//         console.error('Error generating Excel file:', error);
//         res.status(500).send('Server error');
//     }
// });

// // ------------------------------------------------------------------------------------------------------- //

// // Scope Excel Download

// app.get('/download/scope', async (req, res) => 
// {
//     try {
//         const scopeData = await scope.findAll();

//         const formattedData = [
//             ['STAFF_ID', 'ROLE', 'DASHBOARD', 'COURSE_LIST', 'COURSE_OUTCOME', 
//              'STUDENT_OUTCOME', 'PROGRAM_OUTCOME', 'PROGRAM_SPECIFIC_OUTCOME', 
//              'MENTOR_REPORT', 'HOD_REPORT', 'REPORT', 'INPUT_FILES', 
//              'MANAGE', 'RELATIONSHIP_MATRIX', 'SETTINGS', 'LOGOUT'],
//             ...scopeData.map(scope => [
//                 scope.staff_id,
//                 scope.role,
//                 scope.dashboard,
//                 scope.course_list,
//                 scope.course_outcome,
//                 scope.student_outcome,
//                 scope.program_outcome,
//                 scope.program_specific_outcome,
//                 scope.mentor_report,
//                 scope.hod_report,
//                 scope.report,
//                 scope.input_files,
//                 scope.manage,
//                 scope.relationship_matrix,
//                 scope.settings,
//                 scope.logout
//             ])
//         ];

//         const ws = XLSX.utils.aoa_to_sheet(formattedData);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'Scope Data');
//         const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
//         res.setHeader('Content-Disposition', 'attachment; filename = Scope Data.xlsx'); 
//         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//         res.send(excelBuffer);
//     } 
//     catch (error) {
//         console.error('Error generating Excel file:', error);
//         res.status(500).send('Server error');
//     }
// });

// // ------------------------------------------------------------------------------------------------------- //


// // Student Mark Entry Excel Download

// app.get('/download/mark', async (req, res) => 
// {
//     try 
//     {
//         const markData = await markentry.findAll();
//         const formattedData = [
//             ['SNO', 'BATCH', 'CATEGORY', 'COURSE_ID', 'REG_NO', 'COURSE_CODE', 'SEMESTER', 'C1_LOT', 'C1_HOT', 'C1_MOT', 'C1_TOTAL',
//                 'C2_LOT', 'C2_HOT', 'C2_MOT', 'C2_TOTAL', 'A1_LOT', 'A2_LOT', 'ESE_LOT', 'ESE_HOT', 'ESE_MOT', 'ESE_TOTAL'],

//             ...markData.map(student =>
//                 [
//                     student.s_no,
//                     student.batch,
//                     student.category,
//                     student.course_id,
//                     student.reg_no,
//                     student.course_code,
//                     student.semester,
//                     student.c1_lot,
//                     student.c1_hot,
//                     student.c1_mot,
//                     student.c1_total,
//                     student.c2_lot,
//                     student.c2_hot,
//                     student.c2_mot,
//                     student.c2_total,
//                     student.a1_lot,
//                     student.a2_lot,
//                     student.ese_lot,
//                     student.ese_hot,
//                     student.ese_mot,
//                     student.ese_total
//                 ])
//         ];

//         const ws = XLSX.utils.aoa_to_sheet(formattedData);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'Mark Data');
//         const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
//         res.setHeader('Content-Disposition', 'attachment; filename = Mark Entry Data.xlsx');
//         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//         res.send(excelBuffer);
//     }
//     catch (error) {
//         console.error('Error generating Excel file:', error);
//         res.status(500).send('Server error');
//     }
// });
    
// // ------------------------------------------------------------------------------------------------------- //
    
// // Dept Mark Entry Excel Download

// app.get('/download/deptmarkentry', async (req, res) => 
// {
//     try 
//     {
//         const markData = await markentry.findAll();
        
//         const formattedData = [
//             ['Registration No', 'Course Code', 'Course ID', 'C1 LOT', 'C1 HOT', 
//              'C1 MOT', 'C1 Total'],
//             ...markData.map(entry => [
//                 entry.reg_no,
//                 entry.course_code,
//                 entry.course_id,
//                 entry.c1_lot,
//                 entry.c1_hot,
//                 entry.c1_mot,
//                 entry.c1_total
//             ])
//         ];

//         const ws = XLSX.utils.aoa_to_sheet(formattedData);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'Dept Mark Entry Data');
//         const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
//         res.setHeader('Content-Disposition', 'attachment; filename = Dept Mark Entry.xlsx');
//         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//         res.send(excelBuffer);
//     } 
//     catch (error) {
//         console.error('Error generating Excel file:', error);
//         res.status(500).send('Server error');
//     }
// });

// // ------------------------------------------------------------------------------------------------------- //

// // Report Excel Download

// app.get('/download/report', async (req, res) => 
// {
//     try 
//     {
//         const reportData = await report.findAll();

//         const formattedData = [
//             ['STAFF_ID', 'COURSE_CODE', 'CATEGORY', 'SECTION', 'DEPT_NAME', 
//              'CIA_1', 'CIA_2', 'ASS_1', 'ASS_2', 'ESE', 
//              'L_C1', 'L_C2', 'L_A1', 'L_A2', 'L_ESE', 'ACTIVE_SEM'],
//             ...reportData.map(reports => [
//                 reports.staff_id,
//                 reports.course_code,
//                 reports.category,
//                 reports.section,
//                 reports.dept_name,
//                 reports.cia_1,
//                 reports.cia_2,
//                 reports.ass_1,
//                 reports.ass_2,
//                 reports.ese,
//                 reports.l_c1,
//                 reports.l_c2,
//                 reports.l_a1,
//                 reports.l_a2,
//                 reports.l_ese,
//                 reports.active_sem
//             ])
//         ];

//         const ws = XLSX.utils.aoa_to_sheet(formattedData);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'Report Data');
//         const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
//         res.setHeader('Content-Disposition', 'attachment; filename = Report Data.xlsx');
//         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//         res.send(excelBuffer);
//     } 
//     catch (error) {
//         console.error('Error generating Excel file:', error);
//         res.status(500).send('Server error');
//     }
// });
// // ------------------------------------------------------------------------------------------------------- //

// // Students Data Fetching Coding

// app.post('/studentdetails', async (req, res) => 
// {
//     const { course_id, stu_section, stu_category, stu_course_code, activeSection, academic_year } = req.body;

//     try 
//     {
//         const studentDetails = await studentmaster.findAll({
//             where: {
//                 course_id: course_id,
//                 section: stu_section,
//                 category: stu_category
//             }
//         });

//         const registerNumbers = studentDetails.map(student => student.reg_no);

//         let markFields = {};

//         switch (activeSection) 
//         {
//             case '1':
//                 markFields = ['c1_lot', 'c1_mot', 'c1_hot', 'c1_total'];
//                 break;
//             case '2':
//                 markFields = ['c2_lot', 'c2_mot', 'c2_hot', 'c2_total'];
//                 break;
//             case '3':
//                 markFields = ['a1_lot'];
//                 break;
//             case '4':
//                 markFields = ['a2_lot'];
//                 break;
//             case '5':
//                 markFields = ['ese_lot', 'ese_mot', 'ese_hot', 'ese_total'];
//                 break;
//             default:
//                 return res.status(400).json({ error: 'Invalid section' });
//         }

//         const stud_reg = await markentry.findAll({
//             where: {
//                 course_code: stu_course_code,
//                 reg_no: registerNumbers,
//                 active_sem: academic_year
//             },
//             attributes: ['reg_no', ...markFields]
//         });

//         const stud_name = await studentmaster.findAll({
//             where: {
//                 reg_no: stud_reg.map(entry => entry.reg_no)
//             },
//             attributes: ['reg_no', 'stu_name']
//         });

//         const studentData = stud_name.map(student => 
//         {
//             const marks = stud_reg.find(mark => mark.reg_no === student.reg_no) || {};
//             return {
//                 reg_no: student.reg_no,
//                 stu_name: student.stu_name,
//                 lot: marks[`${activeSection === '1' ? 'c1_lot' : activeSection === '2' ? 'c2_lot' : activeSection === '3' ? 'a1_lot' : activeSection === '4' ? 'a2_lot' : 'ese_lot'}`] ?? (0 || ''),
//                 mot: marks[`${activeSection === '1' ? 'c1_mot' : activeSection === '2' ? 'c2_mot' : 'ese_mot'}`] ?? (0 || ''),
//                 hot: marks[`${activeSection === '1' ? 'c1_hot' : activeSection === '2' ? 'c2_hot' : 'ese_hot'}`] ?? (0 || ''),
//                 total: marks[`${activeSection === '1' ? 'c1_total' : activeSection === '2' ? 'c2_total' : 'ese_total'}`] ?? (0 || '')
//             };
//         });
//         res.json(studentData);
//     }
//     catch (err) {
//         console.error('Error fetching data:', err);
//         res.status(500).json({ error: 'An error occurred while fetching data.' });
//     }
// });

// ------------------------------------------------------------------------------------------------------- //

// Scope Options Validating Coding

app.get('/scope/:staffId', async (req, res) => 
{
    const { staffId } = req.params;

    try {
        const scopeDetails = await scope.findOne({
            where: { staff_id: staffId }
        });
        res.json(scopeDetails);
    }
    catch (err) {
        console.error('Error fetching scope details:', err);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

// ------------------------------------------------------------------------------------------------------- //

// // Mark Updation Coding

// app.put('/updateMark', async (req, res) => 
// {
//     const { updates, activeSection, courseCode, academicYear } = req.body;
//     const examType = activeSection;
//     const regNumbers = Object.keys(updates);

//     try
//     {
//         for (const regNo of regNumbers) 
//         {
//             const updateData = updates[regNo];
//             let updateFields = {};

//             const setField = (value) => value === '' || value === undefined ? null : value;

//             switch (examType) {
//                 case '1':
//                     updateFields =
//                     {
//                         c1_lot: setField(updateData.lot),
//                         c1_hot: setField(updateData.hot),
//                         c1_mot: setField(updateData.mot),
//                         c1_total: setField(updateData.total)
//                     };
//                     break;

//                 case '2':
//                     updateFields =
//                     {
//                         c2_lot: setField(updateData.lot),
//                         c2_hot: setField(updateData.hot),
//                         c2_mot: setField(updateData.mot),
//                         c2_total: setField(updateData.total)
//                     };
//                     break;

//                 case '3':
//                     updateFields =
//                     {
//                         a1_lot: setField(updateData.lot)
//                     };
//                     break;

//                 case '4':
//                     updateFields =
//                     {
//                         a2_lot: setField(updateData.lot)
//                     };
//                     break;

//                 case '5':
//                     updateFields =
//                     {
//                         ese_lot: setField(updateData.lot),
//                         ese_hot: setField(updateData.hot),
//                         ese_mot: setField(updateData.mot),
//                         ese_total: setField(updateData.total)
//                     };
//                     break;

//                 default:
//                     console.log('Invalid section');
//                     res.status(400).send({ error: "Invalid section" });
//                     return;
//             }

//             await markentry.update(updateFields, {
//                 where: {
//                     reg_no: regNo,
//                     course_code: courseCode,
//                     active_sem: academicYear
//                 }
//             });
//         }
//         res.status(200).send({ success: true, message: 'Marks updated successfully' });
//     }
//     catch (error) {
//         console.error("Error updating marks:", error);
//         res.status(500).send({ success: false, error: "Failed to update marks" });
//     }
// });

// ------------------------------------------------------------------------------------------------------- //

// // Course Mapping File Upload

// app.post('/coursemapping', upload.single('file'), async (req, res) => 
// {
//     try 
//     {
//         const file = req.file;
//         const workbook = XLSX.readFile(file.path);
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const rows = XLSX.utils.sheet_to_json(worksheet);

//         const activeAcademic = await academic.findOne({
//             where: { active_sem: 1 }
//         });

//         if (!activeAcademic) {
//             return res.status(400).send('No Active Academic Year Found');
//         }

//         const activeSemester = activeAcademic.academic_year;

//         const course = rows.map(row => ({
//             category: row.category,
//             batch: row.batch,
//             course_id: row.course_id,
//             degree: row.degree,
//             dept_name: row.dept_name,
//             semester: row.semester,
//             section: row.section,
//             course_code: row.course_code,
//             staff_id: row.staff_id,
//             staff_name: row.staff_name,
//             course_title: row.course_title,
//             active_sem: activeSemester
//         }));

//         await coursemapping.bulkCreate(course);

//         const reportData = rows.map(row => ({
//             staff_id: row.staff_id,
//             course_code: row.course_code,
//             category: row.category,
//             section: row.section,
//             dept_name: row.dept_name,
//             active_sem: activeSemester
//         }));

//         await report.bulkCreate(reportData, { ignoreDuplicates: true });

//         res.status(200).send('Course Mapping Data Imported Successfully');
//     } 
//     catch (error) {
//         console.error(error);
//         res.status(500).send('An error occurred');
//     }
// });

// ------------------------------------------------------------------------------------------------------- //

// // Staff Master File Upload

// app.post('/staffmaster', upload.single('file'), async (req, res) => 
// {
//     try 
//     {
//         const file = req.file;
//         const workbook = XLSX.readFile(file.path);
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const rows = XLSX.utils.sheet_to_json(worksheet);

//         const staff = rows.map(row => ({
//             staff_id: row.staff_id,
//             staff_name: row.staff_name,
//             staff_pass: row.staff_pass,
//             staff_dept: row.staff_dept,
//             category: row.category
//         }));

//         await staffmaster.bulkCreate(staff, {});

//         res.status(200).send('Staff Master Data Imported Successfully');
//     }
//     catch (error) {
//         console.error(error);
//         res.status(500).send('An error occurred');
//     }
// });

// // ------------------------------------------------------------------------------------------------------- //

// // Student Master File Upload

// app.post('/studentmaster', upload.single('file'), async (req, res) => 
// {
//     try 
//     {
//         const file = req.file;
//         const workbook = XLSX.readFile(file.path);
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const rows = XLSX.utils.sheet_to_json(worksheet);

//         const activeAcademic = await academic.findOne({
//             where: { active_sem: 1 }
//         });

//         if (!activeAcademic) {
//             return res.status(400).send('No Active Academic Year Found');
//         }

//         const activeSemester = activeAcademic.academic_year;

//         const students = rows.map(row => ({
//             reg_no: row.reg_no,
//             stu_name: row.stu_name,
//             course_id: row.course_id,
//             category: row.category,
//             semester: row.semester,
//             section: row.section,
//             batch: row.batch,
//             mentor: row.mentor,
//             emis: row.emis,
//             active_sem: activeSemester
//         }));

//         await studentmaster.bulkCreate(students, {});

//         res.status(200).send('Student Master Data Imported Successfully');
//     }
//     catch (error) {
//         console.error(error);
//         res.status(500).send('An error occurred');
//     }
// });

// // ------------------------------------------------------------------------------------------------------- //

// // Scope File Upload

// app.post('/scope', upload.single('file'), async (req, res) => 
// {
//     try 
//     {
//         const file = req.file;

//         if (!file) {
//             return res.status(400).send('No File Uploaded.');
//         }

//         const workbook = XLSX.readFile(file.path);
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const rows = XLSX.utils.sheet_to_json(worksheet);

//         const scopes = rows.map(row => ({
//             staff_id: row.staff_id,
//             role: row.role, 
//             dashboard: row.dashboard,
//             course_list: row.course_list,
//             course_outcome: row.course_outcome,
//             student_outcome: row.student_outcome,
//             program_outcome: row.program_outcome,
//             program_specific_outcome: row.program_specific_outcome,
//             mentor_report: row.mentor_report,
//             hod_report: row.hod_report,
//             report: row.report,
//             input_files: row.input_files,
//             manage: row.manage,
//             relationship_matrix: row.relationship_matrix,
//             settings: row.settings,
//             logout: row.logout
//         }));

//         await scope.bulkCreate(scopes, {});

//         res.status(200).send('Scope Table Imported Successfully');
//     } 
//     catch (error) {
//         console.error("Error in upload4:", error);
//         res.status(500).send('An error occurred');
//     }
// });

// // ------------------------------------------------------------------------------------------------------- //

// // Mark Entry File Upload

// app.post('/markentry', upload.single('file'), async (req, res) => 
// {
//     try 
//     {
//         const file = req.file;
//         const workbook = XLSX.readFile(file.path);
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const rows = XLSX.utils.sheet_to_json(worksheet);

//         const activeAcademic = await academic.findOne({
//             where: { active_sem: 1 }
//         });

//         if (!activeAcademic) {
//             return res.status(400).send('No Active Academic Year Found');
//         }
//         const activeSemester = activeAcademic.academic_year;

//         const mark = rows.map(row => ({
//             batch: row.batch,
//             category: row.category,
//             course_id: row.course_id,
//             reg_no: row.reg_no,
//             course_code: row.course_code,
//             semester: row.semester,
//             c1_lot: row.c1_lot,
//             c1_hot: row.c1_hot,
//             c1_mot: row.c1_mot,
//             c1_total: row.c1_total,
//             c2_lot: row.c2_lot,
//             c2_hot: row.c2_hot,
//             c2_mot: row.c2_mot,
//             c2_total: row.c2_total,
//             a1_lot: row.a1_lot,
//             a2_lot: row.a2_lot,
//             ese_lot: row.ese_lot,
//             ese_hot: row.ese_hot,
//             ese_mot: row.ese_mot,
//             ese_total: row.ese_total,
//             active_sem: activeSemester

//         }));

//         await markentry.bulkCreate(mark, {});
//         res.status(200).send('Mark Entry Data Imported Successfully');
//     }
//     catch (error) {
//         console.error(error);
//         res.status(500).send('An error occurred');
//     }
// });

// // ------------------------------------------------------------------------------------------------------- //

// // Department Mark Entry File Upload

// app.post('/deptmarkentry', upload.single('file'), async (req, res) => 
// {
//     try 
//     {
//         const file = req.file;
//         const workbook = XLSX.readFile(file.path);
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const rows = XLSX.utils.sheet_to_json(worksheet);

//         for (const row of rows) 
//         {
//             const { reg_no, course_code } = row;
//             const existingEntry = await markentry.findOne({
//                 where: {
//                     reg_no: reg_no,
//                     course_code: course_code
//                 }
//             });

//             const updatedData = {
//                 course_id: row.course_id,
//                 c1_lot: row.c1_lot,
//                 c1_hot: row.c1_hot,
//                 c1_mot: row.c1_mot,
//                 c1_total: row.c1_total,
//             };

//             if (existingEntry) {
//                 await markentry.update(updatedData, {
//                     where: {
//                         reg_no: reg_no,
//                         course_code: course_code
//                     }
//                 });
//             }
//         }
//         res.status(200).send('Department Mark Data Imported Successfully');
//     }
//     catch (error) {
//         console.error(error);
//         res.status(500).send('An error occurred');
//     }
// });

// // ------------------------------------------------------------------------------------------------------- //

// // Report File Upload

// app.post('/report', upload.single('file'), async (req, res) => 
// {
//     try 
//     {
//         const file = req.file;
//         const workbook = XLSX.readFile(file.path);
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const rows = XLSX.utils.sheet_to_json(worksheet);

//         const activeAcademic = await academic.findOne({
//             where: { active_sem: 1 }
//         });

//         if (!activeAcademic) {
//             return res.status(400).send('No Active Academic Year Found');
//         }

//         const activeSemester = activeAcademic.academic_year;

//         const reports = rows.map(row => ({
//             sno: row.s_no,
//             course_code: row.course_code,
//             category: row.category,
//             section: row.section,
//             dept_name: row.dept_name,
//             cia_1: row.cia_1,
//             cia_2: row.cia_2,
//             ass_1: row.ass_1,
//             ass2: row.ass_2,
//             ese: row.ese,
//             active_sem: activeSemester
//         }));

//         await report.bulkCreate(reports, {});

//         res.status(200).send('Report Data Imported Successfully');
//     }
//     catch (error) {
//         console.error(error);
//         res.status(500).send('An error occurred');
//     }
// });

// ------------------------------------------------------------------------------------------------------- //

// // Report Creating Code

// app.put('/report', async (req, res) => 
// {
//     const { activeSection, courseCode, deptName, category, button_value, section, academicYear } = req.body;
//     try 
//     {
//         let cia_1 = 0, cia_2 = 0, ass_1 = 0, ass_2 = 0, ese = 0;

//         const valueToSet = button_value === "0" ? 1 : 2;

//         const existingReports = await report.findAll({
//             where: {
//                 course_code: courseCode,
//                 section: section,
//                 category: category,
//                 dept_name: deptName,
//                 active_sem: academicYear
//             }
//         });

//         if (existingReports.length > 0) 
//         {
//             for (const existingReport of existingReports) 
//             {
//                 switch (activeSection) 
//                 {
//                     case "1":
//                         existingReport.cia_1 = valueToSet;
//                         break;
//                     case "2":
//                         existingReport.cia_2 = valueToSet;
//                         break;
//                     case "3":
//                         existingReport.ass_1 = valueToSet;
//                         break;
//                     case "4":
//                         existingReport.ass_2 = valueToSet;
//                         break;
//                     case "5":
//                         existingReport.ese = valueToSet;
//                         break;
//                     default:
//                         console.log('Invalid activeSection');
//                         break;
//                 }
//                 await existingReport.save();
//             }
//         } 
//         else 
//         {
//             await report.create({
//                 course_code: courseCode,
//                 section: section,
//                 category: category,
//                 dept_name: deptName,
//                 active_sem: academicYear,
//                 cia_1: activeSection === "1" ? valueToSet : null,
//                 cia_2: activeSection === "2" ? valueToSet : null,
//                 ass_1: activeSection === "3" ? valueToSet : null,
//                 ass_2: activeSection === "4" ? valueToSet : null,
//                 ese: activeSection === "5" ? valueToSet : null
//             });
//         }

//         const updatedReports = await report.findAll({
//             where: {
//                 course_code: courseCode,
//                 section: section,
//                 category: category,
//                 dept_name: deptName,
//                 active_sem: academicYear
//             }
//         });

//         updatedReports.forEach(r => {
//             cia_1 = Math.max(cia_1, r.cia_1 || 0);
//             cia_2 = Math.max(cia_2, r.cia_2 || 0);
//             ass_1 = Math.max(ass_1, r.ass_1 || 0);
//             ass_2 = Math.max(ass_2, r.ass_2 || 0);
//             ese = Math.max(ese, r.ese || 0);
//         });

//         res.status(200).json({ cia_1, cia_2, ass_1, ass_2, ese });
//     } 
//     catch (err) {
//         console.error(err);
//         res.status(500).send('Internal Server Error');
//     }
// })

// ------------------------------------------------------------------------------------------------------- //

// // Getting Report Coding

// app.get('/getreport', async (req, res) => 
// {
//     const { courseCode, deptName, section, category, academicYear } = req.query;
//     const checkActive = await report.findOne({
//         where: {
//             course_code: courseCode,
//             section: section,
//             category: category,
//             dept_name: deptName,
//             active_sem: academicYear
//         }
//     });
//     res.json(checkActive);
// })

// ------------------------------------------------------------------------------------------------------- //

// Database Authenticate Coding

sequelize_conn.authenticate()
    .then(() => {
        console.log('Database Connected');
        app.listen(port, () => {
            console.log(`Server running on http:/localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the Database:', err);
    });

// ------------------------------------------------------------------------------------------------------- //

// Academic Year Setting Coding

app.put('/academic', async (req, res) => 
{
    const { academicsem } = req.body;
    try 
    {
        await academic.update(
            { active_sem: 0 },
            { where: {} }
        );

        const academicupdate = await academic.findOne({
            where: {
                academic_year: academicsem,
            }
        });

        if (academicupdate) {
            academicupdate.active_sem = 1;
            await academicupdate.save();
            res.json(academicupdate);
        }
        else {
            res.status(404).json({ error: "Academic year not found" });
        }
    }
    catch (error) {
        console.error('Error: ', error);
        res.status(500).json({ error: "Something went wrong with the server" });
    }
});

// ------------------------------------------------------------------------------------------------------- //

// Active Sem Fetching Coding

app.post('/activesem', async (req, res) => 
{
    const activeAcademic = await academic.findOne({
      where: { active_sem: 1 }
    })
    res.json(activeAcademic);
})
  
// ------------------------------------------------------------------------------------------------------- //

// Staff Details Fetching Coding

app.get('/staffdetails', async (req, res) => 
{
    const staffDetails = await staffmaster.findAll();
    res.json(staffDetails);
})

// ------------------------------------------------------------------------------------------------------- //

// // Scope Setting Coding

// app.get('/scopeset', async (req, res) => 
// {
//     const scopeData = await scope.findAll();
//     res.json(scopeData);
// });

// ------------------------------------------------------------------------------------------------------- //

// Scope Updating Coding

app.put('/updateScope', async (req, res) => 
{
    const { updates } = req.body;
    const staffIds = Object.keys(updates);
    try 
    {
        for (const staffId of staffIds) 
        {
            const updateData = updates[staffId];
            await scope.update(updateData, {
                where: {
                    staff_id: staffId,
                }
            });
        }
        res.status(200).send({ success: true, message: 'Scope data updated successfully' });
    }
    catch (error) {
        console.error("Error updating scope data:", error);
        res.status(500).send({ success: false, error: "Failed to update Scope Data" });
    }
});

// ------------------------------------------------------------------------------------------------------- //

// Staff Creating Coding

app.post('/newstaff', async (req, res) => 
{
    const { staff_id, staff_name, staff_dept, category, password, permissions } = req.body; 

    try 
    {
        const newStaff = await staffmaster.create({
            staff_id: staff_id,
            staff_name: staff_name,
            staff_dept: staff_dept,
            category: category,
            staff_pass: password
        });

        const newScope = await scope.create(
        {
            staff_id: staff_id, 
            dashboard: permissions.dashboard ? 1 : 0,
            course_list: permissions.course ? 1 : 0,
            course_outcome: permissions.co ? 1 : 0, 
            student_outcome: permissions.so ? 1 : 0, 
            program_outcome: permissions.po ? 1 : 0, 
            program_specific_outcome: permissions.pso ? 1 : 0,
            mentor_report: permissions.tutor ? 1 : 0,
            hod_report: permissions.hod ? 1 : 0,
            report: permissions.report ? 1 : 0,
            input_files: permissions.input ? 1 : 0,
            manage: permissions.manage ? 1 : 0,
            relationship_matrix: permissions.rsm ? 1 : 0,
            settings: permissions.setting ? 1 : 0,
        });

        return res.json({ message: 'New staff and permissions added successfully' });
    } 
    catch (err) {
        console.error('Error inserting data into the database:', err);
        return res.status(500).json({ message: 'Database error' });
    }
});

// ------------------------------------------------------------------------------------------------------- //

// Staff Creating Coding

app.get('/reportdata', async (req, res) => 
{
    const reportData = await report.findAll();
    res.json(reportData);
});

// ------------------------------------------------------------------------------------------------------- //

// Update Report
    
app.put('/updatereport', async (req, res) => 
{
    const { updates } = req.body;
    const staffIds = Object.keys(updates);

    try 
    {
        for (const staffId of staffIds) 
        {
            const updateData = updates[staffId];
            const updateFields = {
                cia_1: updateData.cia_1 ? 1 : 0,
                cia_2: updateData.cia_2 ? 1 : 0,
                ass_1: updateData.ass_1 ? 1 : 0,
                ass_2: updateData.ass_2 ? 1 : 0,
                ese: updateData.ese ? 1 : 0
            };

            await markRelease.update(updateFields, {
                where: { staff_id: staffId }
            })
        }
        res.status(200).send({ success: true, message: 'Data updated successfully' });
    } 
    catch (error) {
        console.error("Error updating data:", error);
        res.status(500).send({ success: false, error: "Failed to update data" });
    }
})

// ------------------------------------------------------------------------------------------------------- //

// Update Mark Release

app.put('/updatemarkrelease', async (req, res) => 
{
    const { updates } = req.body;
    const regNumbers = Object.keys(updates);

    try 
    {
        for (const regNo of regNumbers) 
        {
            const updateData = updates[regNo];
            
            let updateFields = {
                cia_1: updateData.cia_1,
                cia_2: updateData.cia_2,
                ass_1: updateData.ass_1,
                ass_2: updateData.ass_2,
                ese: updateData.ese
            };

            await report.update(updateFields, {
                where: { staff_id: regNo } 
            });
        }

        res.status(200).send({ success: true, message: 'Mark release data updated successfully' });
    } 
    catch (error) {
        console.error("Error updating mark release:", error);
        res.status(500).send({ success: false, error: "Failed to update mark release data" });
    }
});

// ------------------------------------------------------------------------------------------------------- //