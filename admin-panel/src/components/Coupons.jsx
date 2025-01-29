import React, { useState, useEffect } from "react";
import "./Coupons.css"; // Import the updated CSS file

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [totalLimit, setTotalLimit] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState(null);

  const fetchCoupons = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/coupons");
      const data = await response.json();
      setCoupons(data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      alert("Error fetching coupons");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Format date to DD-MM-YYYY for displaying in the UI
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return ""; // Handle case where there's no date
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Convert to DD-MM-YYYY format
  };

  // Format date to YYYY-MM-DD for the input field
  const formatDateForInput = (dateString) => {
    if (!dateString) return ""; // Handle case where there's no date
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // Convert to YYYY-MM-DD format for the input
  };

  // Reset form when opening the modal for adding a new coupon
  const resetForm = () => {
    setCouponCode("");
    setTotalLimit("");
    setStartDate("");
    setEndDate("");
    setEditingCouponId(null); // Ensure we're not editing an existing coupon
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const couponData = { 
      couponCode, 
      totalLimit, 
      startDate, 
      endDate, 
      usageLimit: 0 // Usage starts at 0 by default
    };

    try {
      if (editingCouponId) {
        // Edit Coupon
        const response = await fetch(`http://localhost:5000/api/coupons/${editingCouponId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(couponData),
        });

        if (response.ok) {
          alert("Coupon updated successfully!");
        } else {
          alert("Error updating coupon");
        }

        setEditingCouponId(null);
      } else {
        // Add Coupon
        const response = await fetch("http://localhost:5000/api/coupons", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(couponData),
        });

        if (response.ok) {
          alert("Coupon added successfully!");
        } else {
          alert("Error adding coupon");
        }
      }

      // After submission, reset the form and close the modal
      resetForm();
      fetchCoupons(); // Refresh the coupon list
      setIsModalOpen(false); // Close modal after successful submission
    } catch (error) {
      console.error("Error saving coupon:", error);
      alert("An error occurred while saving the coupon.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/coupons/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Coupon deleted successfully!");
      } else {
        alert("Error deleting coupon");
      }

      fetchCoupons(); // Refresh the coupon list after deletion
    } catch (error) {
      console.error("Error deleting coupon:", error);
      alert("An error occurred while deleting the coupon.");
    }
  };

  const handleEdit = (coupon) => {
    setCouponCode(coupon.couponCode);
    setTotalLimit(coupon.totalLimit);
    setStartDate(formatDateForInput(coupon.startDate)); // Ensure correct format for input
    setEndDate(formatDateForInput(coupon.endDate)); // Ensure correct format for input
    setEditingCouponId(coupon._id);
    setIsModalOpen(true); // Open the modal in edit mode
  };

  return (
    <div className="coupon-manager-page">
      <div className="container">
        <div className="coupon-header">
          <h2>Coupon Manager</h2>
          <button
            className="add-button"
            onClick={() => {
              resetForm(); // Reset the form fields when adding a new coupon
              setIsModalOpen(true); // Open modal for new coupon
            }}
          >
            Add Coupon
          </button>
        </div>

        {/* Coupon List */}
        <ul>
          {coupons.map((coupon) => (
            <li className="coupon-list" key={coupon._id}>
              <span>
                {coupon.couponCode} - Total Limit: {coupon.totalLimit} - Used: {coupon.usageLimit}
                <br />
                {/* Display Date Range in "From: - To:" format */}
                From: {formatDateForDisplay(coupon.startDate)} - To: {formatDateForDisplay(coupon.endDate)}
              </span>
              <div>
                <button className="edit" onClick={() => handleEdit(coupon)}>
                  Edit
                </button>
                <button
                  className="delete"
                  onClick={() => handleDelete(coupon._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Modal for Add/Edit Coupon */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              {/* Modal Header */}
              <h3>{editingCouponId ? "Edit Coupon" : "Add Coupon"}</h3>

              <form onSubmit={handleSubmit}>
                <div>
                  <label>Coupon Code:</label>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label>Total Limit:</label>
                  <input
                    type="number"
                    value={totalLimit}
                    onChange={(e) => setTotalLimit(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label>Start Date:</label>
                  <input
                    type="date"
                    value={startDate} // Use formatted date for input
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label>End Date:</label>
                  <input
                    type="date"
                    value={endDate} // Use formatted date for input
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>

                <button className="form-btn" type="submit">
                  {editingCouponId ? "Update Coupon" : "Add Coupon"}
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

export default Coupons;
