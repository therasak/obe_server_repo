const express = require("express");
const route = express.Router();
const studentmaster = require('../models/studentmaster');
const markentry = require('../models/markentry');
const academic = require('../models/academic');

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

// Add new Student 

route.post('/addstudent', async (req, res) => {
     try {
          const { stu_name, reg_no, course_id, category, semester, section } = req.body;

          const activeAcademic = await academic.findOne({
               where: { active_sem: 1 },
          })
          const activeSemester = activeAcademic.academic_year;
          console.log(activeSemester)

          const courseid = await studentmaster.findAll({
               where: { active_sem: activeSemester },
               attributes: ['course_id']
          })
          const uniqueCourseId = [...new Set(courseid.map(courseid => courseid.course_id))];
          // console.log(uniqueCourseId)
          res.json(uniqueCourseId)
     }
     catch (error) {
          console.error(error)
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