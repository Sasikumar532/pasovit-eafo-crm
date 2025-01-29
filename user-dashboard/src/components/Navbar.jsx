import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Translation hook
import { FaSignOutAlt, FaGlobe } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { i18n, t } = useTranslation(); // Translation hook
  const navigate = useNavigate();

  useEffect(() => {
    // Check login status
    const userId = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!userId && !!token);

    // Set default language from localStorage or fallback to 'en'
    const savedLanguage = localStorage.getItem("language") || "ru";
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    navigate("/");
    window.location.reload();
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang); // Change language
    localStorage.setItem("language", lang); // Persist language selection
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo" onClick={() => navigate("/")}>
        <img
          src="https://static.wixstatic.com/media/e6f22e_a90a0fab7b764c24805e7e43d165d416~mv2.png"
          alt={t("logo_alt", "Logo")} // Alt text translation
        />
      </div>

      {/* Welcome Message */}
      <div className="nav-welcome-msg">
        <h1>{t("welcome_message", "Welcome to EAFO User account!")}</h1>
      </div>

      {/* Right Section */}
      <div className="right-section">
        {/* Language Selector */}
        <div className="language-selector">
          <FaGlobe className="language-icon" title={t("language", "Language")} />
          <select
            className="language-dropdown"
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="en">{t("english", "English")}</option>
            <option value="ru">{t("russian", "Русский")}</option>
          </select>
        </div>

        {/* Logout Button */}
        {isLoggedIn && (
          <FaSignOutAlt
            className="user-icon"
            onClick={handleLogout}
            title={t("user_logout", "Logout")}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
