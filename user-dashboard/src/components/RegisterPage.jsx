import React, { useState, useEffect } from "react";
import "./RegisterPage.css";
import { columnImages } from "./imageData";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Importing styles for PhoneInput

import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineInfoCircle,
} from "react-icons/ai"; // Importing eye icons
import Navbar from "./Navbar";
import { useTranslation } from "react-i18next";
import ContactUs from "./ContactUs";
import ScrollingComponent from "./ScrollingComponent";



const RegisterPage = () => {

  const { t , i18n} = useTranslation(); // Use the translation function
  const selectedLanguage = i18n.language; 
  const [columnsToShow, setColumnsToShow] = useState(7);
    const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
    country: "",
    university: "",
    department: "",
    profession: "",
    position: "",
    gender: "",
    agreePersonalData:"",
    acceptTerms:""
    

  });

  const baseUrl = import.meta.env.VITE_BASE_URL;


  const titleOptions = selectedLanguage === 'ru'
  ? [
      { value: "Respectful", label: "Уважаемый" },  // Respectful title for males
      { value: "RespectfulFemale", label: "Уважаемая" }, // Respectful title for females
      { value: "Dr.", label: "Доктор" },
      { value: "Prof.", label: "Профессор" },
      { value: "Academician", label: "Академик" }
    ]
  : [
      { value: "Mr.", label: t("registerPage.mr") },
      { value: "Ms.", label: t("registerPage.ms") },
      { value: "Mrs.", label: t("registerPage.mrs") },
      { value: "Dr.", label: t("registerPage.dr") },
      { value: "Prof.", label: t("registerPage.prof") }
    ];

  

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // To toggle visibility of password
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // For confirm password

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    return regex.test(password);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });

    if (!validatePassword(newPassword)) {
      setPasswordError(
        "Password must be 8-16 characters, include one uppercase letter, one number, and one special character."
      );
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setFormData({ ...formData, confirmPassword: newConfirmPassword });

    if (newConfirmPassword !== formData.password) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible);

  const [emailError, setEmailError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateColumns = () => {
    const width = window.innerWidth;
    if (width >= 1200) setColumnsToShow(7);
    else if (width >= 768) setColumnsToShow(5);
    else setColumnsToShow(3);
  };

  useEffect(() => {
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError(false);
    setIsLoading(true);
  
    try {
      const response = await fetch(`${baseUrl}/api/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      setIsLoading(false);
  
      if (response.ok) {
        const data = await response.json();
        toast.success(t("registerPage.toastSuccess"));
        setEmailError(false);
        setFormData({
          title: "",
          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          dob: "",
          country: "",
          university: "",
          department: "",
          profession: "",
          position: "",
          gender: "",
          agreePersonalData:"",
          acceptTerms:""

        });

        setTimeout(() => {
          navigate("/"); // Navigate to home page after timeout
        }, 2000);
        
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const error = await response.json();
          if (error.message === "Email already registered.") {
            setEmailError(true);
            toast.error(t("registerPage.toastEmailRegistered"));
            

          } else {
            toast.error(t("registerPage.toastRegistrationFailed"));          }
        } else {
          toast.error(t("registerPage.toastUnexpectedResponse"));
                    console.error("Unexpected response format:", await response.text());
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
      toast.error(t("registerPage.toastErrorOccurred"));
    }
  };
  

  return (
    <div className="user-register-page">
      <Navbar/>
    <div className="register-container">

      
      <div className="scrolling-columns">
      
          <ScrollingComponent/>
  
      </div>

      <div className="black-blur-overlay"></div>
<div className="user-register-form-ot-container">

<div className="user-register-form">
        {/* Fixed Heading */}
        <h2 className="register-heading">{t("registerPage.register")}</h2>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="scrollable-form">
          {/* Title and First Name */}
          <div className="user-form-group-row">
            <div className="user-form-group">
              <label htmlFor="title">{t("registerPage.title")}</label>
              <select
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              >
                <option value="" disabled>
                {t("registerPage.selectTitle")}
                </option>
                {titleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
              </select>
            </div>
            </div>

            {selectedLanguage === 'ru' ? (
  <div className="user-form-group-row">
    {/* Last Name First for Russian */}
    <div className="user-form-group">
      <label htmlFor="lastName">{t("registerPage.lastName")}</label>
      <input
        type="text"
        id="lastName"
        placeholder={t("registerPage.plh_lastName")}
        value={formData.lastName}
        onChange={(e) =>
          setFormData({ ...formData, lastName: e.target.value })
        }
        required
      />
    </div>

    <div className="user-form-group">
      <label htmlFor="firstName">{t("registerPage.firstName")}</label>
      <input
        type="text"
        id="firstName"
        placeholder={t("registerPage.plh_firstName")}
        value={formData.firstName}
        onChange={(e) =>
          setFormData({ ...formData, firstName: e.target.value })
        }
        required
      />
    </div>

    <div className="user-form-group">
      <label htmlFor="middleName">{t("registerPage.middleName")}</label>
      <input
        type="text"
        id="middleName"
        placeholder={t("registerPage.plh_middleName")}
        value={formData.middleName}
        onChange={(e) =>
          setFormData({ ...formData, middleName: e.target.value })
        }
      />
    </div>
  </div>
) : (
  <div className="user-form-group-row">
    {/* Default order for other languages */}
    <div className="user-form-group">
      <label htmlFor="firstName">{t("registerPage.firstName")}</label>
      <input
        type="text"
        id="firstName"
        placeholder={t("registerPage.plh_firstName")}
        value={formData.firstName}
        onChange={(e) =>
          setFormData({ ...formData, firstName: e.target.value })
        }
        required
      />
    </div>

    <div className="user-form-group">
      <label htmlFor="middleName">{t("registerPage.middleName")}</label>
      <input
        type="text"
        id="middleName"
        placeholder={t("registerPage.plh_middleName")}
        value={formData.middleName}
        onChange={(e) =>
          setFormData({ ...formData, middleName: e.target.value })
        }
      />
    </div>

    <div className="user-form-group">
      <label htmlFor="lastName">{t("registerPage.lastName")}</label>
      <input
        type="text"
        id="lastName"
        placeholder={t("registerPage.plh_lastName")}
        value={formData.lastName}
        onChange={(e) =>
          setFormData({ ...formData, lastName: e.target.value })
        }
        required
      />
    </div>
  </div>
)}

          {/* Date of Birth */}
          <div className="user-form-group">
            <label htmlFor="dob">{t("registerPage.dob")}</label>
            <input
              type="date"
              id="dob"
              value={formData.dob}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
              required
            />
          </div>

          {/* Gender */}
          <div className="user-form-group">
            <label htmlFor="gender">{t("registerPage.gender")}</label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              required
            >
              <option value="" disabled>
              {t("registerPage.genderSelect")}
              </option>
              <option value="Male">{t("registerPage.male")}</option>
              <option value="Female">{t("registerPage.female")}</option>
              <option value="Other">{t("registerPage.other")}</option>
            </select>
          </div>

          {/* Email */}
          <div className="user-form-group">
            <label htmlFor="email">{t("registerPage.email")}</label>
            <input
              type="email"
              id="email"
              placeholder={t("registerPage.plh_email")}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className={emailError ? "input-error" : ""}
            />
            {emailError && (
              <div className="error-message" style={{display:"flex",marginTop:"8px",alignItems:"center"}}>
                <AiOutlineInfoCircle /> Email is already registered.
              </div>
            )}
          </div>

          {/* Password and Confirm Password */}
          <div className="user-form-group-row">
            {/* Password */}
            <div className="user-form-group">
              <label htmlFor="password">{t("registerPage.password")}</label>
              <div className="password-input-container">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  placeholder={t("registerPage.plh_password")}
                  value={formData.password}
                  onChange={handlePasswordChange}
                  required
                />
                <span className="eye-icon" onClick={togglePasswordVisibility}>
                  {passwordVisible ? (
                    <AiOutlineEyeInvisible />
                  ) : (
                    <AiOutlineEye />
                  )}
                </span>
              </div>
              {passwordError && (
                <div className="error-message"style={{display:"flex",marginTop:"8px",alignItems:"center"}}>
                  <AiOutlineInfoCircle /> {passwordError}
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="user-form-group">
              <label htmlFor="confirmPassword">{t("registerPage.confirmPassword")}</label>
              <div className="password-input-container">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  id="confirmPassword"
                  placeholder={t("registerPage.plh_confirmPassword")}
                  value={formData.confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {confirmPasswordVisible ? (
                    <AiOutlineEyeInvisible />
                  ) : (
                    <AiOutlineEye />
                  )}
                </span>
              </div>
              {confirmPasswordError && (
                <div className="error-message">
                  <AiOutlineInfoCircle /> {confirmPasswordError}
                </div>
              )}
            </div>
          </div>

          {/* Phone Number */}
          <div className="user-form-group">
  <label htmlFor="phone">{t("registerPage.phone")}</label>
  <PhoneInput
    className="phone-input"
    country={"ru"}
    value={formData.phone}
    onChange={(phone) => setFormData({ ...formData, phone })}
    inputProps={{
      name: "phone",
      required: true,
      autoFocus: true,
    }}
  />
</div>


          {/* Place of Work/Study Section */}

          <div className="user-form-group">
            <h3
              style={{
                margin: "20px 0px",
                fontWeight: "bold",
                marginTop: "30px",
                fontSize: "18px",
              }}
            >
              {t("registerPage.placeOfWorkStudy")}
            </h3>
            <label htmlFor="country">{t("registerPage.country")}</label>
            <input
              type="text"
              id="country"
              placeholder={t("registerPage.plh_country")}
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              required
            />
          </div>

          <div className="user-form-group">
            <label htmlFor="university">{t("registerPage.university")}</label>
            <input
              type="text"
              id="university"
              placeholder={t("registerPage.plh_university")}
              value={formData.university}
              onChange={(e) =>
                setFormData({ ...formData, university: e.target.value })
              }
              required
            />
          </div>

          <div className="user-form-group">
            <label htmlFor="department">{t("registerPage.department")}</label>
            <input
              type="text"
              id="department"
              placeholder={t("registerPage.plh_department")}
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              required
            />
          </div>

          <div className="user-form-group">
            <label htmlFor="profession">{t("registerPage.profession")}</label>
            <input
              type="text"
              id="profession"
              placeholder={t("registerPage.plh_profession")}
              value={formData.profession}
              onChange={(e) =>
                setFormData({ ...formData, profession: e.target.value })
              }
            />
          </div>

          <div className="user-form-group">
            <label htmlFor="position">{t("registerPage.position")}</label>
            <input
              type="text"
              id="position"
              placeholder={t("registerPage.plh_position")}
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
            />
          </div>

          <div className="user-form-group label-group">
      <label className="checkbox-label">
        <input
          type="checkbox"
          required
          checked={formData.agreePersonalData}
          onChange={(e) =>
            setFormData({ ...formData, agreePersonalData: e.target.checked })
          }
        />
        {t("registerPage.personalDataText")}{" "}
        <a
          href={t("registerPage.privacyPolicyUrl")}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("registerPage.privacyPolicy")}
        </a>
      </label>
    </div>

    {/* Checkbox 2: Accept Terms of Use */}
    <div className="user-form-group ">
      <label className="checkbox-label">
        <input
          type="checkbox"
          required
          checked={formData.acceptTerms}
          onChange={(e) =>
            setFormData({ ...formData, acceptTerms: e.target.checked })
          }
        />
        {t("registerPage.termsText")}{" "}
        <a
          href={t("registerPage.termsUrl")}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("registerPage.termsOfUse")}
        </a>
      </label>
    </div>
          <div className="btn-div">
            {/* Submit Button */}
            <button
              type="submit"
              className="register-button"
              disabled={isLoading}
            >
              {isLoading ? t("registerPage.registering") : t("registerPage.register")}
            </button>
          </div>
        </form>

        {/* Fixed Footer */}
        <p className="login-link">
        {t("registerPage.alreadyHaveAccount")} <a href="/">{t("registerPage.signIn")}</a>
        </p>
      </div>
</div>
     

      <ToastContainer />
    </div>
    <ContactUs/>
    </div>
  );
};

export default RegisterPage;
