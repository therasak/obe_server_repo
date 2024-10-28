const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize_conn = require('./models/dbconnection');
const staffmaster = require('./models/staffmaster');
const studentmaster = require('./models/studentmaster');
const scope = require('./models/scope');
const report = require('./models/report');
const markentry = require('./models/markentry');
const coursemapping = require('./models/coursemapping');
const academic = require('./models/academic');
const rsmatrix = require('./models/rsmatrix');

const DashBoard = require('./routes/dash');
const CourseList = require('./routes/courselist');
const ScopeManage = require('./routes/scopemanage');
const FileUpload = require('./routes/fileupload');
const FileDownload = require('./routes/filedownload');
const StatusReport = require('./routes/statusreport');
const Settings = require('./routes/settings');
const Rsmatrix = require('./routes/rsmatrix');
const Studentmanage = require('./routes/studentmanage');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/api', DashBoard);
app.use('/api', CourseList);
app.use('/api', ScopeManage);
app.use('/api', FileUpload);
app.use('/api', FileDownload);
app.use('/api', StatusReport);
app.use('/api', Settings);
app.use('/api', Rsmatrix);
app.use('/api', Studentmanage);

app.use(bodyParser.json({ limit: '10mb' }));

require('dotenv').config();

const port = process.env.PORT || 5001;
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
//         // await rsmatrix.sync();
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


//         await markentry.sync();
//         console.log('Markentry Table Synced');

//         // Synchronize the markentry model
//         await report.sync();
//         await rsmatrix.sync();
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

    try 
    {
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
            res.status(404).json({ error: "Academic Year Not Found" });
        }
    }
    catch (error) {
        console.error('Error: ', error);
        res.status(500).json({ error: "Something went wrong with the Server" });
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

// Staff Creating Coding

// app.get('/reportdata', async (req, res) => {
//     try {
//         const reportData = await report.findAll({
//             include: [
//                 {
//                     model: coursemapping,
//                     attributes: ['staff_name', 'course_id'],
//                     required: true, 
//                 }
//             ],
//             attributes: ['staff_id', 'category', 'section', 'cia_1', 'cia_2', 'ass_1', 'ass_2', 'ese'], 
//         });
//         res.json(reportData);
//     } catch (error) {
//         console.error("Error fetching report data:", error);
//         res.status(500).send({ success: false, error: "Failed to fetch report data" });
//     }
// });

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
// update staf
app.put('/staffupdate',async (req,res)=>{
    const {newstaffid,newstaffname,newpassword,newdept,newcategory}=req.body;
    try{
        const updated_staff = await staffmaster.update(
            { staff_name:newstaffname, 
              staff_pass:newpassword,
              staff_dept:newdept,
              category:newcategory
            },

            { where: { staff_id: newstaffid } }
        );

        res.json({ message: 'Staff updated successfully' })
    }
    catch(err){
        console.log("error while update")
    }
})

// ------------------------------------------------------------------------------------------------------- //
// delete staff

app.post('/staffdelete', async (req,res)=>{
    const {deletestaffid}=req.body;
    console.log(deletestaffid);
    try{
        const deleteresult = await staffmaster.destroy({
            where: { staff_id: deletestaffid }
        });
        res.json({message:"staff successfully delete"})
    }
    catch(err)
    {
        console.log(err,"delete error")
    }
})


app.post('/newstaff', async (req, res) => {
    const { staff_id, staff_name, staff_dept, category, password, permissions } = req.body; // Include permissions

    try {
        // Create a new staff member
        const newStaff = await staffmaster.create({
            staff_id: staff_id,
            staff_name: staff_name,
            staff_dept: staff_dept,
            category: category,
            staff_pass: password
        });

        // Create a corresponding scope entry for permissions
        const newScope = await scope.create({
            staff_id: staff_id, // Link the permission to the staff ID
            dashboard: permissions.dashboard ? 1 : 0,
            course_list: permissions.course ? 1 : 0,
            course_outcome: permissions.co ? 1 : 0, // Renamed for uniqueness
            student_outcome: permissions.so ? 1 : 0, // Renamed for uniqueness
            program_outcome: permissions.po ? 1 : 0, // Renamed for uniqueness
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
    } catch (err) {
        console.error('Error inserting data into the database:', err);
        return res.status(500).json({ message: 'Database error' });
    }
});

app.get('/reportdata', async (req, res) => {
    try {
        const reportData = await report.findAll();
        const staff = await coursemapping.findAll();
        const matchData = reportData.map(match=>{
            const matchStaff = staff.find(staff => staff.staff_id === match.staff_id && staff.course_code === match.course_code);
            if(matchStaff){
                return{
                    ...match.toJSON(),
                    staff_name: matchStaff.staff_name,
                    course_id: matchStaff.course_id
                }   
            }else{
                return{
                    ...match.toJSON(),
                    staff_name: 'unknown',
                    course_id: 'unknown'
                }   
            }
        })
        console.log(matchData);
        const count = await report.count();
        console.log(count)
        res.json(matchData);
    } catch (error) {
        console.error("Error fetching report data:", error);
        res.status(500).send({ success: false, error: "Failed to fetch report data" });
    }
});

app.put('/reportrelease', async (req, res)=>{
    const {dept_name,course_code, category, section, cia_1, cia_2, ass_1, ass_2, ese,} = req.body;
    console.log(dept_name,course_code, section, cia_1, cia_2, ass_1, ass_2, ese)
    try{
        const update = await report.update({cia_1, cia_2, ass_1, ass_2, ese}, {where: {course_code, section, dept_name, category}})
        if (update){
            res.status(200).json({ message: 'Update successful' });
        }
    }
    catch(err){
        console.error('Error for Updating')
        res.status(500)
    }
   
})
app.put('/overallrelease', async (req, res) => {
    const {l_cia1,l_cia2 , l_a1, l_a2, l_ese} =req.body;
    console.log(l_cia1)
    try{
        const update = await report.update({l_c1 : l_cia1, l_c2 : l_cia2, l_a1 : l_a1, l_a2 : l_a2, l_ese : l_ese }, {where: {}})
        if (update){
            res.status(200)
        }
    }catch(err){
        console.error('Error for Updating')
        res.status(500)
    }
})


app.post('/coursecode', async (req, res) => {
    const { academic_year, staff_id } = req.body; 

    try {
        const courseMappings = await coursemapping.findAll({
            where: { 
                active_sem: academic_year,  
                staff_id: staff_id           
            },
            attributes: ['course_code', 'active_sem']
        });

        if (courseMappings.length === 0) {
            return res.status(404).json({ error: 'No course codes found for the given academic year and staff ID.' });
        }

        const uniqueCourseDetails = Array.from(
            new Set(courseMappings.map(item => item.course_code))
        ).map(course_code => ({
            course_code: course_code,
            active_sem: courseMappings.find(item => item.course_code === course_code).active_sem
        }));

        res.json(uniqueCourseDetails);
    } 
    catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching course codes.'});
}
});
