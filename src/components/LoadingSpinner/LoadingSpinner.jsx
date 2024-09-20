import React from "react";
import "./LoadingSpinner.css"; // Importer le fichier CSS pour le spinner
import logo from "../../assets/logo.png"; // Importer l'image correctement

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <img src={logo} alt="Loading..." className="spinner" />{" "}
    </div>
  );
};

export default LoadingSpinner;
