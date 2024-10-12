const express = require ('express');
const route = express.Router();
const coursemapping = require('../models/coursemapping');

// ------------------------------------------------------------------------------------------------------- //

// Report Department Name Fetching Coding

route.post('/statusDeptName', async (req, res) => 
{
    const { academicYear } = req.body;
    
    try {
        const courseDeptMapping = await coursemapping.findAll({
            where: {
                active_sem: academicYear
            }
        });
        res.json(courseDeptMapping);
    }
    catch (err) {
        res.status(500).json({ error: 'An error occurred while Fetching Data.' });
    }
})

module.exports = route;