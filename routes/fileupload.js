const express = require ('express');
const route = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads' })
const XLSX = require('xlsx');

const academic = require('../models/academic');
const coursemapping = require('../models/coursemapping');
const report = require('../models/report');
const studentmaster = require('../models/studentmaster');
const staffmaster = require('../models/staffmaster');
const markentry = require('../models/markentry');
const scope = require('../models/scope');
const mentor = require('../models/mentor');

// ------------------------------------------------------------------------------------------------------- //

// Course Mapping File Upload

route.post('/coursemapping', upload.single('file'), async (req, res) => 
{
    try 
    {
        const file = req.file;
        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);

        const activeAcademic = await academic.findOne({
            where: { active_sem: 1 }
        });

        if (!activeAcademic) {
            return res.status(400).send('No Active Academic Year Found');
        }

        const activeSemester = activeAcademic.academic_year;

        const course = rows.map(row => ({
            category: row.category,
            batch: row.batch,
            course_id: row.course_id,
            degree: row.degree,
            dept_name: row.dept_name,
            semester: row.semester,
            section: row.section,
            course_code: row.course_code,
            staff_id: row.staff_id,
            staff_name: row.staff_name,
            course_title: row.course_title,
            active_sem: activeSemester
        }));

        await coursemapping.bulkCreate(course);

        const reportData = rows.map(row => ({
            staff_id: row.staff_id,
            course_code: row.course_code,
            category: row.category,
            section: row.section,
            dept_name: row.dept_name,
            active_sem: activeSemester
        }));

        await report.bulkCreate(reportData, { ignoreDuplicates: true });

        res.status(200).send('Course Mapping Data Imported Successfully');
    } 
    catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
})

// ------------------------------------------------------------------------------------------------------- //

// Staff Master File Upload

route.post('/staffmaster', upload.single('file'), async (req, res) => 
{
    try 
    {
        const file = req.file;
        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);

        const staffData = rows.map(row => ({
            staff_id: row.staff_id,
            staff_name: row.staff_name,
            staff_pass: row.staff_pass,
            staff_dept: row.staff_dept,
            category: row.category
        }))

        for (const staff of staffData) {
            await staffmaster.upsert(staff, {
                where: { staff_id: staff.staff_id }
            })
        }

        res.status(200).send('Staff Master Data Imported and Updated Successfully');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
})

// ------------------------------------------------------------------------------------------------------- //

// Student Master File Upload

route.post('/studentmaster', upload.single('file'), async (req, res) => 
{
    try 
    {
        const file = req.file;
        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);

        const activeAcademic = await academic.findOne({
            where: { active_sem: 1 }
        });

        if (!activeAcademic) {
            return res.status(400).send('No Active Academic Year Found');
        }

        const activeSemester = activeAcademic.academic_year;

        const students = rows.map(row => ({
            reg_no: row.reg_no,
            stu_name: row.stu_name,
            course_id: row.course_id,
            category: row.category,
            semester: row.semester,
            section: row.section,
            batch: row.batch,
            mentor: row.mentor,
            emis: row.emis,
            active_sem: activeSemester
        }));

        await studentmaster.bulkCreate(students, {});

        res.status(200).send('Student Master Data Imported Successfully');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
})
    
// ------------------------------------------------------------------------------------------------------- //

// Scope File Upload

route.post('/scope', upload.single('file'), async (req, res) => 
{
    try 
    {
        const file = req.file;

        if (!file) {
            return res.status(400).send('No File Uploaded.');
        }

        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);

        const scopes = rows.map(row => ({
            staff_id: row.staff_id,
            role: row.role, 
            dashboard: row.dashboard,
            course_list: row.course_list,
            course_outcome: row.course_outcome,
            student_outcome: row.student_outcome,
            program_outcome: row.program_outcome,
            program_specific_outcome: row.program_specific_outcome,
            mentor_report: row.mentor_report,
            hod_report: row.hod_report,
            report: row.report,
            input_files: row.input_files,
            manage: row.manage,
            relationship_matrix: row.relationship_matrix,
            settings: row.settings
        }));

        await scope.bulkCreate(scopes, {});

        res.status(200).send('Scope Table Imported Successfully');
    } 
    catch (error) {
        console.error("Error in upload4:", error);
        res.status(500).send('An error occurred');
    }
});

// ------------------------------------------------------------------------------------------------------- //

// Mark Entry File Upload

route.post('/markentry', upload.single('file'), async (req, res) => 
{
    try 
    {
        const file = req.file;
        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);

        const activeAcademic = await academic.findOne({
            where: { active_sem: 1 }
        });

        if (!activeAcademic) {
            return res.status(400).send('No Active Academic Year Found');
        }
        const activeSemester = activeAcademic.academic_year;

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
            ese_total: row.ese_total,
            active_sem: activeSemester

        }));

        await markentry.bulkCreate(mark, {});
        res.status(200).send('Mark Entry Data Imported Successfully');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

// ------------------------------------------------------------------------------------------------------- //

// Department Mark Entry File Upload

route.post('/deptmarkentry', upload.single('file'), async (req, res) => 
{
    try 
    {
        const file = req.file;
        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);

        for (const row of rows) 
        {
            const { reg_no, course_code } = row;
            const existingEntry = await markentry.findOne({
                where: {
                    reg_no: reg_no,
                    course_code: course_code
                }
            });

            const updatedData = {
                course_id: row.course_id,
                c1_lot: row.c1_lot,
                c1_hot: row.c1_hot,
                c1_mot: row.c1_mot,
                c1_total: row.c1_total,
            };

            if (existingEntry) {
                await markentry.update(updatedData, {
                    where: {
                        reg_no: reg_no,
                        course_code: course_code
                    }
                });
            }
        }
        res.status(200).send('Department Mark Data Imported Successfully');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
})

// ------------------------------------------------------------------------------------------------------- //

// Report File Upload

route.post('/report', upload.single('file'), async (req, res) => 
{
    try 
    {
        const file = req.file;

        if (!file) {
            return res.status(400).send('File Upload Failed');
        }

        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);

        const activeAcademic = await academic.findOne({
            where: { active_sem: 1 }
        });

        if (!activeAcademic) {
            return res.status(400).send('No Active Academic Year Found');
        }

        const activeSemester = activeAcademic.academic_year;

        await report.destroy({ where: {}, truncate: true });

        const reports = rows.map(row => (
        {
            sno: row.s_no, 
            staff_id: row.staff_id,
            course_code: row.course_code,
            category: row.category,
            section: row.section,
            dept_name: row.dept_name,
            cia_1: row.cia_1,
            cia_2: row.cia_2,
            ass_1: row.ass_1,
            ass_2: row.ass_2, 
            ese: row.ese,
            l_c1: row.l_c1,
            l_c2: row.l_c2,
            l_a1: row.l_a1,
            l_a2: row.l_a2,
            l_ese: row.l_ese,
            active_sem: activeSemester 
        }));

        await report.bulkCreate(reports);

        res.status(200).send('Report Data Imported and Replaced Successfully');
    } 
    catch (error) {
        console.error('Error processing report upload:', error);
        res.status(500).send('An error occurred while processing the report');
    }
})

// ------------------------------------------------------------------------------------------------------- //

// Mentor File Upload

route.post('/mentor', upload.single('file'), async (req, res) => 
{
    try 
    {
        const file = req.file;

        if (!file) {
            return res.status(400).send('File Upload Failed');
        }

        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);

        const activeAcademic = await academic.findOne({
            where: { active_sem: 1 }
        })

        if (!activeAcademic) {
            return res.status(400).send('No Active Academic Year Found');
        }

        const activeSemester = activeAcademic.academic_year;

        await mentor.destroy({ where: {}, truncate: true });

        const mentorData = rows.map(row => ({
            sno: row.sno,
            graduate: row.graduate,
            course_id: row.course_id,
            category: row.category,
            degree: row.degree,
            dept_name: row.dept_name,
            section: row.section,
            batch: row.batch,
            staff_id: row.staff_id,
            staff_name: row.staff_name,
            active_sem: activeSemester
        }))

        await mentor.bulkCreate(mentorData);

        const updatedStaffIds = mentorData.map(data => data.staff_id);
        await scope.update(
            { mentor_report: 1 },
            {
                where: {
                    staff_id: updatedStaffIds.map(id => `${id}`),
                    mentor_report: 0
                }
            }
        );
        res.status(200).send('Mentor Data Imported Successfully');
    } 
    catch (error) {
        console.error('Error Processing Mentor Upload:', error);
        res.status(500).send('An error occurred while processing the mentor');
    }
})

// ------------------------------------------------------------------------------------------------------- //

// Mentor File Upload

route.post('/hod', upload.single('file'), async (req, res) => 
{
    try 
    {
        const file = req.file;

        if (!file) {
            return res.status(400).send('File Upload Failed');
        }

        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);

        const activeAcademic = await academic.findOne({
            where: { active_sem: 1 }
        })

        if (!activeAcademic) {
            return res.status(400).send('No Active Academic Year Found');
        }

        const activeSemester = activeAcademic.academic_year;

        await hod.destroy({ where: {}, truncate: true });

        const mentorData = rows.map(row => ({
            sno: row.sno,
            graduate: row.graduate,
            course_id: row.course_id,
            category: row.category,
            degree: row.degree,
            dept_name: row.dept_name,
            section: row.section,
            batch: row.batch,
            staff_id: row.staff_id,
            staff_name: row.staff_name,
            active_sem: activeSemester
        }))

        await mentor.bulkCreate(mentorData);

        const updatedStaffIds = mentorData.map(data => data.staff_id);
        await scope.update(
            { mentor_report: 1 },
            {
                where: {
                    staff_id: updatedStaffIds.map(id => `${id}`),
                    mentor_report: 0
                }
            }
        );
        res.status(200).send('Mentor Data Imported Successfully');
    } 
    catch (error) {
        console.error('Error Processing Mentor Upload:', error);
        res.status(500).send('An error occurred while processing the mentor');
    }
})

module.exports = route;