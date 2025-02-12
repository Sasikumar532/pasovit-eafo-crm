import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaGlobe, FaSignOutAlt } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css"; // Toast styles
import "./AdminLogin.css"; // Your CSS file for styling
import ScrollingComponent from "../webinarComponents/ScrollingComponent";

const translations = {
  English: {
    admin_login: "Admin Login",
    email_label: "Email",
    email_placeholder: "Enter your admin email",
    password_label: "Password",
    password_placeholder: "Enter your password",
    login_button: "Login",
    logging_in: "Logging in...",
    invalid_email: "Please enter a valid email address.",
    short_password: "Password must be at least 8 characters long.",
    access_denied: "Access denied. Admins only.",
    login_success: "Login successful!",
    login_failed: "Login failed. Please try again.",
    welcome_message: "Welcome to EAFO Admin account!",
    logo_alt: "Logo",
    language: "Language",
    english: "English",
    russian: "Русский",
    user_logout: "Logout",
  },
  Russian: {
    admin_login: "Вход для администратора",
    email_label: "Электронная почта",
    email_placeholder: "Введите ваш email",
    password_label: "Пароль",
    password_placeholder: "Введите ваш пароль",
    login_button: "Войти",
    logging_in: "Вход...",
    invalid_email: "Пожалуйста, введите действительный адрес электронной почты.",
    short_password: "Пароль должен содержать не менее 8 символов.",
    access_denied: "Доступ запрещен. Только администраторы.",
    login_success: "Успешный вход!",
    login_failed: "Ошибка входа. Пожалуйста, попробуйте снова.",
    welcome_message: "Добро пожаловать в учетную запись администратора EAFO!",
    logo_alt: "Логотип",
    language: "Язык",
    english: "English",
    russian: "Русский",
    user_logout: "Выход",
  },
};

const AdminLogin = ({ setIsAuthenticated, selectedLanguage, setSelectedLanguage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast.error(translations[selectedLanguage].invalid_email);
      return;
    }

    if (password.length < 8) {
      toast.error(translations[selectedLanguage].short_password);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("https://api.eafo.info/api/user/login", {
        email,
        password,
      });

      const { token, role } = response.data;

      if (!token || role !== "admin") {
        setErrorMessage(translations[selectedLanguage].access_denied);
        toast.error(translations[selectedLanguage].access_denied);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      toast.success(translations[selectedLanguage].login_success);
      setIsAuthenticated(true);
      setIsLoggedIn(true);
      navigate("/webinar-dashboard");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || translations[selectedLanguage].login_failed;
      setErrorMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setIsLoggedIn(false);
    navigate("/");
  };

  const isFormValid = email && password;

  return (
    <div className="admin-login-page">
      <ToastContainer position="top-center" />

      {/* Navbar */}
      <nav className="navbar">
        {/* Logo */}
        <div className="logo" onClick={() => navigate("/")}>
          <img
            src="https://static.wixstatic.com/media/e6f22e_a90a0fab7b764c24805e7e43d165d416~mv2.png"
            alt={translations[selectedLanguage].logo_alt}
          />
        </div>

        {/* Welcome Message */}
        <div className="nav-welcome-msg">
          <h1>{translations[selectedLanguage].welcome_message}</h1>
        </div>

        {/* Right Section */}
        <div className="right-section">
          {/* Language Selector */}
          <div className="language-selector">
            <FaGlobe className="language-icon" title={translations[selectedLanguage].language} />
            <select
              className="language-dropdown"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              <option value="English">{translations[selectedLanguage].english}</option>
              <option value="Russian">{translations[selectedLanguage].russian}</option>
            </select>
          </div>

          {/* Logout Button */}
          {isLoggedIn && (
            <FaSignOutAlt
              className="user-icon"
              onClick={handleLogout}
              title={translations[selectedLanguage].user_logout}
            />
          )}
        </div>
      </nav>

      <div className="login-container">
        {/* Scrolling Columns */}
        <div className="scrolling-columns">
          <ScrollingComponent />
        </div>

        {/* Black Blur Overlay */}
        <div className="black-blur-overlay"></div>

        {/* Login Form */}
        <div className="admin-login-form">
          <h2>{translations[selectedLanguage].admin_login}</h2>
          <form onSubmit={handleSubmit}>
            <div className="admin-login-form-group">
              <label htmlFor="email">{translations[selectedLanguage].email_label}</label>
              <input
                type="email"
                id="email"
                placeholder={translations[selectedLanguage].email_placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-form-input"
              />
            </div>

            <div className="admin-login-form-group">
              <label htmlFor="password">{translations[selectedLanguage].password_label}</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder={translations[selectedLanguage].password_placeholder}
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
              {loading
                ? translations[selectedLanguage].logging_in
                : translations[selectedLanguage].login_button}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
