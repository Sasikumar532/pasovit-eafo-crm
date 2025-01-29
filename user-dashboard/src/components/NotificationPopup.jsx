import React, { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import "./Dashboard.css";


const NotificationPopup = ({ notifications, onClose }) => {
  const popupRef = useRef();

  // Close the popup when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      className="notification-popup visible"
    >
      <div className="popup-header">
        <h4>Notifications</h4>
        <span>
          <FaTimes className="close-icon" onClick={onClose} />
        </span>
      </div>
      <div className="notification-list">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification-item">
            <div className="notification-heading">
              <h5>{notification.title}</h5>
              <span className="notification-time">{notification.time}</span>
            </div>
            <div className="notification-body">
              <p>{notification.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPopup;
