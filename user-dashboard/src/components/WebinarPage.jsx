import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./WebinarPage.css";
import Navbar from "./Navbar";
import ContactUs from "./ContactUs";
import i18n from "../i18n"; // Import i18n for language handling

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const baseUrl = import.meta.env.VITE_BASE_URL;


const WebinarPage = () => {
  const { webinarId } = useParams();
  const { t } = useTranslation(); // Use translation hook
  const [webinar, setWebinar] = useState(null);
  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [isWebinarStarted, setIsWebinarStarted] = useState(false);

  const token = localStorage.getItem("token");
  const currentLanguage = i18n.language;  // Current language from i18n

  // Fetch webinar details when the webinarId or language changes
  useEffect(() => {
    const fetchWebinarDetails = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/webinars/${webinarId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token here
          },
        });

        const webinarData = response.data;

        // Capitalize title for consistent formatting
        webinarData.title = capitalizeFirstLetter(webinarData.title);

        setWebinar(webinarData);
      } catch (error) {
        console.error("Error fetching webinar data:", error);
      }
    };

    fetchWebinarDetails();
  }, [webinarId, token, currentLanguage]);  // Now we listen to language changes (currentLanguage)

  // Countdown logic
  useEffect(() => {
    if (!webinar) return;

    const interval = setInterval(() => {
      const webinarDateTime = new Date(`${webinar.date}T${webinar.time}:00`);
      const now = new Date();

      if (isNaN(webinarDateTime.getTime())) {
        console.error("Invalid webinar date or time format");
        clearInterval(interval);
        return;
      }

      const timeDifference = webinarDateTime - now;

      if (timeDifference <= 0) {
        setIsWebinarStarted(true);
        clearInterval(interval);
      } else {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        setCountdown({
          days: days < 10 ? `0${days}` : `${days}`,
          hours: hours < 10 ? `0${hours}` : `${hours}`,
          minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
          seconds: seconds < 10 ? `0${seconds}` : `${seconds}`,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [webinar]);

  if (!webinar) return <div>{t("webinarPage.loading")}</div>;

  return (
    <div>
      <Navbar />
      <div className="webinar-page">
        {/* Webinar Header */}
        <div className="webinar-header-container">
          <div className="webinar-header">
            <h1 className="title">{currentLanguage === 'ru' ? webinar.titleRussian : webinar.title}</h1>
            <p className="experts-info">
              {t("webinarPage.expert")}: {currentLanguage === 'ru' ? webinar.chiefGuestNameRussian : webinar.chiefGuestName}
            </p>
            <p className="experts-info">
              {currentLanguage === 'ru' ? webinar.regaliaRussian : webinar.regalia}
            </p>
            <p className="date">{t("webinarPage.date")}: {webinar.date}</p>
            <p className="head-time">{t("webinarPage.time")}: {webinar.time}</p>
          </div>
        </div>

        {/* Webinar Content */}
        <div className="outer-webinar-content">
          <div className="webinar-content">
            <div className="video-container">
              <div style={{ position: "relative", paddingTop: "56.25%", width: "100%" }}>
                <iframe
                  src={webinar.liveEmbed}
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write"
                  frameBorder="0"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                  }}
                ></iframe>
              </div>
            </div>

            <div className="chat-container">
              <div style={{ position: "relative", paddingTop: "56.25%", width: "100%" }}>
                <iframe
                  src={webinar.chatEmbed}
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write"
                  frameBorder="0"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                  }}
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Countdown Popup */}
        {!isWebinarStarted && (
          <div className="countdown-overlay">
            <div className="countdown-popup">
              <div>
                <h1 className="popup-title">{currentLanguage === 'ru' ? webinar.titleRussian : webinar.title}</h1>
                <div className="expert-details">
                <h2 className="popup-chief-guest">{t("webinarPage.chiefGuest")}: {currentLanguage === 'ru' ? webinar.chiefGuestNameRussian : webinar.chiefGuestName}</h2>
                <p className="popup-description">{currentLanguage === 'ru' ? webinar.regaliaRussian : webinar.regalia}</p>
              </div></div>
              <div>
                <h3 className="popup-countdown-heading">{t("webinarPage.startsIn")}:</h3>
                <div className="countdown-timer">
                  <div className="time-block">
                    <span className="time">{countdown.days}</span>
                    <span className="label">{t("webinarPage.days")}</span>
                  </div>
                  <div className="time-block">
                    <span className="time">{countdown.hours}</span>
                    <span className="label">{t("webinarPage.hours")}</span>
                  </div>
                  <div className="time-block">
                    <span className="time">{countdown.minutes}</span>
                    <span className="label">{t("webinarPage.minutes")}</span>
                  </div>
                  <div className="time-block">
                    <span className="time">{countdown.seconds}</span>
                    <span className="label">{t("webinarPage.seconds")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ContactUs />
    </div>
  );
};

export default WebinarPage;
