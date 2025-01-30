import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "react-toastify/dist/ReactToastify.css"; // Toast styles

import "./AdminLogin.css"; // Your CSS file for styling
import ScrollingComponent from "../webinarComponents/ScrollingComponent";

const AdminLogin = ({ setIsAuthenticated }) => {
  const [columnsToShow, setColumnsToShow] = useState(7);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/api/user/login", { email, password });

      const { token, role } = response.data;

      if (!token || role !== "admin") {
        setErrorMessage("Access denied. Admins only.");
        toast.error("Access denied. Admins only.");
        return;
      }

      // Save token and role in localStorage for authentication
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // After login, navigate to the dashboard
      toast.success("Login successful!");
      setIsAuthenticated(true); // Trigger authentication state change
      navigate("/webinar-dashboard"); // Navigate to the default page after successful login
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
      setErrorMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email && password;

  return (
    <div className="login-container">
      <ToastContainer position="top-center" />

      {/* Scrolling Columns */}
      <div className="scrolling-columns">
        <ScrollingComponent/>
      </div>

      {/* Black Blur Overlay */}
      <div className="black-blur-overlay"></div>

      {/* Login Form */}
      <div className="admin-login-form">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="admin-login-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-form-input"
            />
          </div>

          <div className="admin-login-form-group">
            <label htmlFor="password">Password</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-form-input"
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button
            type="submit"
            className="login-form-submit-button"
            disabled={loading || !isFormValid}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="forgot-password-link">
          <p></p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
