const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS Configuration
const corsOptions = {
   origin: '*', // Allows all domains
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   allowedHeaders: ['Content-Type', 'Authorization', 'Role'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Import Routes
const formRoutes = require('./routes/formRoutes');
const courseRoutes = require("./routes/courseRoutes");
const couponRoutes = require('./routes/couponRoutes');
const userRoutes = require('./routes/userRoutes');
const webinarRoutes = require('./routes/webinarRoutes');

// Access the BASE_URL from the .env file
const baseUrl = process.env.BASE_URL || 'http://localhost:4000';

// Use routes with dynamically loaded base URL
app.use(`/api/invoices`, formRoutes);
app.use(`/api/forms`, formRoutes); // Form-related APIs
app.use(`/api/courses`, courseRoutes); // Course-related APIs
app.use(`/api/coupons`, couponRoutes); // Coupon-related APIs
app.use(`/api/user`, userRoutes); // User-related APIs
app.use(`/api/webinars`, webinarRoutes); // Webinar-related APIs

// Route for root (localhost:5000)
app.get('/', (req, res) => {
  res.send('Server is working!');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start Server
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
