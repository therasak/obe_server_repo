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

		// Fetch Categories for the Active Semester

		const categories = await studentmaster.findAll({
			where: { active_sem: activeSemester },
			attributes: ['category'], 
		});

		// Extract Unique Categories

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

// get semester based on selected course id

route.post('/semester', async (req, res) => {
	try {
		const { category, courseId } = req.body; // Extract both category and courseId from the request body
		console.log("Received category:", category);
		console.log("Received courseId:", courseId);

		// Get the active semester
		const activeAcademic = await academic.findOne({
			where: { active_sem: 1 },
		});

		if (!activeAcademic) {
			return res.status(404).json({ error: "Active academic year not found" });
		}

		const activeSemester = activeAcademic.academic_year;

		// Find semesters for the given category, courseId, and active semester
		const semesters = await studentmaster.findAll({
			where: {
				active_sem: activeSemester,
				category: category,
				course_id: courseId,
			},
			attributes: ['semester'], // Select only the 'semester' column
		});

		// Extract unique semesters
		const uniqueSemesters = [
			...new Set(semesters.map((entry) => entry.semester)),
		];

		// Respond with the unique semesters
		res.status(200).json(uniqueSemesters);
		// console.log(uniqueSemesters)

	} catch (error) {
		console.error("Error in /semester route:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

//-----------------------------------------------------------------------------------------------------------//

// to fetch the section 

route.post('/section', async (req, res) => {
	try {
		const { category, courseId, semester } = req.body; // Extract category, courseId, and semester from the request body
		// console.log("Received category:", category);
		// console.log("Received courseId:", courseId);
		// console.log("Received semester:", semester);

		// Get the active semester
		const activeAcademic = await academic.findOne({
			where: { active_sem: 1 },
		});

		if (!activeAcademic) {
			return res.status(404).json({ error: "Active academic year not found" });
		}

		const activeSemester = activeAcademic.academic_year;

		// Find sections for the given conditions
		const sections = await studentmaster.findAll({
			where: {
				active_sem: activeSemester,
				category: category,
				course_id: courseId,
				semester: semester,
			},
			attributes: ['section'], // Select only the 'section' column
		});

		// Extract unique sections
		const uniqueSections = [
			...new Set(sections.map((entry) => entry.section)),
		];

		// Respond with the unique sections
		res.status(200).json(uniqueSections);
		// console.log(uniqueSections)

	} catch (error) {
		console.error("Error in /section route:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

//-----------------------------------------------------------------------------------------------------------//

route.post('/coursecode', async (req, res) => {
	try {
		const { category, courseId, semester, section } = req.body;

		// Get the active semester
		const activeAcademic = await academic.findOne({
			where: { active_sem: 1 },
		});

		if (!activeAcademic) {
			return res.status(404).json({ error: "Active academic year not found" });
		}

		const activeSemester = activeAcademic.academic_year;

		// // Log the received data
		// console.log("Received Data:");
		// console.log("Category:", category);
		// console.log("Course ID:", courseId);
		// console.log("Semester:", semester);
		// console.log("Section:", section);

		// Query for the course code based on the given criteria
		const courseCodes = await markentry.findAll({
			where: {
				active_sem: activeSemester,
				category: category,
				course_id: courseId,
				semester: semester,
				// section: section, // Include section in the filtering
			},
			attributes: ['course_code'], // Fetch only the course_code column
		});

		// Check if any course codes are found
		if (courseCodes.length === 0) {
			return res.status(404).json({ error: "No course code found for the provided details." });
		}

		// Extract unique course codes
		const uniqueCourseCodes = [...new Set(courseCodes.map((entry) => entry.course_code))];

		console.log(uniqueCourseCodes)

		// Respond with the unique course codes
		res.status(200).json(uniqueCourseCodes);

	} catch (error) {
		console.error("Error in /coursecode route:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});




//-----------------------------------------------------------------------------------------------------------//
// Add new Student 

route.post("/addstudent", async (req, res) => {
	try {
		// Destructure the incoming data from the request body
		const {
			stu_name,
			reg_no,
			batch,
			emis,
			section,
			semester,
			mentor,
			category,
			course_id,
			course_codes,
		} = req.body;

		// console.log(
		// 	stu_name,
		// 	reg_no,
		// 	batch,
		// 	emis,
		// 	section,
		// 	semester,
		// 	mentor,
		// 	category,
		// 	course_id)

		const activeAcademic = await academic.findOne({
			where: { active_sem: 1 },
		});

		if (!activeAcademic) {
			return res.status(404).json({ error: "Active academic year not found" });
		}

		const activeSemester = activeAcademic.academic_year;

		// Ensure that required fields are provided
		if (!stu_name || !reg_no) {
			return res.status(400).json({ error: "Student name and registration number are required." });
		}

		// Use the destructured data to create a new student record
		const newStudent = await studentmaster.create({
			stu_name: stu_name,
			reg_no: reg_no,
			batch: batch,
			emis: emis,
			section: section,
			semester: semester,
			mentor: mentor,
			category: category,
			course_id: course_id,
			active_sem: activeSemester
		});

		// Loop through the course_codes array and create multiple entries in markentry
		const markEntryPromises = course_codes.map(async (course_code) => {
			// Ensure that each course_code is a string
			if (typeof course_code !== 'string') {
				throw new Error(`Invalid course_code: ${course_code} should be a string.`);
			}

			// Create a new markentry for each course_code
			return await markentry.create({
				stu_name: stu_name,
				reg_no: reg_no,
				semester: semester,
				batch: batch,
				category: category,
				course_id: course_id,
				course_code: course_code,
				active_sem: activeSemester,
				// Use NULL for numeric fields
				c1_lot: null,
				c1_hot: null,
				c1_mot: null,
				c1_total: null,
				c2_lot: null,
				c2_mot: null,
				c2_hot: null,
				c2_total: null,
				a1_lot: null,
				a2_lot: null,
				ese_lot: null,
				ese_hot: null,
				ese_mot: null,
				ese_total: null,
			});
		});

		// Wait for all mark entry promises to resolve
		const markEntries = await Promise.all(markEntryPromises);

		// Respond with success
		res.status(201).json({
			message: "Student and mark entries added successfully",
			student: newStudent,
			markEntries: markEntries,
		});
	} catch (error) {
		console.error("Error adding student:", error);
		res.status(500).json({ error: "Failed to add student" });
	}
});

// ------------------------------------------------------------------------------------------------------- //
route.delete('/deletestudent/:reg_no', async (req, res) => {
    try {
        const { reg_no } = req.params;

        // Log reg_no for debugging
        console.log(`Deleting student with reg_no: ${reg_no}`);

        // Delete the mark entries associated with the student
        const deletedMarks = await markentry.destroy({
            where: { reg_no },
        });

        console.log(`Deleted marks entries: ${deletedMarks}`);

        // Delete the student record
        const deletedStudent = await studentmaster.destroy({
            where: { reg_no },
        });

        if (deletedStudent) {
            res.status(200).json({ 
                message: 'Student and associated marks deleted successfully!' 
            });
        } else {
            res.status(404).json({ error: 'Student not found!' });
        }
    } catch (error) {
        console.error('Error deleting student and associated marks:', error);
        res.status(500).json({ error: 'Failed to delete student and associated marks' });
    }
});






module.exports = route;