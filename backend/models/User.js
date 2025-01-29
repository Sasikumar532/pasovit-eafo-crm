const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  title: { type: String, enum: ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.'], required: true },
  firstName: { type: String, required: true },
  middleName: { type: String, required: false },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: false }, // It can be validated separately, it's not typically stored in DB
  phone: { type: String, required: true },
  countryCode: { type: String, default: "+1" },
  dob: { type: Date, required: true },
  country: { type: String, required: true },
  university: { type: String, required: true },
  department: { type: String, required: true },
  profession: { type: String, required: false },
  position: { type: String, required: false },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  role: { type: String, default: "user" }, 
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model("User", userSchema);
