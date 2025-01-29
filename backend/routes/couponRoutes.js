const express = require("express");
const router = express.Router();
const Coupon = require("../models/Coupons"); // Import the Coupon model

// Add a new coupon
router.post("/", async (req, res) => {
  try {
    const { couponCode, totalLimit, startDate, endDate } = req.body;

    // Ensure that all required fields are provided
    if (!couponCode || !totalLimit || !startDate || !endDate) {
      return res.status(400).send("All fields are required.");
    }

    // Create the new coupon
    const newCoupon = new Coupon({
      couponCode,
      totalLimit,
      usageLimit: 0, // Starts at 0
      startDate,
      endDate,
    });

    // Save the new coupon
    await newCoupon.save();
    res.status(201).send("Coupon added successfully.");
  } catch (error) {
    res.status(500).send("Error adding coupon.");
  }
});

// Get all coupons
router.get("/", async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).send("Error fetching coupons.");
  }
});

// Edit a coupon
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { couponCode, totalLimit, startDate, endDate } = req.body;

    // Ensure that all required fields are provided
    if (!couponCode || !totalLimit || !startDate || !endDate) {
      return res.status(400).send("All fields are required.");
    }

    // Update the coupon
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { couponCode, totalLimit, startDate, endDate },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(404).send("Coupon not found.");
    }

    res.send("Coupon updated successfully.");
  } catch (error) {
    res.status(500).send("Error updating coupon.");
  }
});

// Delete a coupon
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return res.status(404).send("Coupon not found.");
    }

    res.send("Coupon deleted successfully.");
  } catch (error) {
    res.status(500).send("Error deleting coupon.");
  }
});

// Use a coupon and increment usageLimit
router.put("/use/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).send("Coupon not found.");
    }

    // Ensure that the usage limit does not exceed the total limit
    if (coupon.usageLimit < coupon.totalLimit) {
      coupon.usageLimit += 1;
      await coupon.save();
      res.send("Coupon used successfully.");
    } else {
      res.status(400).send("Coupon usage limit exceeded.");
    }
  } catch (error) {
    res.status(500).send("Error using coupon.");
  }
});

module.exports = router;
