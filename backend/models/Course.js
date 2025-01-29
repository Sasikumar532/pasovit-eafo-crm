const mongoose = require("mongoose");

// Define the Course schema
const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  coursePrice: { type: String, required: true },
  courseCurrency: {
    type: String,
    required: true,
    enum: ["INR", "RUB"], // Only allow INR or RUB
    default: "RUB", // Default currency is Russian Ruble
  },
});

// Create and export the Course model
module.exports = mongoose.model("Course", courseSchema);
