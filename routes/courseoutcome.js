const express = require('express');
const route = express.Router();
const markentry = require('../models/markentry');
const studentmaster = require('../models/studentmaster');
const calculation = require('../models/calculation');
const academic = require('../models/academic');
const mentor = require('../models/mentor');
const coursemapping = require('../models/coursemapping');


route.post('/chkstaffId', async (req, res) => {
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

route.post('/checkTutorCOC', async (req, res) => {
    const { staff_id } = req.body;

    const tutorHandleStaffId = await mentor.findOne({
        where: {
            staff_id: staff_id
        }
    })

    const stuRegNo = await studentmaster.findAll({
        where: {
            category: tutorHandleStaffId.category,
            course_id: tutorHandleStaffId.course_id,
            batch: tutorHandleStaffId.batch,
            section: tutorHandleStaffId.section
        },

        attributes: ['reg_no']
    })
    // console.log(stuRegNo);
    const stud_regs = stuRegNo.map(student => student.reg_no);
    // console.log(stud_regs);

    const course_code = await markentry.findAll({
        where: {
            reg_no: stud_regs,
            // course_code: selectedCourseCode, 
            // active_sem: selectedSem

        },
        attributes: ['course_code']
    });
    // console.log(course_code);
    const stud_coursecodes = [...new Set(course_code.map(student => student.course_code))];
    // console.log(stud_coursecodes);

    const academicdata = await academic.findOne({
        where: { active_sem: 1 }
    });
    const cal = await calculation.findOne({
        where: { active_sem: academicdata.academic_year }

    });

    // console.log(cal.so_l1_ug);

    const marks = await markentry.findAll({
        where: {
            course_code: stud_coursecodes,
            // course_code: selectedCourseCode, 
            // active_sem: selectedSem
        }
    });
    // console.log(marks);
    res.json(marks);
    let count=0;
    const calculatedData = await Promise.all(marks.map(async entry => {
        let {
            c1_lot = 0, c2_lot = 0, a1_lot = 0, a2_lot = 0, ese_lot = 0,
            c1_mot = 0, c2_mot = 0, ese_mot = 0,
            c1_hot = 0, c2_hot = 0, ese_hot = 0
        } = entry.dataValues;
        
        // const lot_total =cal.c_lot;
        // const mot_total = cal.c_hot;
        // const hot_total = cal.c_mot;
        const cia_weightage = cal.cia_weightage || 0;
        const ese_weightage = cal.ese_weightage || 0;
        
        const lot_percentage = ((c1_lot || 0) + (c2_lot || 0) + (a1_lot || 0) + (a2_lot || 0)) / (cal.c_lot || 1) * 100;
        const mot_percentage = ((c1_mot || 0) + (c2_mot || 0)) / (cal.c_hot || 1) * 100;
        const hot_percentage = ((c1_hot || 0) + (c2_hot || 0)) / (cal.c_mot || 1) * 100;
        // console.log(lot_percentage);
        
        if(lot_percentage>=cal.co_thresh_value){
            count++
            console.log(count)
        }
        const elot_percentage = (ese_lot || 0) / 25 * 100;
        const emot_percentage = (ese_mot || 0) / 40 * 100;
        const ehot_percentage = (ese_hot || 0) / 10 * 100;
        // const overAll_lot = (lot_percentage*cia_weightage/100) + (elot_percentage*ese_weightage/100)
        // const lot_attainment = await calculateCategory(lot_percentage);
        // const mot_attainment = await calculateCategory(mot_percentage);
        // const hot_attainment = await calculateCategory(hot_percentage);
        // const elot_attainment = await calculateCategory(elot_percentage);
        // const emot_attainment = await calculateCategory(emot_percentage);
        // const ehot_attainment = await calculateCategory(ehot_percentage);

        // Calculate overall attainment values based on CIA and ESE weightages
        // const overAll_lot = (lot_attainment * (cia_weightage / 100)) + (elot_attainment * (ese_weightage / 100));
        // const overAll_mot = (mot_attainment * (cia_weightage / 100)) + (emot_attainment * (ese_weightage / 100));
        // const overAll_hot = (hot_attainment * (cia_weightage / 100)) + (ehot_attainment * (ese_weightage / 100));

        // return {
        //     ...entry.dataValues,
        //     lot_percentage,
        //     mot_percentage,
        //     hot_percentage,
        //     elot_percentage,
        //     emot_percentage,
        //     ehot_percentage,
        //     lot_attainment,
        //     mot_attainment,
        //     hot_attainment,
        //     elot_attainment,
        //     emot_attainment,
        //     ehot_attainment,
        //     overAll_lot,
        //     overAll_mot,
        //     overAll_hot
        // };
      
    }));
    res.json(calculatedData);
    // const stuCouCode = await markentry.findOne({
    //     where: { 
    //         reg_no: stuRegNo.reg_no
    //     },

    //     attributes: ['course_code']
    // })

    // const couMarks = await markentry.findAll({ 
    //     where: { 
    //         course_code: stuCouCode.course_code
    //     }
    // })

    // console.log(couMarks); 
    // res.json(couMarks);

    // console.log(stuCouCode);

    
})

module.exports = route;