import React, { useState, useEffect } from "react";
import "./CourseManager.css"; // Import the updated CSS file

const CourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseCurrency, setCourseCurrency] = useState("RUB");
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/courses");
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      alert("Error fetching courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const courseData = { courseName, coursePrice, courseCurrency };

      if (editingCourseId) {
        // Edit Course
        const response = await fetch(`http://localhost:5000/api/courses/${editingCourseId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courseData),
        });

        if (response.ok) {
          alert("Course updated successfully!");
        } else {
          alert("Error updating course");
        }

        setEditingCourseId(null);
      } else {
        // Add Course
        const response = await fetch("http://localhost:5000/api/courses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courseData),
        });

        if (response.ok) {
          alert("Course added successfully!");
        } else {
          alert("Error adding course");
        }
      }

      setCourseName(""); // Clear input fields
      setCoursePrice(""); // Clear input fields
      setCourseCurrency("RUB"); 
      setIsModalOpen(false); // Close the modal after submission
      fetchCourses(); // Refresh the course list
    } catch (error) {
      console.error("Error saving course:", error);
      alert("An error occurred while saving the course.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Course deleted successfully!");
      } else {
        alert("Error deleting course");
      }

      fetchCourses(); // Refresh the course list after deletion
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("An error occurred while deleting the course.");
    }
  };

  const handleEdit = (course) => {
    setCourseName(course.courseName);
    setCoursePrice(course.coursePrice);
    setEditingCourseId(course._id);
    setCourseCurrency(course.courseCurrency); 
    setIsModalOpen(true); // Open the modal in edit mode
  };

  const currencySymbol = (currency) => {
    switch (currency) {
      case "INR":
        return "₹"; // Indian Rupee
      case "RUB":
        return "₽"; // Russian Ruble
      default:
        return "₽"; // Default currency is RUB (Russian Ruble)
    }
  };

  return (
    <div className="course-price-page">
    <div className="container">
        <div className="couser-header">
        <h2>Course Manager</h2>

        <button
        className="add-button"
        onClick={() => {
          setIsModalOpen(true); // Open modal when Add button is clicked
          setEditingCourseId(null); // Reset editing state
        }}
      >
        Add Course
      </button>
        </div>
      

      {/* Add Course Button */}
      

      {/* Course List */}
     
      <ul>
        {courses.map((course) => (
          <li className="course-list" key={course._id}>
            <span> {course.courseName} - {currencySymbol(course.courseCurrency)} {course.coursePrice}</span>
            <div>
              <button className="edit" onClick={() => handleEdit(course)}>
                Edit
              </button>
              <button
                className="delete"
                onClick={() => handleDelete(course._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for Add/Edit Course */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            {/* Modal Header */}
            <h3>{editingCourseId ? "Edit Course" : "Add Course"}</h3>

            <form onSubmit={handleSubmit}>
              <div>
                <label>Course Name:</label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Course Price:</label>
                <input
                  type="text"
                  value={coursePrice}
                  onChange={(e) => setCoursePrice(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Currency:</label>
                <select
                  value={courseCurrency}
                  onChange={(e) => setCourseCurrency(e.target.value)}
                >
                  <option value="RUB">Russian Ruble (₽)</option>
                  <option value="INR">Indian Rupee (₹)</option>
                </select>
              </div>

              <button className="form-btn" type="submit">
                {editingCourseId ? "Update Course" : "Add Course"}
              </button>
            </form>

            {/* Close Modal X Button */}
            <button className="close" onClick={() => setIsModalOpen(false)}>
              &times; {/* X Icon */}
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default CourseManager;
