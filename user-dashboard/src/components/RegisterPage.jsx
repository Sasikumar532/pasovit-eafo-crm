import React, { useState, useEffect,useRef  } from "react";
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

import en from "i18n-iso-countries/langs/en.json";
import ru from "i18n-iso-countries/langs/ru.json";

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
    confirmEmail:"",
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
  i18nCountries.registerLocale(en);
i18nCountries.registerLocale(ru);

const handleEmailChange = (e) => {
  const emailValue = e.target.value;
  setFormData({ ...formData, email: emailValue });

  if (formData.confirmEmail) {
    setConfirmEmailError(emailValue.toLowerCase() !== formData.confirmEmail.toLowerCase());
  }
};

const handleConfirmEmailChange = (e) => {
  const confirmEmailValue = e.target.value;
  setFormData({ ...formData, confirmEmail: confirmEmailValue });

  if (formData.email) {
    setConfirmEmailError(formData.email.toLowerCase() !== confirmEmailValue.toLowerCase());
  }
};


useEffect(() => {
  if (!selectedLanguage) return;

  const countries = Object.entries(i18nCountries.getNames(selectedLanguage)).map(([key, value]) => ({
    value: key,
    label: value,
  }));

  if (countries.length === 0) {
    console.warn(`No country options available for language: ${selectedLanguage}`);
  }

  setCountryOptions(countries);
}, [selectedLanguage]); // Update when language changes


  const getTranslatedCountries = (language) => {
    try {
      const countryNames = i18nCountries.getNames(language);
  
      if (!countryNames || Object.keys(countryNames).length === 0) {
        console.warn(`No country names found for language: ${language}`);
        return [];
      }
  
      return Object.entries(countryNames).map(([key, value]) => ({
        value: key,
        label: value,
      }));
    } catch (error) {
      console.error("Error fetching country list:", error);
      return [];
    }
  };
  


  const baseUrl = import.meta.env.VITE_BASE_URL;


  const titleOptions = selectedLanguage === 'ru'
  ? [
      { value: "Уважаемый", label: "Уважаемый" },  // Respectful title for males
      { value: "Уважаемая", label: "Уважаемая" }, // Respectful title for females
      { value: "Доктор.", label: "Доктор" },
      { value: "Профессор.", label: "Профессор" },
      { value: "Академик", label: "Академик" }
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
      setPasswordError(t("registerPage.passwordError")); // Translated error
    } else {
      setPasswordError("");
    }
  
    // Re-check confirm password if already filled
    if (formData.confirmPassword) {
      setConfirmPasswordError(newPassword !== formData.confirmPassword ? t("registerPage.confirmPasswordError") : "");
    }
  };
  
  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setFormData({ ...formData, confirmPassword: newConfirmPassword });
  
    setConfirmPasswordError(newConfirmPassword !== formData.password ? t("registerPage.confirmPasswordError") : "");
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
    const selectedLanguage=localStorage.getItem("language");
    e.preventDefault();
    setEmailError(false);
    setIsLoading(true);
  
    try {
      // Include dashboardLang in the request payload
      const payload = {
        ...formData,
        dashboardLang: selectedLanguage, // Assuming you have a state for dashboardLang
      };
  
      const response = await fetch(`${baseUrl}/api/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      setIsLoading(false);
  
      if (response.ok) {
        const data = await response.json();
        toast.success(t("registerPage.toastSuccess"));
        setEmailError(false);
  
        // Reset form after successful submission
        setFormData({
          title: "",
          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          confirmEmail:"",
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
          agreePersonalData: "",
          acceptTerms: "",
          dashboardLang: "", // Clear after submission
        });
  
        setTimeout(() => {
          navigate("/"); // Navigate to home page after timeout
        }, 3000);
        
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const error = await response.json();
          if (error.message === "Email already registered.") {
            setEmailError(true);
            toast.error(t("registerPage.toastEmailRegistered"));
          } else {
            toast.error(t("registerPage.toastRegistrationFailed"));
          }
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
        <form onSubmit={handleSubmit} ref={formRef} className="scrollable-form">
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
              <option value={t("registerPage.male")}>{t("registerPage.male")}</option>
              <option value={t("registerPage.female")}>{t("registerPage.female")}</option>
              <option value={t("registerPage.other")}>{t("registerPage.other")}</option>
            </select>
          </div>

          {/* Email */}
          <div className="user-form-group-row">
          <div className="user-form-group">
  {/* Email Field */}
  <label htmlFor="email">{t("registerPage.email")}</label>
  <input
    type="email"
    id="email"
    placeholder={t("registerPage.plh_email")}
    value={formData.email}
    onChange={handleEmailChange}
    required
    className={emailError ? "input-error" : ""}
  />
  {emailError && (
    <div className="error-message" style={{ display: "flex", marginTop: "8px", alignItems: "center" }}>
      <AiOutlineInfoCircle /> {t("registerPage.emailError")}
    </div>
  )}
</div>

<div className="user-form-group">
  {/* Confirm Email Field */}
  <label htmlFor="confirmEmail">{t("registerPage.confirmEmail")}</label>
  <input
    type="email"
    id="confirmEmail"
    placeholder={t("registerPage.plh_confirmEmail")}
    value={formData.confirmEmail}
    onChange={handleConfirmEmailChange}
    required
    className={confirmEmailError ? "input-error" : ""}
  />
  {confirmEmailError && (
    <div className="error-message" style={{ display: "flex", marginTop: "8px", alignItems: "center" }}>
      <AiOutlineInfoCircle /> {t("registerPage.confirmEmailError")}
    </div>
  )}
</div>

</div>


          {/* Password and Confirm Password */}
          <div className="user-form-group-row">
  {/* Password Field */}
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
        {passwordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
      </span>
    </div>
    {passwordError && (
      <div className="error-message" style={{ display: "flex", marginTop: "8px", alignItems: "center" }}>
        <AiOutlineInfoCircle /> {passwordError}
      </div>
    )}
  </div>

  {/* Confirm Password Field */}
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
      <span className="eye-icon" onClick={toggleConfirmPasswordVisibility}>
        {confirmPasswordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
      </span>
    </div>
    {confirmPasswordError && (
      <div className="error-message" style={{ display: "flex", marginTop: "8px", alignItems: "center" }}>
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
            <Select
            id="country"
            options={countryOptions}
            value={countryOptions.find((option) => option.value === formData.country)}
            onChange={(selectedOption) => setFormData({ ...formData, country: selectedOption.value })}
            placeholder={t("registerPage.plh_country")}
            isSearchable
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
