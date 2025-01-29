const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS Configuration (Keep only this one)
const corsOptions = {
   origin: ['http://localhost:5183','http://localhost:5184'], // Replace with your frontend URL
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   allowedHeaders: ['Content-Type', 'Authorization','Role'],
};
app.use(cors(corsOptions));

app.use(express.json());

// Import Routes
const formRoutes = require('./routes/formRoutes');
const courseRoutes = require("./routes/courseRoutes");
const couponRoutes = require('./routes/couponRoutes');
const userRoutes = require('./routes/userRoutes');
const webinarRoutes = require('./routes/webinarRoutes');

// Use routes
app.use('/api/invoices', formRoutes);
app.use('/api/forms', formRoutes); //form-related APIs
app.use("/api/courses", courseRoutes); // Course-related APIs
app.use("/api/coupons", couponRoutes); // Coupon-related APIs
app.use("/api/user", userRoutes); // User-related APIs
app.use("/api/webinars", webinarRoutes); // User-related APIs


// Database Connection
mongoose
   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => console.log('MongoDB connected'))
   .catch((err) => console.error('Database connection failed:', err));

// Global Error Handler (Optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
