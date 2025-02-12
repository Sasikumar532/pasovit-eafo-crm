const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken'); // Import JWT library
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";; // Replace with a secure key
const adminCredentials = [
  { email: "admin@example.com", password: "admin123" } // Replace with actual credentials
];

// Helper functions for authentication
const isAdmin = (email, password) => {
  return adminCredentials.some(
    (admin) => admin.email === email && admin.password === password
  );
};

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
    req.user = decoded;
    next();
  });
};

// Path to webinars JSON file
const webinarsFilePath = path.join(__dirname, '..', 'Folders', 'webinarData', 'webinars.json');

// Initialize and read/write helper functions
const initializeWebinarsFile = () => {
  if (!fs.existsSync(webinarsFilePath)) {
    const dirPath = path.dirname(webinarsFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(webinarsFilePath, JSON.stringify([]));
  }
};

const readWebinarsFromFile = () => {
  try {
    initializeWebinarsFile();
    const webinarsData = fs.readFileSync(webinarsFilePath, 'utf8');
    return webinarsData ? JSON.parse(webinarsData) : [];
  } catch (err) {
    console.error('Error reading webinars file:', err);
    return [];
  }
};

const writeWebinarsToFile = (webinars) => {
  try {
    fs.writeFileSync(webinarsFilePath, JSON.stringify(webinars, null, 2));
  } catch (err) {
    console.error('Error writing to webinars file:', err);
  }
};

// Routes
router.get('/', authenticateJWT, (req, res) => {
  try {
    const webinars = readWebinarsFromFile(); // Read the webinars from the file
    res.json(webinars); // Send the webinars as a response
  } catch (error) {
    console.error('Error fetching webinars:', error);
    res.status(500).json({ message: 'Error fetching webinars.' });
  }
});

router.post('/', authenticateJWT, (req, res) => {
  try {
    const {
      title,
      titleRussian,
      date,
      dayOfWeek,
      dayOfWeekRussian,
      time,
      liveEmbed,
      eventSiteURL,
      chatEmbed,
      bannerUrl,
      bannerRussianURL,
      chiefGuestName,
      chiefGuestNameRussian,
      photoUrl,
      regalia,
      regaliaRussian,
    } = req.body;

    const webinars = readWebinarsFromFile();
    const webinarNumber = webinars.length + 1;
    const webinarId = (webinars.length + 1).toString().padStart(5, '0');
    const uniqueId = uuidv4();

    const newWebinar = {
      webinarId,
      webinarNumber,
      id: uniqueId,
      title,
      titleRussian,
      date,
      dayOfWeek,
      dayOfWeekRussian,
      time,
      liveEmbed,
      eventSiteURL,
      chatEmbed,
      bannerUrl,
      bannerRussianURL,
      chiefGuestName,
      chiefGuestNameRussian,
      photoUrl,
      regalia,
      regaliaRussian,
    };

    webinars.push(newWebinar);
    writeWebinarsToFile(webinars);

    res.status(200).json({ message: 'Webinar added successfully!', webinar: newWebinar });
  } catch (error) {
    console.error('Error adding webinar:', error);
    res.status(500).json({ message: 'Error adding webinar.' });
  }
});

router.get('/:webinarId', authenticateJWT, (req, res) => {
  const { webinarId } = req.params;

  try {
    const webinars = readWebinarsFromFile(); // Fetch webinars from file

    const webinar = webinars.find((w) => w.id === webinarId);

    if (!webinar) {
      return res.status(404).json({ message: 'Webinar not found' });
    }

    res.json(webinar); // Return the webinar object with both English and Russian fields
  } catch (error) {
    console.error('Error fetching webinar:', error);
    res.status(500).json({ message: 'Error fetching webinar data' });
  }
});

module.exports = router;

router.delete('/:id', authenticateJWT, (req, res) => {
  try {
    const { id } = req.params;
    let webinars = readWebinarsFromFile();
    webinars = webinars.filter((webinar) => webinar.id !== id);
    writeWebinarsToFile(webinars);

    res.status(200).json({ message: 'Webinar deleted successfully!' });
  } catch (error) {
    console.error('Error deleting webinar:', error);
    res.status(500).json({ message: 'Error deleting webinar.' });
  }
});

router.put('/:id', authenticateJWT, (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      titleRussian,
      date,
      dayOfWeek,
      dayOfWeekRussian,
      time,
      liveEmbed,
      eventSiteURL,
      chatEmbed,
      bannerUrl,
      bannerRussianURL,
      chiefGuestName,
      chiefGuestNameRussian,
      photoUrl,
      regalia,
      regaliaRussian,
    } = req.body;

    let webinars = readWebinarsFromFile();
    const webinarIndex = webinars.findIndex((webinar) => webinar.id === id);

    if (webinarIndex === -1) {
      return res.status(404).json({ message: 'Webinar not found' });
    }

    webinars[webinarIndex] = {
      ...webinars[webinarIndex],
      title,
      titleRussian,
      date,
      dayOfWeek,
      dayOfWeekRussian,
      time,
      liveEmbed,
      eventSiteURL,
      chatEmbed,
      bannerUrl,
      bannerRussianURL,
      chiefGuestName,
      chiefGuestNameRussian,
      photoUrl,
      regalia,
      regaliaRussian,
    };

    writeWebinarsToFile(webinars);

    res.status(200).json({ message: 'Webinar updated successfully!' });
  } catch (error) {
    console.error('Error updating webinar:', error);
    res.status(500).json({ message: 'Error updating webinar.' });
  }
});

// Admin-only route
router.post('/admin', (req, res) => {
  const { email, password } = req.body;

  if (isAdmin(email, password)) {
    const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ message: 'Admin authenticated', token });
  }

  return res.status(403).json({ message: 'Invalid admin credentials' });
});

module.exports = router;
