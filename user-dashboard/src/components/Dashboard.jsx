import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaPen, FaRegSave, FaSignOutAlt, FaBell } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next"; // Import the translation hook
import Navbar from "./Navbar";
import "./Dashboard.css";
import "react-toastify/dist/ReactToastify.css";
import ContactUs from "./ContactUs";
import { format } from "date-fns";
import Select from "react-select";
import i18nCountries from "i18n-iso-countries";
import enCountry from "i18n-iso-countries/langs/en.json";
import ruCountry from "i18n-iso-countries/langs/ru.json";
import i18n from "../i18n"; // Goes one level up to the root directory and imports i18n.js

const Dashboard = () => {
  const { t } = useTranslation(); // Initialize translation
  const [userDetails, setUserDetails] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [originalUserDetails, setOriginalUserDetails] = useState(null);
  const [webinars, setWebinars] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedEventCategory, setSelectedEventCategory] = useState("Webinar");
  const [searchQuery, setSearchQuery] = useState("");
  const popupRef = useRef();
  const navigate = useNavigate();
  const currentLanguage = i18n.language;
  i18nCountries.registerLocale(enCountry);
i18nCountries.registerLocale(ruCountry);
  const [countryOptions, setCountryOptions] = useState([]);

  const genderOptions = {
    en: [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
      { value: "Other", label: "Other" },
    ],
    ru: [
      { value: "Мужчина", label: "Мужчина" }, // Male in Russian
      { value: "Женщина", label: "Женщина" }, // Female in Russian
      { value: "Другое", label: "Другое" }, // Other in Russian
    ],
  };

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const isTokenValid = (token) => {
    try {
      return jwtDecode(token).exp > Date.now() / 1000;
    } catch {
      return false;
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profileImage", file);
      const token = localStorage.getItem("token");
      axios
        .post(`${baseUrl}/api/user/upload-profile-image`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setProfileImage(res.data.imagePath);
          toast.success(t("dashboard.profile_image_updated"));
        })
        .catch(() => toast.error(t("dashboard.error_updating_profile_image")));
    }
  };

  const fetchUserDetails = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token || !isTokenValid(token)) return navigate("/");
    const email = localStorage.getItem("email");
    axios
      .get(`${baseUrl}/api/user/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserDetails(res.data);
        setOriginalUserDetails(res.data);
        setProfileImage(
          res.data.profileImage ||
            "https://img.icons8.com/fluency/96/user-male-circle--v1.png"
        );
      })
      .catch(() => navigate("/"));
  }, [navigate]);

  const fetchWebinars = useCallback(() => {
    const token = localStorage.getItem("token"); // Retrieve token from local storage or another secure storage
    if (!token) {
      toast.error("Authentication token is missing!");
      return;
    }

    axios
      .get(`${baseUrl}/api/webinars`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
        },
      })
      .then((res) => {
        setWebinars(res.data); // Update state with the webinars data
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Fetch webinars request canceled");
        } else {
          console.error("Error fetching webinars:", error);
          toast.error("Failed to fetch webinars. Please try again.");
        }
      });
  }, []);

  useEffect(() => fetchUserDetails(), [fetchUserDetails]);
  useEffect(() => {
    if (selectedEventCategory === "Webinar") fetchWebinars();
  }, [selectedEventCategory, fetchWebinars]);

  const eventCounts = {
    Webinar: webinars.length,
    Courses: 0, // Placeholder; you can replace with actual count logic
    Registered: userDetails?.webinar?.length || 0, // Placeholder
  };

  const handleSaveChanges = () => {
    if (!userDetails.phone || !userDetails.dob || !userDetails.country) {
      return toast.error(t("dashboard.fill_required_fields"));
    }

    const getUpdatedFields = (original, updated) => {
      let changes = {};
      for (let key in updated) {
        if (updated.hasOwnProperty(key)) {
          if (updated[key] !== original[key]) {
            if (typeof updated[key] === "object" && updated[key] !== null) {
              const nestedChanges = getUpdatedFields(
                original[key],
                updated[key]
              );
              if (Object.keys(nestedChanges).length > 0) {
                changes[key] = nestedChanges;
              }
            } else {
              changes[key] = updated[key];
            }
          }
        }
      }
      return changes;
    };

    const updatedFields = getUpdatedFields(originalUserDetails, userDetails);

    if (Object.keys(updatedFields).length === 0) {
      return toast.info(t("dashboard.no_changes_detected"));
    }

    const token = localStorage.getItem("token");

    axios
      .put(
        `${baseUrl}/api/user/${localStorage.getItem("email")}`,
        updatedFields,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setOriginalUserDetails(userDetails);
        toast.success(t("dashboard.user_details_updated"));
      })
      .catch(() => {
        toast.error(t("dashboard.error_updating_details"));
      });
  };

  const handleRegisterWebinar = (
    webinarId,
    webinarTitle,
    webinarTime,
    webinarDate,
    webinarChiefGuest,
    regalia,
    dayOfWeek
  ) => {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    axios
      .put(
        `${baseUrl}/api/user/${email}`,
        {
          webinar: {
            id: webinarId,
            title: webinarTitle,
            date: webinarDate,
            time: webinarTime,
            chiefGuest: webinarChiefGuest,
            regalia: regalia,
            dayOfWeek: dayOfWeek,
            country: userDetails.country,
            registered: true,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setWebinars((prevWebinars) =>
          prevWebinars.map((webinar) =>
            webinar.id === webinarId
              ? { ...webinar, registered: true }
              : webinar
          )
        );
        toast.success(t("dashboard.registered_for_webinar"));

        // Reload the page after a timeout
        setTimeout(() => {
          window.location.reload();
        }, 4000); // Adjust the delay (in milliseconds) as needed
      })
      .catch((error) => {
        // Check for specific error codes and show a more informative message
        if (error.response && error.response.status === 400) {
          toast.error(t("dashboard.already_registered"));
        } else {
          toast.error(t("dashboard.failed_to_register"));
        }
      });
  };

  const filteredEvents = (category) => {
    if (category === "Webinar") {
      return webinars.filter((event) =>
        (currentLanguage === "ru" ? event.titleRussian : event.title)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    } else if (category === "Courses") {
      return courses.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (category === "Registered") {
      return getRegisteredWebinars().filter((event) =>
        (currentLanguage === "ru" ? event.titleRussian : event.title)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }
    return [];
  };

  const getRegisteredWebinars = () => {
    return webinars.filter((webinar) =>
      userDetails?.webinar?.some(
        (registeredWebinar) => registeredWebinar.id === webinar.id
      )
    );
  };

  const isWebinarClosed = (event) => {
    const now = new Date();
    const webinarDate = new Date(`${event.date}T${event.time}:00`);
    return now > webinarDate;
  };

  const handleWebinarPreview = (webinarId) => {
    navigate(`/dashboard/webinars/${webinarId}`);
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    navigate("/");
    window.location.reload();
  };
  const selectedLanguage = userDetails?.dashboardLang || "en"; 



  const countryList = (language) => {
    return Object.entries(i18nCountries.getNames(language)).map(([key, value]) => ({
      value: key,
      label: value,
    }));
  };

  if (!userDetails) return <div>{t("loading")}</div>;

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-row">


          <div className="profile-column">
            <div className="profile-container">
              <div className="profile-photo-container">
                <img
                  className="profile-photo"
                  src={profileImage}
                  alt={t("profile_image")}
                />
                <label htmlFor="profileImage" className="upload-btn">
                  {t("dashboard.upload_image")}
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
              <div className="profile-header">
                <h2 className="profile-name">
                  {" "}
                  {currentLanguage === "ru"
                    ? `${userDetails.lastName} ${userDetails.firstName} ${userDetails.middleName}`
                    : `${userDetails.firstName} ${userDetails.middleName} ${userDetails.lastName}`}
                </h2>
                <div
                  className="edit-icon"
                  onClick={() => setIsEditMode((prev) => !prev)}
                >
                  {isEditMode ? (
                    <FaRegSave onClick={handleSaveChanges} />
                  ) : (
                    <FaPen />
                  )}
                </div>
              </div>
              <div className="personal-details">
  {[
    "email",
    "phone",
    "dob",
    "gender",
    "country",
    "university",
    "department",
    "profession",
    "position",
  ].map((field) => (
    <div key={field} className="detail-item">
      <label htmlFor={field}>
        {t(`dashboard.profile${capitalizeFirstLetter(field)}`)} {/* Label */}
      </label>

      {/* Render based on field type */}
      {field === "gender" && isEditMode ? (
        <select
          id={field}
          value={userDetails[field]}
          onChange={(e) => setUserDetails({ ...userDetails, [field]: e.target.value })}
        >
          {genderOptions[
            userDetails.dashboardLang === "ru" ? "ru" : "en"
          ].map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : field === "country" && isEditMode ? (
        <Select
          id={field}
          options={countryList(userDetails.dashboardLang)} // Pass language code here
          value={countryList(userDetails.dashboardLang).find((option) => option.label === userDetails[field])}
          onChange={(selectedOption) =>
            setUserDetails({
              ...userDetails,
              [field]: selectedOption.label,
            })
          }
        />
      ) : (
        <input
          id={field}
          type={field === "dob" ? "date" : "text"}
          value={userDetails[field]}
          onChange={(e) => setUserDetails({ ...userDetails, [field]: e.target.value })}
          disabled={field === "email" || !isEditMode}
        />
      )}
    </div>
  ))}
</div>

            </div>
          </div>



          <div className="events-column">
  <div className="events-heading-container">
    <h3 className="events-heading">{t("dashboard.events")}</h3>
  </div>
  <div className="event-category-bar">
    {Object.keys(eventCounts).map((category) => (
      <button
        key={category}
        onClick={() => setSelectedEventCategory(category)}
        className={
          selectedEventCategory === category
            ? "active event-list-item"
            : "event-list-item"
        }
      >
        {t(`dashboard.${category.toLowerCase()}`)} ({eventCounts[category]})
      </button>
    ))}
  </div>
  <div className="event-details">
    <h3>
      {t(`dashboard.${selectedEventCategory.toLowerCase()}_details`)}
    </h3>

    {/* Search Bar */}
    <div className="search-container">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-bar"
        placeholder={t("dashboard.searchPlaceholder")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>

    <div className="event-lists-container">
      {selectedEventCategory === "Webinar" && webinars.length ? (
        <div className="event-list">
          {filteredEvents("Webinar").map((event) => {
            const isClosed = isWebinarClosed(event);
            const isRegistered = userDetails?.webinar?.some(
              (registeredWebinar) => registeredWebinar.id === event.id
            );

            return (
              <div key={event.id} className="event-tile">
                {/* Banner Section */}
                <div className="event-banner">
                  <img
                    src={event.bannerUrl}
                    alt="Event Banner"
                    className="banner-image"
                  />
                </div>

                {/* Event Content */}
                <div className="event-info-container">
                  <div className="event-content">
                    <h4 className="event-title">
                      {currentLanguage === "ru"
                        ? event.titleRussian
                        : event.title}
                    </h4>

                    <div className="event-expert">
                      <span className="expert-name">
                        {t("dashboard.expert")}:{" "}
                        {currentLanguage === "ru"
                          ? event.chiefGuestNameRussian
                          : event.chiefGuestName}
                      </span>
                      <br />
                      <span className="regalia">
                        {t("dashboard.regalia")}:{" "}
                        {currentLanguage === "ru"
                          ? event.regaliaRussian
                          : event.regalia}
                      </span>
                    </div>

                    <div className="event-date-time">
                      <span>
                        {t("dashboard.date")}:{" "}
                        {format(new Date(event.date), "dd-MM-yyyy")} |{" "}
                        {t("dashboard.time")}: {event.time} (Timezone:Moscow, Russia (GMT+3))
                      </span>
                    </div>
                  </div>

                  <div className="event-buttons-container">
                    <button
                      onClick={() => {
                        if (isRegistered) {
                          return;
                        }
                        if (isClosed) {
                          handleWebinarPreview(event.id);
                        } else {
                          handleRegisterWebinar(
                            event.id,
                            event.title,
                            event.time,
                            event.date,
                            event.chiefGuestName,
                            event.regalia,
                            event.dayOfWeek
                          );
                        }
                      }}
                      disabled={isRegistered}
                      className={
                        isClosed
                          ? "btn-watch-webinar"
                          : isRegistered
                          ? "btn-registered"
                          : ""
                      }
                    >
                      {isRegistered
                        ? t("dashboard.registered")
                        : isClosed
                        ? t("dashboard.watchWebinar")
                        : t("dashboard.register")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : selectedEventCategory === "Courses" ? (
        <div className="event-list">
          <p>{t("dashboard.noCoursesAvailable")}</p>
        </div>
      ) : selectedEventCategory === "Registered" ? (
        <div className="event-list">
          {getRegisteredWebinars().map((event) => {
            return (
              <div key={event.id} className="event-tile">
                {/* Banner Section */}
                <div className="event-banner">
                  <img src={event.bannerUrl} alt="Event Banner" className="banner-image" />
                </div>
                <div className="event-info-container">
                  <div className="event-content">
                    <h4 className="event-title">
                      {currentLanguage === "ru" ? event.titleRussian : event.title}
                    </h4>
                    <div className="event-expert">
                      <span className="expert-name">
                        {t("dashboard.expert")}:{" "}
                        {currentLanguage === "ru" ? event.chiefGuestNameRussian : event.chiefGuestName}
                      </span>
                      <br />
                      <span className="regalia">
                        {t("dashboard.regalia")}:{" "}
                        {currentLanguage === "ru" ? event.regaliaRussian : event.regalia}
                      </span>
                    </div>
                    <div className="event-date-time">
                      <span>
                        {t("dashboard.date")}: {format(new Date(event.date), "dd-MM-yyyy")} |{" "}
                        {t("dashboard.time")}: {event.time} (Timezone:Moscow, Russia (GMT+3))
                      </span>
                    </div>
                  </div>
                  <div className="event-buttons-container">
                    <button
                      className="btn-webinar-link btn-preview"
                      onClick={() => handleWebinarPreview(event.id)}
                    >
                      {t("dashboard.webinar_link")}
                    </button>
                    <button className="btn-registered" disabled>
                      {t("dashboard.registeredButton")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  </div>
</div>



        </div>
        <button className="logout-button" onClick={handleLogout}>
          {t("dashboard.logout")} <FaSignOutAlt className="logout-icon" />
        </button>
        <ToastContainer />
      </div>
      <ContactUs />
    </div>
  );
};

export default Dashboard;
