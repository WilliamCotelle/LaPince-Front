import React from "react";
import "./Calculator.css"; // Assure-toi de bien styliser le clavier

// Composant pour une calculatrice simple
const Calculator = ({ amount, setAmount }) => {
  // Fonction appelée lors du clic sur un bouton de la calculatrice
  const handleButtonClick = (value) => {
    // Si l'utilisateur clique sur "C", on efface le montant actuel
    if (value === "C") {
      setAmount("");
      return;
    }

    // Si l'utilisateur clique sur ".", on s'assure qu'il n'y a pas déjà un point dans le montant
    if (value === "." && amount.includes(".")) {
      return;
    }

    // Si l'utilisateur clique sur un chiffre, on l'ajoute au montant actuel
    setAmount((prevAmount) => prevAmount + value);
  };

  return (
    <div className="calculator-container">
      {/* Ligne 1 du clavier de la calculatrice */}
      <div className="calculator-row">
        <button
          className="calculator-button"
          onClick={() => handleButtonClick("1")}
        >
          1
        </button>
        <button
          className="calculator-button"
          onClick={() => handleButtonClick("2")}
        >
          2
        </button>
        <button
          className="calculator-button"
          onClick={() => handleButtonClick("3")}
        >
          3
        </button>
      </div>
      {/* Ligne 2 du clavier de la calculatrice */}
      <div className="calculator-row">
        <button
          className="calculator-button"
          onClick={() => handleButtonClick("4")}
        >
          4
        </button>
        <button
          className="calculator-button"
          onClick={() => handleButtonClick("5")}
        >
          5
        </button>
        <button
          className="calculator-button"
          onClick={() => handleButtonClick("6")}
        >
          6
        </button>
      </div>
      {/* Ligne 3 du clavier de la calculatrice */}
      <div className="calculator-row">
        <button
          className="calculator-button"
          onClick={() => handleButtonClick("7")}
        >
          7
        </button>
        <button
          className="calculator-button"
          onClick={() => handleButtonClick("8")}
        >
          8
        </button>
        <button
          className="calculator-button"
          onClick={() => handleButtonClick("9")}
        >
          9
        </button>
      </div>
      {/* Ligne 4 du clavier de la calculatrice */}
      <div className="calculator-row">
        <button
          className="calculator-button"
          onClick={() => handleButtonClick("0")}
        >
          0
        </button>
        <button
          className="calculator-button"
          onClick={() => handleButtonClick(".")}
        >
          .
        </button>
        <button
          className="calculator-button-reset"
          onClick={() => handleButtonClick("C")}
        >
          C
        </button>
      </div>
    </div>
  );
};

export default Calculator;
