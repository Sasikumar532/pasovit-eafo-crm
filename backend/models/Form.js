const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: String,
    email: String,
    phoneNumber: String,
    dateOfBirth: String,
    city: String,
    country: String,
    gender: String,
    courseSelection: String,
    accommodation: String,
    submitAbstract: String,
    couponCode: String,
    couponCodeInput: String,
    termsAndConditions: Boolean,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { strict: false } // Allows additional fields
);

module.exports = mongoose.model("Form", FormSchema);
