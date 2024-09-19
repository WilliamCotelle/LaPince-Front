import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  fetchBudgets,
  createBudget,
  deleteBudget,
  fetchTransactionsByCategory,
} from "../../api/budgetService";
import { fetchDashboardData } from "../../api/dashboardService";
import BudgetProgress from "../../components/Budget/BudgetProgress";
import BudgetModal from "../../components/Budget/BudgetModal";
import Header from "../../components/Dashboard/DashHeader/DashHeader";
import "react-toastify/dist/ReactToastify.css";
import "./BudgetPage.css";
import { useBankContext } from "../../context/BankContext";
const BudgetPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({
    limitAmount: "",
    id_category: "",
  });
  const [showMore, setShowMore] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const { selectedAccount, setSelectedAccount } = useBankContext();
  const [bankAccounts, setBankAccounts] = useState([]);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const budgetColors = ["#3f51b5"];

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const dashboardData = await fetchDashboardData(token);
        const accounts = dashboardData.user.bankAccounts;
        setBankAccounts(accounts);
        setUser(dashboardData.user);

        if (accounts.length > 0 && !selectedAccount) {
          const accountId = accounts[0].id;
          setSelectedAccount(accountId);
          await loadBudgets(accountId);
        } else if (selectedAccount) {
          // If an account is already selected (from context or elsewhere), load the budgets for it
          await loadBudgets(selectedAccount);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, []);

  const loadBudgets = async (accountId) => {
    try {
      const budgets = await fetchBudgets(accountId);
      const budgetsWithTransactions = await Promise.all(
        budgets.map(async (budget) => {
          const transactionsData = await fetchTransactionsByCategory(
            budget.id_category,
            accountId
          );
          return {
            ...budget,
            transactions: transactionsData?.transactions || [],
            totalSpent: transactionsData?.totalSpent || 0,
            remainingBudget:
              transactionsData?.remainingBudget || budget.limitAmount,
          };
        })
      );
      setBudgets(budgetsWithTransactions);
    } catch (error) {
      console.error("Erreur lors de la récupération des budgets:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBudget({ ...newBudget, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const existingBudget = budgets.find(
      (budget) => Number(budget.id_category) === Number(newBudget.id_category)
    );
    if (existingBudget) {
      toast.error("Un budget existe déjà pour cette catégorie.");
      return;
    }
    try {
      const createdBudget = await createBudget(selectedAccount, newBudget);
      if (createdBudget) {
        await loadBudgets(selectedAccount); // Recharger les budgets
        setModalOpen(false);
        setNewBudget({ limitAmount: "", id_category: "" });
        toast.success("Budget créé avec succès !");
      }
    } catch (error) {
      console.error("Erreur lors de la création du budget:", error);
      toast.error("Erreur lors de la création du budget");
    }
  };

  const handleDeleteBudget = async (id) => {
    try {
      await deleteBudget(id);
      await loadBudgets(selectedAccount);
      toast.success("Budget supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression du budget:", error);
      toast.error("Erreur lors de la suppression du budget");
    }
  };

  const handleAccountChange = async (accountId) => {
    setSelectedAccount(accountId);
    await loadBudgets(accountId);
  };

  return (
    <div className="budget-page">
      <Header
        user={user}
        bankAccounts={bankAccounts}
        onAccountChange={handleAccountChange}
      />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <button className="btn-primary" onClick={() => setModalOpen(true)}>
        Créer un nouveau budget
      </button>

      <div className="budgets-list">
        {budgets
          .slice(0, showMore ? budgets.length : 3)
          .map((budget, index) => (
            <BudgetProgress
              key={budget.id}
              budget={budget}
              color={budgetColors[index % budgetColors.length]}
              onDelete={handleDeleteBudget}
            />
          ))}
      </div>

      {budgets.length > 3 && (
        <button
          className="btn-secondary"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "Voir moins" : "Voir plus"}
        </button>
      )}

      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        handleSubmit={handleSubmit}
        newBudget={newBudget}
        handleInputChange={handleInputChange}
      />
    </div>
  );
};

export default BudgetPage;
