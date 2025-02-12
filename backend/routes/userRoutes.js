const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const multer = require("multer");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const usersFilePath = "./Folders/userData/users.json";
const webinarsFilePath = "./Folders/webinarData/webinars.json";

router.use(
  "/Folders/profileImages",
  express.static(path.join(__dirname, "Folders", "profileImages"))
);

// Admin credentials
const adminCredentials = [
  { email: "admin@eafo.info", password: "$HSsX8QSWi+WQgw" },
  { email: "project@eafo.ru", password: "sXUpb3=vzO5N{T8" },
  { email: "tech.admin@eafo.info", password: "79m@3Zw50[%FF0" },
];

// Helper to initialize JSON file if missing
const initializeUsersFile = () => {
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([]));
  }
};

// Read users from the JSON file
const readUsersFromFile = () => {
  try {
    initializeUsersFile();
    const usersData = fs.readFileSync(usersFilePath, "utf8");
    return usersData ? JSON.parse(usersData) : [];
  } catch (err) {
    console.error("Error reading file:", err);
    return [];
  }
};

// Write users to the JSON file
const writeUsersToFile = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error("Error writing to file:", err);
  }
};

const readWebinarsFromFile = () => {
  const data = fs.readFileSync(webinarsFilePath, "utf8");
  return JSON.parse(data);
};

const writeWebinarsToFile = (webinars) => {
  fs.writeFileSync(webinarsFilePath, JSON.stringify(webinars, null, 2));
};

// Helper function to check if credentials match an admin
const isAdmin = (email, password) => {
  return adminCredentials.some(
    (admin) => admin.email === email && admin.password === password
  );
};

// Middleware for JWT Authentication
const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from Authorization header

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
// Multer setup for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "..", "Folders", "profileImages");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // Use the SMTP host (Gmail in this case)
  port: process.env.SMTP_PORT, // Use the SMTP port (465 for secure connection)
  secure: true, // Set to true for SSL
  auth: {
    user: process.env.EMAIL_USER, // Email user from .env
    pass: process.env.EMAIL_PASS, // Email password from .env
  },
});

// Helper function to send registration confirmation email
const sendRegistrationEmail = (email, dashboardLang, firstName, lastName, middleName, salutation) => {
  // Adjust name order based on country
  const fullName =
  dashboardLang.toLowerCase() === "ru"
      ? `${firstName} ${middleName}`
      : `${firstName} ${middleName} ${lastName}`;

  // Define templates for Russia and default (English)
  const russianTemplate = `
  <html>
  <style>
  p{
 font-size:16px; 
}</style>
    <body>
      <h2>${salutation} <b>${fullName}</b>,</h2>

      <p>Благодарим Вас за регистрацию в личном кабинете на платформе Евразийской Федерации Онкологии (EAFO)!</p>

      <p>Для входа в личный кабинет, пожалуйста, перейдите по ссылке: 
        <a href="${process.env.APP_URL}">Войти</a>
      </p>

      <p>Используйте адрес Вашей электронной почты в качестве логина.</p>

      <p>В случае возникновения вопросов, пожалуйста, свяжитесь с нашей службой технической поддержки по адресу: 
        <a href="mailto:support@eafo.info">support@eafo.info</a>
      </p>

      <footer>
        <p>С уважением,</p>
        <p>Команда EAFO</p>
      </footer>
    </body>
  </html>
`;

  const englishTemplate = `
<html>
<style>
  p{
 font-size:16px; 
}</style>
  <body>
    <h2>${salutation} <b>${fullName}</b>,</h2>

    <p>Thank you for registering for a personal account on the Eurasian Federation of Oncology (EAFO).</p>

    <p>To log in to your personal account, please follow this link: 
      <a href="${process.env.APP_URL}">Sign in</a>
    </p>

    <p>Please use your email address as your login.</p>

    <p>If you have any questions, please contact our technical support team at: 
      <a href="mailto:support@eafo.info">support@eafo.info</a>
    </p>

    <footer>
      <p>Best regards,</p>
      <p>EAFO Team</p>
    </footer>
  </body>
</html>
`;

  // Select template based on the country (case-insensitive check for "Russia")
  const selectedTemplate =
  dashboardLang.toLowerCase() === "ru" ? russianTemplate : englishTemplate;

  const subject =
  dashboardLang.toLowerCase() === "ru" ? "Личный кабинет EAFO" : "Registration Confirmation – Personal Account";

  // Mail options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: selectedTemplate,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending registration email:", error);
    } else {
      console.log("Registration email sent:", info.response);
    }
  });
};


// Helper function to send webinar registration confirmation email
const sendWebinarRegistrationEmail = (
  email,
  salutation,
  webinarTitle,
  webinarTime,
  webinarDate,
  webinarChiefGuest,
  regalia,
  dashboardLang,
  firstName,
  lastName,
  middleName,
  dayOfWeek,
  emailTemplate
) => {
  console.log(webinarChiefGuest)
  

  let emailBody;
  if (emailTemplate === "russianTemplate") {
    emailBody = `
      <html>
  <body>
    <h2>Подтверждение регистрации на вебинар</h2>
    <p>${salutation} <b>${firstName} ${middleName}</b>,</p>

    <p>Вы успешно зарегистрированы на <strong>"${webinarTitle}"</strong> от Евразийской федерации онкологии (EAFO)!</p>

    <p>Дата проведения вебинара:<strong> ${webinarDate},${webinarTime} (Timezone:"Moscow, Russia (GMT+3)") [${dayOfWeek}]</strong></p>
    <p>Эксперт вебинара:<strong>${webinarChiefGuest}</strong>,<br> ${regalia}</p>

    <p>Для доступа к запланированным онлайн мероприятиям, пожалуйста, войдите в личный кабинет EAFO:</p>
    <p><a href="${process.env.APP_URL}">Войти в личный кабинет</a></p>

    <p>В случае возникновения любых вопросов, пожалуйста, свяжитесь с нашей службой технической поддержки по адресу: 
      <a href="mailto:support@eafo.info">info@eafo.info</a>
    </p>

    <footer>
      <p>С уважением,</p>
      <p>Команда EAFO</p>
    </footer>
  </body>
</html>

    `;
  } else {
    emailBody = `
      <html>
  <body>

    <p>Dear ${salutation} ${firstName} ${middleName} ${lastName},</p>
    
    <p>You have successfully registered for <strong>"${webinarTitle}"</strong>, organized by the Eurasian Federation of Oncology (EAFO)!</p>
    
    <p>Webinar Date:<strong>${webinarDate}, ${webinarTime} (Timezone:"Moscow, Russia (GMT+3)") [${dayOfWeek}]</strong></p>
    <p>Webinar Expert:<strong>${webinarChiefGuest}</strong> ,</p>
    <p>${regalia}</p>
    
    <p>To access scheduled online events, please log in to your EAFO Personal Account:</p>
    <p><a href="${process.env.APP_URL}">Login Link</a></p>

    <p>If you have any questions, please contact our technical support team at:</p>
    <p><a href="mailto:support@eafo.info">info@eafo.info</a></p>

    <footer>
      <p>Best regards,</p>
      <p>EAFO Team</p>
    </footer>
  </body>
</html>

    `;
  }
  let subject =
  emailTemplate === "russianTemplate"
      ? `Регистрация: ${webinarTitle}` 
      : `Registration Confirmation: ${webinarTitle}`; 

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: emailBody,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending webinar registration email:", error);
    } else {
      console.log("Webinar registration email sent:", info.response);
    }
  });
};

// Registration Route
router.post("/", async (req, res) => {
  try {
    const { email, password, country, ...otherDetails } = req.body;

    const users = readUsersFromFile();

    // Check if email already exists
    if (users.some((user) => user.email === email)) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Determine user role
    const role = isAdmin(email, password) ? "admin" : "user";

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user object
    const newUser = {
      email,
      password: hashedPassword,
      role,
      country,
      ...otherDetails,
      registeredAt: new Date().toISOString(),
    };

    // Save the user
    users.push(newUser);
    writeUsersToFile(users);

    // Choose the email template based on the user's country

    // Send the registration success email

    res
      .status(200)
      .json({ message: `User registered successfully as ${role}.` });
    sendRegistrationEmail(
      newUser.email,
      newUser.dashboardLang,
      newUser.firstName,
      newUser.lastName,
      newUser.middleName,
      newUser.title
    );
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const users = readUsersFromFile();

  // Admin login
  if (isAdmin(email, password)) {
    const token = jwt.sign({ userId: email, role: "admin" }, JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ token, email, role: "admin" });
  }

  // User login
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(400).json({ message: "User not found!" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password!" });
  }

  const token = jwt.sign({ userId: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token, email: user.email, role: user.role });
});

router.post("/validate", async (req, res) => {
  const { email, dob } = req.body;

  if (!email || !dob) {
    return res
      .status(400)
      .json({ message: "Email and date of birth are required." });
  }

  const users = readUsersFromFile();

  // Find user by email
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  // Check if DOB matches
  if (user.dob !== dob) {
    return res.status(400).json({ message: "Date of birth does not match!" });
  }

  res.json({ success: true, message: "Details matched." });
});

// Reset password route
router.put("/update-password", async (req, res) => {
  const { email, newPassword } = req.body;
  const users = readUsersFromFile(); // Replace with your database query logic

  // Find the user
  const userIndex = users.findIndex((user) => user.email === email);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found!" });
  }

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in the user data
    users[userIndex].password = hashedPassword;

    // Remove confirmPassword field (if needed)
    if (users[userIndex].confirmPassword) {
      delete users[userIndex].confirmPassword;
    }

    // Save the updated data (to file or database)
    writeUsersToFile(users); // Replace with your database update logic

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating password.", error: error.message });
  }
});

// Route to get user details
// Route to get user details by email (admin can access any, user can only access their own)
router.get("/:email", authenticateJWT, (req, res) => {
  const { email } = req.params;
  const users = readUsersFromFile();

  // Check if the requesting user is an admin or the user whose data is being accessed
  if (req.user.role !== "admin" && req.user.userId !== email) {
    return res
      .status(403)
      .json({ message: "Access denied. You can only access your own data." });
  }

  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  res.json(user);
});

// Route to get all users (admin only)
router.get("/", authenticateJWT, (req, res) => {
  // Check if the authenticated user is an admin
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Access denied. You are not an admin." });
  }

  try {
    const users = readUsersFromFile(); // Read users from the file
    res.json(users); // Return the list of users
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.put("/:email", authenticateJWT, (req, res) => {
  const { email } = req.params;
  const updatedData = req.body;
  const users = readUsersFromFile();
  const webinars = readWebinarsFromFile();

  // Check if 'users' is an array
  if (!Array.isArray(users)) {
    return res.status(500).json({ message: "User data is corrupted." });
  }

  // Check if the user exists
  const userIndex = users.findIndex((user) => user.email === email);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found!" });
  }

  // Check if the logged-in user has permission to update
  if (req.user.role === "admin" || req.user.userId === email) {
    const user = users[userIndex];

    // Case 1: User is only updating their details (No webinar registration in request)
    if (!updatedData.webinar) {
      const updatedUser = {
        ...user,
        ...updatedData, // Merge updated user data (e.g., country, phone, etc.)
        webinar: Array.isArray(user.webinar) ? user.webinar : [], // Ensure webinar is an array
      };

      // Save updated user details
      users[userIndex] = updatedUser;
      writeUsersToFile(users);

      return res.json({ message: "User details updated successfully!" });
    }

    // Case 2: User is registering for a webinar (Only webinar data present in the request)
    if (updatedData.webinar) {
      const { id } = updatedData.webinar;

      // Fetch the webinar details using the ID
      const webinar = webinars.find((web) => web.id === id);
      if (!webinar) {
        return res.status(404).json({ message: "Webinar not found!" });
      }

      // Ensure user.webinar is always an array before using .find()
      if (!Array.isArray(user.webinar)) {
        user.webinar = [];
      }

      // Check if the user is already registered for this webinar
      const existingWebinar = user.webinar.find((web) => web.id === id);
      if (existingWebinar) {
        return res.status(400).json({ message: "Already registered for this webinar." });
      }

      // Register the user for the webinar
      user.webinar.push({ id, title: webinar.title, registered: true });

      // Ensure webinar.participants is always an array
      if (!Array.isArray(webinar.participants)) {
        webinar.participants = [];
      }

      // Add user to webinar participants
      webinar.participants.push({ email, "registered at": new Date().toISOString() });
      writeWebinarsToFile(webinars); // Save updated webinar data

      // Send the email after successful registration
      const isUserFromRussia = user.dashboardLang?.toLowerCase() === "ru";
      const webinarTitle = isUserFromRussia ? webinar.titleRussian : webinar.title;
      const chiefGuestName = isUserFromRussia ? webinar.chiefGuestNameRussian : webinar.chiefGuestName;
      const regalia = isUserFromRussia ? webinar.regaliaRussian : webinar.regalia;
      const dayOfWeek = isUserFromRussia ? webinar.dayOfWeekRussian : webinar.dayOfWeek;
      const formattedDate = new Date(webinar.date).toLocaleDateString("en-GB");
      // Send email to the user with the appropriate details based on their country
      sendWebinarRegistrationEmail(
        user.email,
        user.title, // User's title (e.g., Mr., Dr.)
        webinarTitle, // Webinar title based on language
        webinar.time, // Webinar time
        formattedDate, // Webinar date
        chiefGuestName, // Chief guest's name based on language
        regalia, // Regalia of the guest based on language
        user.dashboardLang, // User's country
        user.firstName, // User's first name
        user.middleName, // User's middle name
        user.lastName, // User's last name
        dayOfWeek, // Day of the week of the webinar based on language
        isUserFromRussia ? "russianTemplate" : "englishTemplate" // Email template based on country
      );

      // Save the updated user details
      users[userIndex] = user;
      writeUsersToFile(users);

      return res.json({ message: "Webinar registration successful!" });
    }
  }

  return res.status(403).json({ message: "You are not authorized to update this user's details." });
});


// Profile image upload route
router.post(
  "/upload-profile-image",
  authenticateJWT,
  upload.single("profileImage"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded." });
      }

      const imagePath = path
        .join("/Folders/profileImages", req.file.filename)
        .replace(/\\/g, "/");
      const { userId } = req.user;

      const users = readUsersFromFile();
      const userIndex = users.findIndex((user) => user.email === userId);
      if (userIndex === -1) {
        return res.status(404).json({ message: "User not found." });
      }

      users[userIndex].profileImage = imagePath;
      writeUsersToFile(users);

      res
        .status(200)
        .json({ message: "Profile image uploaded successfully.", imagePath });
    } catch (error) {
      console.error("Error uploading profile image:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);






module.exports = router;
