import React, { useMemo, useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { fetchCategories } from "../../api/transactionService";
import "./CategoryDoughnutChart.css";

// Enregistrez tous les composants nécessaires de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Filler);

const MAX_CATEGORIES = 6; // Nombre maximal de catégories à afficher

const CategoryDoughnutChart = ({ transactions }) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchCategoriesData = async () => {
      try {
        const categoriesData = await fetchCategories(token);
        setCategories(categoriesData);
        localStorage.setItem("categories", JSON.stringify(categoriesData));
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
        setError(error.message);
      }
    };

    fetchCategoriesData();
  }, []);

  const baseColors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
  ];

  const chartData = useMemo(() => {
    if (!transactions.length || !categories.length) return null;

    const categoryMap = {};
    let otherTotal = 0;

    transactions
      .filter((transaction) => transaction.transaction_type === "debit")
      .forEach((transaction) => {
        const category = categories.find(
          (cat) => cat.id === transaction.id_category
        );
        const categoryName = category
          ? category.name_category
          : "Non catégorisé";
        const amount = parseFloat(transaction.amount);

        if (!categoryMap[categoryName]) {
          categoryMap[categoryName] = 0;
        }
        categoryMap[categoryName] += amount;
      });

    let sortedCategories = Object.entries(categoryMap).sort(
      (a, b) => b[1] - a[1]
    );

    if (sortedCategories.length > MAX_CATEGORIES) {
      sortedCategories = sortedCategories.slice(0, MAX_CATEGORIES);
    }

    const categoryNames = sortedCategories.map(([name]) => name);
    const amounts = sortedCategories.map(([_, value]) => value);

    return {
      labels: categoryNames,
      datasets: [
        {
          data: amounts,
          backgroundColor: baseColors.slice(0, categoryNames.length),
          hoverBackgroundColor: baseColors
            .slice(0, categoryNames.length)
            .map((color) => `${color}B3`),
        },
      ],
    };
  }, [transactions, categories]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 200,
      },
      plugins: {
        legend: {
          display: false, // Masquer la légende intégrée
        },
        tooltip: {
          enabled: true,
          mode: "index",
          intersect: false,
          callbacks: {
            label: (context) => {
              const label = context.label || "";
              const value = context.raw || 0;
              return `${label}: ${value.toFixed(2)} €`;
            },
          },
        },
      },
    }),
    []
  );

  useEffect(() => {
    // Nettoyez le graphique à la destruction du composant
    return () => {
      const chart = ChartJS.getChart("categoryChart");
      if (chart) {
        chart.destroy();
      }
    };
  }, []);

  if (error) {
    return <p>Erreur: {error}</p>;
  }

  return chartData ? (
    <div className="chart-container card">
      <h3 className="chart-title">Dépenses par catégories</h3>
      <div className="chart-and-categories">
        <div className="doughnut-container">
          <Doughnut
            data={chartData}
            options={chartOptions}
            id="categoryChart"
          />
        </div>
        <div className="legend-container">
          {chartData.labels.map((label, index) => (
            <div key={index} className="legend-item">
              <div className="legend-left">
                <div
                  className="legend-color"
                  style={{
                    backgroundColor:
                      chartData.datasets[0].backgroundColor[index],
                  }}
                />
                <span className="legend-label">{label}</span>
              </div>
              <span className="legend-value">
                {chartData.datasets[0].data[index].toFixed(2)} €
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div className="no-transaction">Aucune transaction disponible</div>
  );
};

export default CategoryDoughnutChart;
