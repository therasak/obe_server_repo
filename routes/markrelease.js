const express = require ('express');
const route = express.Router();
const coursemapping = require('../models/coursemapping');
const report = require('../models/report');
const academic = require('../models/academic');

// ------------------------------------------------------------------------------------------------------- //

// Mark Release Report Data

route.get('/reportdata', async (req, res) => 
{
    try 
    {
        const activeAcademic = await academic.findOne({
			where: { active_sem: 1 },
		})

		if (!activeAcademic) {
			return res.status(404).json({ error: "Active Academic Year not Found" });
		}

		const activeSemester = activeAcademic.academic_sem; 

        const reportData = await report.findAll({
            where: { academic_sem: activeSemester}
        })

        const staff = await coursemapping.findAll();

        const matchData = reportData.map(match=>
        {
            const matchStaff = staff.find(staff => staff.staff_id === match.staff_id && staff.course_code === match.course_code && staff.dept_name===match.dept_name);
            if(matchStaff)
            {
                return {
                    ...match.toJSON(),
                    staff_name: matchStaff.staff_name,
                    dept_id: matchStaff.dept_id,
                    course_title:matchStaff.course_title
                }   
            }
            else 
            {
                return {
                    ...match.toJSON(),
                    staff_name: 'unknown',
                    dept_id: 'unknown'
                }   
            }
        })
        const count = await report.count();
        res.json(matchData);
    } 
    catch (error) {
        console.error("Error Fetching Report Data:", error);
        res.status(500).send({ success: false, error: "Failed to Fetch Report Data" });
    }
})

// ------------------------------------------------------------------------------------------------------- //

// Mark Indivudual Release

route.put('/reportrelease', async (req, res)=> 
{
    const {dept_name,course_code, category, section, cia_1, cia_2, ass_1, ass_2, ese,} = req.body;
    try
    {
        const update = await report.update({
            cia_1, cia_2, ass_1, ass_2, ese}, 
            { where: {course_code, section, dept_name, category}})
        if (update)
        {
            res.status(200).json({ message: 'Update Successful' });
        }
    }
    catch(err){
        console.error('Error for Updating')
        res.status(500)
    }
})

// ------------------------------------------------------------------------------------------------------- //

// Mark Release Report Data

route.put('/overallrelease', async (req, res) => 
{
    const {l_cia1,l_cia2 , l_a1, l_a2, l_ese} = req.body;
    try
    {
        const update = await report.update({l_c1 : l_cia1, l_c2 : l_cia2, l_a1 : l_a1, l_a2 : l_a2, l_ese : l_ese }, {where: {}})
        if (update) {
            res.status(200)
        }
    }
    catch(err) {
        console.error('Error for Updating')
        res.status(500)
    }
})

module.exports = route;