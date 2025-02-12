import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./WebinarParticipants.css";
import { FaSearch } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

// Translation object
const translations = {
  English: {
    title: "{webinarTitle} - Participants",
    search: "Search:",
    searchPlaceholder: "Search by name or email",
    name: "Name:",
    email: "Email:",
    phoneNumber: "Phone Number:",
    registeredAt: "Registered At:",
    noParticipants: "No participants found.",
    errorFetchingParticipants: "Error fetching participants",
    errorFetchingDetails: "Error fetching details for",
  },
  Russian: {
    title: "{webinarTitle} - Участники",
    search: "Поиск:",
    searchPlaceholder: "Искать по имени или электронная почта",
    name: "Имя:",
    email: "Электронная почта:",
    phoneNumber: "Телефонный номер:",
    registeredAt: "Зарегистрирован в:",
    noParticipants: "Участники не найдены.",
    errorFetchingParticipants: "Ошибка при получении участников",
    errorFetchingDetails: "Ошибка при получении данных для",
  },
};

const WebinarParticipants = ({ selectedLanguage = "English" }) => {

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const { webinarId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [webinarTitle, setWebinarTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [token] = useState(localStorage.getItem("token"));

  // Fetch participants and webinar title
  const fetchParticipants = async () => {
    try {
      // Get the token from localStorage or from the context (based on how you store it)
      const token = localStorage.getItem('token'); // Or get it from your state management or context
  
      const response = await fetch(`${baseUrl}/api/webinars/${webinarId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch participants');
      }
  
      const data = await response.json();
  
      // Assuming the data contains participants and title information
      setParticipants(data.participants || []);
      setWebinarTitle(data.title || "");
  
    } catch (error) {
      console.error("Error fetching participants:", error);
      toast.error(translations[selectedLanguage].errorFetchingParticipants);
    }
  };
  

  // Fetch additional details for a participant
  const fetchUserDetails = async (email) => {
    try {
      const response = await fetch(`${baseUrl}/api/user/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`${translations[selectedLanguage].errorFetchingDetails} ${email}:`, error);
      toast.error(`${translations[selectedLanguage].errorFetchingDetails} ${email}`);
      return null;
    }
  };

  // Enrich participants with additional details
  const enrichParticipants = async () => {
    const enrichedParticipants = await Promise.all(
      participants.map(async (participant) => {
        const userDetails = await fetchUserDetails(participant.email);
        return userDetails ? { ...participant, ...userDetails } : participant;
      })
    );
    setParticipants(enrichedParticipants);
  };

  useEffect(() => {
    fetchParticipants();
  }, [webinarId]);

  useEffect(() => {
    if (participants.length > 0) {
      enrichParticipants();
    }
  }, [participants]);

  // Format date to DD-MM-YYYY HH:MM
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  // Filter participants based on search query
  const filteredParticipants = participants.filter((participant) =>
    `${participant.firstName} ${participant.middleName} ${participant.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="participants-page-container">
      {/* Language Switcher */}
     

      {/* Navbar */}
      <div className="participants-navbar">
        <h1 className="navbar-heading">
          {translations[selectedLanguage].title.replace("{webinarTitle}", webinarTitle)}
        </h1>
      </div>

      <div className="search-container">
          <div className="search-bar-wrapper">
            <p>
              <strong>{translations[selectedLanguage].search}</strong>
            </p>
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-bar"
              placeholder={translations[selectedLanguage].searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="participants-container">
          <div className="participants-list">
            {filteredParticipants.length > 0 ? (
              filteredParticipants.map((participant, index) => (
                <Link
                  key={index}
                  to={`/webinar-dashboard/${webinarId}/webinar-participants/user-details/${participant.email}`}
                  className="participant-card-link"
                >
                  <div className="participant-card">
                    <p>
                      <strong>{translations[selectedLanguage].name}</strong> {participant.firstName}{" "}
                      {participant.middleName} {participant.lastName}
                    </p>
                    <p>
                      <strong>{translations[selectedLanguage].email}</strong> {participant.email}
                    </p>
                    <p>
                      <strong>{translations[selectedLanguage].phoneNumber}</strong>{" "}
                      {participant.countryCode} {participant.phone}
                    </p>
                    <p>
                      <strong>{translations[selectedLanguage].registeredAt}</strong>{" "}
                      {formatDate(participant["registered at"])}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="no-participants">{translations[selectedLanguage].noParticipants}</p>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default WebinarParticipants;

