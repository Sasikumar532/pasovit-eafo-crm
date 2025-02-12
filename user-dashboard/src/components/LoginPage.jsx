import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { columnImages } from "./imageData";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { jwtDecode } from "jwt-decode";
import Navbar from "./Navbar";
import ContactUs from "./ContactUs";
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook
import ScrollingComponent from "./ScrollingComponent";

const LoginPage = () => {
  const { t } = useTranslation(); // Get translation function
  const [columnsToShow, setColumnsToShow] = useState(7);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_BASE_URL;


  const updateColumns = () => {
    const width = window.innerWidth;
    if (width >= 1200) {
      setColumnsToShow(7);
    } else if (width >= 768) {
      setColumnsToShow(5);
    } else {
      setColumnsToShow(3);
    }
  };

  const validateToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp > Date.now() / 1000) {
        setIsLoggedIn(true);
        return true;
      } else {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        return false;
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      return false;
    }
  };

  useEffect(() => {
    updateColumns();
    window.addEventListener("resize", updateColumns);

    const token = localStorage.getItem("token");
    if (token) {
      validateToken(token);
    }

    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast.error(t("loginPage.validEmail"), { ariaLive: "polite" });
      return;
    }

    if (password.length < 8) {
      toast.error(t("loginPage.validPassword"), { ariaLive: "polite" });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/api/user/login`, {
        email,
        password,
      });

      const { token } = response.data;
      if (!token) throw new Error("Invalid login response.");

      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      setIsLoggedIn(true);

      toast.success(t("loginPage.login"), { ariaLive: "polite" });
      
        setTimeout(() => {
          navigate("/dashboard"); // Navigate to home page after timeout
        }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || t("loginPage.loginFailed");
      toast.error(errorMessage, { ariaLive: "polite" });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email && password;

  return (
    <div>
      <Navbar />
      <div className="user-login-container">
        <ToastContainer ariaLive="polite" />

        {/* Scrolling Column Section */}
        <div className="scrolling-columns">
          <ScrollingComponent/>
        </div>

        {/* Black Blur Overlay */}
        <div className="black-blur-overlay"></div>

        {/* Login Form */}
        <div className="user-login-form">
          <h2>{t("loginPage.login")}</h2>
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="user-login-form-group">
              <label htmlFor="email" className="user-login-form-label">{t("loginPage.email")}</label>
              <input
                type="email"
                id="email"
                placeholder={t("loginPage.enterEmail")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="user-login-form-input"
                aria-label="Enter your email address"
              />
            </div>

            {/* Password Input */}
            <div className="user-login-form-group">
              <label htmlFor="password" className="user-login-form-label">{t("loginPage.password")}</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder={t("loginPage.enterPassword")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="user-login-form-input"
                  aria-label="Enter your password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? t("loginPage.hidePassword") : t("loginPage.showPassword")}
                  aria-label={showPassword ? t("loginPage.hidePassword") : t("loginPage.showPassword")}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
              <div className="forgot-password">
                <a href="/forget-password" className="forgot-password-link" aria-label="Forgot password link">
                  {t("loginPage.forgotPassword")}
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="user-login-form-submit-button"
              disabled={loading || !isFormValid}
            >
              {loading ? `${t("loginPage.submit")}...` : t("loginPage.submit")}
            </button>
          </form>

          {/* Register Link */}
          <div className="register-link">
            <p>
              {t("loginPage.register")}{" "}
              <a href="/register" className="register-text">
                {t("loginPage.register_a")}
              </a>
            </p>
          </div>
        </div>
      </div>
      <ContactUs />
    </div>
  );
};

export default LoginPage;
