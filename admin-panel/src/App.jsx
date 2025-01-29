import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import FormEntries from "./components/FormEntries";
import Coupons from "./components/Coupons";
import CourseManager from "./components/CourseManager";
import AdminLogin from "./components/AdminLogin";
import SettingsButton from "./components/SettingsButton";
import WebinarManagement from "./webinarComponents/WebinarManagement";
import WebinarFormEntries from "./webinarComponents/WebinarFormEntries";
import WebinarDashboard from "./webinarComponents/webinarDashboard";
import WebinarParticipants from "./webinarComponents/WebinarParticipants";
import UserDetails from "./webinarComponents/UserDetails";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("Russian");
  const [selectedOS, setSelectedOS] = useState("Webinar");

  // Function to verify authentication status
  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    return token && role === "admin"; // Authentication check
  };

  // Effect to initialize authentication status
  useEffect(() => {
    setIsAuthenticated(checkAuthentication());
  }, []);

  return (
    <BrowserRouter>
      <div className="app-container">
        {isAuthenticated ? (
          <>
            {/* Sidebar for authenticated users */}
            <Sidebar
              selectedLanguage={selectedLanguage}
              selectedOS={selectedOS}
            />

            <div className="main-content">
              {/* Protected Routes */}
              <Routes>
                <Route path="/admin-dashboard" element={<Dashboard />} />
                <Route path="/form-entries" element={<FormEntries />} />
                <Route path="/coupon-codes" element={<Coupons />} />
                <Route path="/course-price" element={<CourseManager />} />
                <Route path="/webinar-forms" element={<WebinarFormEntries />} />
                <Route
                  path="/webinar-dashboard"
                  element={
                    <WebinarDashboard
                      setSelectedLanguage={setSelectedLanguage}
                      selectedLanguage={selectedLanguage}
                    />
                  }
                />
                <Route
                  path="/webinar-dashboard/:webinarId/webinar-participants"
                  element={
                    <WebinarParticipants
                      setSelectedLanguage={setSelectedLanguage}
                      selectedLanguage={selectedLanguage}
                    />
                  }
                />
                <Route
                  path="/webinar-management"
                  element={
                    <WebinarManagement
                      setSelectedLanguage={setSelectedLanguage}
                      selectedLanguage={selectedLanguage}
                    />
                  }
                />
                <Route
                  path="/webinar-dashboard/:webinarId/webinar-participants/user-details/:email"
                  element={
                    <UserDetails
                      setSelectedLanguage={setSelectedLanguage}
                      selectedLanguage={selectedLanguage}
                    />
                  }
                />

                {/* Redirect unmatched routes */}
                <Route
                  path="*"
                  element={<Navigate to="/webinar-dashboard" />}
                />
              </Routes>
            </div>

            {/* Global Settings Button */}
            <SettingsButton
              setSelectedLanguage={setSelectedLanguage}
              setSelectedOS={setSelectedOS}
            />
          </>
        ) : (
          <>
            {/* Routes for unauthenticated users */}
            <Routes>
              <Route
                path="/"
                element={<AdminLogin setIsAuthenticated={setIsAuthenticated} />}
              />
              {/* Redirect unmatched routes to login */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;
