const express = require('express');
const route = express.Router();
const markentry = require('../models/markentry');
const studentmaster = require('../models/studentmaster');
const calculation = require('../models/calculation');
const academic = require('../models/academic');

const getUniqueValues = (data, key) => {
    return [...new Set(data.map(entry => entry[key]))];
};

route.get('/markentry', async (req, res) => {
    const { batch, active_sem, course_id, category } = req.query;

    try {
        const where = {};
        if (batch) where.batch = batch;
        if (active_sem) where.active_sem = active_sem;
        if (course_id) where.course_id = course_id;
        if (category) where.category = category;

        const entries = await markentry.findAll({
            attributes: ['batch', 'active_sem', 'course_id', 'category', 'course_code'],
            where
        });

        const uniqueEntries = {
            batch: getUniqueValues(entries, 'batch'),
            active_sem: getUniqueValues(entries, 'active_sem'),
            course_id: getUniqueValues(entries, 'course_id'),
            category: getUniqueValues(entries, 'category'),
            course_code: getUniqueValues(entries, 'course_code')
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
        const uniqueSections = [...new Set(students.map(student => student.section))];
        res.json(uniqueSections);
    } catch (error) {
        console.error('Error fetching student sections:', error);
        res.status(500).json({ message: 'Error fetching student sections' });
    }
});

route.get('/studOutcome', async (req, res) => {
    const {
        selectedBatch,
        selectedSem,
        selectedCourseId,
        selectedCategory,
        selectedCourseCode,
        selectedSection
    } = req.query;

    console.log(selectedBatch, selectedSem, selectedCourseId, selectedCategory, selectedCourseCode, selectedSection);

    try {
        const students = await studentmaster.findAll({
            where: {
                batch: selectedBatch,
                course_id: selectedCourseId,
                category: selectedCategory,
                section: selectedSection
            },
            attributes: ['reg_no']
        });

        const stud_regs = students.map(student => student.reg_no);

        const marks = await markentry.findAll({
            where: {
                reg_no: stud_regs,
                // course_code: selectedCourseCode,
                active_sem: selectedSem
            }
        });

        const academicdata = await academic.findOne({
            where: { active_sem: 1 }
        });
        const cal = await calculation.findOne({
            where: { active_sem: academicdata.academic_year }
        });
        const calculatedData = await Promise.all(marks.map(async entry => {
            let {
                c1_lot = 0, c2_lot = 0, a1_lot = 0, a2_lot = 0, ese_lot = 0,
                c1_mot = 0, c2_mot = 0, ese_mot = 0,
                c1_hot = 0, c2_hot = 0, ese_hot = 0
            } = entry.dataValues;
            
            const lot_total = (cal.c1_lot || 0) + (cal.c2_lot || 0) + (cal.a1_lot || 0) + (cal.a2_lot || 0);
            const mot_total = (cal.c1_mot || 0) + (cal.c2_mot || 0);
            const hot_total = (cal.c1_hot || 0) + (cal.c2_hot || 0);
            const cia_weightage = cal.cia_weightage || 0;
            const ese_weightage = cal.ese_weightage || 0;
        
            const lot_percentage = ((c1_lot || 0) + (c2_lot || 0) + (a1_lot || 0) + (a2_lot || 0)) / (lot_total || 1) * 100;
            const mot_percentage = ((c1_mot || 0) + (c2_mot || 0)) / (mot_total || 1) * 100;
            const hot_percentage = ((c1_hot || 0) + (c2_hot || 0)) / (hot_total || 1) * 100;
            const elot_percentage = (ese_lot || 0) / 25 * 100;
            const emot_percentage = (ese_mot || 0) / 40 * 100;
            const ehot_percentage = (ese_hot || 0) / 10 * 100;
            const overAll_lot = (lot_percentage*cia_weightage/100) + (elot_percentage*ese_weightage/100)
            const overAll_mot = (mot_percentage*cia_weightage/100) + (emot_percentage*ese_weightage/100)
            const overAll_hot = (hot_percentage*cia_weightage/100) + (ehot_percentage*ese_weightage/100)

        
            console.log(`LOT Percentage: ${lot_percentage}, MOT Percentage: ${mot_percentage}, HOT Percentage: ${hot_percentage}`);
            console.log(overAll_lot, overAll_mot, overAll_hot);
            return {
                ...entry.dataValues,
                lot_percentage: await calculateCategory(lot_percentage),
                mot_percentage: await calculateCategory(mot_percentage),
                hot_percentage: await calculateCategory(hot_percentage),
                elot_percentage: await calculateCategory(elot_percentage),
                emot_percentage: await calculateCategory(emot_percentage),
                ehot_percentage: await calculateCategory(ehot_percentage),
                overAll_lot: await calculateCategory(overAll_lot),
                overAll_mot: await calculateCategory(overAll_mot),
                overAll_hot: await calculateCategory(overAll_hot),            
            };
          
        }));
        res.json(calculatedData);

    } catch (error) {
        console.error('Error fetching student sections:', error);
        res.status(500).json({ message: 'Error fetching student sections' });
    }
});

async function calculateCategory(percentage) {
    try {
        const academicdata = await academic.findOne({
            where: { active_sem: 1 }
        });

        if (!academicdata) {
            console.error("Academic data not found");
            return null;
        }

        const data = await calculation.findOne({
            where: { active_sem: academicdata.academic_year }
        });

        if (!data) {
            console.error("Calculation data not found for the specified academic year");
            return null;
        }

        if (percentage > data.so_l3_ug) {
            return 3;
        } else if (percentage > data.so_l2_ug) {
            return 2;
        } else if (percentage > data.so_l1_ug) {
            return 1;
        } else if (percentage > data.so_l0_ug) {
            return 0;
        }
        return 0;

    } catch (error) {
        console.error('Error fetching academic or calculation data:', error);
    }
}

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




