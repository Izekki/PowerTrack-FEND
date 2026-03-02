import React from "react";
import "../../styles/CommonComponentsCss/Breadcrumb.css";

const Breadcrumb = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav className="breadcrumb-container" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => (
          <li key={index} className="breadcrumb-item">
            {item.active ? (
              <span className="breadcrumb-active">{item.label}</span>
            ) : (
              <>
                <button
                  className="breadcrumb-link"
                  onClick={item.onClick}
                  type="button"
                  aria-label={`Ir a ${item.label}`}
                >
                  {item.label}
                </button>
                <span className="breadcrumb-separator" aria-hidden="true">/</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
