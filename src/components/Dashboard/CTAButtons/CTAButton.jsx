import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import "./CTAButton.css";

const CTAButton = ({ type, onClick }) => {
  const isIncome = type === "income";
  const buttonClass = isIncome ? "cta income" : "cta expense";

  return (
    <div className={buttonClass} onClick={onClick}>
      <div className="icon-wrapper">
        {isIncome ? <FaPlus className="icon" /> : <FaMinus className="icon" />}
      </div>
      <div className="text-2">
        <p className="text">
          {isIncome ? "Ajouter un revenu" : "Ajouter une dépense"}
        </p>
      </div>
    </div>
  );
};

export default CTAButton;
