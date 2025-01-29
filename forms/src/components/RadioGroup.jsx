import React from 'react';

const RadioGroup = ({ label, name, options, value, onChange }) => {
  return (
    <div className="radio-group">
      <label>
        <strong>{label}</strong>
      </label>
      <div>
        {options.map((option) => (
          <label key={option.value} style={{ marginRight: '10px' }}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
