const express =  require("express");
const route = express.Router();
const mentor = require('../models/mentor');

// ------------------------------------------------------------------------------------------------------- //

// Student Details Fetching 

route.post('/tutorreportcode', async (req, res) => 
{
    const { academic_year, staff_id } = req.body;
    console.log(academic_year, staff_id );
})

module.exports = route;