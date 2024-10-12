const express = require ('express');
const route = express.Router();
const coursemapping = require('../models/coursemapping');

// ------------------------------------------------------------------------------------------------------- //

// Report Department Name Fetching Coding

route.post('/coursemap', async (req, res) => 
{
    const { academic_year } = req.body;
    console.log('academic_year:', academic_year);

    try {
        const courseDeptMapping = await coursemapping.findAll({
            where: {
                active_sem: academic_year
            }
        });
        res.json(courseDeptMapping);
    }
    catch (err) {
        res.status(500).json({ error: 'An error occurred while Fetching Data.' });
    }
})

module.exports = route;