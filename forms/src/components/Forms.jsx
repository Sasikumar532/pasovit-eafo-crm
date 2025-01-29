import React, { useState } from "react";
import axios from "axios";
import "./Form.css";
import Notification from "./Notification";
import { questionsByPage } from "./questions";

const Form = () => {
  const [formData, setFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };

      // Handle file input separately
      if (type === "file" && files.length > 0) {
        updatedFormData[name] = files[0]; // Store the file object
      }

      return updatedFormData;
    });
  };

  const validatePage = () => {
    console.log("Validating Page", currentPage, formData); // Debugging log

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
          if (type === "file") {
            // Check for file uploads: the file object should not be null or undefined
            if (!formData[id]) {
              setNotification(`Please upload the required file.`);
              return false;
            }
          } else {
            // For non-file inputs (text, radio, select), use trim() to validate empty values
            if (!formData[id] || formData[id].trim() === "") {
              setNotification(`Please fill in all required fields on this page.`);
              return false;
            }
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

    // Create FormData to handle file uploads
    const formDataToSubmit = new FormData();

    // Append form data including file input
    for (let key in formData) {
      if (formData[key] instanceof File) {
        formDataToSubmit.append(key, formData[key]);  // Append file
      } else {
        formDataToSubmit.append(key, formData[key]);  // Append other data
      }
    }

    try {
      await axios.post("http://localhost:5000/api/forms", formDataToSubmit, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
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
          <p>We sincerely appreciate you taking the time to complete this form.</p>
          <p>
            If you have any additional questions or need assistance, feel free to reach out to us at:
            <a href="mailto:support@example.com"> support@example.com</a>.
          </p>
          <p>Meanwhile, you can:</p>
          <div className="thank-you-actions">
            <button onClick={() => window.location.href = '/home'}>Go to Homepage</button>
            <button onClick={() => window.location.href = '/contact'}>Contact Support</button>
            <button onClick={() => window.location.href = '/faq'}>View FAQs</button>
          </div>
          <p>We look forward to serving you again. Have a great day!</p>
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
      {!previewMode ? (
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
              <button type="button" onClick={() => setPreviewMode(true)}>
                Preview
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="preview-container">
          <h2>Preview Your Answers</h2>
          {Object.keys(questionsByPage).map((pageKey) => (
            <div key={pageKey} className="preview-section">
              {questionsByPage[pageKey].map((section) => {
                const sectionAnswers = section.questions
                  .filter((q) => formData[q.id])
                  .map((q) => ({
                    question: q.question,
                    answer: formData[q.id] instanceof File ? `File uploaded: ${formData[q.id].name}` : formData[q.id]
                  }));

                if (sectionAnswers.length === 0) return null;

                return (
                  <div key={section.section}>
                    <h3 className="section-title">{section.section}</h3>
                    <ul className="preview-list">
                      {sectionAnswers.map(({ question, answer }, index) => (
                        <li key={index} className="preview-item">
                          <strong>{question}:</strong> {answer || "N/A"}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ))}
          <div className="navigation-buttons">
            <button type="button" onClick={() => setPreviewMode(false)}>
              Back
            </button>
            <button type="submit" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
