const express = require('express');
const route = express.Router();
const markentry = require('../models/markentry');
const studentmaster = require('../models/studentmaster');
const calculation = require('../models/calculation');
const academic = require('../models/academic');
const mentor = require('../models/mentor');
const coursemapping = require('../models/coursemapping');
const hod = require('../models/hod');

// ------------------------------------------------------------------------------------------------------- //

// Role of StaffId ( Tuo, Course Handler, HOD )

route.post('/chkstaffId', async (req, res) => 
{
    const { staff_id } = req.body;

    const academicdata = await academic.findOne({
        where: { active_sem: 1 }
    })

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

    const hodHandleStaffId = await hod.findOne({
        where: { 
            staff_id: staff_id
        }
    })
    res.json({ courseHandleStaffId, tutorHandleStaffId, hodHandleStaffId });
})

// ------------------------------------------------------------------------------------------------------- //

// Tutor Course Outcome

route.post('/checkTutorCOC', async (req, res) => 
{
    const { staff_id } = req.body;

    const tutorHandleStaffId = await mentor.findOne({
        where: { staff_id: staff_id }
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

    const stud_regs = stuRegNo.map(student => student.reg_no);

    const course_codes = await markentry.findAll({
        where: { reg_no: stud_regs },
        attributes: ['course_code']
    })

    const stud_coursecodes = [...new Set(course_codes.map(entry => entry.course_code))];

    const academicdata = await academic.findOne({
        where: { active_sem: 1 }
    })
    
    const cal = await calculation.findOne({
        where: { active_sem: academicdata.academic_year }
    })

    const marks = await markentry.findAll({
        where: { course_code: stud_coursecodes }
    })

    let countAboveThreshold = {
        lot: {},
        mot: {},
        hot: {},
        elot: {},
        emot: {},
        ehot: {}
    }

    const studentCountsByCourse = {};

    await Promise.all(marks.map(async entry => 
    {
        const 
        {
            course_code,
            c1_lot = 0, c2_lot = 0, a1_lot = 0, a2_lot = 0,
            c1_mot = 0, c2_mot = 0,
            c1_hot = 0, c2_hot = 0,
            ese_lot = 0, ese_mot = 0, ese_hot = 0
        } = entry.dataValues;

        const lot_percentage = ((c1_lot || 0) + (c2_lot || 0) + (a1_lot || 0) + (a2_lot || 0)) / (cal.c_lot || 1) * 100;
        const mot_percentage = ((c1_mot || 0) + (c2_mot || 0)) / (cal.c_mot || 1) * 100;
        const hot_percentage = ((c1_hot || 0) + (c2_hot || 0)) / (cal.c_hot || 1) * 100;
        const elot_percentage = (ese_lot || 0) / (cal.ese_lot || 1) * 100;
        const emot_percentage = (ese_mot || 0) / (cal.ese_mot || 1) * 100;
        const ehot_percentage = (ese_hot || 0) / (cal.ese_hot || 1) * 100;

        ['lot', 'mot', 'hot', 'elot', 'emot', 'ehot'].forEach(type => {
            if (!countAboveThreshold[type][course_code]) countAboveThreshold[type][course_code] = 0;
        })

        if (!studentCountsByCourse[course_code]) studentCountsByCourse[course_code] = 0;
        studentCountsByCourse[course_code]++;
        if (lot_percentage >= cal.co_thresh_value) countAboveThreshold.lot[course_code]++;
        if (mot_percentage >= cal.co_thresh_value) countAboveThreshold.mot[course_code]++;
        if (hot_percentage >= cal.co_thresh_value) countAboveThreshold.hot[course_code]++;
        if (elot_percentage >= cal.co_thresh_value) countAboveThreshold.elot[course_code]++;
        if (emot_percentage >= cal.co_thresh_value) countAboveThreshold.emot[course_code]++;
        if (ehot_percentage >= cal.co_thresh_value) countAboveThreshold.ehot[course_code]++;
    }))

    let percentageAboveThreshold = {
        lot: {},
        mot: {},
        hot: {},
        elot: {},
        emot: {},
        ehot: {}
    };

    for (const course_code of stud_coursecodes) 
    {
        const totalStudents = studentCountsByCourse[course_code] || 1;

        percentageAboveThreshold.lot[course_code] = (countAboveThreshold.lot[course_code] / totalStudents) * 100;
        percentageAboveThreshold.mot[course_code] = (countAboveThreshold.mot[course_code] / totalStudents) * 100;
        percentageAboveThreshold.hot[course_code] = (countAboveThreshold.hot[course_code] / totalStudents) * 100;
        percentageAboveThreshold.elot[course_code] = (countAboveThreshold.elot[course_code] / totalStudents) * 100;
        percentageAboveThreshold.emot[course_code] = (countAboveThreshold.emot[course_code] / totalStudents) * 100;
        percentageAboveThreshold.ehot[course_code] = (countAboveThreshold.ehot[course_code] / totalStudents) * 100;
    }

    let attainedScores = {
        lot: {},
        mot: {},
        hot: {},
        elot: {},
        emot: {},
        ehot: {},
        overall: {}
    };

    for (const course_code of stud_coursecodes) 
    {
        attainedScores.lot[course_code] = await calculateCategory(percentageAboveThreshold.lot[course_code]);
        attainedScores.mot[course_code] = await calculateCategory(percentageAboveThreshold.mot[course_code]);
        attainedScores.hot[course_code] = await calculateCategory(percentageAboveThreshold.hot[course_code]);
        attainedScores.elot[course_code] = await calculateCategory(percentageAboveThreshold.elot[course_code]);
        attainedScores.emot[course_code] = await calculateCategory(percentageAboveThreshold.emot[course_code]);
        attainedScores.ehot[course_code] = await calculateCategory(percentageAboveThreshold.ehot[course_code]);
    
        attainedScores.overall[course_code] = 
        {
            lot: (attainedScores.lot[course_code] * (cal.cia_weightage / 100)) + 
                 (attainedScores.elot[course_code] * (cal.ese_weightage / 100)),
            mot: (attainedScores.mot[course_code] * (cal.cia_weightage / 100)) + 
                 (attainedScores.emot[course_code] * (cal.ese_weightage / 100)),
            hot: (attainedScores.hot[course_code] * (cal.cia_weightage / 100)) + 
                 (attainedScores.ehot[course_code] * (cal.ese_weightage / 100))
        }
    
        const avgOverallScore = (
            attainedScores.overall[course_code].lot +
            attainedScores.overall[course_code].mot +
            attainedScores.overall[course_code].hot
        ) / 3;
    
        attainedScores.grade = attainedScores.grade || {};
        attainedScores.grade[course_code] = calculateGrade(avgOverallScore);
    }
    res.json({attainedScores});
})

// ------------------------------------------------------------------------------------------------------- //

// Admin Course Outcome

route.post('/checkAdminCOC', async (req, res) => 
{
    const course_codes = await markentry.findAll({
        attributes: ['course_code']
    })

    const stud_coursecodes = [...new Set(course_codes.map(entry => entry.course_code))];

    const academicdata = await academic.findOne({
        where: { active_sem: 1 }
    })
    
    const cal = await calculation.findOne({
        where: { active_sem: academicdata.academic_year }
    })

    const marks = await markentry.findAll({
        where: { course_code: stud_coursecodes }
    })

    let countAboveThreshold = {
        lot: {},
        mot: {},
        hot: {},
        elot: {},
        emot: {},
        ehot: {}
    }

    const studentCountsByCourse = {};

    await Promise.all(marks.map(async entry => 
    {
        const 
        {
            course_code,
            c1_lot = 0, c2_lot = 0, a1_lot = 0, a2_lot = 0,
            c1_mot = 0, c2_mot = 0,
            c1_hot = 0, c2_hot = 0,
            ese_lot = 0, ese_mot = 0, ese_hot = 0
        } = entry.dataValues;

        const lot_percentage = ((c1_lot || 0) + (c2_lot || 0) + (a1_lot || 0) + (a2_lot || 0)) / (cal.c_lot || 1) * 100;
        const mot_percentage = ((c1_mot || 0) + (c2_mot || 0)) / (cal.c_mot || 1) * 100;
        const hot_percentage = ((c1_hot || 0) + (c2_hot || 0)) / (cal.c_hot || 1) * 100;
        const elot_percentage = (ese_lot || 0) / (cal.ese_lot || 1) * 100;
        const emot_percentage = (ese_mot || 0) / (cal.ese_mot || 1) * 100;
        const ehot_percentage = (ese_hot || 0) / (cal.ese_hot || 1) * 100;

        ['lot', 'mot', 'hot', 'elot', 'emot', 'ehot'].forEach(type => {
            if (!countAboveThreshold[type][course_code]) countAboveThreshold[type][course_code] = 0;
        })

        if (!studentCountsByCourse[course_code]) studentCountsByCourse[course_code] = 0;
        studentCountsByCourse[course_code]++;
        if (lot_percentage >= cal.co_thresh_value) countAboveThreshold.lot[course_code]++;
        if (mot_percentage >= cal.co_thresh_value) countAboveThreshold.mot[course_code]++;
        if (hot_percentage >= cal.co_thresh_value) countAboveThreshold.hot[course_code]++;
        if (elot_percentage >= cal.co_thresh_value) countAboveThreshold.elot[course_code]++;
        if (emot_percentage >= cal.co_thresh_value) countAboveThreshold.emot[course_code]++;
        if (ehot_percentage >= cal.co_thresh_value) countAboveThreshold.ehot[course_code]++;
    }))

    let percentageAboveThreshold = {
        lot: {},
        mot: {},
        hot: {},
        elot: {},
        emot: {},
        ehot: {}
    };

    for (const course_code of stud_coursecodes) 
    {
        const totalStudents = studentCountsByCourse[course_code] || 1;

        percentageAboveThreshold.lot[course_code] = (countAboveThreshold.lot[course_code] / totalStudents) * 100;
        percentageAboveThreshold.mot[course_code] = (countAboveThreshold.mot[course_code] / totalStudents) * 100;
        percentageAboveThreshold.hot[course_code] = (countAboveThreshold.hot[course_code] / totalStudents) * 100;
        percentageAboveThreshold.elot[course_code] = (countAboveThreshold.elot[course_code] / totalStudents) * 100;
        percentageAboveThreshold.emot[course_code] = (countAboveThreshold.emot[course_code] / totalStudents) * 100;
        percentageAboveThreshold.ehot[course_code] = (countAboveThreshold.ehot[course_code] / totalStudents) * 100;
    }

    let attainedScores = {
        lot: {},
        mot: {},
        hot: {},
        elot: {},
        emot: {},
        ehot: {},
        overall: {}
    };

    for (const course_code of stud_coursecodes) 
    {
        attainedScores.lot[course_code] = await calculateCategory(percentageAboveThreshold.lot[course_code]);
        attainedScores.mot[course_code] = await calculateCategory(percentageAboveThreshold.mot[course_code]);
        attainedScores.hot[course_code] = await calculateCategory(percentageAboveThreshold.hot[course_code]);
        attainedScores.elot[course_code] = await calculateCategory(percentageAboveThreshold.elot[course_code]);
        attainedScores.emot[course_code] = await calculateCategory(percentageAboveThreshold.emot[course_code]);
        attainedScores.ehot[course_code] = await calculateCategory(percentageAboveThreshold.ehot[course_code]);
    
        attainedScores.overall[course_code] = 
        {
            lot: (attainedScores.lot[course_code] * (cal.cia_weightage / 100)) + 
                    (attainedScores.elot[course_code] * (cal.ese_weightage / 100)),
            mot: (attainedScores.mot[course_code] * (cal.cia_weightage / 100)) + 
                    (attainedScores.emot[course_code] * (cal.ese_weightage / 100)),
            hot: (attainedScores.hot[course_code] * (cal.cia_weightage / 100)) + 
                    (attainedScores.ehot[course_code] * (cal.ese_weightage / 100))
        }
    
        const avgOverallScore = (
            attainedScores.overall[course_code].lot +
            attainedScores.overall[course_code].mot +
            attainedScores.overall[course_code].hot
        ) / 3;
    
        attainedScores.grade = attainedScores.grade || {};
        attainedScores.grade[course_code] = calculateGrade(avgOverallScore);
    }
    res.json({attainedScores});
})
   
// ------------------------------------------------------------------------------------------------------- //

// Course Handler Course Outcome

route.post('/checkCourseCOC', async (req, res) => 
{
    const { staff_id } = req.body;

    const courseHandleStaffId = await coursemapping.findAll({
        where: { 
            staff_id: staff_id },
            attributes: ['course_code']
    })  

    const stud_coursecodes = [...new Set(courseHandleStaffId.map(entry => entry.course_code))];

    const academicdata = await academic.findOne({
        where: { active_sem: 1 }
    })
    
    const cal = await calculation.findOne({
        where: { active_sem: academicdata.academic_year }
    })

    const marks = await markentry.findAll({
        where: { course_code: stud_coursecodes }
    })

    let countAboveThreshold = {
        lot: {},
        mot: {},
        hot: {},
        elot: {},
        emot: {},
        ehot: {}
    }

    const studentCountsByCourse = {};

    await Promise.all(marks.map(async entry => 
    {
        const 
        {
            course_code,
            c1_lot = 0, c2_lot = 0, a1_lot = 0, a2_lot = 0,
            c1_mot = 0, c2_mot = 0,
            c1_hot = 0, c2_hot = 0,
            ese_lot = 0, ese_mot = 0, ese_hot = 0
        } = entry.dataValues;

        const lot_percentage = ((c1_lot || 0) + (c2_lot || 0) + (a1_lot || 0) + (a2_lot || 0)) / (cal.c_lot || 1) * 100;
        const mot_percentage = ((c1_mot || 0) + (c2_mot || 0)) / (cal.c_mot || 1) * 100;
        const hot_percentage = ((c1_hot || 0) + (c2_hot || 0)) / (cal.c_hot || 1) * 100;
        const elot_percentage = (ese_lot || 0) / (cal.ese_lot || 1) * 100;
        const emot_percentage = (ese_mot || 0) / (cal.ese_mot || 1) * 100;
        const ehot_percentage = (ese_hot || 0) / (cal.ese_hot || 1) * 100;

        ['lot', 'mot', 'hot', 'elot', 'emot', 'ehot'].forEach(type => {
            if (!countAboveThreshold[type][course_code]) countAboveThreshold[type][course_code] = 0;
        })

        if (!studentCountsByCourse[course_code]) studentCountsByCourse[course_code] = 0;
        studentCountsByCourse[course_code]++;
        if (lot_percentage >= cal.co_thresh_value) countAboveThreshold.lot[course_code]++;
        if (mot_percentage >= cal.co_thresh_value) countAboveThreshold.mot[course_code]++;
        if (hot_percentage >= cal.co_thresh_value) countAboveThreshold.hot[course_code]++;
        if (elot_percentage >= cal.co_thresh_value) countAboveThreshold.elot[course_code]++;
        if (emot_percentage >= cal.co_thresh_value) countAboveThreshold.emot[course_code]++;
        if (ehot_percentage >= cal.co_thresh_value) countAboveThreshold.ehot[course_code]++;
    }))

    let percentageAboveThreshold = {
        lot: {},
        mot: {},
        hot: {},
        elot: {},
        emot: {},
        ehot: {}
    };

    for (const course_code of stud_coursecodes) 
    {
        const totalStudents = studentCountsByCourse[course_code] || 1;

        percentageAboveThreshold.lot[course_code] = (countAboveThreshold.lot[course_code] / totalStudents) * 100;
        percentageAboveThreshold.mot[course_code] = (countAboveThreshold.mot[course_code] / totalStudents) * 100;
        percentageAboveThreshold.hot[course_code] = (countAboveThreshold.hot[course_code] / totalStudents) * 100;
        percentageAboveThreshold.elot[course_code] = (countAboveThreshold.elot[course_code] / totalStudents) * 100;
        percentageAboveThreshold.emot[course_code] = (countAboveThreshold.emot[course_code] / totalStudents) * 100;
        percentageAboveThreshold.ehot[course_code] = (countAboveThreshold.ehot[course_code] / totalStudents) * 100;
    }

    let attainedScores = {
        lot: {},
        mot: {},
        hot: {},
        elot: {},
        emot: {},
        ehot: {},
        overall: {}
    };

    for (const course_code of stud_coursecodes) 
    {
        attainedScores.lot[course_code] = await calculateCategory(percentageAboveThreshold.lot[course_code]);
        attainedScores.mot[course_code] = await calculateCategory(percentageAboveThreshold.mot[course_code]);
        attainedScores.hot[course_code] = await calculateCategory(percentageAboveThreshold.hot[course_code]);
        attainedScores.elot[course_code] = await calculateCategory(percentageAboveThreshold.elot[course_code]);
        attainedScores.emot[course_code] = await calculateCategory(percentageAboveThreshold.emot[course_code]);
        attainedScores.ehot[course_code] = await calculateCategory(percentageAboveThreshold.ehot[course_code]);
    
        attainedScores.overall[course_code] = 
        {
            lot: (attainedScores.lot[course_code] * (cal.cia_weightage / 100)) + 
                    (attainedScores.elot[course_code] * (cal.ese_weightage / 100)),
            mot: (attainedScores.mot[course_code] * (cal.cia_weightage / 100)) + 
                    (attainedScores.emot[course_code] * (cal.ese_weightage / 100)),
            hot: (attainedScores.hot[course_code] * (cal.cia_weightage / 100)) + 
                    (attainedScores.ehot[course_code] * (cal.ese_weightage / 100))
        }
    
        const avgOverallScore = (
            attainedScores.overall[course_code].lot +
            attainedScores.overall[course_code].mot +
            attainedScores.overall[course_code].hot
        ) / 3;
    
        attainedScores.grade = attainedScores.grade || {};
        attainedScores.grade[course_code] = calculateGrade(avgOverallScore);
    }
    res.json({attainedScores});
})

// ------------------------------------------------------------------------------------------------------- //

// Course Hod Course Outcome

route.post('/checkHodCOC', async (req, res) => 
{
    const { staff_id } = req.body;

    const hodDeptHandle = await hod.findAll(
    {
        where: { 
            staff_id: staff_id },
            attributes: ['course_id']
    })  

    const hod_dept_id = [...new Set(hodDeptHandle.map(entry => entry.course_id))];

    const courseHandleStaffId = await markentry.findAll({
        where: { 
            course_id: hod_dept_id },
            attributes: ['course_code']
    })

    const stud_coursecodes = [...new Set(courseHandleStaffId.map(entry => entry.course_code))];

    const academicdata = await academic.findOne({
        where: { active_sem: 1 }
    })
    
    const cal = await calculation.findOne({
        where: { active_sem: academicdata.academic_year }
    })

    const marks = await markentry.findAll({
        where: { course_code: stud_coursecodes }
    })

    let countAboveThreshold = {
        lot: {},
        mot: {},
        hot: {},
        elot: {},
        emot: {},
        ehot: {}
    }

    const studentCountsByCourse = {};

    await Promise.all(marks.map(async entry => 
    {
        const 
        {
            course_code,
            c1_lot = 0, c2_lot = 0, a1_lot = 0, a2_lot = 0,
            c1_mot = 0, c2_mot = 0,
            c1_hot = 0, c2_hot = 0,
            ese_lot = 0, ese_mot = 0, ese_hot = 0
        } = entry.dataValues;

        const lot_percentage = ((c1_lot || 0) + (c2_lot || 0) + (a1_lot || 0) + (a2_lot || 0)) / (cal.c_lot || 1) * 100;
        const mot_percentage = ((c1_mot || 0) + (c2_mot || 0)) / (cal.c_mot || 1) * 100;
        const hot_percentage = ((c1_hot || 0) + (c2_hot || 0)) / (cal.c_hot || 1) * 100;
        const elot_percentage = (ese_lot || 0) / (cal.ese_lot || 1) * 100;
        const emot_percentage = (ese_mot || 0) / (cal.ese_mot || 1) * 100;
        const ehot_percentage = (ese_hot || 0) / (cal.ese_hot || 1) * 100;

        ['lot', 'mot', 'hot', 'elot', 'emot', 'ehot'].forEach(type => {
            if (!countAboveThreshold[type][course_code]) countAboveThreshold[type][course_code] = 0;
        })

        if (!studentCountsByCourse[course_code]) studentCountsByCourse[course_code] = 0;
        studentCountsByCourse[course_code]++;
        if (lot_percentage >= cal.co_thresh_value) countAboveThreshold.lot[course_code]++;
        if (mot_percentage >= cal.co_thresh_value) countAboveThreshold.mot[course_code]++;
        if (hot_percentage >= cal.co_thresh_value) countAboveThreshold.hot[course_code]++;
        if (elot_percentage >= cal.co_thresh_value) countAboveThreshold.elot[course_code]++;
        if (emot_percentage >= cal.co_thresh_value) countAboveThreshold.emot[course_code]++;
        if (ehot_percentage >= cal.co_thresh_value) countAboveThreshold.ehot[course_code]++;
    }))

    let percentageAboveThreshold = {
        lot: {},
        mot: {},
        hot: {},
        elot: {},
        emot: {},
        ehot: {}
    };

    for (const course_code of stud_coursecodes) 
    {
        const totalStudents = studentCountsByCourse[course_code] || 1;

        percentageAboveThreshold.lot[course_code] = (countAboveThreshold.lot[course_code] / totalStudents) * 100;
        percentageAboveThreshold.mot[course_code] = (countAboveThreshold.mot[course_code] / totalStudents) * 100;
        percentageAboveThreshold.hot[course_code] = (countAboveThreshold.hot[course_code] / totalStudents) * 100;
        percentageAboveThreshold.elot[course_code] = (countAboveThreshold.elot[course_code] / totalStudents) * 100;
        percentageAboveThreshold.emot[course_code] = (countAboveThreshold.emot[course_code] / totalStudents) * 100;
        percentageAboveThreshold.ehot[course_code] = (countAboveThreshold.ehot[course_code] / totalStudents) * 100;
    }

    let attainedScores = {
        lot: {},
        mot: {},
        hot: {},
        elot: {},
        emot: {},
        ehot: {},
        overall: {}
    };

    for (const course_code of stud_coursecodes) 
    {
        attainedScores.lot[course_code] = await calculateCategory(percentageAboveThreshold.lot[course_code]);
        attainedScores.mot[course_code] = await calculateCategory(percentageAboveThreshold.mot[course_code]);
        attainedScores.hot[course_code] = await calculateCategory(percentageAboveThreshold.hot[course_code]);
        attainedScores.elot[course_code] = await calculateCategory(percentageAboveThreshold.elot[course_code]);
        attainedScores.emot[course_code] = await calculateCategory(percentageAboveThreshold.emot[course_code]);
        attainedScores.ehot[course_code] = await calculateCategory(percentageAboveThreshold.ehot[course_code]);
    
        attainedScores.overall[course_code] = 
        {
            lot: (attainedScores.lot[course_code] * (cal.cia_weightage / 100)) + 
                    (attainedScores.elot[course_code] * (cal.ese_weightage / 100)),
            mot: (attainedScores.mot[course_code] * (cal.cia_weightage / 100)) + 
                    (attainedScores.emot[course_code] * (cal.ese_weightage / 100)),
            hot: (attainedScores.hot[course_code] * (cal.cia_weightage / 100)) + 
                    (attainedScores.ehot[course_code] * (cal.ese_weightage / 100))
        }
    
        const avgOverallScore = (
            attainedScores.overall[course_code].lot +
            attainedScores.overall[course_code].mot +
            attainedScores.overall[course_code].hot
        ) / 3;
    
        attainedScores.grade = attainedScores.grade || {};
        attainedScores.grade[course_code] = calculateGrade(avgOverallScore);
    }
    res.json({attainedScores});
})

// ------------------------------------------------------------------------------------------------------- //
    
async function calculateCategory(percentage) 
{
    try 
    {
        const academicdata = await academic.findOne({ where: { active_sem: 1 } });

        if (!academicdata) {
            console.error("Academic data not found");
            return null;
        }

        const data = await calculation.findOne({ where: { active_sem: academicdata.academic_year } });

        if (!data) {
            console.error("Calculation data not found for the specified academic year");
            return null;
        }

        if (percentage >= data.so_l3_ug) {
            return 3;
        } 
        else if (percentage >= data.so_l2_ug) {
            return 2;
        } 
        else if (percentage >= data.so_l1_ug) {
            return 1;
        } 
        else if (percentage > data.so_l0_ug) {
            return 0;
        }
        return 0;
    } 
    catch (error) {
        console.error('Error fetching academic or calculation data:', error);
    }
}

// ------------------------------------------------------------------------------------------------------- //

function calculateGrade(overallAverage) 
{
    if (overallAverage >= 2.5) {
        return 'High';
    } 
    else if (overallAverage >= 1.5 && overallAverage < 2.5) {
        return 'Medium';
    } 
    else if (overallAverage >= 0) {
        return 'Low';
    } 
    else {
        return 'N/A';
    }
}

module.exports = route;