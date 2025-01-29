import React, { useState } from 'react';
import axios from 'axios';

const GoogleSheetForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace with your actual Google Sheet URL (including the script ID)
      const url = 'https://script.google.com/macros/s/AKfycbzL03UyfpSEQ7zp77jTFW6mQSLk9Ufedi8hiXTL0u-1aphthZkRM4PD-pEIMnPmDUHiSw/exec'; 

      // Add the Access-Control-Allow-Origin header for development
      const response = await axios.post(url, formData, {
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:5174', // Replace with your development server's origin
        },
      });

      alert('Form submitted successfully!');
      // Clear the form after successful submission
      setFormData({
        name: '',
        email: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default GoogleSheetForm;