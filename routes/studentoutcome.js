const express = require('express');
const route = express.Router();
const markentry = require('../models/markentry'); 
const studentmaster = require('../models/studentmaster'); 


const getUniqueValues = (data, key) => {
    return [...new Set(data.map(entry => entry[key]))];
};


route.get('/markentry', async (req, res) => {
    console.log('Received request for mark entries');
    try {
        const entries = await markentry.findAll({
            attributes: ['batch', 'active_sem', 'course_id', 'category', 'course_code']
        });

        const uniqueEntries = {
            batch: getUniqueValues(entries, 'batch'),
            active_sem: getUniqueValues(entries, 'active_sem'),
            course_id: getUniqueValues(entries, 'course_id'),
            category: getUniqueValues(entries, 'category'),
            course_code: getUniqueValues(entries, 'course_code'),
        };
        
        res.json(uniqueEntries);
    } catch (error) {
        console.error('Error fetching mark entries:', error);
        res.status(500).json({ message: 'Error fetching mark entries' });
    }
});


route.get('/studentmaster', async (req, res) => {
    try {
        const students = await studentmaster.findAll({
            attributes: ['section']
        });
        const uniqueSections = [...new Set(students.map(student => student.section))]; // Extract unique sections
        res.json(uniqueSections);
    } catch (error) {
        console.error('Error fetching student sections:', error);
        res.status(500).json({ message: 'Error fetching student sections' });
    }
});

module.exports = route;















// const express = require('express'); 
// const route = express.Router();
// const markentry = require('../models/markentry');
// const academic = require('../models/academic');

// function calculateCategory(percentage) {
//     if (percentage > 80) {
//         return 3;
//     } 
//     else if (percentage > 60) {
//         return 2;
//     } 
//     else if (percentage > 10){
//         return 1;
//     }
//     else{
//         return 0;
//     }
// }

// route.get('/course_outcome', async (req, res) => {
//     try {
//         const academicdata = await academic.findOne({
//             where: {
//                 active_sem: 1
//             }
//         });

//         if (!academicdata) {
//             return res.status(404).json({ error: 'No academic record found for the active semester.' });
//         }

//         const student_out = await markentry.findAll({
//             where: {
//                 active_sem: academicdata.academic_year
//             }
//         });

//         const calculatedData = student_out.map(entry => {
//             let {
//                 c1_lot, c2_lot, a1_lot, a2_lot, ese_lot,
//                 c1_mot, c2_mot, ese_mot,
//                 c1_hot, c2_hot, ese_hot
//             } = entry.dataValues;

//             const lot_percentage = ((c1_lot || 0) + (c2_lot || 0) + (a1_lot || 0) + (a2_lot || 0) + (ese_lot || 0)) / 87 * 100;
//             const mot_percentage = ((c1_mot || 0) + (c2_mot || 0) + (ese_mot || 0)) / 120 * 100;
//             const hot_percentage = ((c1_hot || 0) + (c2_hot || 0) + (ese_hot || 0)) / 30 * 100;

//             // Use the helper function to determine category
//             return {
//                 ...entry.dataValues,
//                 lot_percentage: calculateCategory(lot_percentage),
//                 mot_percentage: calculateCategory(mot_percentage),
//                 hot_percentage: calculateCategory(hot_percentage)
//             };
//         });

//         res.json(calculatedData);
//     } catch (err) {
//         console.error('Error in course_outcome route:', err);
//         res.status(500).json({ error: 'An error occurred while fetching data.' });
//     }
// });

// module.exports = route; 




