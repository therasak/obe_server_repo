
const express = require('express');
const route = express.Router();

const coursemapping = require('../models/coursemapping');


route.get('/staffcoursemanage', async (req,res)=>
{
    const staffcourse = await coursemapping.findAll();
    res.json(staffcourse);
})

module.exports=route;