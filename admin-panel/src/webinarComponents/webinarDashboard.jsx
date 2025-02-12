import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WebinarDashboard.css";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const WebinarDashboard = ({ selectedLanguage }) => {
  const [webinars, setWebinars] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Track the search query
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const fetchWebinars = async () => {
    try {
      const token = localStorage.getItem('token'); // Or from context/store if applicable

      const response = await fetch(`${baseUrl}/api/webinars`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch webinars');
      }

      const data = await response.json();
      setWebinars(data); // Store webinars data
    } catch (error) {
      console.error("Error fetching webinars:", error);
      toast.error(
        selectedLanguage === "Russian"
          ? "Ошибка при получении данных вебинара"
          : "Error fetching webinars"
      );
    } finally {
      setIsLoading(false); // Stop loading after fetching is done
    }
  };

  useEffect(() => {
    fetchWebinars();
  }, []);

  const handleWebinarClick = (webinarId) => {
    navigate(`/webinar-dashboard/${webinarId}/webinar-participants`);
  };

  // Filter webinars based on the search query
  const filteredWebinars = webinars.filter((webinar) =>
    webinar.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="webinar-dashboard-container">
      {/* Navbar */}
      <div className="webinardashboard-fixed-navbar">
        <h2>
          {selectedLanguage === "Russian"
            ? "Панель управления вебинаром"
            : "Webinar Dashboard"}
        </h2>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          placeholder={selectedLanguage === "Russian" ? "Поиск вебинаров..." : "Search webinars..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query
        />
      </div>

      {/* Webinars List */}
      <div className="webinar-grid">
        {isLoading ? (
          <div className="loading-spinner">Loading...</div>
        ) : filteredWebinars.length === 0 ? (
          <p>{selectedLanguage === "Russian" ? "Нет вебинаров" : "No webinars available"}</p>
        ) : (
          filteredWebinars.map((webinar) => (
            <div
              key={webinar.id}
              className="webinar-dashboard-webinar-card"
              onClick={() => handleWebinarClick(webinar.id)}
            >
              {/* Webinar Details */}


            
              <div className="webinar-details-container">
                <div className="webinar-image">
                  <img src={webinar.bannerUrl} alt={`${webinar.title} banner`} />
                </div>
                <div className="webinar-info">
                  <h2 className="webinar-title">{selectedLanguage === "Russian" ? webinar.titleRussian : webinar.title}</h2>
                  <div className="webinar-time" style={{ display: "flex" }}>
                    <p className="webinar-details">
                      <strong>
                        {selectedLanguage === "Russian" ? "Дата:" : "Date:"}
                      </strong>{" "}
                      {webinar.date}
                    </p>
                    <p className="webinar-details">
                      <strong>
                        {selectedLanguage === "Russian" ? "Время:" : "Time:"}
                      </strong>{" "}
                      {webinar.time}
                    </p>
                  </div>
                </div>
              </div>

              {/* Registration Stats */}
              <div className="webinar-stats-container">
                <div className="stats-box">
                  <p className="stats-number">
                    {webinar.participants?.length || 0}
                  </p>
                  <p className="stats-label">
                    {selectedLanguage === "Russian"
                      ? "Всего регистраций"
                      : "Total Registrations"}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default WebinarDashboard;
