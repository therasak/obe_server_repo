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

route.post('/checkstaffId', async (req, res) => 
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

const getUniqueValues = (data, key) => {
    return [...new Set(data.map(entry => entry[key]))];
}

// ------------------------------------------------------------------------------------------------------- //

route.get('/markentry', async (req, res) => 
{
    const { batch, active_sem, course_id, category } = req.query;

    try 
    {
        const where = {};
        if (batch) where.batch = batch;
        if (active_sem) where.active_sem = active_sem;
        if (course_id) where.course_id = course_id;
        if (category) where.category = category;

        const entries = await markentry.findAll({
            attributes: ['batch', 'active_sem', 'course_id', 'category', 'course_code'],
            where
        })

        const uniqueEntries = {
            batch: getUniqueValues(entries, 'batch'),
            active_sem: getUniqueValues(entries, 'active_sem'),
            course_id: getUniqueValues(entries, 'course_id'),
            category: getUniqueValues(entries, 'category'),
            course_code: getUniqueValues(entries, 'course_code')
        }
        res.json(uniqueEntries);
    }
    catch (error) {
        console.error('Error Fetching Mark Entries:', error);
        res.status(500).json({ message: 'Error fetching mark entries' });
    }
})

// ------------------------------------------------------------------------------------------------------- //

route.get("/academic", async (req, res) => 
{
    try {
        const data = await academic.findAll();
        res.json({ academic_data: data });
    } 
    catch (err) {
        console.error("Error Fetching Academic Data :", err);
        res.status(500).json({ error: "Error Fetching Academic Data." });
    }
})

// ------------------------------------------------------------------------------------------------------- //

route.get("/coursemapping", async (req, res) => 
{
    try 
    {
        const { academic_year, category, dept_name, course_id, section, semester } = req.query;

        const filters = {};
        if (academic_year) filters.active_sem = academic_year;
        if (category) filters.category = category;
        if (dept_name) filters.dept_name = dept_name;
        if (course_id) filters.course_id = course_id;
        if (section) filters.section = section;
        if (semester) filters.semester = semester;

        const data = await coursemapping.findAll({ where: filters });
        res.json(data);
    } 
    catch (err) {
        console.error("Error Fetching Course Mapping Data :", err);
        res.status(500).json({ error: "Error Fetching Course Mapping Data." });
    }
})

// ------------------------------------------------------------------------------------------------------- //

route.get('/studentmaster', async (req, res) => 
{
    try 
    {
        const students = await studentmaster.findAll({
            attributes: ['section']
        })
        const uniqueSections = [...new Set(students.map(student => student.section))];
        res.json(uniqueSections);
    }
    catch (error) {
        console.error('Error Fetching Student Sections :', error);
        res.status(500).json({ message: 'Error Fetching Student Sections' });
    }
})

// ------------------------------------------------------------------------------------------------------- //

route.post('/adminstuoutcome', async (req, res) => 
{
    const 
    { 
        academicYear, selectedCategory, selectedDepartment, 
        selectedClass, selectedSection, selectedSemester } = req.body;

    try 
    {
        const students = await studentmaster.findAll(
        {
            where: {
                active_sem: academicYear,
                semester: selectedSemester,
                course_id: selectedClass,
                category: selectedCategory,
                section: selectedSection
            },
            attributes: ['reg_no']
        })

        const stud_regs = students.map(student => student.reg_no);

        const marks = await markentry.findAll({
            where: {
                reg_no: stud_regs,
                active_sem: academicYear
            }
        })

        const academicdata = await academic.findOne({
            where: { active_sem: 1 }
        })

        const cal = await calculation.findOne({
            where: { active_sem: academicdata.academic_year }

        })

        const calculatedData = await Promise.all(marks.map(async entry => 
        {
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
            const elot_percentage = (ese_lot || 0) / cal.e_lot * 100;
            const emot_percentage = (ese_mot || 0) / cal.e_mot * 100;
            const ehot_percentage = (ese_hot || 0) / cal.e_hot * 100;

            const lot_attainment = await calculateCategory(lot_percentage);
            const mot_attainment = await calculateCategory(mot_percentage);
            const hot_attainment = await calculateCategory(hot_percentage);
            const elot_attainment = await calculateCategory(elot_percentage);
            const emot_attainment = await calculateCategory(emot_percentage);
            const ehot_attainment = await calculateCategory(ehot_percentage);

            const overAll_lot = (lot_attainment * (cia_weightage / 100)) + (elot_attainment * (ese_weightage / 100));
            const overAll_mot = (mot_attainment * (cia_weightage / 100)) + (emot_attainment * (ese_weightage / 100));
            const overAll_hot = (hot_attainment * (cia_weightage / 100)) + (ehot_attainment * (ese_weightage / 100));

            const average_score = (overAll_lot + overAll_mot + overAll_hot) / 3;

            let final_grade = "N / A";

            if (average_score >= 2.5) 
            {
                final_grade = "High";
            } 
            else if (average_score >= 1.5) 
            {
                final_grade = "Medium";
            } 
            else if (average_score >= 0) 
            {
                final_grade = "Low";
            }

            return {
                ...entry.dataValues,
                lot_percentage,
                mot_percentage,
                hot_percentage,
                elot_percentage,
                emot_percentage,
                ehot_percentage,
                lot_attainment,
                mot_attainment,
                hot_attainment,
                elot_attainment,
                emot_attainment,
                ehot_attainment,
                overAll_lot,
                overAll_mot,
                overAll_hot,
                final_grade
            }
        }))
        res.json(calculatedData);
    }
    catch (error) {
        console.error('Error Fetching Student Sections:', error);
        res.status(500).json({ message: 'Error Fetching Student Sections:' });
    }
})

// ------------------------------------------------------------------------------------------------------- //

async function calculateCategory(percentage) 
{
    try 
    {
        const academicdata = await academic.findOne({
            where: { active_sem: 1 }
        })

        if (!academicdata) {
            console.error("Academic Data not Found");
            return null;
        }

        const data = await calculation.findOne({
            where: { active_sem: academicdata.academic_year }
        })

        if (!data) {
            console.error("Calculation Data not found for the Specified Academic Year");
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
        console.error('Error fetching Academic or Calculation Data:', error);
    }
}

module.exports = route;