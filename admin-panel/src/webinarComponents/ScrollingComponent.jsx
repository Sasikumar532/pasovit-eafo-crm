import React from 'react';
import './ScrollingComponent.css'; // Ensure CSS is correctly imported
import { columnImages } from './imageData'; // Import the image arrays

const ScrollingComponent = () => {
  return (
    <div className="outer-container">
      <div className="scroll-container">
        <div className="company-logo-scroll">
          {columnImages.map((column, index) => (
            <div
              className={`ticker-track ${index % 2 === 0 ? 'scroll-up' : 'scroll-down'}`}
              key={index}
            >
              {column.map((image, i) => (
                <img src={image} alt={`image-${i}`} className="image" key={i} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollingComponent;
