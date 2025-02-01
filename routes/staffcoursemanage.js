const express = require('express');
const router = express.Router();
const coursemapping = require('../models/coursemapping');
const report = require('../models/report');
const academic = require('../models/academic');

// ------------------------------------------------------------------------------------------------------- //

// Get all staff course details

router.get('/staffcoursemanage', async (req, res) => {

    try {

        const activeAcademic = await academic.findOne({ where: { active_sem: 1 } })

        const staffcourse = await coursemapping.findAll({
            where: { academic_sem: activeAcademic.academic_sem },
        })
        res.json(staffcourse);
    }
    catch (error) {
        console.error('Error fetching Staff Course Data :', error);
        res.status(500).json({ error: 'Error fetching Staff Data' });
    }
})

// ------------------------------------------------------------------------------------------------------- //

// Fetch Staff Id

router.get('/staffId', async (req, res) => {

    try {

        const activeAcademic = await academic.findOne({ where: { active_sem: 1 } })

        const staffData = await coursemapping.findAll({
            where: {
                academic_sem: activeAcademic.academic_sem
            },
            attributes: ['staff_id'],
        })

        const uniqueStaffIds = [...new Set(staffData.map(entry => entry.staff_id))];
        res.json(uniqueStaffIds)
    }
    catch (error) {
        console.error('Error fetching Staff Id :', error);
        res.status(500).json({ error: 'Error fetching Staff Id' });
    }
})

// ------------------------------------------------------------------------------------------------------- //

router.post('/staffname', async (req, res) => {

    try {

        const { staff_id } = req.body;

        const staffData = await coursemapping.findAll({
            where: { staff_id: staff_id },
            attributes: ['staff_name'],
        })

        const uniqueStaffNames = [...new Set(staffData.map(entry => entry.staff_name))];
        res.json(uniqueStaffNames)
    }
    catch (error) {
        console.error('Error fetching Staff Name :', error);
        res.status(500).json({ error: 'Error fetching Staff Name' });
    }
})

// ------------------------------------------------------------------------------------------------------- //

router.post('/depId', async (req, res) => {

    try {

        const { category } = req.body;

        const activeAcademic = await academic.findOne({ where: { active_sem: 1 } })

        const deptId = await coursemapping.findAll({
            where: {
                academic_sem: activeAcademic.academic_sem,
                category: category
            },
            attributes: ['dept_id']
        })

        const uniqueDeptIds = [...new Set(deptId.map(entry => entry.dept_id))];
        res.json(uniqueDeptIds)
    }
    catch (error) {
        console.error('Error fetching staff course data:', error);
        res.status(500).json({ error: 'Error fetching staff data' });
    }
})

// ------------------------------------------------------------------------------------------------------- //

router.post('/departmentname', async (req, res) => {

    try {

        const { dept_id } = req.body;

        const activeAcademic = await academic.findOne({ where: { active_sem: 1 } })

        const deptData = await coursemapping.findAll({
            where: { dept_id: dept_id },
            attributes: ['dept_name', 'degree']
        });

        const semester = await coursemapping.findAll({
            where: { academic_sem: activeAcademic.academic_sem, dept_id: dept_id },
            attributes: ['semester']
        })

        const uniqueDeptNames = [...new Set(deptData.map(entry => entry.dept_name))];
        const uniqueDegrees = [...new Set(deptData.map(entry => entry.degree))];
        const uniqueSemester = [...new Set(semester.map(entry => entry.semester))];

        // Respond with Dept Id, uniqueDeptNames, uniqueDegrees, and deptData

        res.json({ uniqueDeptNames: uniqueDeptNames, uniqueDegrees: uniqueDegrees, uniqueSemester: uniqueSemester })
    }
    catch (error) {
        console.error('Error fetching Department Data :', error);
        res.status(500).json({ error: 'Error fetching Department Data' });
    }
});

// ------------------------------------------------------------------------------------------------------- //

// Fetch Semester

router.post('/scmsection', async (req, res) => {

    try {

        const { semester } = req.body;

    }
    catch (error) { console.log(error) }
})

// ------------------------------------------------------------------------------------------------------- //

router.delete('/deletestaff', async (req, res) => {

    const { staff_id, course_code, category, section } = req.query;

    try {

        const deletedStaffCourse = await coursemapping.destroy({
            where: {
                staff_id: staff_id, course_code: course_code,
                category: category, section: section
            }
        })

        if (!deletedStaffCourse) { return res.status(404).json({ error: "Staff Course Entry not found" }) }

        const deletedreport = await report.destroy({
            where: {
                staff_id: staff_id, course_code: course_code,
                category: category, section: section
            }
        })

        if (!deletedreport) { return res.status(404).json({ error: "Report Entry not found" }) }

        res.status(200).json({ message: "Staff Course and Report has been deleted Successfully" })
    }
    catch (error) {
        console.error("Error deleting Staff Course Entry :", error);
        res.status(500).json({ error: "Error Deleting Staff Course Entry" });
    }
})

module.exports = router;