import React from "react";
import "./MainPage.css";
import Navbar from "./Navbar";

const MainPage = () => {
  return (
    <div className="main-page">
      <Navbar/>
      <h1>Welcome to MyApp</h1>
      <p>Your one-stop solution for managing user details and information.</p>
    </div>
  );
};

export default MainPage;
