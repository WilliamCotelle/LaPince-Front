import React, { useState, useEffect, useRef, useMemo } from "react";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
} from "chart.js";
import {
  fetchDashboardData,
  fetchTransactions,
} from "../../api/dashboardService";
import { fetchCategories } from "../../api/transactionService";
import Header from "../../components/Dashboard/DashHeader/DashHeader"; // Import du Header
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import "./AnalysisPage.css";
import { useBankContext } from "../../context/BankContext";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler
);

const Analysis = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const { selectedAccount, setSelectedAccount } = useBankContext();
  const [bankAccounts, setBankAccounts] = useState([]);
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);

  const doughnutChartRef = useRef(null);
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);

  // Charger les comptes bancaires et les données utilisateur
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchDashboardAndCategories = async () => {
      try {
        const dashboardData = await fetchDashboardData(token);
        const accounts = dashboardData.user.bankAccounts;
        setBankAccounts(accounts);
        setUser(dashboardData.user);

        if (accounts.length > 0 && !selectedAccount) {
          const accountId = accounts[0].id;
          setSelectedAccount(accountId); // Si aucun compte sélectionné, on prend le premier
          const transactionsData = await fetchTransactions(token, accountId);
          setTransactions(transactionsData);
        } else if (selectedAccount) {
          const transactionsData = await fetchTransactions(
            token,
            selectedAccount
          ); // Si un compte est déjà sélectionné, on l'utilise
          setTransactions(transactionsData);
        }

        const categoriesData = await fetchCategories(token);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        setError(error.message);
      }
    };

    fetchDashboardAndCategories();
  }, []);

  // Fonction pour gérer le changement de compte dans le Header
  const handleAccountChange = async (accountId) => {
    setSelectedAccount(accountId);
    const token = localStorage.getItem("token");

    try {
      const transactionsData = await fetchTransactions(token, accountId);
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions:", error);
      setError(error.message);
    }
  };

  // Générer les données des graphiques (Doughnut, Bar, Line) en fonction des transactions
  const categoryChartData = useMemo(() => {
    if (!transactions.length || !categories.length) return null;

    const categoryMap = {};
    transactions.forEach((transaction) => {
      if (transaction.transaction_type === "debit") {
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
      }
    });

    const sortedCategories = Object.entries(categoryMap).sort(
      (a, b) => b[1] - a[1]
    );
    const topCategories = sortedCategories.slice(0, 6);

    return {
      labels: topCategories.map(([name]) => name),
      datasets: [
        {
          data: topCategories.map(([_, value]) => value),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
          hoverBackgroundColor: [
            "#FF6384B3",
            "#36A2EBB3",
            "#FFCE56B3",
            "#4BC0C0B3",
            "#9966FFB3",
            "#FF9F40B3",
          ],
        },
      ],
    };
  }, [transactions, categories]);

  const barChartData = useMemo(() => {
    if (!transactions.length) return null;

    const monthlyData = transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.transaction_date).getMonth();
      const year = new Date(transaction.transaction_date).getFullYear();
      const monthYear = `${year}-${month + 1}`;

      if (!acc[monthYear]) {
        acc[monthYear] = { credit: 0, debit: 0 };
      }

      if (transaction.transaction_type === "credit") {
        acc[monthYear].credit += parseFloat(transaction.amount);
      } else if (transaction.transaction_type === "debit") {
        acc[monthYear].debit += parseFloat(transaction.amount);
      }

      return acc;
    }, {});

    const months = Object.keys(monthlyData);
    const credits = months.map((month) => monthlyData[month].credit);
    const debits = months.map((month) => monthlyData[month].debit);

    return {
      labels: months,
      datasets: [
        {
          label: "Revenus",
          data: credits,
          backgroundColor: "#36A2EB",
        },
        {
          label: "Dépenses",
          data: debits,
          backgroundColor: "#FF6384",
        },
      ],
    };
  }, [transactions]);

  const lineChartData = useMemo(() => {
    if (!transactions.length) return null;

    const monthlyData = transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.transaction_date).getMonth();
      const year = new Date(transaction.transaction_date).getFullYear();
      const monthYear = `${year}-${month + 1}`;

      if (!acc[monthYear]) {
        acc[monthYear] = { total: 0 };
      }

      acc[monthYear].total += parseFloat(transaction.amount);

      return acc;
    }, {});

    const months = Object.keys(monthlyData);
    const totals = months.map((month) => monthlyData[month].total);

    return {
      labels: months,
      datasets: [
        {
          label: "Total des Transactions",
          data: totals,
          borderColor: "#FF9F40",
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          fill: true,
        },
      ],
    };
  }, [transactions]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
  };

  if (error) {
    return <p>Erreur: {error}</p>;
  }

  return (
    <div className="analysis">
      {/* Ajout du Header avec gestion du changement de compte */}
      <Header
        user={user}
        bankAccounts={bankAccounts}
        onAccountChange={handleAccountChange}
      />
      <div className="charts-analysis">
        <div className="chart-container-analysis">
          <h2 className="chart-titles">Transactions Mensuelles</h2>
          {barChartData ? (
            <Bar ref={barChartRef} data={barChartData} options={chartOptions} />
          ) : (
            <LoadingSpinner />
          )}
        </div>
        <div className="chart-container-analysis">
          <h2 className="chart-titles">Répartition par Catégorie</h2>
          {categoryChartData ? (
            <Doughnut
              ref={doughnutChartRef}
              data={categoryChartData}
              options={chartOptions}
            />
          ) : (
            <LoadingSpinner />
          )}
        </div>
        <div className="chart-container-analysis">
          <h2 className="chart-titles">Total des Transactions Mensuelles</h2>
          {lineChartData ? (
            <Line
              ref={lineChartRef}
              data={lineChartData}
              options={chartOptions}
            />
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>
    </div>
  );
};

export default Analysis;
