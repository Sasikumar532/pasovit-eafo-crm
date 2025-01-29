import React, { useState, useEffect } from "react";
import { MdSupport, MdEmail, MdClose } from "react-icons/md"; // Material Design icons
import { FaWhatsapp } from "react-icons/fa"; // Font Awesome for WhatsApp
import "./ContactUs.css";
import { BiSupport } from "react-icons/bi";
import { useTranslation } from "react-i18next"; // Import translation hook

const ContactUs = () => {
  const [showPopup, setShowPopup] = useState(false);
  const { t } = useTranslation(); // Initialize translation function

  const togglePopup = () => setShowPopup(!showPopup);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".popup-content")) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="contact-us-div">
      {/* Button to trigger the popup */}
      <div className="contact-us-button" onClick={togglePopup} aria-label={t("contactUs.contactUsButton")}>
        <BiSupport   className="contact-icon" />
      </div>

      {/* Popup for Contact Us */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            {/* Close button */}
            <div className="close-button" onClick={togglePopup} aria-label={t("contactUs.closePopup")}>
              <MdClose />
            </div>
            <h3>{t("contactUs.title")}</h3>

            {/* Contact Info Section */}
            <div className="contact-info">
              <div className="contact-item">
                <MdEmail className="contact-icon" />
                <div>
                  <h4>
                    <strong>{t("contactUs.enquiry")}</strong>
                  </h4>
                  <span>
                    <a href="mailto:info@eafo.info">info@eafo.info</a>
                  </span>
                </div>
              </div>
              <div className="contact-item">
                <MdEmail className="contact-icon" />
                <div>
                  <h4>
                    <strong>{t("contactUs.technicalComplaints")}</strong>
                  </h4>
                  <span>
                    <a href="mailto:support@eafo.info">support@eafo.info</a>
                  </span>
                </div>
              </div>
              <div className="contact-item">
                <FaWhatsapp className="contact-icon" />
                <div>
                  <h4>
                    <strong>{t("contactUs.phone")}</strong>
                  </h4>
                  <span>
                    <a href="https://wa.me/79151290927" target="_blank" rel="noopener noreferrer">
                      +7-915-129-09-27
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUs;
