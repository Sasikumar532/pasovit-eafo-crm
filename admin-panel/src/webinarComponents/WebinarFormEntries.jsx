import React, { useEffect, useState } from "react";
import axios from "axios";

const WebinarFormEntries = () => {
  const [formEntries, setFormEntries] = useState([]); // Store form entries
  const [selectedUser, setSelectedUser] = useState(null); // Selected user
  const [editMode, setEditMode] = useState(false); // Edit mode for updating user details
  const [updatedDetails, setUpdatedDetails] = useState({}); // Updated user details
  const [isSaving, setIsSaving] = useState(false); // Saving state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token || !role) {
          alert("You must be logged in with appropriate permissions.");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
            Role: role, // Send role to authenticate the request
          },
        });

        const formattedEntries = response.data.map((entry) => ({
          ...entry,
          registeredAt: new Date(entry.registeredAt).toLocaleString("en-GB"),
        }));

        setFormEntries(formattedEntries);
        setSelectedUser(formattedEntries[0]); // Pre-select first user for editing
        setUpdatedDetails(formattedEntries[0]); // Set details for updating
      } catch (error) {
        console.error("Error fetching form entries:", error);
        alert("Failed to fetch user data. Please try again.");
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setUpdatedDetails(user);
    setEditMode(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (!token || !role) {
        alert("You must be logged in.");
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/user/${updatedDetails.email}`,
        updatedDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Role: role,
          },
        }
      );

      const updatedEntries = formEntries.map((entry) =>
        entry.email === updatedDetails.email
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
          value={fields[key] ?? ""}
          onChange={(e) =>
            setUpdatedDetails({ ...updatedDetails, [key]: e.target.value })
          }
          disabled={!editMode}
        />
      </div>
    ));
  };

  return (
    <div className="form-entries">
      <div className="form-entries-container">
        <h1>Webinar Management</h1>
        {!selectedUser ? (
          <p>Loading...</p>
        ) : (
          <div className="form-entries-grid">
            <div className="form-entries-list">
              <ul>
                {formEntries.map((entry) => (
                  <li
                    key={entry.email}
                    className={`form-entry-item ${selectedUser.email === entry.email ? "active" : "inactive"}`}
                    onClick={() => handleUserClick(entry)}
                  >
                    <p>
                      <strong>Full Name:</strong> {entry.firstName} {entry.lastName}
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
                  <button onClick={() => setEditMode(true)} disabled={isSaving}>Edit</button>
                ) : (
                  <>
                    <button onClick={() => setEditMode(false)} disabled={isSaving}>Cancel</button>
                    <button onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</button>
                  </>
                )}
              </div>

              <div className="details-section">
                <h2>Personal Details</h2>
                {renderFields(updatedDetails, [
                  "firstName",
                  "lastName",
                  "email",
                  "phone",
                  "dob",
                  "country",
                  "university",
                  "department",
                  "profession",
                  "position",
                  "gender"
                ])}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebinarFormEntries;
