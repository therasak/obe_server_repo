const express = require ('express');
const route = express.Router();
const scope = require('../models/scope');

// Scope Setting Coding

route.get('/scopeset', async (req, res) => 
    {
        const scopeData = await scope.findAll();
        res.json(scopeData);
    });

    
module.exports=route;