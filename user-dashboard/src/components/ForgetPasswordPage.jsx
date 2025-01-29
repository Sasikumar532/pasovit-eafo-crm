import React, { useState } from "react";
import axios from "axios";
import "./ForgetPasswordPage.css";
import { columnImages } from "./imageData";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import ContactUs from "./ContactUs";
import { useTranslation } from "react-i18next";

const ForgetPasswordPage = () => {
  const [columnsToShow, setColumnsToShow] = useState(7);
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const updateColumns = () => {
    const width = window.innerWidth;
    if (width >= 1200) {
      setColumnsToShow(7);
    } else if (width >= 768) {
      setColumnsToShow(5);
    } else {
      setColumnsToShow(3);
    }
  };

  React.useEffect(() => {
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleCheckDetails = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast.error(t("forgetPasswordPage.invalidEmail"));
      return;
    }

    if (!dob) {
      toast.error(t("forgetPasswordPage.enterDob"));
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/user/validate", {
        email,
        dob,
      });

      if (response.data.success) {
        setResetToken(response.data.token);
        setShowPasswordFields(true);
        toast.success(t("forgetPasswordPage.detailsVerified"));
      }
    } catch (error) {
      toast.error(error.response?.data?.message ==="User not found!" ?  t("forgetPasswordPage.userMatch"):t("forgetPasswordPage.enterDob"));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error(t("forgetPasswordPage.passwordMismatch"));
      return;
    }

    if (password.length < 8) {
      toast.error(t("forgetPasswordPage.passwordLength"));
      return;
    }

    setLoading(true);
    try {
      await axios.put("http://localhost:5000/api/user/update-password", {
        email,
        newPassword: password,
      });

      toast.success(t("forgetPasswordPage.passwordUpdated"));
      setEmail("");
      setDob("");
      setPassword("");
      setConfirmPassword("");
      setShowPasswordFields(false);
      setTimeout(() => {
        navigate("/"); // Navigate to the home page or desired route
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || t("forgetPasswordPage.updateFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="user-forget-password-container">
        <ToastContainer />

        {/* Scrolling Columns */}
        <div className="scrolling-columns">
          {columnImages.slice(0, columnsToShow).map((images, columnIndex) => (
            <div
              key={`column-${columnIndex}`}
              className={`scroll-column ${
                columnIndex % 2 === 0
                  ? "scroll-top-to-bottom"
                  : "scroll-bottom-to-top"
              }`}
            >
              {images.map((image, index) => (
                <div
                  key={`col-${columnIndex}-img-${index}`}
                  className="scroll-image"
                  style={{ backgroundImage: `url(${image})` }}
                  aria-label={`Decorative background image ${index + 1}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Black Blur Overlay */}
        <div className="black-blur-overlay"></div>

        {/* Forget Password Form */}
        <div className="user-forget-password-form">
          <h2>{t("forgetPasswordPage.forgotPassword")}</h2>
          <form onSubmit={showPasswordFields ? handleChangePassword : handleCheckDetails}>
            {/* Email Input */}
            <div className="user-forget-password-form-group">
              <label htmlFor="email" className="user-forget-password-form-label">
                {t("forgetPasswordPage.email")}
              </label>
              <input
                type="email"
                id="email"
                placeholder={t("forgetPasswordPage.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="user-forget-password-form-input"
                aria-label={t("forgetPasswordPage.emailAria")}
              />
            </div>

            {/* Date of Birth Input */}
            <div className="user-forget-password-form-group">
              <label htmlFor="dob" className="user-forget-password-form-label">
                {t("forgetPasswordPage.dob")}
              </label>
              <input
                type="date"
                id="dob"
                placeholder={t("forgetPasswordPage.dobPlaceholder")}
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                className="user-forget-password-form-input"
                aria-label={t("forgetPasswordPage.dobAria")}
              />
            </div>

            {showPasswordFields && (
              <>
                {/* New Password Input */}
                <div className="user-forget-password-form-group">
                  <label htmlFor="password" className="user-forget-password-form-label">
                    {t("forgetPasswordPage.newPassword")}
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder={t("forgetPasswordPage.passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="user-forget-password-form-input"
                    aria-label={t("forgetPasswordPage.passwordAria")}
                  />
                </div>

                {/* Confirm Password Input */}
                <div className="user-forget-password-form-group">
                  <label htmlFor="confirm-password" className="user-forget-password-form-label">
                    {t("forgetPasswordPage.confirmPassword")}
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    placeholder={t("forgetPasswordPage.confirmPasswordPlaceholder")}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="user-forget-password-form-input"
                    aria-label={t("forgetPasswordPage.confirmPasswordAria")}
                  />
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="user-forget-form-submit-button"
              disabled={loading}
            >
              {loading
                ? t("forgetPasswordPage.processing")
                : showPasswordFields
                ? t("forgetPasswordPage.changePassword")
                : t("forgetPasswordPage.checkDetails")}
            </button>
          </form>
        </div>
      </div>
      <ContactUs />
    </div>
  );
};

export default ForgetPasswordPage;
