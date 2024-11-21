const express = require('express');
const route = express.Router();
const studentmaster = require('../models/studentmaster');
const staffmaster = require('../models/staffmaster');
const report = require('../models/report');
const academic = require('../models/academic')
const coursemapping = require('../models/coursemapping');
const { Sequelize } = require('sequelize');

// ------------------------------------------------------------------------------------------------------- //

// Student Staff Programme Course Count

route.get('/counts', async (req, res) => 
{
    try 
    {
        const academicdata = await academic.findOne({
            where: { active_sem: 1 }
        })

        const studentCount = await studentmaster.count({
            where: {active_sem: String(academicdata.academic_year)}
        });

        const staffCount = await staffmaster.count();

        const uniqueCourseCount = await coursemapping.count({
            where: {active_sem: String(academicdata.academic_year)},
            distinct: true,
            col: 'course_code'
        });

        const uniqueProgramCount = await coursemapping.count({
            where: {active_sem: String(academicdata.academic_year)},
            distinct: true,
            col: 'course_id'
        });

        res.json({
            studentCount,
            staffCount,
            courseCount: uniqueCourseCount,
            programCount: uniqueProgramCount
        });
    }
    catch (error) {
        console.error('Error fetching counts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// ------------------------------------------------------------------------------------------------------- //

// Student Piechart

route.get('/studentpiechart', async (req, res) => 
{
    try 
    {
        const studentPieData = await studentmaster.findAll();

        const categoryCounts = {};

        studentPieData.forEach(student => 
        {
            const category = student.category;
            if (category) {
                if (!categoryCounts[category]) {
                    categoryCounts[category] = 0;
                }
                categoryCounts[category]++;
            }
        });

        const result = Object.keys(categoryCounts).map(key => ({
            type: key,
            count: categoryCounts[key]
        }));

        const aided = await studentmaster.count({ where: {
            category: 'AIDED'
        }})
        const sfm = await studentmaster.count({ where: {
            category: 'SFM'
        }})
        const sfw = await studentmaster.count({ where: {
            category: 'SFW'
        }})
        res.json({ data: result, aided, sfm, sfw });
    }
    catch (error) {
        console.error('Error fetching student pie data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// ------------------------------------------------------------------------------------------------------- //

// Staff Piechart

route.get('/staffpiechart', async (req, res) => 
{
    try 
    {
        const staffData = await staffmaster.findAll();
        const categoryCounts = {};

        staffData.forEach(staff => 
        {
            const category = staff.category;
            if (category) {
                if (!categoryCounts[category]) {
                    categoryCounts[category] = 0;
                }
                categoryCounts[category]++;
            }
        });

        const result = Object.keys(categoryCounts).map(key => ({
            type: key,
            count: categoryCounts[key]
        }));

        const aided = await staffmaster.count({ where: {
            category: 'AIDED'
        }});

        const sfm = await staffmaster.count({ where: {
            category: 'SFM'
        }});

        const sfw = await staffmaster.count({ where: {
            category: 'SFW'
        }});

        res.json({ data: result, aided, sfm, sfw });
    }
    catch (error) {
        console.error('Error fetching staff pie data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ------------------------------------------------------------------------------------------------------- //

// Component Report Table

route.post('/componentreport', async (req, res) => 
{
    try 
    {
        const academicdata = await academic.findOne({
            where: { active_sem: 1 }
        })

        const totalCount = await report.count({
            where: {active_sem: String(academicdata.academic_year)}
        });

        const cia_1 = await report.count({
            where: {
                active_sem: String(academicdata.academic_year),
                cia_1: '2'
            }
        });

        const cia_2 = await report.count({
            where: {
                active_sem: String(academicdata.academic_year),
                cia_2: '2'
            }
        });

        const ass_1 = await report.count({
            where: {
                active_sem: String(academicdata.academic_year),
                ass_1: '2'
            }
        });

        const ass_2 = await report.count({
            where: {
                active_sem: String(academicdata.academic_year),
                ass_2: '2'
            },
        });

        const ese = await report.count({
            where: {
                active_sem: String(academicdata.academic_year),
                ese: '2'
            },
        });

        res.json({cia_1, cia_2, ass_1, ass_2, ese, totalCount});
    }
    catch (error) {
        console.error('Error fetching counts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = route;

// ------------------------------------------------------------------------------------------------------- //

route.post('/processedChartData', async (req, res) => 
{
    try 
    {
        const course_codes = await report.findAll({
            attributes: ['course_code', 'cia_1', 'cia_2', 'ass_1', 'ass_2', 'ese'],
        });

        const counts = 
        {
            cia_1: 0,
            cia_2: 0,
            ass_1: 0,
            ass_2: 0,
            ese: 0,
        };

        const stud_coursecodes = [...new Set(course_codes.map(entry => entry.course_code))];

        for (let course_code of stud_coursecodes) 
        {
            const courseRows    = course_codes.filter(entry => entry.course_code === course_code);
            const allCia1Equal2 = courseRows.every(row => row.cia_1 === 2);
            const allCia2Equal2 = courseRows.every(row => row.cia_2 === 2);
            const allAss1Equal2 = courseRows.every(row => row.ass_1 === 2);
            const allAss2Equal2 = courseRows.every(row => row.ass_2 === 2);
            const allEseEqual2  = courseRows.every(row => row.ese === 2);

            if (allCia1Equal2) counts.cia_1++;
            if (allCia2Equal2) counts.cia_2++;
            if (allAss1Equal2) counts.ass_1++;
            if (allAss2Equal2) counts.ass_2++;
            if (allEseEqual2) counts.ese++;
        }
        
        res.status(200).json({ uniqueCourseCodes: stud_coursecodes, counts }); 
    } 
    catch (error) {
        console.error('Error processing chart data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = route;