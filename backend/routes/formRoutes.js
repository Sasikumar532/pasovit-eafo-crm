const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const Form = require('../models/Form'); // Your Form schema
const path = require("path"); // Import the path module
const fs = require("fs");

const router = express.Router();

// Generate unique ID for each submission
const generateUniqueId = () => Math.floor(100000 + Math.random() * 900000).toString();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uniqueId = req.uniqueId || generateUniqueId();
    req.uniqueId = uniqueId;

    const uploadPath = path.join(__dirname, "../uploads/form-data", uniqueId);

    // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });

    req.uploadPath = uploadPath;
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep the original file name
  },
});

const upload = multer({ storage });

// POST route to handle form submission and file uploads
router.post("/", upload.any(), async (req, res) => {
  try {
    const formData = req.body; // Form data excluding files
    const uniqueId = req.uniqueId;
    const uploadPath = req.uploadPath;

    // Save form details as a JSON file inside the unique folder
    const detailsPath = path.join(uploadPath, "details.json");

    // Merge file details into formData
    const uploadedFiles = req.files.map((file) => ({
      originalName: file.originalname,
      path: file.path,
    }));
    formData.uploadedFiles = uploadedFiles;

    // Save the form data to MongoDB
    const form = new Form({
      ...formData,
      uniqueId,
    });
    await form.save();

    // Write the form details (including file paths) into details.json
    fs.writeFileSync(detailsPath, JSON.stringify(formData, null, 2));

    res.status(200).json({ message: "Form submitted successfully!", uniqueId });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ error: "An error occurred while submitting the form." });
  }
});

// Route to fetch all submitted forms (excluding file data for now)
router.get('/', async (req, res) => {
  try {
    const forms = await Form.find(); // Fetch all forms from DB
    res.status(200).json(forms); // Return the form data
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ error: 'Failed to fetch forms' });
  }
});

// Route to fetch files for a specific user
router.get('/files/:uniqueId', async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const folderPath = path.join(__dirname, '../uploads/form-data', uniqueId);

    // Check if the folder exists
    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ error: 'No files found for this user.' });
    }

    // Read all files in the folder
    const files = fs.readdirSync(folderPath).map((fileName) => ({
      name: fileName,
      path: `uploads/form-data/${uniqueId}/${fileName}`,
    }));

    res.status(200).json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Failed to fetch files.' });
  }
});

// Route to fetch a specific form by its ID
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id); // Fetch form by ID
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.status(200).json(form);
  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({ error: 'Failed to fetch form.' });
  }
});

// Endpoint for previewing the file (without forcing download)
router.get('/files/:uniqueId/:fileName', async (req, res) => {
  try {
    const { uniqueId, fileName } = req.params;
    const filePath = path.join(__dirname, '../uploads/form-data', uniqueId, fileName);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);  // Directly send the file
    } else {
      return res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Failed to download the file.' });
  }
});

// Endpoint to update specific fields in form details
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body; // Get only the updated fields

    // Find the form by its ID and update only the specific fields
    const form = await Form.findById(id);

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Update each field in the form
    Object.keys(updatedFields).forEach((key) => {
      if (updatedFields[key] !== undefined) {
        form[key] = updatedFields[key];
      }
    });

    // Save the updated form
    await form.save();

    res.status(200).json({ message: 'Form updated successfully!', form });
  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({ error: 'Failed to update form.' });
  }
});

module.exports = router;
