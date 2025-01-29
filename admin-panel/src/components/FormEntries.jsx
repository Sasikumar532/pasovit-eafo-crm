import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FormEntries.css";
import InvoicePopup from "./InvoicePopup";


const FormEntries = () => {
  const [formEntries, setFormEntries] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [files, setFiles] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
const [selectedCoursePrice, setSelectedCoursePrice] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/forms");
        const formattedEntries = response.data.map((entry) => ({
          ...entry,
          registeredAt: new Date(entry.submittedAt).toLocaleString("en-GB"),
        }));
        setFormEntries(formattedEntries);

        if (formattedEntries.length > 0) {
          setSelectedUser(formattedEntries[0]);
          setUpdatedDetails(formattedEntries[0]);
          fetchFiles(formattedEntries[0].uniqueId); // Fetch files for the first user
        }
      } catch (error) {
        console.error("Error fetching form entries:", error);
      }
    };
    fetchEntries();
  }, []);

  useEffect(() => {
    if (selectedUser && selectedUser.uniqueId) {
      const fetchFiles = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/forms/files/${selectedUser.uniqueId}`
          );
          setFiles(response.data);
        } catch (error) {
          console.error("Error fetching files:", error);
        }
      };

      fetchFiles();
    }
  }, [selectedUser]);

  const downloadFile = async (uniqueId, fileName) => {
    try {
      const fileUrl = `http://localhost:5000/api/forms/files/${uniqueId}/${fileName}`;
      const response = await axios.get(fileUrl, { responseType: "blob" });

      const contentDisposition = response.headers["content-disposition"];
      const originalFileName = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
        : fileName;

      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", originalFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const previewFile = (fileName) => {
    const fileUrl = `http://localhost:5000/api/forms/files/${selectedUser.uniqueId}/${fileName}`;
    window.open(fileUrl, "_blank");
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setUpdatedDetails(user);
    setEditMode(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/forms/${updatedDetails._id}`,
        updatedDetails
      );
      const updatedEntries = formEntries.map((entry) =>
        entry._id === updatedDetails._id
          ? { ...updatedDetails, registeredAt: entry.registeredAt }
          : entry
      );
      setFormEntries(updatedEntries);
      setEditMode(false);
      alert("User details updated successfully!");
    } catch (error) {
      console.error("Error updating user details:", error);
      alert("Failed to update user details. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderFields = (fields, keysToInclude) => {
    return keysToInclude.map((key) => (
      <div key={key}>
        <label>{key.replace(/([A-Z])/g, " $1").toUpperCase()}</label>
        <input
          type={key === "email" ? "email" : "text"}
          value={fields[key] ?? ""} // Use nullish coalescing to handle undefined/null
          onChange={(e) =>
            setUpdatedDetails({ ...updatedDetails, [key]: e.target.value })
          }
          disabled={!editMode}
        />
      </div>
    ));
  };


  const fetchCoursePrice = async (courseName) => {
    try {
      const response = await axios.get("http://localhost:5000/api/courses");
      const courses = response.data;
  
      // Find the matching course
      const matchedCourse = courses.find(
        (course) => course.courseName === courseName
      );
  
      if (matchedCourse) {
        setCoursePrice(`${matchedCourse.coursePrice} ${matchedCourse.courseCurrency}`);
      } else {
        setCoursePrice("Course not found");
      }
    } catch (error) {
      console.error("Error fetching course prices:", error);
      setCoursePrice("Error fetching course price");
    }
  };
  

  const handleGenerateInvoice = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/courses");
      const courseData = response.data;
  
      // Find the selected course's price
      const selectedCourse = courseData.find(
        (course) => course.courseName === selectedUser.courseSelection
      );
  
      if (selectedCourse) {
        setSelectedCoursePrice(
          `${selectedCourse.coursePrice} ${selectedCourse.courseCurrency}`
        );
        setIsPopupOpen(true);
      } else {
        alert("Course not found!");
      }
    } catch (error) {
      console.error("Error fetching course price:", error);
      alert("Failed to fetch course price.");
    }
  };
  
  

  const closeInvoicePopup = () => {
    setInvoicePopup(false); // Close the invoice popup
    setCoursePrice(null); // Reset the course price
  };
  

  return (
    <div className="form-entries">
      <div className="form-entries-container">
        <h1>Form Entries</h1>
        {!selectedUser ? (
          <p>Loading...</p>
        ) : (
          <div className="form-entries-grid">
            <div className="form-entries-list">
              <ul>
                {formEntries.map((entry) => (
                  <li
                    key={entry._id}
                    className={`form-entry-item ${selectedUser._id === entry._id ? "active" : "inactive"}`}
                    onClick={() => handleUserClick(entry)}
                  >
                    <p>
                      <strong>Full Name:</strong> {entry.fullName}
                    </p>
                    <p>
                      <strong>Email:</strong> {entry.email}
                    </p>
                    <p>
                      <strong>Registered At:</strong> {entry.registeredAt}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="user-details">
              {/* Full-width Navbar */}
              <div className="user-details-navbar">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    disabled={isSaving}
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setEditMode(false)}
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </button>
                  </>
                )}
                <button onClick={handleGenerateInvoice}>
                  Generate Invoice
                </button>
              </div>

              <div className="details-section">
                <h2>Personal Details</h2>
                {renderFields(updatedDetails, [
                  "fullName",
                  "email",
                  "phoneNumber",
                  "dateOfBirth",
                  "city",
                  "country",
                ])}
              </div>

              <div className="details-section">
                <h2>Course Details</h2>
                {renderFields(updatedDetails, [
                  "courseSelection",
                  "couponCode",
                  "couponCodeInput",
                ])}
              </div>

              <div className="details-section">
                <h2>Accommodation Details</h2>
                {renderFields(updatedDetails, ["accommodation", "submitAbstract"])}
              </div>

              {selectedUser && (
                <div className="details-section">
                  <h2>Files</h2>
                  <div className="file-list">
                    {files.length > 0 ? (
                      files.map((file) => (
                        <div key={file.name} className="file-item">
                          <span className="file-icon">📄</span>
                          <span className="file-name">{file.name}</span>

                          {/* File options: Preview and Download buttons */}
                          <div className="file-options">
                            <button
                              className="preview-btn"
                              onClick={() => previewFile(file.name)}
                            >
                              Preview
                            </button>
                            <button
                              className="download-btn"
                              onClick={() => downloadFile(selectedUser.uniqueId, file.name)}
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No files available</p>
                    )}
                  </div>
                </div>
              )}


{isPopupOpen && (
  <InvoicePopup
    user={selectedUser}
    coursePrice={selectedCoursePrice}
    onClose={() => setIsPopupOpen(false)}
  />
)}


           
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormEntries;
