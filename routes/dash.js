const express = require ('express');
const route = express.Router();
const studentmaster = require('../models/studentmaster');
const staffmaster = require('../models/staffmaster');
const coursemapping = require('../models/coursemapping');


// student,staff,course,programm cout

route.get('/counts', async (req, res) => 
    {
        try 
        {
            const studentCount = await studentmaster.count();
            const staffCount = await staffmaster.count();
    
            const uniqueCourseCount = await coursemapping.count({
                distinct: true,
                col: 'course_code'
            });
    
            const uniqueProgramCount = await coursemapping.count({
                distinct: true,
                col: 'course_id'
            });
            res.json({
                studentCount,
                staffCount,
                courseCount: uniqueCourseCount,
                programCount: uniqueProgramCount
            });
        } 
        catch (error) {
            console.error('Error fetching counts:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    //studentpiechart

    route.get('/studentpiechart', async (req, res) =>
        {
            try 
            {
                const studentPieData = await studentmaster.findAll();
                
                const categoryCounts = {};
        
                studentPieData.forEach(student => 
                {
                    const category = student.category; 
                    if (category) 
                    { 
                        if (!categoryCounts[category]) {
                            categoryCounts[category] = 0; 
                        }
                        categoryCounts[category]++;
                    }
                });
        
                const result = Object.keys(categoryCounts).map(key => ({
                    type: key,
                    count: categoryCounts[key]
                }));
        
                res.json({ data: result });
            } 
            catch (error) {
                console.error('Error fetching student pie data:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        //staffpiechart

        route.get('/staffpiechart', async (req, res) => 
            {
                try 
                {
                    const staffData = await staffmaster.findAll();
                    const categoryCounts = {};
            
                    staffData.forEach(staff => {
                        const category = staff.category;
                        if (category) 
                        { 
                            if (!categoryCounts[category]) {
                                categoryCounts[category] = 0;
                            }
                            categoryCounts[category]++;
                        }
                    });
            
                    const result = Object.keys(categoryCounts).map(key => ({
                        type: key,
                        count: categoryCounts[key]
                    }));
            
                    res.json({ data: result });
                } 
                catch (error) {
                    console.error('Error fetching staff pie data:', error);
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            });
            
module.exports=route;