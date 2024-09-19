import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Enregistre les composants nécessaires de Chart.js pour le graphique linéaire
ChartJS.register(LineElement, CategoryScale, LinearScale, Tooltip, Legend);

// Composant pour afficher un graphique linéaire des transactions au fil du temps
const TransactionLineChart = ({ transactions }) => {
  // Prépare les données pour le graphique
  const data = {
    // Labels pour l'axe des X : dates uniques extraites des transactions
    labels: [...new Set(transactions.map((tx) => tx.date))],
    datasets: [
      {
        // Dataset pour les montants des transactions
        label: "Transactions au fil du temps",
        // Données pour chaque date : montants des transactions
        data: transactions.map((tx) => tx.amount),
        // Couleur de la bordure de la ligne
        borderColor: "#36A2EB",
        // Couleur de fond sous la ligne
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        // Remplit la zone sous la ligne
        fill: true,
      },
    ],
  };

  // Rendu du graphique linéaire avec les données préparées
  return <Line data={data} />;
};

export default TransactionLineChart;
