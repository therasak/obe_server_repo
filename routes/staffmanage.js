const express = require ('express');
const route = express.Router();

const staffmaster = require('../models/staffmaster');
const scope = require('../models/scope');
const hod = require('../models/hod');
const mentor = require('../models/mentor'); 

// ------------------------------------------------------------------------------------------------------- //

// Staff Details Fetching Coding

route.get('/staffdetails', async (req, res) => 
{
    const staffDetails = await staffmaster.findAll();
    res.json(staffDetails);
})

// ------------------------------------------------------------------------------------------------------- //

// Staff Add

route.post('/newstaff', async (req, res) => 
{
    const { staff_id, staff_name, staff_dept, category, password, permissions } = req.body; 

    try 
    {
        const newStaff = await staffmaster.create(
        {
            staff_id: staff_id,
            staff_name: staff_name,
            staff_dept: staff_dept,
            category: category,
            staff_pass: password
        })

        const newScope = await scope.create(
        {
            staff_id: staff_id, 
            dashboard: permissions.dashboard ? 1 : 0,
            course_list: permissions.course ? 1 : 0,
            course_outcome: permissions.co ? 1 : 0, 
            student_outcome: permissions.so ? 1 : 0, 
            program_outcome: permissions.po ? 1 : 0,
            program_specific_outcome: permissions.pso ? 1 : 0,
            mentor_report: permissions.tutor ? 1 : 0,
            hod_report: permissions.hod ? 1 : 0,
            report: permissions.report ? 1 : 0,
            input_files: permissions.input ? 1 : 0,
            manage: permissions.manage ? 1 : 0,
            relationship_matrix: permissions.rsm ? 1 : 0,
            settings: permissions.setting ? 1 : 0,
        })
        return res.json({ message: 'New Staff and Permissions Added Successfully' });
    } 
    catch (err) {
        console.error('Error Inserting Data into the DataBase:', err);
        return res.status(500).json({ message: 'Database error' });
    }
})
    
// ------------------------------------------------------------------------------------------------------- //

// Staff Updation

route.put('/staffupdate',async (req,res)=>
{
    const {newstaffid,newstaffname,newpassword,newdept,newcategory} = req.body;
    try
    {
        const updated_staff = await staffmaster.update(
            { 
                staff_name:newstaffname, 
                staff_pass:newpassword,
                staff_dept:newdept,
                category:newcategory
            },
            { where: { staff_id: newstaffid } }
        )
        res.json({ message: 'Staff Updated Successfully' })
    }
    catch(err) {
        console.log("Error while Update")
    }
})

// ------------------------------------------------------------------------------------------------------- //

// Staff Deletion

route.post('/staffdelete', async (req,res)=>
{
    const {deletestaffid}=req.body;
    try
    {
        const deleteresult = await staffmaster.destroy({
            where: { staff_id: deletestaffid }
        })
        res.json({message:"Staff Successfully Deleted"})
    }
    catch(err)
    {
        console.log(err,"Delete Error")
    }
})

// ------------------------------------------------------------------------------------------------------- //

route.get('/hod', async (req, res) => 
{
    try {
        const hodData = await hod.findAll(); 
        res.json(hodData); 
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching data from the HOD Table.' });
    }
});

// ------------------------------------------------------------------------------------------------------- //

route.get('/mentor', async (req, res) => 
{
    try {
        const mentorData = await mentor.findAll(); 
        res.json(mentorData); 
    } 
    catch (err) {
        console.error(err); 
        res.status(500).json({ error: 'An error occurred while fetching data from the Mentor Table.' });
    }
})

module.exports = route;