const express = require("express");
const route = express.Router();
const studenmaster = require("../models/studentmaster");

// ------------------------------------------------------------------------------------------------------- //
// Fetch All Student Details
route.get("/studetails", async (req, res) => {
  try {
    const studata = await studenmaster.findAll();
    res.status(200).json(studata);
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ error: "Failed to fetch student details" });
  }
});

// ------------------------------------------------------------------------------------------------------- //
route.post("/addstudent", async (req, res) => {
  try {
    const { stu_name, reg_no, category, section } = req.body;
    console.log("Received data:", req.body); // Debug: Check incoming data

    if (!stu_name || !reg_no || !category || !section) {
      return res.status(400).json({ error: "All fields are required: stu_name, reg_no, category, and section" });
    }

    const existingStudent = await studenmaster.findOne({ where: { reg_no } });
    if (existingStudent) {
      return res.status(400).json({ error: "Student with this registration number already exists" });
    }

    const newStudent = await studenmaster.create({ stu_name, reg_no, category, section });
    console.log("Student added to the database:", newStudent); // Debug: Check saved student

    res.status(201).json({ message: "Student added successfully!", student: newStudent });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ error: "Failed to add student" });
  }
});


// ------------------------------------------------------------------------------------------------------- //
// Edit an Existing Student
route.put("/editstudent", async (req, res) => {
  try {
    const { reg_no, stu_name, category, section } = req.body;

    // Validate input data
    if (!reg_no) {
      return res.status(400).json({ error: "Registration number is required to update student details" });
    }
    if (!stu_name || !category || !section) {
      return res.status(400).json({ error: "All fields are required: stu_name, category, and section" });
    }

    // Update the student record identified by reg_no
    const [updatedRowsCount] = await studenmaster.update(
      { stu_name, category, section },
      { where: { reg_no } }
    );

    if (updatedRowsCount > 0) {
      res.status(200).json({ message: "Student updated successfully!" });
    } else {
      res.status(404).json({ error: "Student not found with the given registration number!" });
    }
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Failed to update student" });
  }
});

// ------------------------------------------------------------------------------------------------------- //
// Delete a Student
route.delete("/deletestudent/:reg_no", async (req, res) => {
  try {
    const { reg_no } = req.params;

    // Delete the student identified by reg_no
    const result = await studenmaster.destroy({ where: { reg_no } });

    if (result === 0) {
      return res.status(404).json({ error: "Student not found with the given registration number" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Failed to delete student" });
  }
});

module.exports = route;
