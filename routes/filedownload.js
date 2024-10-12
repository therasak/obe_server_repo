const express = require ('express');
const route = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');

const coursemapping = require('../models/coursemapping');
const report = require('../models/report');
const studentmaster = require('../models/studentmaster');
const staffmaster = require('../models/staffmaster');
const markentry = require('../models/markentry');
// Course Mapping Downlaod Excel 

route.get('/download/coursemap', async (req, res) => 
    {
        try 
        {
            const courseData = await coursemapping.findAll();
            
            const formattedData = [
                ['Category', 'Batch', 'Course ID', 'Degree', 'Department Name', 'Semester', 
                 'Section', 'Course Code', 'Staff ID', 'Staff Name', 'Course Title', 'Active Semester'],
                ...courseData.map(course => [
                    course.category,
                    course.batch,
                    course.course_id,
                    course.degree,
                    course.dept_name,
                    course.semester,
                    course.section,
                    course.course_code,
                    course.staff_id,
                    course.staff_name,
                    course.course_title,
                    course.active_sem
                ])
            ];
    
            const ws = XLSX.utils.aoa_to_sheet(formattedData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Course Mapping Data');
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
            res.setHeader('Content-Disposition', 'attachment; filename = Course Mapping Data.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(excelBuffer);
        } 
        catch (error) {
            console.error('Error generating Excel file:', error);
            res.status(500).send('Server error');
        }
    });
    
    // ------------------------------------------------------------------------------------------------------- //
    
    // Staff Master Download Excel
    
    route.get('/download/staff', async (req, res) => 
    {
        try 
        {
            const staffData = await staffmaster.findAll();
            const formattedData = [
                ['Staff ID', 'Staff Name', 'Staff Password', 'Staff Department', 'Category'],
                ...staffData.map(staff =>
                    [
                        staff.staff_id,
                        staff.staff_name,
                        staff.staff_pass,
                        staff.staff_dept,
                        staff.category
                    ])
            ];
    
            const ws = XLSX.utils.aoa_to_sheet(formattedData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Staff Data');
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
            res.setHeader('Content-Disposition', 'attachment; filename = Staff Master Data.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(excelBuffer);
        }
        catch (error) {
            console.error('Error generating Excel file:', error);
            res.status(500).send('Server error');
        }
    });
    
    // ------------------------------------------------------------------------------------------------------- //
    
    // Student Master Excel Download
    
    
    route.get('/download/studentmaster', async (req, res) => 
    {
        try 
        {
            const studentData = await studentmaster.findAll();
    
            const formattedData = [
                ['Registration No', 'Student Name', 'Course ID', 'Category', 'Semester', 
                 'Section', 'Batch', 'Mentor', 'EMIS', 'Active Semester'],
                ...studentData.map(student => [
                    student.reg_no,
                    student.stu_name,
                    student.course_id,
                    student.category,
                    student.semester,
                    student.section,
                    student.batch,
                    student.mentor,
                    student.emis,
                    student.active_sem
                ])
            ];
    
            const ws = XLSX.utils.aoa_to_sheet(formattedData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Student Master Data');
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
            res.setHeader('Content-Disposition', 'attachment; filename = Student Master Data.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(excelBuffer);
        } 
        catch (error) {
            console.error('Error generating Excel file:', error);
            res.status(500).send('Server error');
        }
    });
    
    // ------------------------------------------------------------------------------------------------------- //
    
    // Scope Excel Download
    
    route.get('/download/scope', async (req, res) => 
    {
        try {
            const scopeData = await scope.findAll();
    
            const formattedData = [
                ['STAFF_ID', 'ROLE', 'DASHBOARD', 'COURSE_LIST', 'COURSE_OUTCOME', 
                 'STUDENT_OUTCOME', 'PROGRAM_OUTCOME', 'PROGRAM_SPECIFIC_OUTCOME', 
                 'MENTOR_REPORT', 'HOD_REPORT', 'REPORT', 'INPUT_FILES', 
                 'MANAGE', 'RELATIONSHIP_MATRIX', 'SETTINGS', 'LOGOUT'],
                ...scopeData.map(scope => [
                    scope.staff_id,
                    scope.role,
                    scope.dashboard,
                    scope.course_list,
                    scope.course_outcome,
                    scope.student_outcome,
                    scope.program_outcome,
                    scope.program_specific_outcome,
                    scope.mentor_report,
                    scope.hod_report,
                    scope.report,
                    scope.input_files,
                    scope.manage,
                    scope.relationship_matrix,
                    scope.settings,
                    scope.logout
                ])
            ];
    
            const ws = XLSX.utils.aoa_to_sheet(formattedData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Scope Data');
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
            res.setHeader('Content-Disposition', 'attachment; filename = Scope Data.xlsx'); 
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(excelBuffer);
        } 
        catch (error) {
            console.error('Error generating Excel file:', error);
            res.status(500).send('Server error');
        }
    });
    
    // ------------------------------------------------------------------------------------------------------- //
    
    
    // Student Mark Entry Excel Download
    
    route.get('/download/mark', async (req, res) => 
    {
        try 
        {
            const markData = await markentry.findAll();
            const formattedData = [
                ['SNO', 'BATCH', 'CATEGORY', 'COURSE_ID', 'REG_NO', 'COURSE_CODE', 'SEMESTER', 'C1_LOT', 'C1_HOT', 'C1_MOT', 'C1_TOTAL',
                    'C2_LOT', 'C2_HOT', 'C2_MOT', 'C2_TOTAL', 'A1_LOT', 'A2_LOT', 'ESE_LOT', 'ESE_HOT', 'ESE_MOT', 'ESE_TOTAL'],
    
                ...markData.map(student =>
                    [
                        student.s_no,
                        student.batch,
                        student.category,
                        student.course_id,
                        student.reg_no,
                        student.course_code,
                        student.semester,
                        student.c1_lot,
                        student.c1_hot,
                        student.c1_mot,
                        student.c1_total,
                        student.c2_lot,
                        student.c2_hot,
                        student.c2_mot,
                        student.c2_total,
                        student.a1_lot,
                        student.a2_lot,
                        student.ese_lot,
                        student.ese_hot,
                        student.ese_mot,
                        student.ese_total
                    ])
            ];
    
            const ws = XLSX.utils.aoa_to_sheet(formattedData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Mark Data');
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
            res.setHeader('Content-Disposition', 'attachment; filename = Mark Entry Data.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(excelBuffer);
        }
        catch (error) {
            console.error('Error generating Excel file:', error);
            res.status(500).send('Server error');
        }
    });
        
    // ------------------------------------------------------------------------------------------------------- //
        
    // Dept Mark Entry Excel Download
    
    route.get('/download/deptmarkentry', async (req, res) => 
    {
        try 
        {
            const markData = await markentry.findAll();
            
            const formattedData = [
                ['Registration No', 'Course Code', 'Course ID', 'C1 LOT', 'C1 HOT', 
                 'C1 MOT', 'C1 Total'],
                ...markData.map(entry => [
                    entry.reg_no,
                    entry.course_code,
                    entry.course_id,
                    entry.c1_lot,
                    entry.c1_hot,
                    entry.c1_mot,
                    entry.c1_total
                ])
            ];
    
            const ws = XLSX.utils.aoa_to_sheet(formattedData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Dept Mark Entry Data');
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
            res.setHeader('Content-Disposition', 'attachment; filename = Dept Mark Entry.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(excelBuffer);
        } 
        catch (error) {
            console.error('Error generating Excel file:', error);
            res.status(500).send('Server error');
        }
    });
    
    // ------------------------------------------------------------------------------------------------------- //
    
    // Report Excel Download
    
    route.get('/download/report', async (req, res) => 
    {
        try 
        {
            const reportData = await report.findAll();
    
            const formattedData = [
                ['STAFF_ID', 'COURSE_CODE', 'CATEGORY', 'SECTION', 'DEPT_NAME', 
                 'CIA_1', 'CIA_2', 'ASS_1', 'ASS_2', 'ESE', 
                 'L_C1', 'L_C2', 'L_A1', 'L_A2', 'L_ESE', 'ACTIVE_SEM'],
                ...reportData.map(reports => [
                    reports.staff_id,
                    reports.course_code,
                    reports.category,
                    reports.section,
                    reports.dept_name,
                    reports.cia_1,
                    reports.cia_2,
                    reports.ass_1,
                    reports.ass_2,
                    reports.ese,
                    reports.l_c1,
                    reports.l_c2,
                    reports.l_a1,
                    reports.l_a2,
                    reports.l_ese,
                    reports.active_sem
                ])
            ];
    
            const ws = XLSX.utils.aoa_to_sheet(formattedData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Report Data');
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
            res.setHeader('Content-Disposition', 'attachment; filename = Report Data.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(excelBuffer);
        } 
        catch (error) {
            console.error('Error generating Excel file:', error);
            res.status(500).send('Server error');
        }
    });
    // ------------------------------------------------------------------------------------------------------- //
module.exports=route;