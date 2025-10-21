import React from "react";
import "../styles/button.css";
const Button = ({ children, onClick, type = "button", className = "" }) => {
  return (
    <div>
      <button
        onClick={onClick}
        type={type}
        className={`SimButton ${className}`}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
