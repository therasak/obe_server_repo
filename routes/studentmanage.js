const express =  require("express");
const route = express.Router();
const studenmaster = require('../models/studentmaster');

// ------------------------------------------------------------------------------------------------------- //

// Student Details Fetching 

route.get('/studetails', async (req, res) => 
{
    const studata = await studenmaster.findAll();
    res.json(studata);
})

// ------------------------------------------------------------------------------------------------------- //

// Add new Student 

route.post('/addstudent', async (req, res) => {
    try {
      const { stu_name, reg_no, category, section } = req.body;
  
      // Create a new student record
      const newStudent = await studenmaster.create({
        stu_name,
        reg_no,
        category,
        section,
      });
  
      res.status(200).json({ message: 'Student added successfully!', student: newStudent });
    } catch (error) {
      console.error('Error adding student:', error);
      res.status(500).json({ error: 'Failed to add student' });
    }
  });

  // ------------------------------------------------------------------------------------------------------- //

// Delete Student
// Delete Student
route.delete('/deletestudent/:reg_no', async (req, res) => {
  try {
      const { reg_no } = req.params;

      // Delete the student record
      const deletedStudent = await studenmaster.destroy({
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



  

module.exports = route;