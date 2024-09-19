import React from "react";
import "./BudgetPage.css"; // Optionnel : styles spécifiques au composant
import { FaTrash } from "react-icons/fa";

// Composant pour afficher les progrès d'un budget
const BudgetProgress = ({ budget, color, onDelete }) => {
  // Calcul du montant dépensé et du pourcentage de progression
  const budgetLimit = budget.limitAmount || 0;
  const remainingBudget = budget.remainingBudget || 0;
  const spent = budgetLimit - remainingBudget;
  const progress = (spent / budgetLimit) * 100;

  return (
    <div className="budget-item">
      {/* Affiche le nom de la catégorie du budget ou un texte par défaut */}
      <h3>{budget.category ? budget.category.name_category : "Sans nom"}</h3>
      <div className="progress-bar">
        <div
          className="progress"
          style={{
            width: `${isNaN(progress) ? 0 : progress}%`, // Applique le pourcentage de progression ou 0 si NaN
            backgroundColor: color, // Utilise la couleur passée en prop pour la barre de progression
            height: "20px",
          }}
        ></div>
      </div>
      {/* Affiche le montant dépensé et le montant total du budget */}
      <p>
        {isNaN(spent) ? 0 : spent}€ dépensé sur {budgetLimit}€
      </p>
      {/* Icône pour supprimer le budget, déclenche la fonction onDelete avec l'id du budget */}
      <span className="delete-icon" onClick={() => onDelete(budget.id)}>
        <FaTrash />
      </span>
    </div>
  );
};

export default BudgetProgress;
