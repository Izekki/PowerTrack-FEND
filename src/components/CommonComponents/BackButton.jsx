import React from "react";
import "../../styles/CommonComponentsCss/BackButton.css";

const BackButton = ({ onClick, label = "Volver", ariaLabel, className = "" }) => {
  return (
    <button
      type="button"
      className={`btn-style-default back-button ${className}`.trim()}
      onClick={onClick}
      aria-label={ariaLabel || label}
    >
      <span className="back-button-arrow" aria-hidden="true">←</span>
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
