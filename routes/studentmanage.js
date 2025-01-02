const express = require("express");
const route = express.Router();
const studentmaster = require('../models/studentmaster');
const markentry = require('../models/markentry');
const academic = require("../models/academic");
const { where } = require("sequelize");

// ------------------------------------------------------------------------------------------------------- //

// Student Details Fetching 

route.get('/studetails', async (req, res) => 
{
	const activeAcademic = await academic.findOne({
		where: { active_sem: 1 },
	})

	const studata = await studentmaster.findAll({
		where: { active_sem: activeAcademic.academic_year },
	})

	res.json(studata);
})

// ------------------------------------------------------------------------------------------------------- //

// Fetch Category

route.get('/category', async (req, res) => 
{
	try 
	{
		const activeAcademic = await academic.findOne({
			where: { active_sem: 1 },
		});

		if (!activeAcademic) {
			console.log('No active academic year found');
			return res.status(404).json({ error: 'Active academic year not found' });
		}

		const activeSemester = activeAcademic.academic_year;

		const categories = await studentmaster.findAll({
			where: { active_sem: activeSemester },
			attributes: ['category'], 
		})

		const uniqueCategory = [...new Set(categories.map(entry => entry.category))];

		res.json(uniqueCategory);
	} 
	catch (error) {
		console.error('Error fetching categories:', error);
		res.status(500).json({ error: 'Failed to fetch categories' });
	}
})

//-----------------------------------------------------------------------------------------------------------//

// Get Course Id based on the Selected Category

route.post('/courseid', async (req, res) => 
{
	try 
	{
		const { category } = req.body; 

		const activeAcademic = await academic.findOne({
			where: { active_sem: 1 },
		})

		if (!activeAcademic) {
			return res.status(404).json({ error: "Active Academic Year not Found" });
		}

		const activeSemester = activeAcademic.academic_year;

		const courseid = await studentmaster.findAll(
		{
			where: { 
				active_sem: activeSemester, 
				category: category 
			}, 
			attributes: ['course_id'],
		})

		const uniqueCourseId = [...new Set(courseid.map((course) => course.course_id))]
		res.status(200).json(uniqueCourseId);
	} 
	catch (error) {
		console.error("Error in Course Id Route:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
})

//-----------------------------------------------------------------------------------------------------------//

// Get Semester based on selected Course Id

route.post('/semester', async (req, res) => 
{
	try 
	{
		const { category, courseId } = req.body;

		const activeAcademic = await academic.findOne({
			where: { active_sem: 1 },
		})

		if (!activeAcademic) {
			return res.status(404).json({ error: "Active Academic Year Not Found" });
		}

		const activeSemester = activeAcademic.academic_year;

		const semesters = await studentmaster.findAll({
			where: {
				active_sem: activeSemester,
				category: category,
				course_id: courseId,
			},
			attributes: ['semester'], 
		});

		const uniqueSemesters = [ ...new Set(semesters.map((entry) => entry.semester)) ]
		res.status(200).json(uniqueSemesters);

	} 
	catch (error) {
		console.error("Error in Semester Route:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
})

//-----------------------------------------------------------------------------------------------------------//

// To fetch the Section 

route.post('/section', async (req, res) => 
{
	try 
	{
		const { category, courseId, semester } = req.body; 

		const activeAcademic = await academic.findOne({
			where: { active_sem: 1 },
		});

		if (!activeAcademic) {
			return res.status(404).json({ error: "Active academic year not found" });
		}

		const activeSemester = activeAcademic.academic_year;

		const sections = await studentmaster.findAll({
			where: {
				active_sem: activeSemester,
				category: category,
				course_id: courseId,
				semester: semester,
			},
			attributes: ['section'], 
		});

		const uniqueSections = [ ...new Set(sections.map((entry) => entry.section)) ]

		res.status(200).json(uniqueSections);

	} 
	catch (error) {
		console.error("Error in Section Route:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
})

//-----------------------------------------------------------------------------------------------------------//

route.post('/coursecode', async (req, res) => 
{
	try 
	{
		const { category, courseId, semester, section } = req.body;

		const activeAcademic = await academic.findOne({
			where: { active_sem: 1 },
		});

		if (!activeAcademic) {
			return res.status(404).json({ error: "Active academic year not found" });
		}

		const activeSemester = activeAcademic.academic_year;

		const courseCodes = await markentry.findAll({
			where: {
				active_sem: activeSemester,
				category: category,
				course_id: courseId,
				semester: semester
			},
			attributes: ['course_code'],
		})

		if (courseCodes.length === 0) {
			return res.status(404).json({ error: "No course code found for the provided details." });
		}

		const uniqueCourseCodes = [...new Set(courseCodes.map((entry) => entry.course_code))];

		res.status(200).json(uniqueCourseCodes);

	} 
	catch (error) {
		console.error("Error in /coursecode route:", error);
		res.status(500).json({ error: "Internal server error" });
	}
})

//-----------------------------------------------------------------------------------------------------------//

// Add new Student 

route.post("/addstudent", async (req, res) => 
{
	try 
	{
		const { stu_name, reg_no, batch, emis, section, semester, mentor, 
		category, course_id, course_codes } = req.body;

		const activeAcademic = await academic.findOne({
			where: { active_sem: 1 },
		});

		if (!activeAcademic) {
			return res.status(404).json({ error: "Active academic year not found" });
		}

		const activeSemester = activeAcademic.academic_year;

		if (!stu_name || !reg_no) {
			return res.status(400).json({ error: "Student name and registration number are required." });
		}

		const newStudent = await studentmaster.create({
			stu_name: stu_name, reg_no: reg_no, batch: batch,
			emis: emis, section: section, semester: semester,
			mentor: mentor, category: category, course_id: course_id,
			active_sem: activeSemester
		});

		const markEntryPromises = course_codes.map(async (course_code) => 
		{
			if (typeof course_code !== 'string') {
				throw new Error(`Invalid course_code: ${course_code} should be a string.`);
			}

			return await markentry.create({
				stu_name: stu_name, reg_no: reg_no, semester: semester, batch: batch,
				category: category, course_id: course_id, course_code: course_code,
				active_sem: activeSemester, c1_lot: null, c1_hot: null, c1_mot: null,
				c1_total: null, c2_lot: null, c2_mot: null, c2_hot: null, c2_total: null,
				a1_lot: null, a2_lot: null, ese_lot: null, ese_hot: null, ese_mot: null,
				ese_total: null,
			})
		})

		const markEntries = await Promise.all(markEntryPromises);

		res.status(201).json({
			message: "Student and Mark Entries Added Successfully",
			student: newStudent,
			markEntries: markEntries,
		})
	} 
	catch (error) {
		console.error("Error Adding Student:", error);
		res.status(500).json({ error: "Failed to Add Student" });
	}
})

// ------------------------------------------------------------------------------------------------------- //

route.delete('/deletestudent/:reg_no', async (req, res) => 
{
    try 
	{
        const { reg_no } = req.params;

        const deletedMarks = await markentry.destroy({
            where: { reg_no }
        })

        const deletedStudent = await studentmaster.destroy({
            where: { reg_no }
        });

        if (deletedStudent) 
		{
            res.status(200).json({ 
                message: 'Student and Associated Marks Deleted Successfully!' 
            })
        } 
		else {
            res.status(404).json({ error: 'Student not Found!' });
        }
    } 
	catch (error) {
        console.error('Error deleting Student and Associated Marks:', error);
        res.status(500).json({ error: 'Failed to delete Student and Associated Marks' });
    }
})

module.exports = route;