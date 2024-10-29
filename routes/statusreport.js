const express = require ('express');
const route = express.Router();
const report = require('../models/report');
const coursemapping = require('../models/coursemapping');
const rsmatrix = require('../models/rsmatrix');

// ------------------------------------------------------------------------------------------------------- //

// Report Department Name Fetching Coding

route.post('/statusDeptName', async (req, res) => 
{
    const { academicYear } = req.body;
    
    try 
    {
        const reportDeptMapping = await report.findAll({
            where: { active_sem: academicYear },
            attributes: ['dept_name']
        })
        const uniqueDeptNames = [...new Set(reportDeptMapping.map(item => item.dept_name))];
        res.json(uniqueDeptNames); 
    }
    catch (err) {
        res.status(500).json({ error: 'An error occurred while Fetching Data.' });
    }
})

// ------------------------------------------------------------------------------------------------------- //

// Department Status Report Fetching Coding

route.post('/deptstatusreport', async (req, res) => 
{
    const { academic_year, dept_name } = req.body;

    try 
    {
        let deptReportStatus;

        if (dept_name === "ALL") {
            deptReportStatus = await report.findAll({
                where: { active_sem: academic_year }
            })
        } 
        else {
            deptReportStatus = await report.findAll({
                where: { 
                    active_sem: academic_year,
                    dept_name: dept_name
                }
            })
        }
        res.json(deptReportStatus);
    }
    catch (err) {
        res.status(500).json({ error: 'An error occurred while Fetching Data.' });
    }
})

// ------------------------------------------------------------------------------------------------------- //

// Matrix Status Report Fetching Coding

route.post('/allmatrixreport', async (req, res) => 
{
    const { academic_year } = req.body;
    try 
    {
        const matrixAllReport = await coursemapping.findAll({
            where: {
                active_sem: academic_year,
            }
        })

        if (!matrixAllReport) {
            throw new Error('No matrix report found.');
        }

        const rsMatrix = await rsmatrix.findAll();

        if (!rsMatrix) {
            throw new Error('No rsmatrix data found.');
        }

        const reportWithStatus = matrixAllReport.map(report => 
        {
            const isCompleted = rsMatrix.some(matrix => matrix.course_code === report.course_code);
            return {
                ...report.dataValues,
                status: isCompleted ? 'Completed' : 'Incomplete'
            }
        })
        res.json(reportWithStatus);
    } 
    catch (err) {
        console.error('Error fetching data:', err); 
        res.status(500).send('Error fetching data');
    }
})

module.exports = route;