const express = require('express');
const router = express.Router();
const CourseMapping = require('../models/coursemapping');
const Report = require('../models/report');

// Get all staff course details
router.get('/staffcoursemanage', async (req, res) => {
    try {
        const staffcourse = await CourseMapping.findAll();
        res.json(staffcourse);
    } catch (error) {
        console.error('Error fetching staff course data:', error);
        res.status(500).json({ error: 'Error fetching staff data' });
    }
});

// Add a new staff record and corresponding report entry
router.post('/addstaff', async (req, res) => {
    try {
        const {
            staff_id, staff_name, category, section, dept_id, course_code, course_title,
            degree, batch, semester, dept_name, active_sem
        } = req.body;

        // Validate fields
        if (!staff_id || !staff_name || !category || !section || !dept_id || !course_code ||
            !course_title || !degree || !batch || !semester || !dept_name || !active_sem) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Add a new course mapping
        const newStaffCourse = await CourseMapping.create({
            staff_id, staff_name, category, section, dept_id, course_code, course_title,
            degree, batch, semester, dept_name, active_sem
        });

        // Add a corresponding report entry
        const newReport = await Report.create({
            staff_id,
            course_code,
            category,
            section,
            dept_name,
            active_sem,
            cia_1: 0,
            cia_2: 0,
            ass_1: 0,
            ass_2: 0,
            ese: 0,
            l_c1: 0,
            l_c2: 0,
            l_a1: 0,
            l_a2: 0,
            l_ese: 0
        });

        res.status(201).json({
            message: 'Staff course and report added successfully!',
            staff: newStaffCourse,
            report: newReport
        });
    } catch (error) {
        console.error('Error adding staff course:', error);
        res.status(500).json({ error: 'Failed to add staff course' });
    }
});

// Edit staff record and corresponding report entry
router.put('/editstaff', async (req, res) => {
    try {
        const {
            staff_id, staff_name, category, section, dept_id, course_code, course_title,
            degree, batch, semester, dept_name, active_sem
        } = req.body;

        // Validate fields
        if (!staff_id || !staff_name || !category || !section || !dept_id || !course_code ||
            !course_title || !degree || !batch || !semester || !dept_name || !active_sem) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Update the course mapping
        const updatedStaffCourse = await CourseMapping.update(
            {
                staff_name, category, section, dept_id, course_code, course_title,
                degree, batch, semester, dept_name, active_sem
            },
            {
                where: { staff_id, course_code, section }
            }
        );

        // If no record is updated, return an error
        if (!updatedStaffCourse[0]) {
            return res.status(404).json({ error: 'Staff-course entry not found' });
        }

        // Update the corresponding report entry
        const updatedReport = await Report.update(
            {
                staff_name, category, section, dept_id, course_code, course_title,
                degree, batch, semester, dept_name, active_sem
            },
            {
                where: { staff_id, course_code, section }
            }
        );

        if (!updatedReport[0]) {
            return res.status(404).json({ error: 'Report entry not found' });
        }

        res.status(200).json({
            message: 'Staff course and report updated successfully!',
        });
    } catch (error) {
        console.error('Error updating staff course:', error);
        res.status(500).json({ error: 'Failed to update staff course' });
    }
});

router.delete('/deletestaff', async (req, res) => {
    const { staff_id, course_code, category, section, dept_id } = req.query;

    try {
        // Delete the specific staff-course entry from the CourseMapping table
        const deletedStaffCourse = await CourseMapping.destroy({
            where: {
                staff_id: staff_id,
                course_code: course_code,
                category: category,
                section: section
            },
        });

        if (!deletedStaffCourse) {
            return res.status(404).json({ error: "Staff-course entry not found" });
        }

        // Delete the corresponding entry from the Report table
        const deletedReport = await Report.destroy({
            where: {
                staff_id: staff_id,
                course_code: course_code,
                category: category,
                section: section
            },
        });

        if (!deletedReport) {
            return res.status(404).json({ error: "Report entry not found" });
        }

        res.status(200).json({
            message: "Staff-course entry and corresponding report deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting staff-course entry:", error);
        res.status(500).json({ error: "Error deleting staff-course entry" });
    }
});


module.exports = router;