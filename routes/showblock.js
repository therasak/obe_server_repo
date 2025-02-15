const express = require('express');
const route = express.Router();
const academic = require('../models/academic');
const { where } = require('sequelize');
// const { where } = require('sequelize');

route.get('/showblock', async (req, res) => {
    try {
        const lockData = await academic.findOne({
            where: { active_sem: 1 }
        })
        res.json(lockData);
    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


//-----------------------------------
route.post('/updatelock', async (req, res) => {

    const activeData = req.body;
    // console.log("UPDAET DATA", activeData)
    try {
        const updateLock = await academic.update(
            {
                cia_1: activeData.cia_1,
                cia_2: activeData.cia_2,
                ass_1: activeData.ass_1,
                ass_2: activeData.ass_2
            },
            {
                where: { active_sem: 1 } 
            }
        );
        res.json({"message":"Success"})
    } catch (err) {
        res.json({"message":"Issue in Lock Update"})
    }
})
module.exports = route;