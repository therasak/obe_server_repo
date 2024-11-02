const express =  require("express");
const route = express.Router();
const mentor = require('../models/mentor');
const markentry = require('../models/markentry');
const studentmaster = require("../models/studentmaster");
const { Op } = require("sequelize");

// ------------------------------------------------------------------------------------------------------- //

// Student Details Fetching 

route.post('/tutorreportcode', async (req, res) => 
{
     const { academic_year, staff_id } = req.body;
   
     try 
     {
          const mentorData = await mentor.findOne({
               where: {
                   staff_id: staff_id,
                   active_sem: academic_year
               }
          })
     
          const mentorStuReg = await studentmaster.findAll({ 
               where: {
                   batch: mentorData.batch,
                   active_sem: mentorData.active_sem,
                   category: mentorData.category,
                   course_id: mentorData.course_id,
                   section: mentorData.section
               }
          })
     
          const regNos = mentorStuReg.map(student => student.reg_no);
     
          const mentorStuCode = await markentry.findAll(
          {
               where: {
                    reg_no: {
                         [Op.in]: regNos
                    }
               }
          })
          const uniqueCourseCodes = [...new Set(mentorStuCode.map(entry => entry.course_code))];
          res.json({ uniqueCourseCodes, mentorStuReg});
     }
     catch {
          console.error("Error Fetching Tutor Report:", error);
          res.status(500).json({ message: "An error occurred while fetching tutor report" });
     }
     
})

module.exports = route;