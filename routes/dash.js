const express = require('express');
const route = express.Router();
const studentmaster = require('../models/studentmaster');
const staffmaster = require('../models/staffmaster');
const report = require('../models/report');
const coursemapping = require('../models/coursemapping');

// ------------------------------------------------------------------------------------------------------- //

// Student Staff Programme Course Count

route.get('/counts', async (req, res) => 
{
    try 
    {
        const studentCount = await studentmaster.count();
        const staffCount = await staffmaster.count();

        const uniqueCourseCount = await coursemapping.count({
            distinct: true,
            col: 'course_code'
        });

        const uniqueProgramCount = await coursemapping.count({
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
});

// ------------------------------------------------------------------------------------------------------- //

// Student Piechart

route.get('/studentpiechart', async (req, res) => 
{
    try 
    {
        const studentPieData = await studentmaster.findAll();

        const categoryCounts = {};

        studentPieData.forEach(student => {
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
        }})
        const sfm = await staffmaster.count({ where: {
            category: 'SFM'
        }})
        const sfw = await staffmaster.count({ where: {
            category: 'SFW'
        }})
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
        const componentData = await report.findAll();
        if (componentData) 
        {
            const courseCodes = componentData.map(data => data.course_code);
            const cia_1 = await report.count({
                where: {
                    course_code: courseCodes,
                    cia_1: '2'
                },
                distinct: true,
                col: 'course_code'
            });
            const cia_2 = await report.count({
                where: {
                    course_code: courseCodes,
                    cia_2: '2'
                },
                distinct: true,
                col: 'course_code'
            });
            const ass_1 = await report.count({
                where: {
                    course_code: courseCodes,
                    ass_1: '2'
                },
                distinct: true,
                col: 'course_code'
            });
            const ass_2 = await report.count({
                where: {
                    course_code: courseCodes,
                    ass_2: '2'
                },
                distinct: true,
                col: 'course_code'
            });
            const ese = await report.count({
                where: {
                    course_code: courseCodes,
                    ese: '2'
                },
                distinct: true,
                col: 'course_code'
            });
            res.json({cia_1, cia_2, ass_1, ass_2, ese});
        }
    }
    catch (error) {
        console.error('Error fetching counts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = route;