import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Enregistre les composants nécessaires de Chart.js pour le graphique à barres
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Composant pour afficher un graphique à barres des dépenses mensuelles
const MonthlyBarChart = ({ transactions }) => {
  // Prépare les données pour le graphique
  const data = {
    // Labels pour l'axe des X : mois uniques extraits des transactions
    labels: [...new Set(transactions.map((tx) => tx.month))],
    datasets: [
      {
        // Dataset pour les dépenses par mois
        label: "Dépenses par mois",
        // Données pour chaque mois : somme des montants pour chaque mois
        data: transactions.reduce((acc, tx) => {
          // Accumule les montants par mois
          acc[tx.month] = (acc[tx.month] || 0) + tx.amount;
          return acc;
        }, {}),
        // Couleur de fond des barres
        backgroundColor: "#FF6384",
      },
    ],
  };

  // Rendu du graphique à barres avec les données préparées
  return <Bar data={data} />;
};

export default MonthlyBarChart;
