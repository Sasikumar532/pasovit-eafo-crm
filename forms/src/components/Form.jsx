import React, { useState } from "react";
import axios from "axios";
import "./Form.css";
import Notification from "./Notification";
import { questionsByPage } from "./questions";

const Form = () => {
  const [formData, setFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;

    setFormData((prev) => {
      const updatedFormData = { ...prev };

      if (type === "file" && files.length > 0) {
        updatedFormData[name] = files[0]; // Store file object
      } else if (type === "checkbox") {
        updatedFormData[name] = checked; // Store checkbox state
      } else {
        updatedFormData[name] = value; // Store other input values
      }

      return updatedFormData;
    });
  };

  const validatePage = () => {
    const sections = questionsByPage[`page${currentPage}`];

    for (const section of sections) {
      for (const question of section.questions) {
        const { id, condition, type } = question;

        const shouldValidate =
          !condition ||
          (typeof condition === "function"
            ? condition(formData)
            : formData[condition] === "Yes");

        if (shouldValidate) {
          if (type === "file" && !formData[id]) {
            setNotification(`Please upload the required file for: ${id}`);
            return false;
          } else if (type === "checkbox" && !formData[id]) {
            setNotification(`You must accept the terms and conditions.`);
            return false;
          } else if (!formData[id] || (typeof formData[id] === "string" && formData[id].trim() === "")) {
            setNotification(`Please fill in all required fields.`);
            return false;
          }
        }
      }
    }
    return true;
  };

  const nextPage = () => {
    if (validatePage()) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();

    for (let key in formData) {
      if (formData[key] instanceof File) {
        formDataToSubmit.append(key, formData[key]);
      } else {
        formDataToSubmit.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.post("http://localhost:5000/api/forms", formDataToSubmit, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(`Form submitted successfully! Your unique ID is: ${response.data.uniqueId}`);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      setNotification("Error submitting the form. Please try again.");
    }
  };

  const renderQuestions = (sections) =>
    sections.map((section) => (
      <div key={section.section}>
        <h3 className="section-title">{section.section}</h3>
        {section.questions.map(({ id, question, options, type, condition }) => {
          const shouldRender =
            !condition ||
            (typeof condition === "function"
              ? condition(formData)
              : formData[condition] === "Yes");

          return (
            shouldRender && (
              <div key={id} className="form-question">
                <label>
                  <strong>{question}</strong>
                  <div>
                    {type === "radio" ? (
                      <div className="radio-buttons">
                        {options.map((option) => (
                          <label key={option}>
                            <input
                              type="radio"
                              name={id}
                              value={option}
                              checked={formData[id] === option}
                              onChange={handleChange}
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    ) : type === "textarea" ? (
                      <textarea
                        name={id}
                        value={formData[id] || ""}
                        onChange={handleChange}
                        placeholder={question}
                        className="question-visible"
                      />
                    ) : type === "select" ? (
                      <select name={id} value={formData[id] || ""} onChange={handleChange}>
                        <option value="">Select</option>
                        {options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : type === "file" ? (
                      <input
                        type="file"
                        name={id}
                        onChange={handleChange}
                        className="question-visible"
                      />
                    ) : type === "checkbox" ? (
                      <input
                        type="checkbox"
                        name={id}
                        checked={formData[id] || false}
                        onChange={handleChange}
                      />
                    ) : (
                      <input
                        type={type}
                        name={id}
                        value={formData[id] || ""}
                        onChange={handleChange}
                      />
                    )}
                  </div>
                </label>
              </div>
            )
          );
        })}
      </div>
    ));

  const totalPages = Object.keys(questionsByPage).length;

  if (isSubmitted) {
    return (
      <div className="thank-you-page-container">
        <div className="thank-you-page">
          <h1>🎉 Thank You for Your Submission! 🎉</h1>
          <p>Your unique ID is saved successfully. Please check your email for further instructions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <Notification
        message={notification}
        onClose={() => setNotification(null)}
        duration={3000}
      />
      <form onSubmit={handleSubmit}>
        {renderQuestions(questionsByPage[`page${currentPage}`])}
        <div className="navigation-buttons">
          {currentPage > 1 && (
            <button className="previous-btn" type="button" onClick={prevPage}>
              Previous
            </button>
          )}
          {currentPage < totalPages && (
            <button className="next-btn" type="button" onClick={nextPage}>
              Next
            </button>
          )}
          {currentPage === totalPages && (
            <button type="submit">
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Form;
