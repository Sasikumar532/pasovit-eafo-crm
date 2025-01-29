import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


import {
  FaHome,
  FaFileAlt,
  FaMoneyBill,
  FaCreditCard,
  FaCogs,
  FaTag,
  FaQuestion,
  FaDollarSign,
  FaSignOutAlt,
} from "react-icons/fa"; // Import necessary icons
import "./Sidebar.css"; // Sidebar styling

const Sidebar = ({ selectedLanguage, selectedOS }) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Manage collapsed state
  const navigate = useNavigate();
  const handleMouseEnter = () => {
    setIsCollapsed(false); // Expand sidebar on hover
  };

  const handleMouseLeave = () => {
    setIsCollapsed(true); // Collapse sidebar when not hovered
  };

  

  

  const handleLogout = () => {
    // Remove token and role from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.reload(); 

    // Navigate to the home page
    navigate("/");
  };

  // Simplified version without logout or localStorage handling
  return (
    <div
      className={`sidebar ${isCollapsed ? "collapsed" : "expanded"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Company Branding */}
      <div className="sidebar-header">
        <h2 className="company-name">
          {selectedOS === "Webinar" ? (selectedLanguage === "Russian" ? "Вебинар" : "Webinar") : (selectedLanguage === "Russian" ? "EAFO CRM" : "EAFO CRM")}
        </h2>
      </div>

      <div className="sidebar-menu">
        {/* Conditional rendering for links based on selected OS and Language */}
        {selectedOS === "Webinar" ? (
          <>
            <NavLink
              to="/webinar-dashboard"
              className={({ isActive }) =>
                isActive ? "sidebar-item active" : "sidebar-item"
              }
            >
              <FaHome className="sidebar-icon" />
              <span className={`sidebar-label ${isCollapsed ? "hidden" : ""}`}>
                {selectedLanguage === "Russian" ? "Панель управления" : "Webinar Dashboard"}
              </span>
            </NavLink>

            <NavLink
              to="/webinar-management"
              className={({ isActive }) =>
                isActive ? "sidebar-item active" : "sidebar-item"
              }
            >
              <FaFileAlt className="sidebar-icon" />
              <span className={`sidebar-label ${isCollapsed ? "hidden" : ""}`}>
                {selectedLanguage === "Russian" ? "Управление вебинарами" : "Webinar Management"}
              </span>
            </NavLink>


            <NavLink
              to="/webinar-settings"
              className={({ isActive }) =>
                isActive ? "sidebar-item active" : "sidebar-item"
              }
            >
              <FaCogs className="sidebar-icon" />
              <span className={`sidebar-label ${isCollapsed ? "hidden" : ""}`}>
                {selectedLanguage === "Russian" ? "Настройки" : "Settings"}
              </span>
            </NavLink>
          </>
        ) : (
          // Links for EAFO CRM
          <>
            <NavLink
              to="/admin-dashboard"
              className={({ isActive }) =>
                isActive ? "sidebar-item active" : "sidebar-item"
              }
            >
              <FaHome className="sidebar-icon" />
              <span className={`sidebar-label ${isCollapsed ? "hidden" : ""}`}>
                {selectedLanguage === "Russian" ? "Панель управления" : "Dashboard"}
              </span>
            </NavLink>

            <NavLink
              to="/form-entries"
              className={({ isActive }) =>
                isActive ? "sidebar-item active" : "sidebar-item"
              }
            >
              <FaFileAlt className="sidebar-icon" />
              <span className={`sidebar-label ${isCollapsed ? "hidden" : ""}`}>
                {selectedLanguage === "Russian" ? "Записи формы" : "Form Entries"}
              </span>
            </NavLink>

            <NavLink
              to="/invoices"
              className={({ isActive }) =>
                isActive ? "sidebar-item active" : "sidebar-item"
              }
            >
              <FaMoneyBill className="sidebar-icon" />
              <span className={`sidebar-label ${isCollapsed ? "hidden" : ""}`}>
                {selectedLanguage === "Russian" ? "Счета" : "Invoices"}
              </span>
            </NavLink>

            <NavLink
              to="/payment"
              className={({ isActive }) =>
                isActive ? "sidebar-item active" : "sidebar-item"
              }
            >
              <FaCreditCard className="sidebar-icon" />
              <span className={`sidebar-label ${isCollapsed ? "hidden" : ""}`}>
                {selectedLanguage === "Russian" ? "Оплата" : "Payment"}
              </span>
            </NavLink>

            <NavLink
              to="/akt-system"
              className={({ isActive }) =>
                isActive ? "sidebar-item active" : "sidebar-item"
              }
            >
              <FaCogs className="sidebar-icon" />
              <span className={`sidebar-label ${isCollapsed ? "hidden" : ""}`}>
                {selectedLanguage === "Russian" ? "Система АКТ" : "Akt System"}
              </span>
            </NavLink>

            <NavLink
              to="/coupon-codes"
              className={({ isActive }) =>
                isActive ? "sidebar-item active" : "sidebar-item"
              }
            >
              <FaTag className="sidebar-icon" />
              <span className={`sidebar-label ${isCollapsed ? "hidden" : ""}`}>
                {selectedLanguage === "Russian" ? "Коды купонов" : "Coupon Codes"}
              </span>
            </NavLink>

            <NavLink
              to="/form-questions"
              className={({ isActive }) =>
                isActive ? "sidebar-item active" : "sidebar-item"
              }
            >
              <FaQuestion className="sidebar-icon" />
              <span className={`sidebar-label ${isCollapsed ? "hidden" : ""}`}>
                {selectedLanguage === "Russian" ? "Вопросы формы" : "Form Questions"}
              </span>
            </NavLink>

            <NavLink
              to="/course-price"
              className={({ isActive }) =>
                isActive ? "sidebar-item active" : "sidebar-item"
              }
            >
              <FaDollarSign className="sidebar-icon" />
              <span className={`sidebar-label ${isCollapsed ? "hidden" : ""}`}>
                {selectedLanguage === "Russian" ? "Цена курса" : "Course Price"}
              </span>
            </NavLink>
          </>
        )}
      </div>

      {/* Logout Button styled as a NavLink */}
      <div className="sidebar-logout">
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="sidebar-logout-icon" />
          <span className={`sidebar-logout-label ${isCollapsed ? "hidden" : ""}`}>
            {selectedLanguage === "Russian" ? "Выход" : "Logout"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
