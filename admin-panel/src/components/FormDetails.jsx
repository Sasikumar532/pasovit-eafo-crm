import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './DataDisplay.css';

const DataDisplay = () => {
   const { status } = useParams();
   const [data, setData] = useState([]);
   const [error, setError] = useState(null);
   const [currentPage, setCurrentPage] = useState(1);
   const [searchTerm, setSearchTerm] = useState('');
   const [timeFilter, setTimeFilter] = useState('All');
   const recordsPerPage = 8;

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await axios.get('http://localhost:5000/api/forms');
            const sortedData = response.data.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
            setData(sortedData);
         } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch data.');
         }
      };

      fetchData();
   }, []);

   const isWithinTimeRange = (submittedAt) => {
      const now = new Date();
      const submissionDate = new Date(submittedAt);

      if (timeFilter === 'Last 24 hours') {
         return now - submissionDate <= 24 * 60 * 60 * 1000;
      } else if (timeFilter === 'Last 7 days') {
         return now - submissionDate <= 7 * 24 * 60 * 60 * 1000;
      } else if (timeFilter === 'Last 30 days') {
         return now - submissionDate <= 30 * 24 * 60 * 60 * 1000;
      }
      return true; // For 'All', no date filter applied
   };

   const filteredData = useMemo(() => {
      return data.filter((item) => {
         const statusMatch = status === 'all' || item.status.toLowerCase() === status;
         const searchMatch =
            searchTerm === '' ||
            (item.fullName && item.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
         const dateMatch = isWithinTimeRange(item.submittedAt);
         return statusMatch && searchMatch && dateMatch;
      });
   }, [data, status, searchTerm, timeFilter]);

   const totalPages = Math.ceil(filteredData.length / recordsPerPage);
   const startIndex = (currentPage - 1) * recordsPerPage;
   const currentData = filteredData.slice(startIndex, startIndex + recordsPerPage);

   const handlePageChange = (page) => {
      if (page >= 1 && page <= totalPages) {
         setCurrentPage(page);
      }
   };

   return (
      <div className="data-display-container">
         {/* Header */}
         <div className="header">
            <h2>{status.charAt(0).toUpperCase() + status.slice(1)} Submissions</h2>
         </div>

         {/* Filters and Search */}
         <div className="filters-container">
            <div className="search-input">
               <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name..."
               />
               <i className="search-icon fas fa-search"></i> {/* Search Icon */}
            </div>

            <div className="time-filter">
               <select
                  id="time-filter"
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
               >
                  <option value="All">All</option>
                  <option value="Last 24 hours">Last 24 hours</option>
                  <option value="Last 7 days">Last 7 days</option>
                  <option value="Last 30 days">Last 30 days</option>
               </select>
            </div>
         </div>

         {/* Data Cards */}
         <div className="cards-container">
            {error && <p className="error-message">{error}</p>}
            {filteredData.length === 0 ? (
               <p className="no-data">No submissions found.</p>
            ) : (
               currentData.map((item) => (
                  <Link
                     to={`/data/${item._id}`}
                     key={item._id}
                     className={`data-card ${item.status === 'Checked' ? 'checked' : 'unchecked'}`}
                  >
                     <div className="data-card-content">
                        <h3>{item.fullName}</h3>
                        <p>
                           <strong>Submitted At:</strong>{' '}
                           {new Date(item.submittedAt).toLocaleString('en-GB')}
                        </p>
                        <p>
                           <strong>Status:</strong> {item.status}
                        </p>
                     </div>
                  </Link>
               ))
            )}
         </div>

         {/* Pagination */}
         <div className="pagination">
            <button
               onClick={() => handlePageChange(currentPage - 1)}
               disabled={currentPage === 1}
               className="pagination-button"
            >
               Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
               <button
                  key={i}
                  className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
                  onClick={() => handlePageChange(i + 1)}
               >
                  {i + 1}
               </button>
            ))}
            <button
               onClick={() => handlePageChange(currentPage + 1)}
               disabled={currentPage === totalPages}
               className="pagination-button"
            >
               Next
            </button>
         </div>
      </div>
   );
};

export default DataDisplay;
