import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const handleNavigation = (path) => {
  const navigate = useNavigate();

  // Check if you should push or replace the state
  if (path !== window.location.pathname) {
    window.history.pushState({ path: path }, '', path); // Push the state
  } else {
    window.history.replaceState({ path: path }, '', path); // Replace the current state
  }
  
  navigate(path);
};

useEffect(() => {
  // Track the navigation and ensure the state is saved
  window.onpopstate = (event) => {
    if (event.state && event.state.path) {
      // Here, you can handle the state restoration when going back
      navigate(event.state.path);
    }
  };
}, []);
