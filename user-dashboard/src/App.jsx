import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import Dashboard from "./components/Dashboard";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import './i18n'; // Import the i18n configuration
import WebinarPage from "./components/WebinarPage";
import ForgetPasswordPage from "./components/ForgetPasswordPage";
import ScrollingComponent from "./components/ScrollingComponent";

const App = () => {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/webinars/:webinarId" element={<WebinarPage />} />
       < Route path="/scroll" element={<ScrollingComponent />} />
      </Routes>
    </Router>
  );
};

export default App;
