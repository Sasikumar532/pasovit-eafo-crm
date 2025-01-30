import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import "./WebinarManagement.css";

// Translation data (for English and Russian)
const translations = {
  English: {
    webinarManagement: "Webinar Management",
    addWebinar: "Add Webinar",
    edit: "Edit",
    delete: "Delete",
    title: "Title",
    titleRussian: "Title (Russian)",
    chiefGuestName: "Expert",
    chiefGuestNameRussian: "Expert (Russian)",
    regalia: "Regalia",
    regaliaRussian: "Regalia (Russian)",
    date: "Date",
    time: "Time",
    selectTimeRegion: "Select the time region",
    indian: "Indian",
    russian: "Russian",
    liveEmbed: "Live Embed URL/ Recording Embed URL",
    chatEmbed: "Chat Embed URL",
    bannerUrl: "Banner URL",
    photoUrl: "Photo URL",
    updateWebinar: "Update Webinar",
    addWebinarForm: "Add Webinar",
    errorFetchingWebinars: "Error fetching webinars",
    errorSavingWebinar: "An error occurred while saving the webinar. Try again",
    errorDeletingWebinar: "An error occurred while deleting the webinar.",
    webinarDeleted: "Webinar deleted successfully!",
    webinarUpdated: "Webinar updated successfully!",
    webinarAdded: "Webinar added successfully!",
  },
  Russian: {
    webinarManagement: "Управление вебинарами",
    addWebinar: "Добавить вебинар",
    edit: "Редактировать",
    delete: "Удалить",
    title: "Заголовок",
    titleRussian: "Заголовок (на русском)",
    chiefGuestName: "Эксперт",
    chiefGuestNameRussian: "Эксперт (на русском)",
    regalia: "Регалии",
    regaliaRussian: "Регалии (на русском)",
    date: "Дата",
    time: "Время",
    selectTimeRegion: "Выберите временную зону",
    indian: "Индийский",
    russian: "Русский",
    liveEmbed: "URL встраивания вживую",
    recordingEmbed: "URL записи",
    chatEmbed: "URL чата",
    bannerUrl: "URL баннера",
    photoUrl: "Фото URL",
    updateWebinar: "Обновить вебинар",
    addWebinarForm: "Добавить вебинар",
    errorFetchingWebinars: "Ошибка при получении вебинаров",
    errorSavingWebinar: "Произошла ошибка при сохранении вебинара. Попробуйте снова",
    errorDeletingWebinar: "Произошла ошибка при удалении вебинара.",
    webinarDeleted: "Вебинар успешно удален!",
    webinarUpdated: "Вебинар успешно обновлен!",
    webinarAdded: "Вебинар успешно добавлен!",
  },
};

// Format date function to make it more readable
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const getDayOfWeek = (date) => {
  const daysOfWeek = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];
  const day = new Date(date).getDay();
  return daysOfWeek[day]; // Returns day in English
};

// Function to get day of the week in Russian
const getDayOfWeekRussian = (date) => {
  const daysOfWeekRussian = [
    "Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"
  ];
  const day = new Date(date).getDay();
  return daysOfWeekRussian[day]; // Returns day in Russian
};


const WebinarManagement = ({ selectedLanguage = "English" }) => {

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [webinars, setWebinars] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    titleRussian: "",
    date: "",
    dayOfWeek: "",
    dayOfWeekRussian:"",
    time: "",
    liveEmbed: "",
    recordingEmbed: "",
    chatEmbed: "",
    bannerUrl: "",
    chiefGuestName: "",
    chiefGuestNameRussian: "",
    photoUrl: "",
    regalia: "",
    regaliaRussian: "",
  });
  const [editingWebinar, setEditingWebinar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWebinars = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  
      const response = await fetch(`${baseUrl}/api/webinars`, {
        method: "GET",  // HTTP method GET
        headers: {
          'Authorization': `Bearer ${token}`,  // Include the token in the Authorization header
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error("Error fetching webinars");
      }
  
      const data = await response.json();
      setWebinars(data); // Set the fetched webinars
    } catch (error) {
      console.error("Error fetching webinars:", error);
      toast.error(translations[selectedLanguage].errorFetchingWebinars);  // Display error toast
    }
  };
  

  useEffect(() => {
    fetchWebinars();
  }, []);

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { 
      title, titleRussian, date,dayOfWeek, dayOfWeekRussian,time, liveEmbed, recordingEmbed, 
      chatEmbed, bannerUrl, chiefGuestName, chiefGuestNameRussian, photoUrl, 
      regalia, regaliaRussian 
    } = formData;
  
    // Use formatDateForInput to format the date before sending it
    const formattedDate = formatDateForInput(date);
  
    const webinarData = {
      title: title.trim(),
      titleRussian: titleRussian.trim(),
      date: formattedDate, // Use the formatted date here
      dayOfWeek:dayOfWeek,
      dayOfWeekRussian:dayOfWeekRussian,
      time: `${time.trim()}`,
      liveEmbed: encodeURI(liveEmbed.trim()),
      recordingEmbed: encodeURI(recordingEmbed.trim()),
      chatEmbed: encodeURI(chatEmbed.trim()),
      bannerUrl: encodeURI(bannerUrl.trim()),
      chiefGuestName: chiefGuestName.trim(),
      chiefGuestNameRussian: chiefGuestNameRussian.trim(),
      photoUrl: encodeURI(photoUrl.trim()),
      regalia: regalia.trim(),
      regaliaRussian: regaliaRussian.trim(),
    };

    const token =localStorage.getItem("token");
  
    try {
      let response;
      if (editingWebinar) {
        response = await fetch(`${baseUrl}/api/webinars/${editingWebinar.id}`, {
          method: "PUT",
          headers: { 'Authorization': `Bearer ${token}`, 
          "Content-Type": "application/json" },
          body: JSON.stringify(webinarData),
        });
        if (!response.ok) throw new Error("Error updating webinar");
        toast.success(translations[selectedLanguage].webinarUpdated);
      } else {
        response = await fetch(`${baseUrl}/api/webinars`, {
          method: "POST",
          headers: { 
            'Authorization': `Bearer ${token}`, 
            "Content-Type": "application/json",  },
          body: JSON.stringify(webinarData),
        });
        if (!response.ok) throw new Error("Error adding webinar");
        toast.success(translations[selectedLanguage].webinarAdded);
      }
  
      setIsModalOpen(false);
      fetchWebinars(); // Refresh the webinars list
      setFormData({
        title: "",
        titleRussian: "",
        date: "",
        dayOfWeek:"",
        dayOfWeekRussian:"",
        time: "",
        liveEmbed: "",
        recordingEmbed: "",
        chatEmbed: "",
        bannerUrl: "",
        chiefGuestName: "",
        chiefGuestNameRussian: "",
        photoUrl: "",
        regalia: "",
        regaliaRussian: "",
      }); // Reset form
    } catch (error) {
      console.error("Error saving webinar:", error);
      toast.error(translations[selectedLanguage].errorSavingWebinar);
    }
  };
  

  const handleEdit = (webinar) => {
    setEditingWebinar(webinar);
    setFormData({
      title: webinar.title,
      titleRussian: webinar.titleRussian || "",
      date: formatDateForInput(webinar.date), // You might need to implement this helper function
      dayOfWeek:webinar.dayOfWeek,
      dayOfWeekRussian:webinar.dayOfWeekRussian,
      time: webinar.time.split(" ")[0],
      liveEmbed: decodeURIComponent(webinar.liveEmbed),
      recordingEmbed: decodeURIComponent(webinar.recordingEmbed),
      chatEmbed: decodeURIComponent(webinar.chatEmbed),
      bannerUrl: decodeURIComponent(webinar.bannerUrl || ""),
      chiefGuestName: webinar.chiefGuestName || "",
      chiefGuestNameRussian: webinar.chiefGuestNameRussian || "",
      photoUrl: decodeURIComponent(webinar.photoUrl || ""),
      regalia: webinar.regalia || "",
      regaliaRussian: webinar.regaliaRussian || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  
      const response = await fetch(`${baseUrl}/api/webinars/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,  // Include the token in the Authorization header
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error("Error deleting webinar");
      }
  
      toast.success(translations[selectedLanguage].webinarDeleted);
      fetchWebinars(); // Refresh the webinars list
    } catch (error) {
      console.error("Error deleting webinar:", error);
      toast.error(translations[selectedLanguage].errorDeletingWebinar);
    }
  };
  

  return (
    <div className="webinar-management-page">
      <div className="webinar-fixed-navbar">
        <h2>{translations[selectedLanguage].webinarManagement}</h2>
        <button
          className="add-button"
          onClick={() => {
            setFormData({
              title: "",
              titleRussian: "",
              date: "",
              dayOfWeek:"",
              dayOfWeekRussian:"",
              time: "",
              liveEmbed: "",
              recordingEmbed: "",
              chatEmbed: "",
              bannerUrl: "",
              chiefGuestName: "",
              chiefGuestNameRussian: "",
              photoUrl: "",
              regalia: "",
              regaliaRussian: "",
            });
            setEditingWebinar(null);
            setIsModalOpen(true);
          }}
        >
          {translations[selectedLanguage].addWebinar}
        </button>
      </div>

      <div className="webinar-list-container">
        <ul className="webinar-list">
          {webinars.map((webinar) => (
            <li key={webinar.id} className="webinar-list-item">
              <div className="webinar-first-div">
                <div className="webinar-banner">
                  <img src={webinar.bannerUrl} alt={webinar.title} />
                </div>
                <div className="webinar-details">
                  <h3>{webinar.title}</h3>
                  <p>
                    <strong>{translations[selectedLanguage].date}:</strong> {formatDate(webinar.date)} <br />
                    <strong>{translations[selectedLanguage].time}:</strong> {webinar.time}
                  </p>
                </div>
              </div>

              <div className="webinar-actions">
                <button onClick={() => handleEdit(webinar)} className="edit">{translations[selectedLanguage].edit}</button>
                <button onClick={() => handleDelete(webinar.id)} className="delete">{translations[selectedLanguage].delete}</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingWebinar ? translations[selectedLanguage].updateWebinar : translations[selectedLanguage].addWebinarForm}</h3>
              <button className="close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder={translations[selectedLanguage].title}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder={translations[selectedLanguage].titleRussian}
                  value={formData.titleRussian}
                  onChange={(e) => setFormData({ ...formData, titleRussian: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder={translations[selectedLanguage].chiefGuestName}
                  value={formData.chiefGuestName}
                  onChange={(e) => setFormData({ ...formData, chiefGuestName: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder={translations[selectedLanguage].chiefGuestNameRussian}
                  value={formData.chiefGuestNameRussian}
                  onChange={(e) => setFormData({ ...formData, chiefGuestNameRussian: e.target.value })}
                  required
                />
                <textarea
                  placeholder={translations[selectedLanguage].regalia}
                  value={formData.regalia}
                  onChange={(e) => setFormData({ ...formData, regalia: e.target.value })}
                  
                />
                <textarea
                  placeholder={translations[selectedLanguage].regaliaRussian}
                  value={formData.regaliaRussian}
                  onChange={(e) => setFormData({ ...formData, regaliaRussian: e.target.value })}
                  
                />
                <input
        type="date"
        value={formData.date}
        onChange={(e) => {
          const selectedDate = e.target.value;
          setFormData({
            ...formData,
            date: selectedDate,
            dayOfWeek: getDayOfWeek(selectedDate), // Store day in English
            dayOfWeekRussian: getDayOfWeekRussian(selectedDate), // Store day in Russian
          });
        }}
        required
      />

      {formData.dayOfWeek && <p>Day (English): {formData.dayOfWeek}</p>}
      {formData.dayOfWeekRussian && <p>Day (Russian): {formData.dayOfWeekRussian}</p>}
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              
                <input
                  type="text"
                  placeholder={translations[selectedLanguage].liveEmbed}
                  value={formData.liveEmbed}
                  onChange={(e) => setFormData({ ...formData, liveEmbed: e.target.value })}
                />
                
                <input
                  type="text"
                  placeholder={translations[selectedLanguage].chatEmbed}
                  value={formData.chatEmbed}
                  onChange={(e) => setFormData({ ...formData, chatEmbed: e.target.value })}
                />
                <input
                  type="text"
                  placeholder={translations[selectedLanguage].bannerUrl}
                  value={formData.bannerUrl}
                  onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                />
                <input
                  type="text"
                  placeholder={translations[selectedLanguage].photoUrl}
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                />
                <button type="submit" >{editingWebinar ? translations[selectedLanguage].updateWebinar : translations[selectedLanguage].addWebinarForm}</button>
              </form>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default WebinarManagement;
