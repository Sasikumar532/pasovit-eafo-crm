import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import VideoEmbedWithChat from './VideoEmbedWithChat';

const Dashboard = ({ selectedLanguage }) => {
  const [data, setData] = useState([]);
  const [statusCount, setStatusCount] = useState({ Checked: 0, Unchecked: 0, All: 0 });
  const [displayedCount, setDisplayedCount] = useState({ Checked: 0, Unchecked: 0, All: 0 });

  // Function to animate count transitions
  const animateCount = (targetCount, countType) => {
    let currentCount = displayedCount[countType];
    const increment = targetCount / 100;  // Adjust the speed of the animation
    const interval = setInterval(() => {
      currentCount += increment;
      if (currentCount >= targetCount) {
        currentCount = targetCount;
        clearInterval(interval); // Stop the animation
      }
      setDisplayedCount((prevState) => ({
        ...prevState,
        [countType]: Math.floor(currentCount), // Display as an integer
      }));
    }, 10); // Update every 10ms for smoother animation
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/forms');
        const submissions = response.data;

        // Calculate counts
        const checkedCount = submissions.filter((item) => item.status === 'Checked').length;
        const uncheckedCount = submissions.filter((item) => item.status === 'Unchecked').length;
        const allCount = submissions.length;

        // Update counts and animate if the count changes
        if (checkedCount !== statusCount.Checked) {
          animateCount(checkedCount, 'Checked');
        }
        if (uncheckedCount !== statusCount.Unchecked) {
          animateCount(uncheckedCount, 'Unchecked');
        }
        if (allCount !== statusCount.All) {
          animateCount(allCount, 'All');
        }

        // Update the statusCount to the new values after the animation starts
        setStatusCount({ Checked: checkedCount, Unchecked: uncheckedCount, All: allCount });

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [statusCount]); // Re-run effect only when statusCount changes

  const labels = {
    all: selectedLanguage === 'Russian' ? 'Все заявки' : 'Total Submissions',
    checked: selectedLanguage === 'Russian' ? 'Проверенные заявки' : 'Checked Submissions',
    unchecked: selectedLanguage === 'Russian' ? 'Непроверенные заявки' : 'Unchecked Submissions',
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h2>{selectedLanguage === 'Russian' ? 'Панель управления заявками' : 'Form Submissions Dashboard'}</h2>
      </div>

      <div className="status-summary">
        {/* Total Submissions */}
        <Link to="/dashboard/all" className="status-box">
          <p className="count">{displayedCount.All}</p>
          <h3>{labels.all}</h3>
        </Link>

        {/* 
        <Link to="/dashboard/checked" className="status-box">
          <p className="count">{displayedCount.Checked}</p>
          <h3>{labels.checked}</h3>
        </Link>

       
        <Link to="/dashboard/unchecked" className="status-box">
          <p className="count">{displayedCount.Unchecked}</p>
          <h3>{labels.unchecked}</h3>
        </Link>
          */}
          
          
      </div>
    </div>
  );
};

export default Dashboard;
