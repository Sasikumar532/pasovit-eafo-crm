import React, { useState, useEffect } from "react";
import { FaCog, FaTimes } from "react-icons/fa";
import "./SettingsButton.css";

const SettingsButton = ({ setSelectedLanguage, setSelectedOS }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedLanguage, setLocalSelectedLanguage] = useState("Russian");
  const [selectedOS, setLocalSelectedOS] = useState("EAFO CRM");

  const togglePopup = () => setShowPopup(!showPopup);

  useEffect(() => {
    try {
      const languageFromStorage = localStorage.getItem("selectedLanguage");
      const osFromStorage = localStorage.getItem("selectedOS");

      if (languageFromStorage) {
        setLocalSelectedLanguage(languageFromStorage);
        setSelectedLanguage(languageFromStorage);
      }

      if (osFromStorage) {
        setLocalSelectedOS(osFromStorage);
        setSelectedOS(osFromStorage);
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, [setSelectedLanguage, setSelectedOS]);

  const toggleLanguage = () => {
    const newLanguage = selectedLanguage === "Russian" ? "English" : "Russian";
    setLocalSelectedLanguage(newLanguage);
    setSelectedLanguage(newLanguage);
    try {
      localStorage.setItem("selectedLanguage", newLanguage);
    } catch (error) {
      console.error("Error saving language to localStorage:", error);
    }
  };

  const toggleOS = () => {
    const newOS = selectedOS === "EAFO CRM" ? "Webinar" : "EAFO CRM";
    setLocalSelectedOS(newOS);
    setSelectedOS(newOS);
    try {
      localStorage.setItem("selectedOS", newOS);
    } catch (error) {
      console.error("Error saving OS to localStorage:", error);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".popup-content")) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="settings-div">
      <div className="settings-button" onClick={togglePopup} aria-label="Open Settings">
        <FaCog className="settings-icon" />
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <div className="close-button" onClick={togglePopup} aria-label="Close Settings">
              <FaTimes />
            </div>
            <h3>{selectedLanguage === "Russian" ? "Выберите предпочтения" : "Select Your Preferences"}</h3>

            <div className="question">
              <label>{selectedLanguage === "Russian" ? "Язык" : "Language"}</label>
              <div className="toggle-switch" onClick={toggleLanguage}>
                <span className={`toggle-label ${selectedLanguage === "Russian" ? "active" : ""}`}>
                  {selectedLanguage === "Russian" ? "Русский" : "Russian"}
                </span>
                <div className="switch-background">
                  <div className={`switch ${selectedLanguage === "Russian" ? "left" : "right"}`} />
                </div>
                <span className={`toggle-label ${selectedLanguage === "English" ? "active" : ""}`}>
                  {selectedLanguage === "Russian" ? "English" : "English"}
                </span>
              </div>
            </div>

            <div className="border-separator"></div>

            <div className="question">
              <label>{selectedLanguage === "Russian" ? "Операционная система" : "Operating System"}</label>
              <div className="toggle-switch" onClick={toggleOS}>
                <span className={`toggle-label ${selectedOS === "EAFO CRM" ? "active" : ""}`}>
                  EAFO CRM
                </span>
                <div className="switch-background">
                  <div className={`switch ${selectedOS === "EAFO CRM" ? "left" : "right"}`} />
                </div>
                <span className={`toggle-label ${selectedOS === "Webinar" ? "active" : ""}`}>
                  Webinar
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsButton;
