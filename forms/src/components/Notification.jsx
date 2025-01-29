import React, { useEffect, useState } from 'react';

const Notification = ({ message, onClose, duration = 3000 }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (message) {
      // Start the progress from 100% to 0%
      const timer = setInterval(() => {
        setProgress(prev => Math.max(prev - (100 / (duration / 100)), 0));
      }, 100);

      // Clear the timer and reset progress on unmount or message change
      const closeTimer = setTimeout(onClose, duration);

      return () => {
        clearInterval(timer);
        clearTimeout(closeTimer);
      };
    }
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div style={styles.notification}>
      {message}
      <div
        style={{
          ...styles.progressBar,
          width: `${progress}%`, // Control width dynamically based on time
        }}
      />
      <button style={styles.closeButton} onClick={onClose}>Close</button>
    </div>
  );
};

const styles = {
  notification: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: '#f44336',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  progressBar: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    height: '4px',
    backgroundColor: 'red',
    borderRadius: '5px',
    transition: 'width 0.1s linear',
  },
  closeButton: {
    marginTop: '10px',
    padding: '6px 12px',
    backgroundColor: 'white',
    color: '#f44336', // Red color for the text
    border: '2px solid #f44336', // Red border
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },
};

export default Notification;
