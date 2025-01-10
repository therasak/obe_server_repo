const express = require('express');
const route = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads' })
const XLSX = require('xlsx');

const academic = require('../models/academic');
const coursemapping = require('../models/coursemapping');
const report = require('../models/report');
const markentry = require('../models/markentry');
const scope = require('../models/scope');
const mentor = require('../models/mentor');
const hod = require('../models/hod');
const studentmaster = require('../models/studentmaster');
const staffmaster = require('../models/staffmaster');
const calculation = require('../models/calculation');
const rsmatrix = require('../models/rsmatrix');

// ------------------------------------------------------------------------------------------------------- //

// Course Mapping File Upload

route.post('/coursemapping', upload.single('file'), async (req, res) => {
    try {
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

route.post('/staffmaster', upload.single('file'), async (req, res) => {
    try {
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

route.post('/studentmaster', upload.single('file'), async (req, res) => {
    try {
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

route.post('/scope', upload.single('file'), async (req, res) => {
    try {
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

route.post('/markentry', upload.single('file'), async (req, res) => {
    try {
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

// ESE Mark Entry File Upload

route.post('/ese', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);

        // Array to store updates to be processed in bulk
        const updates = [];

        // Loop through rows and prepare the update data
        for (const row of rows) {
            const { reg_no, course_code, ese_lot, ese_mot, ese_hot, ese_total } = row;

            // Ensure that the fields are numbers or set to -1 if invalid
            const updatedData = {
                ese_lot: typeof ese_lot === 'number' ? ese_lot : -1,
                ese_mot: typeof ese_mot === 'number' ? ese_mot : -1,
                ese_hot: typeof ese_hot === 'number' ? ese_hot : -1,
                ese_total: typeof ese_total === 'number' ? ese_total : -1,
            };

            // Check if entry exists and needs to be updated
            const existingEntry = await markentry.findOne({
                where: { reg_no, course_code },
                attributes: ['ese_lot', 'ese_mot', 'ese_hot', 'ese_total'],
            });

            // Only add to the updates array if the data has changed
            if (existingEntry) {
                let shouldUpdate = false;
                for (const key in updatedData) {
                    if (existingEntry[key] !== updatedData[key]) {
                        shouldUpdate = true;
                        break;
                    }
                }

                if (shouldUpdate) {
                    updates.push({
                        reg_no,
                        course_code,
                        updatedData,
                    });
                }
            }
        }

        // If we have any updates, perform them in bulk
        if (updates.length > 0) {
            const updatePromises = updates.map(async (update) => {
                await markentry.update(update.updatedData, {
                    where: {
                        reg_no: update.reg_no,
                        course_code: update.course_code,
                    },
                });
            });

            await Promise.all(updatePromises); // Perform all updates concurrently
        }

        res.status(200).send('Mark Data Imported and Updated Successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});
// ------------------------------------------------------------------------------------------------------- //

// Report File Upload

route.post('/report', upload.single('file'), async (req, res) => {
    try {
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

        res.status(200).send('Report Data Imported Successfully');
    }
    catch (error) {
        console.error('Error processing report upload:', error);
        res.status(500).send('An error occurred while processing the report');
    }
})

// ------------------------------------------------------------------------------------------------------- //

// Mentor File Upload

route.post('/mentor', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;

        // Check if file is uploaded
        if (!file) {
            return res.status(400).send('File Upload Failed');
        }

        // Read the Excel file
        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);

        // Get the active academic year
        const activeAcademic = await academic.findOne({
            where: { active_sem: 1 },
        });

        if (!activeAcademic) {
            return res.status(400).send('No Active Academic Year Found');
        }

        const activeSemester = activeAcademic.academic_year;

        for (const row of rows) {
            // Check if staff_id exists in scope table and mentor_report is 0
            const existingScope = await scope.findOne({
                where: { staff_id: row.staff_id },
            });

            if (existingScope && existingScope.mentor_report === 0) {
                // Insert or update mentor table
                await mentor.upsert({
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
                    active_sem: activeSemester,
                });

                // Update mentor_report in scope table to 1
                await scope.update(
                    { mentor_report: 1 },
                    { where: { staff_id: row.staff_id } }
                );
            }
        }

        res.status(200).send('Mentor Data and Scope Updated Successfully');
    } catch (error) {
        console.error('Error Processing Mentor Upload:', error);
        res.status(500).send('An error occurred while processing the mentor upload');
    }
});


// ------------------------------------------------------------------------------------------------------- //

// Hod File Upload

route.post('/hod', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).send('File Upload Failed');
        }

        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);


        const activeAcademic = await academic.findOne({
            where: { active_sem: 1 },
        });

        if (!activeAcademic) {
            return res.status(400).send('No Active Academic Year Found');
        }

        const activeSemester = activeAcademic.academic_year;

        for (const row of rows) {
            await hod.upsert({
                s_no: row.s_no,
                graduate: row.graduate,
                course_id: row.course_id,
                category: row.category,
                dept_name: row.dept_name,
                staff_id: row.staff_id,
                hod_name: row.hod_name,
            });
        }

        const staffIds = rows.map(row => row.staff_id);
        await scope.update(
            { hod_report: 1 },
            {
                where: {
                    staff_id: staffIds,
                },
            }
        );

        res.status(200).send('HOD Data Imported and Scope Table Updated Successfully');
    } catch (error) {
        console.error('Error Processing HOD Upload:', error);
        res.status(500).send('An error occurred while processing the HOD file');
    }
});


// ------------------------------------------------------------------------------------------------------- //

// Calculation File Upload

route.post('/calculation', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).send('No File Uploaded.');
        }

        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);

        const calculations = rows.map(row => ({
            s_no:row.s_no,
            active_sem: row.active_sem,
            c1_lot: row.c1_lot,
            c1_mot: row.c1_mot,
            c1_hot: row.c1_hot,
            c2_lot: row.c2_lot,
            c2_mot: row.c2_mot,
            c2_hot: row.c2_hot,
            a1_lot: row.a1_lot,
            a1_mot: row.a1_mot,
            a1_hot: row.a1_hot,
            a2_lot: row.a2_lot,
            a2_mot: row.a2_mot,
            a2_hot: row.a2_hot,
            c_lot: row.c_lot,
            c_mot: row.c_mot,
            c_hot: row.c_hot,
            e_lot: row.e_lot,
            e_mot: row.e_mot,
            e_hot: row.e_hot,
            so_l0_ug: row.so_l0_ug,
            so_l1_ug: row.so_l1_ug,
            so_l2_ug: row.so_l2_ug,
            so_l3_ug: row.so_l3_ug,
            so_l0_pg: row.so_l0_pg,
            so_l1_pg: row.so_l1_pg,
            so_l2_pg: row.so_l2_pg,
            so_l3_pg: row.so_l3_pg,
            cia_weightage: row.cia_weightage,
            ese_weightage: row.ese_weightage,
            co_thresh_value: row.co_thresh_value
        }));


        for (const data of calculations) {
            await calculation.upsert(data);
        }

        res.status(200).send('Calculation Table Imported Successfully Updated Successfully');
    } catch (error) {
        console.error("Error in upload:", error);
        res.status(500).send('An error occurred');
    }
});


// ------------------------------------------------------------------------------------------------------- //

// Academic File Upload

route.post('/academic', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).send('No File Uploaded.');
        }

        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);

        const calculations = rows.map(row => ({
            s_no:row.s_no,
            academic_year:row.academic_year,
            sem:row.sem,
            active_sem: row.active_sem,
        }));


        for (const data of calculations) {
            await academic.upsert(data);
        }

        res.status(200).send('Academic Table Imported Successfully Updated Successfully');
    } catch (error) {
        console.error("Error in upload:", error);
        res.status(500).send('An error occurred');
    }
});


// ------------------------------------------------------------------------------------------------------- //

// RSmatrix File Upload

route.post('/rsmatrix', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).send('No File Uploaded.');
        }

        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);

        // const activeAcademic = await academic.findOne({
        //     where: { active_sem: 1 }
        // });

        // if (!activeAcademic) {
        //     return res.status(400).send('No Active Academic Year Found');
        // }

        // const activeSemester = activeAcademic.academic_year;

        const rsmatrixs = rows.map(row => ({
            s_no:row.s_no,
            academic_year:row.academic_year,
            course_id:row.course_id, 
            course_code:row.course_code, 
            co1_po1:row.co1_po1, 
            co1_po2:row.co1_po2, 
            co1_po3:row.co1_po3, 
            co1_po4:row.co1_po4, 
            co1_po5:row.co1_po5, 
            co1_pso1:row.co1_pso1,
            co1_pso2:row.co1_pso2,
            co1_pso3:row.co1_pso3,
            co1_pso4:row.co1_pso4,
            co1_pso5:row.co1_pso5,
            co1_mean:row.co1_mean,
            
            co2_po1:row.co2_po1, 
            co2_po2:row.co2_po2, 
            co2_po3:row.co2_po3, 
            co2_po4:row.co2_po4, 
            co2_po5:row.co2_po5, 
            co2_pso1:row.co2_pso1,
            co2_pso2:row.co2_pso2,
            co2_pso3:row.co2_pso3,
            co2_pso4:row.co2_pso4,
            co2_pso5:row.co2_pso5,
            co2_mean:row.co2_mean,

            co3_po1:row.co3_po1, 
            co3_po2:row.co3_po2, 
            co3_po3:row.co3_po3, 
            co3_po4:row.co3_po4, 
            co3_po5:row.co3_po5, 
            co3_pso1:row.co3_pso1,
            co3_pso2:row.co3_pso2,
            co3_pso3:row.co3_pso3,
            co3_pso4:row.co3_pso4,
            co3_pso5:row.co3_pso5,
            co3_mean:row.co3_mean,

            co4_po1:row.co4_po1, 
            co4_po2:row.co4_po2, 
            co4_po3:row.co4_po3, 
            co4_po4:row.co4_po4, 
            co4_po5:row.co4_po5, 
            co4_pso1:row.co4_pso1,
            co4_pso2:row.co4_pso2,
            co4_pso3:row.co4_pso3,
            co4_pso4:row.co4_pso4,
            co4_pso5:row.co4_pso5,
            co4_mean:row.co4_mean,

            co5_po1:row.co5_po1, 
            co5_po2:row.co5_po2, 
            co5_po3:row.co5_po3, 
            co5_po4:row.co5_po4, 
            co5_po5:row.co5_po5, 
            co5_pso1:row.co5_pso1,
            co5_pso2:row.co5_pso2,
            co5_pso3:row.co5_pso3,
            co5_pso4:row.co5_pso4,
            co5_pso5:row.co5_pso5,
            co5_mean:row.co5_mean,

            mean:row.mean,
            olrel:row.olrel
            
            
        }));


        for (const data of rsmatrixs) {
            await rsmatrix.upsert(data);
        }

        res.status(200).send('RS Matrix Table Imported Successfully Updated Successfully');
    } catch (error) {
        console.error("Error in upload:", error);
        res.status(500).send('An error occurred');
    }
});


module.exports = route;