import React from "react";
import { Doughnut } from "react-chartjs-2";
import { FaTrash } from "react-icons/fa";
import "./BudgetPage.css"; // Le CSS reste dans le même fichier

const BudgetProgress = ({ budget, color, onDelete }) => {
  // Calcul du montant dépensé et du pourcentage de progression
  const budgetLimit = budget.limitAmount || 0;
  const remainingBudget = budget.remainingBudget || 0;
  const spent = budgetLimit - remainingBudget;
  const progress = (spent / budgetLimit) * 100;

  // Données pour le graphique Doughnut
  const data = {
    datasets: [
      {
        data: [spent, remainingBudget],
        backgroundColor: [color, "#e0e0e0"],
        hoverBackgroundColor: [color, "#e0e0e0"],
        borderWidth: 0,
      },
    ],
  };

  // Options pour le graphique
  const options = {
    cutout: "70%", // Pour créer un anneau
    plugins: {
      legend: { display: false }, // Masquer la légende
      tooltip: { enabled: false }, // Désactiver les tooltips
    },
  };

  return (
    <div className="budget-item">
      {/* Affiche le nom de la catégorie du budget ou un texte par défaut */}
      <h3>{budget.category ? budget.category.name_category : "Sans nom"}</h3>
      <div className="chart-container-budget">
        <Doughnut data={data} options={options} />
        <div className="chart-center">
          <p>{isNaN(progress) ? 0 : Math.round(progress)}%</p>
        </div>
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
