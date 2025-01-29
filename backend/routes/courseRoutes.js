const express = require("express");
const router = express.Router();
const Course = require("../models/Course"); // Import the Course model

// Add a new course
router.post("/", async (req, res) => {
  try {
    const { courseName, coursePrice, courseCurrency } = req.body;

    // Ensure that currency is provided, default to "RUB" if not provided
    const newCourse = new Course({
      courseName,
      coursePrice,
      courseCurrency: courseCurrency || "RUB", // Default to RUB if currency is not provided
    });

    await newCourse.save();
    res.status(201).send("Course added successfully.");
  } catch (error) {
    res.status(500).send("Error adding course.");
  }
});

// Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).send("Error fetching courses.");
  }
});

// Edit a course
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { courseName, coursePrice, courseCurrency } = req.body;

    // Ensure that currency is provided, default to "RUB" if not provided
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { courseName, coursePrice, courseCurrency: courseCurrency || "RUB" },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).send("Course not found.");
    }

    res.send("Course updated successfully.");
  } catch (error) {
    res.status(500).send("Error updating course.");
  }
});

// Delete a course
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).send("Course not found.");
    }

    res.send("Course deleted successfully.");
  } catch (error) {
    res.status(500).send("Error deleting course.");
  }
});

module.exports = router;
