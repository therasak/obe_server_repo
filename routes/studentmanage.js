const express =  require("express");
const route = express.Router();
const studenmaster = require('../models/studentmaster');

// ------------------------------------------------------------------------------------------------------- //


// Student details fetching 

route.get('/studetails', async (req, res) => 
    {
        const studata = await studenmaster.findAll();
        res.json(studata);
    })



module.exports = route;