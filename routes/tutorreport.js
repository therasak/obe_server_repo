const express =  require("express");
const route = express.Router();
const mentor = require('../models/mentor');
const markentry = require('../models/markentry');
const studentmaster = require("../models/studentmaster");
const calculation = require('../models/calculation');
const academic = require('../models/academic');

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
          console.error("Error Fetching Tutor Report", error);
          res.status(500).json({ message: "An error occurred while Fetching Tutor Report" });
     }   
})

// ------------------------------------------------------------------------------------------------------- //

// Student Details Fetching 

route.post('/tutorstudent', async (req, res) => 
{
     const { uniqueValues, courseCode } = req.body;
     console(uniqueValues)    
     try 
     {
          const students = await studentmaster.findAll({
               where: {
                   batch: selectedBatch,
                   course_id: uniqueValues.courseId,
                   category: uniqueValues.category,
                   section: uniqueValues.section
               },
               attributes: ['reg_no']
           });
   
           const stud_regs = students.map(student => student.reg_no);

           const academicdata = await academic.findOne({
               where: { active_sem: 1 }
           });
           const cal = await calculation.findOne({
               where: { active_sem: academicdata.academic_year }
           });
   
           const marks = await markentry.findAll({
               where: {
                   reg_no: stud_regs,
                   course_code: courseCode,
                   active_sem: academicdata.academic_year
               }
           });
   
           const calculatedData = await Promise.all(marks.map(async entry => {
               let {
                   c1_lot = 0, c2_lot = 0, a1_lot = 0, a2_lot = 0, ese_lot = 0,
                   c1_mot = 0, c2_mot = 0, ese_mot = 0,
                   c1_hot = 0, c2_hot = 0, ese_hot = 0
               } = entry.dataValues;
               
               const lot_total = (cal.c1_lot || 0) + (cal.c2_lot || 0) + (cal.a1_lot || 0) + (cal.a2_lot || 0);
               const mot_total = (cal.c1_mot || 0) + (cal.c2_mot || 0);
               const hot_total = (cal.c1_hot || 0) + (cal.c2_hot || 0);
               const cia_weightage = cal.cia_weightage || 0;
               const ese_weightage = cal.ese_weightage || 0;
           
               const lot_percentage = ((c1_lot || 0) + (c2_lot || 0) + (a1_lot || 0) + (a2_lot || 0)) / (lot_total || 1) * 100;
               const mot_percentage = ((c1_mot || 0) + (c2_mot || 0)) / (mot_total || 1) * 100;
               const hot_percentage = ((c1_hot || 0) + (c2_hot || 0)) / (hot_total || 1) * 100;
               const elot_percentage = (ese_lot || 0) / 25 * 100;
               const emot_percentage = (ese_mot || 0) / 40 * 100;
               const ehot_percentage = (ese_hot || 0) / 10 * 100;
               const overAll_lot = (lot_percentage*cia_weightage/100) + (elot_percentage*ese_weightage/100)
               const overAll_mot = (mot_percentage*cia_weightage/100) + (emot_percentage*ese_weightage/100)
               const overAll_hot = (hot_percentage*cia_weightage/100) + (ehot_percentage*ese_weightage/100)
   
           
               console.log(`LOT Percentage: ${lot_percentage}, MOT Percentage: ${mot_percentage}, HOT Percentage: ${hot_percentage}`);
               console.log(overAll_lot, overAll_mot, overAll_hot);
               return {
                   ...entry.dataValues,
                   lot_percentage: await calculateCategory(lot_percentage),
                   mot_percentage: await calculateCategory(mot_percentage),
                   hot_percentage: await calculateCategory(hot_percentage),
                   elot_percentage: await calculateCategory(elot_percentage),
                   emot_percentage: await calculateCategory(emot_percentage),
                   ehot_percentage: await calculateCategory(ehot_percentage),
                   overAll_lot: await calculateCategory(overAll_lot),
                   overAll_mot: await calculateCategory(overAll_mot),
                   overAll_hot: await calculateCategory(overAll_hot),            
               };
             
           }));
           res.json(calculatedData);
   
         
     }
     catch {
          console.error("Error Fetching Tutor Student Report:", error);
          res.status(500).json({ message: "An error occurred while Fetching Tutor Report" });
     }   
})

async function calculateCategory(percentage) {
     try {
         const academicdata = await academic.findOne({
             where: { active_sem: 1 }
         });
 
         if (!academicdata) {
             console.error("Academic data not found");
             return null;
         }
 
         const data = await calculation.findOne({
             where: { active_sem: academicdata.academic_year }
         });
 
         if (!data) {
             console.error("Calculation data not found for the specified academic year");
             return null;
         }
 
         if (percentage > data.so_l3_ug) {
             return 3;
         } else if (percentage > data.so_l2_ug) {
             return 2;
         } else if (percentage > data.so_l1_ug) {
             return 1;
         } else if (percentage > data.so_l0_ug) {
             return 0;
         }
         return 0;
 
     } catch (error) {
         console.error('Error fetching academic or calculation data:', error);
     }
 }

module.exports = route;