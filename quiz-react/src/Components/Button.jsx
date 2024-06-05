// Button.jsx
import React from 'react';
import './Button.css';


const Button = ({ label, onClick }) => {
  return (
    <center>
    <button type="button" className="btn btn-primary w-50 " onClick={onClick}>
      {label}
    </button>
    </center>
  );
};

export default Button;
