const express = require ('express');
const route = express.Router();
const XLSX = require('xlsx');
const coursemapping = require('../models/coursemapping');
const report = require('../models/report');
const studentmaster = require('../models/studentmaster');
const staffmaster = require('../models/staffmaster');
const markentry = require('../models/markentry');
const scope = require('../models/scope');
const mentor = require('../models/mentor');
const hod = require('../models/hod');

// ------------------------------------------------------------------------------------------------------- //

// Course Mapping Downlaod Excel 

route.get('/download/coursemap', async (req, res) => 
{
    try 
    {
        const courseData = await coursemapping.findAll();
        
        const formattedData = [
            ['category', 'batch', 'course_id', 'degree', 'dept_name', 'semester', 
                'section', 'course_code', 'staff_id', 'staff_name', 'course_title', 'active_sem'],
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
})

// ------------------------------------------------------------------------------------------------------- //

// Sample Model File Download

route.get('/download/coursemapmodel', async (req, res) => 
{
    try 
    {
        const courseData = await coursemapping.findAll();
        
        const formattedData = [
            ['category', 'batch', 'course_id', 'degree', 'dept_name', 'semester', 
                'section', 'course_code', 'staff_id', 'staff_name', 'course_title', 'active_sem'],
        ]

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
})
// ------------------------------------------------------------------------------------------------------- //
    
// Staff Master Download Excel
    
route.get('/download/staff', async (req, res) => 
{
    try 
    {
        const staffData = await staffmaster.findAll();
        const formattedData = [
            ['staff_id', 'staff_name', 'staff_pass', 'staff_dept', 'category'],
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
})

// ------------------------------------------------------------------------------------------------------- //
   
// Sample Model File Download

route.get('/download/staffmodel', async (req, res) => 
{
    try 
    {
        const staffData = await staffmaster.findAll();
        const formattedData = [
            ['staff_id', 'staff_name', 'staff_pass', 'staff_dept', 'category'],

        ]

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
})

// ------------------------------------------------------------------------------------------------------- //
    
// Student Master Excel Download
    
route.get('/download/studentmaster', async (req, res) => 
{
    try 
    {
        const studentData = await studentmaster.findAll();

        const formattedData = [
            ['reg_no', 'stu_name', 'course_id', 'category', 'semester', 
                'section', 'batch', 'mentor', 'emis', 'active_sem'],
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
})

// ------------------------------------------------------------------------------------------------------- //

// Sample Model File Download
 
route.get('/download/studentmastermodel', async (req, res) => 
{
    try 
    {
        const studentData = await studentmaster.findAll();

        const formattedData = [
            ['reg_no', 'stu_name', 'course_id', 'category', 'semester', 
                'section', 'batch', 'mentor', 'emis', 'active_sem'],
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
})
        
// ------------------------------------------------------------------------------------------------------- //

// Scope Excel Download

route.get('/download/scope', async (req, res) => 
{
    try 
    {
        const scopeData = await scope.findAll();

        const formattedData = 
        [
            ['staff_id', 'role', 'dashboard', 'course_list', 'course_outcome', 
                'student_outcome', 'program_outcome', 'program_specific_outcome', 
                'mentor_report', 'hod_report', 'report', 'input_files', 
                'manage', 'relationship_matrix', 'settings', 'logout'],

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

// Sample Model File Download

route.get('/download/scopemodel', async (req, res) => 
{
    try 
    {
        const scopeData = await scope.findAll();

        const formattedData = [
            ['staff_id', 'role', 'dashboard', 'course_list', 'course_outcome', 
                'student_outcome', 'program_outcome', 'program_specific_outcome', 
                'mentor_report', 'hod_report', 'report', 'input_files', 
                'manage', 'relationship_matrix', 'settings', 'logout'
            ],
        ]

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
})

// ------------------------------------------------------------------------------------------------------- //

// Student Mark Entry Excel Download

route.get('/download/mark', async (req, res) => 
{
    try 
    {
        const markData = await markentry.findAll();
        const formattedData = [
            
            ['s_no', 'batch', 'category', 'course_id', 'reg_no', 'course_code', 'semester', 'c1_lot', 'c1_hot', 'c1_mot', 'c1_total',
                'c2_lot', 'c2_hot', 'c2_mot', 'c2_total', 'a1_lot', 'a2_lot', 'ese_lot', 'ese_hot', 'ese_mot', 'ese_total'],

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
})

// ------------------------------------------------------------------------------------------------------- //
    
// Sample Model File Download

route.get('/download/markmodel', async (req, res) => 
{
    try 
    {
        const markData = await markentry.findAll();
        const formattedData = [
            ['s_no', 'batch', 'category', 'course_id', 'reg_no', 'course_code', 'semester', 'c1_lot', 'c1_hot', 'c1_mot', 'c1_total',
            'c2_lot', 'c2_hot', 'c2_mot', 'c2_total', 'a1_lot', 'a2_lot', 'ese_lot', 'ese_hot', 'ese_mot', 'ese_total'],
        ]

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
})

// ------------------------------------------------------------------------------------------------------- //
    
// Dept Mark Entry Excel Download

route.get('/download/ese', async (req, res) => 
{
    try 
    {
        const markData = await markentry.findAll();
        
        const formattedData = [
            ['reg_no', 'course_code','ese_lot', 'ese_mot', 'ese_hot', 
                 'ese_total'],
            ...markData.map(entry => [
                entry.reg_no,
                entry.course_code,
                entry.ese_lot,
                entry.ese_mot,
                entry.ese_hot,
                entry.ese_total
            ])
        ];

        const ws = XLSX.utils.aoa_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'ESE Mark Entry Data');
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

// Sample Model File Download

route.get('/download/esemodel', async (req, res) => 
{
    try 
    {
        const markData = await markentry.findAll();
        
        const formattedData = [
            ['reg_no', 'course_code','ese_lot', 'ese_mot', 'ese_hot', 
                    'ese_total'],
        ];

        const ws = XLSX.utils.aoa_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'ESE Mark Entry Data');
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
            ['sno', 'staff_id', 'course_code', 'category', 'section', 'dept_name', 
             'cia_1', 'cia_2', 'ass_1', 'ass_2', 'ese', 
             'l_c1', 'l_c2', 'l_a1', 'l_a2', 'l_ese', 'active_sem'],
            ...reportData.map((reports, index) => 
            [
                index + 1,
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
        ]

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
})

// ------------------------------------------------------------------------------------------------------- //

// Sample Model File Download

route.get('/download/reportmodel', async (req, res) => 
{
    try 
    {
        const reportData = await report.findAll();

        const formattedData = [
            ['sno', 'staff_id', 'course_code', 'category', 'section', 'dept_name', 
            'cia_1', 'cia_2', 'ass_1', 'ass_2', 'ese', 
            'l_c1', 'l_c2', 'l_a1', 'l_a2', 'l_ese', 'active_sem'],
        ]

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
})

// ------------------------------------------------------------------------------------------------------- //

// Mentor Excel Download

route.get('/download/mentor', async (req, res) => 
{
    try 
    {
        const mentorData = await mentor.findAll();

        const formattedData = [
            ['sno', 'graduate', 'course_code', 'category','degree','dept_name','section','batch','staff_id','staff_name', 'active_sem'],
            ...mentorData.map((mentor, index) => 
            [
                index + 1,
                mentor.graduate,
                mentor.course_code,
                mentor.category,
                mentor.degree,
                mentor.dept_name,                    
                mentor.section,
                mentor.batch,
                mentor.staff_id,            
                mentor.staff_name,
                mentor.active_sem
            ])
        ]

        const ws = XLSX.utils.aoa_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Mentor Data');

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        res.setHeader('Content-Disposition', 'attachment; filename = Mentor Data.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);
    } 
    catch (error) {
        console.error('Error generating Excel file:', error);
        res.status(500).send('Server error');
    }
})

// ------------------------------------------------------------------------------------------------------- //

// Sample Model File Download

route.get('/download/mentormodel', async (req, res) => 
{
    try 
    {
        const mentorData = await mentor.findAll();

        const formattedData = [
            ['sno', 'graduate', 'course_code', 'category','degree','dept_name','section','batch','staff_id','staff_name', 'active_sem'],
        ]

        const ws = XLSX.utils.aoa_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Mentor Data');

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        res.setHeader('Content-Disposition', 'attachment; filename = Mentor Data.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);
    } 
    catch (error) {
        console.error('Error generating Excel file:', error);
        res.status(500).send('Server error');
    }
})   

// ------------------------------------------------------------------------------------------------------- //

// Mentor Excel Download

route.get('/download/hod', async (req, res) => 
{
    try 
    {
        const hodData = await hod.findAll();

        const formattedData = [
            ['sno', 'graduate', 'course_id', 'category','degree','dept_name','section','batch','staff_id','hod_name','type'],
            ...hodData.map((hod, index) => 
            [ 
                index + 1,
                hod.graduate,
                hod.course_id,
                hod.category,
                hod.dept_name,                    
                hod.staff_id,            
                hod.hod_name,
            ])
        ]

        const ws = XLSX.utils.aoa_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Hod Data');

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        res.setHeader('Content-Disposition', 'attachment; filename = Hod Data.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);
    } 
    catch (error) {
        console.error('Error generating Excel file:', error);
        res.status(500).send('Server error');
    }
})

// ------------------------------------------------------------------------------------------------------- //

// Sample Model File Download

route.get('/download/hodmodel', async (req, res) => 
{
    try 
    {
        const mentorData = await hod.findAll();

        const formattedData = [
            ['sno', 'graduate', 'course_id', 'category','dept_name','staff_id','hod_name'],
        ]

        const ws = XLSX.utils.aoa_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Hod Data');

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        res.setHeader('Content-Disposition', 'attachment; filename = Hod Data.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);
    } 
    catch (error) {
        console.error('Error generating Excel file:', error);
        res.status(500).send('Server error');
    }
})

module.exports = route;