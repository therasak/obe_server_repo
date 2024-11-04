const express = require('express');
const route = express.Router();
const markentry = require('../models/markentry');
const studentmaster = require('../models/studentmaster');
const calculation = require('../models/calculation');
const academic = require('../models/academic');
const mentor = require('../models/mentor');
const coursemapping = require('../models/coursemapping');


route.post('/chkstaffId', async (req, res) => 
{
    const { staff_id } = req.body;

    const academicdata = await academic.findOne({
        where: { active_sem: 1 }
    });

    const courseHandleStaffId = await coursemapping.findOne({
        where: { 
            staff_id: staff_id,
            active_sem: academicdata.academic_year 
        }
    })

    const tutorHandleStaffId = await mentor.findOne({
        where: { 
            staff_id: staff_id,
            active_sem: academicdata.academic_year 
        }
    })

    // const hodHandleStaffId = await coursemapping.findOne({
    //     where: { 
    //         staff_id: staff_id,
    //         active_sem: academicdata.academic_year 
    //     }
    // })

    res.json({ courseHandleStaffId, tutorHandleStaffId });
})

route.post('/checkTutorCOC', async (req, res) => 
    {
        const { staff_id } = req.body;

        const tutorHandleStaffId = await mentor.findOne({
            where: { 
                staff_id: staff_id
            }
        })

        const stuRegNo = await studentmaster.findOne({
            where: { 
                category: tutorHandleStaffId.category,
                course_id: tutorHandleStaffId.course_id,
                batch: tutorHandleStaffId.batch,
                section: tutorHandleStaffId.section
            },

            attributes: ['reg_no']
        })

        const stuCouCode = await markentry.findAll({
            where: { 
                reg_no: stuRegNo.reg_no
            },

            attributes: ['course_code']
        })

        const couMarks = await markentry.findAll({
            where: { 
                course_code: stuCouCode.course_code
            }
        })

        console.log(couMarks); 
        res.json(couMarks);
        
    
    })

    module.exports = route;