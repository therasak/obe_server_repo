const express = require('express');
const route = express.Router();
const calculation = require('../models/calculation');

// ------------------------------------------------------------------------------------------------------- //

route.post('/calculation', async (req, res) => 
{
    try 
    {
        const { cia1, cia2, ass1, ass2, maxCia, maxEse, academicYear, inputValue } = req.body;
        
        if (!cia1 || !cia2 || !ass1 || !ass2 || !maxCia || !maxEse) {
            return res.status(400).json({ error: 'All fields are Required.' });
        }

        const calculationData = 
        {
            c1_lot: cia1.lot, c1_mot: cia1.mot, c1_hot: cia1.hot,
            c2_lot: cia2.lot, c2_mot: cia2.mot, c2_hot: cia2.hot,
            a1_lot: ass1.lot, a1_mot: ass1.mot, a1_hot: ass1.hot,
            a2_lot: ass2.lot, a2_mot: ass2.mot, a2_hot: ass2.hot,
            c_lot: maxCia.lot,
            c_mot: maxCia.mot,
            c_hot: maxCia.hot,
            e_lot: maxEse.lot,
            e_mot: maxEse.mot,
            e_hot: maxEse.hot,
            ese_weightage: maxEse.weightage,
            cia_weightage: cia1.weightage,
            active_sem: academicYear,
            co_thresh_value: inputValue
        }

        const decition = await calculation.findAll({
            where: { active_sem: academicYear }
        })

        if (decition.length > 0) 
        {
            await calculation.update(calculationData, {
                where: { active_sem: academicYear }
            })
        }
        else {
            await calculation.create(calculationData);
        }
        res.status(201).json({ message: 'Data Saved Successfully!' });
    } 
    catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ error: 'Failed to save data.' });
    }
})

// ------------------------------------------------------------------------------------------------------- //

route.post('/calculationlevel', async (req, res) => 
{
    try 
    {
        const { level0, level1, level2, level3, academicYear } = req.body;

        if (!level0 || !level1 || !level2 || !level3) {
            return res.status(400).json({ error: 'All fields are Required.' });
        }

        const calculationData = {
            so_l0_ug: level0.ug,
            so_l0_pg: level0.pg,
            so_l1_ug: level1.ug,
            so_l1_pg: level1.pg,
            so_l2_ug: level2.ug,
            so_l2_pg: level2.pg,
            so_l3_ug: level3.ug,
            so_l3_pg: level3.pg,
            active_sem: academicYear
        }

        const decition = await calculation.findAll({
            where: { active_sem: academicYear }
        })

        if (decition.length > 0) 
        {
            await calculation.update(calculationData, {
                where: { active_sem: academicYear }
            })
        }
        else {
            await calculation.create(calculationData);
        }
        res.status(201).json({ message: 'Data Saved Successfully!' });
    } 
    catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ error: 'Failed to Save Data.' });
    }
})

module.exports = route;