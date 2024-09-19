import React from "react";
import "./LoadingSpinner.css"; // Importer le fichier CSS pour le spinner

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <img src="/src/assets/logo.png" alt="Loading..." className="spinner" />
    </div>
  );
};

export default LoadingSpinner;
