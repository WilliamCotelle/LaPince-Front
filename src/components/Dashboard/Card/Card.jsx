import React from "react";
import {
  FaWallet,
  FaMoneyBillAlt,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import "./Card.css"; // Importation du fichier CSS pour la mise en forme du composant

const Card = ({ title, value }) => {
  // Fonction pour déterminer l'icône à afficher en fonction du titre
  const getIcon = (title) => {
    switch (title) {
      case "Solde":
        return <FaWallet className="card-icon" />;
      case "Dépenses":
        return <FaArrowDown className="card-icon amount-negative" />;
      case "Rentrées d'argent":
        return <FaArrowUp className="card-icon amount-positive" />;
      default:
        return null; // Aucun icône par défaut si le titre ne correspond à aucun cas
    }
  };

  // Fonction pour déterminer la classe CSS à appliquer au montant en fonction du titre
  const getValueClassName = (title) => {
    switch (title) {
      case "Dépenses":
        return "card-value amount-negative"; // Classe pour montant négatif
      case "Rentrées d'argent":
        return "card-value amount-positive"; // Classe pour montant positif
      default:
        return "card-value"; // Classe par défaut pour les autres titres
    }
  };

  return (
    <div className="card">
      <div className="value-and-badge">
        {getIcon(title)} {/* Affiche l'icône appropriée */}
        <div>
          <p className="card-title">{title}</p>{" "}
          {/* Affiche le titre de la carte */}
          <p className={getValueClassName(title)}>{value} €</p>{" "}
          {/* Affiche la valeur avec la classe appropriée */}
        </div>
      </div>
    </div>
  );
};

export default Card;
