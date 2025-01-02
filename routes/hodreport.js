const express = require('express');
const route = express.Router();
const { Op } = require('sequelize');
const hod = require('../models/hod');
const report = require('../models/report');
const academic = require('../models/academic');
const coursemapping = require('../models/coursemapping');

// ------------------------------------------------------------------------------------------------------- //

// Dept Status Coding

route.post('/deptStatus', async (req, res) => 
{
    const { staff_id } = req.body;

    try 
    {
        const academicdata = await academic.findOne({
            where: { active_sem: 1 }
        })

        const user = await hod.findAll({
            where: { staff_id },
            attributes: ['category','course_id', 'dept_name'],
            raw: true
        })

        if (user.length > 0) 
        {
            const reportDetails = [];

            for (const { category, course_id, dept_name } of user) 
            {
               
                const reportInfo = await report.findAll({
                    where: { 
                        category: category, 
                        dept_name: dept_name, 
                        active_sem: academicdata.academic_year, 
                        // cia_1: {
                        //     [Op.in]: [0, 1]
                        // }
                    },
                    raw: true
                })

                // console.log(reportInfo);

                const courseInfo = await coursemapping.findAll({
                    where: { category, dept_name, course_id, active_sem: academicdata.academic_year },
                    raw: true
                });

                const details = courseInfo.map(userReport => {
                    
                    const matchingStaff = reportInfo.find(staff =>
                        staff.category === userReport.category &&
                        staff.course_code === userReport.course_code &&
                        staff.section === userReport.section &&
                        staff.dept_name === userReport.dept_name &&
                        staff.staff_id === userReport.staff_id
                    )

                    return {
                        ...userReport,
                        cia_1: matchingStaff.cia_1 === 2 ? 'Completed' : matchingStaff.cia_1 === 1 ? 'Processing' : 'Incomplete',
                        cia_2: matchingStaff.cia_2 === 2 ? 'Completed' : matchingStaff.cia_2 === 1 ? 'Processing' : 'Incomplete',
                        ass_1: matchingStaff.ass_1 === 2 ? 'Completed' : matchingStaff.ass_1 === 1 ? 'Processing' : 'Incomplete',
                        ass_2: matchingStaff.ass_2 === 2 ? 'Completed' : matchingStaff.ass_2 === 1 ? 'Processing' : 'Incomplete',
                        semester: matchingStaff ?
                            (matchingStaff.semester === 1 || matchingStaff.semester === 2) ? 1 :
                            (matchingStaff.semester === 3 || matchingStaff.semester === 4) ? 2 : 3 : 'N/A'
                    }
                })
                reportDetails.push(...details);
            }
            res.json(reportDetails);
        } 
        else {
            res.status(404).json({ message: "No records found for the given staff ID." });
        }
    } 
    catch (error) {
        console.error('Error during Dept Status Processing:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

module.exports = route;