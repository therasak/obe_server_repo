const express = require("express");
const route = express.Router();
const studentmaster = require('../models/studentmaster');
const markentry = require('../models/markentry');
const academic = require("../models/academic");
const { where } = require("sequelize");

// ------------------------------------------------------------------------------------------------------- //

// Student Details Fetching 

route.get('/studetails', async (req, res) => {
  const activeAcademic = await academic.findOne({
    where: { active_sem: 1 },
  })
  const studata = await studentmaster.findAll({
    where: { active_sem: activeAcademic.academic_year },
  });
  res.json(studata);
})

// ------------------------------------------------------------------------------------------------------- //

//fetch category

route.get('/category', async (req, res) => {
  try {
    // Fetch active academic year
    const activeAcademic = await academic.findOne({
      where: { active_sem: 1 },
    });

    if (!activeAcademic) {
      console.log('No active academic year found');
      return res.status(404).json({ error: 'Active academic year not found' });
    }

    const activeSemester = activeAcademic.academic_year;
    // console.log('Active Semester:', activeSemester);

    // Fetch categories for the active semester
    const categories = await studentmaster.findAll({
      where: { active_sem: activeSemester },
      attributes: ['category'], // Select only the 'category' column
    });

    // Extract unique categories
    const uniqueCategory = [...new Set(categories.map(entry => entry.category))];

    // Log and respond with the unique categories
    // console.log('Unique Categories:', uniqueCategory);
    res.json(uniqueCategory);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

//-----------------------------------------------------------------------------------------------------------//
//get course id based on the selected category

route.post('/courseid', async (req, res) => {
  try {
    const { category } = req.body; // Extract category from the request body
    // console.log("Received category:", category);

    // Get the active semester
    const activeAcademic = await academic.findOne({
      where: { active_sem: 1 },
    });

    if (!activeAcademic) {
      return res.status(404).json({ error: "Active academic year not found" });
    }

    const activeSemester = activeAcademic.academic_year;

    // Find course IDs for the selected category and active semester
    const courseid = await studentmaster.findAll({
      where: { active_sem: activeSemester, category: category }, // Combine conditions
      attributes: ['course_id'],
    });

    // Extract unique course IDs
    const uniqueCourseId = [
      ...new Set(courseid.map((course) => course.course_id)),
    ];

    // Send the unique course IDs as the response
    res.status(200).json(uniqueCourseId);

  } catch (error) {
    console.error("Error in /courseid route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


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
    console.log(uniqueSections)

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

    // Log the received data
    console.log("Received Data:");
    console.log("Category:", category);
    console.log("Course ID:", courseId);
    console.log("Semester:", semester);
    console.log("Section:", section);

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

route.post('/addstudent', async (req, res) => {
  try {
    const newStudent = await studentmaster.create(req.body); // Use the correct model name
    res.status(201).json({ message: 'Student added successfully', student: newStudent });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

// ------------------------------------------------------------------------------------------------------- //
// Delete Student
route.delete('/deletestudent/:reg_no', async (req, res) => {
  try {
    const { reg_no } = req.params;

    // Delete the student record
    const deletedStudent = await studentmaster.destroy({
      where: { reg_no },
    });

    if (deletedStudent) {
      res.status(200).json({ message: 'Student deleted successfully!' });
    } else {
      res.status(404).json({ error: 'Student not found!' });
    }
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

//--------------------------------------------------------------------------------------

// Fetch a single record by ID
// async function getSingleRecord() {
//   const activeAcademic = await academic.findOne({
//     where: { active_sem: 1 },
//   });
//   console.log(activeAcademic);

//   const activeSemester = activeAcademic.academic_year;
//   console.log(activeSemester)
// }


// getSingleRecord();

// route.post('/addstudent', async(req, res) =>{
//   const activeAcademic = await academic.findOne({
//     where: {active_sem: 1}
//   })
// })




module.exports = route;