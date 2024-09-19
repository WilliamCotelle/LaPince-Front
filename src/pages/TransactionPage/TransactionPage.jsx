import React, { useState, useEffect } from "react";
import Transaction from "../../components/Transaction/Transaction";
import TransactionFilter from "../../components/Transaction/TransactionFilter"; // Gère désormais la recherche et le filtre par catégorie
import {
  fetchDashboardData,
  fetchTransactions,
} from "../../api/dashboardService";
import { deleteTransaction } from "../../api/transactionService";
import Header from "../../components/Dashboard/DashHeader/DashHeader";
import "./TransactionPage.css";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { useBankContext } from "../../context/BankContext";
const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const { selectedAccount, setSelectedAccount } = useBankContext();
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchBankAccounts = async () => {
      try {
        const response = await fetchDashboardData(token);
        const accounts = response.user.bankAccounts;
        setBankAccounts(accounts);
        setUser(response.user);
        setIsLoading(false);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des comptes bancaires:",
          error
        );
      }
    };

    fetchBankAccounts();
  }, [selectedAccount]);

  const handleDeleteTransaction = async (id) => {
    const token = localStorage.getItem("token");

    // Appeler le service pour supprimer la transaction
    const result = await deleteTransaction(id, token);

    if (result.success) {
      setTransactions(
        transactions.filter((transaction) => transaction.id !== id)
      );
      setFilteredTransactions(
        filteredTransactions.filter((transaction) => transaction.id !== id)
      );
    } else {
      console.error(
        "Erreur lors de la suppression de la transaction:",
        result.message
      );
    }
  };

  useEffect(() => {
    if (selectedAccount) {
      fetchTransactionsByAccount(selectedAccount);
    }
  }, [selectedAccount]);

  const fetchTransactionsByAccount = async (accountId) => {
    try {
      const token = localStorage.getItem("token");
      const data = await fetchTransactions(token, accountId);
      setTransactions(data);
      setFilteredTransactions(data); // Mettre à jour les transactions filtrées
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions:", error);
    }
  };
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    handleFilter({ searchTerm, category: selectedCategory, month });
  };
  const handleFilter = (filterCriteria) => {
    if (filterCriteria === "reset") {
      setFilteredTransactions(transactions);
      return;
    }

    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.transaction_date);
      const transactionMonth = transactionDate.getMonth() + 1; // Les mois commencent à 0 en JavaScript

      let categoryMatch = true;
      let searchMatch = true;
      let monthMatch = true;

      if (typeof filterCriteria === "object") {
        // Nouveau format de filtre
        categoryMatch =
          !filterCriteria.category ||
          mapCategory(transaction) === parseInt(filterCriteria.category);
        searchMatch =
          !filterCriteria.searchTerm ||
          transaction.description
            .toLowerCase()
            .includes(filterCriteria.searchTerm.toLowerCase());
        monthMatch =
          !filterCriteria.month ||
          transactionMonth === parseInt(filterCriteria.month);
      } else if (filterCriteria === "thisMonth") {
        const currentDate = new Date();
        monthMatch =
          transactionDate.getMonth() === currentDate.getMonth() &&
          transactionDate.getFullYear() === currentDate.getFullYear();
      } else if (filterCriteria === "lastMonth") {
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        monthMatch =
          transactionDate.getMonth() === lastMonthDate.getMonth() &&
          transactionDate.getFullYear() === lastMonthDate.getFullYear();
      } else if (typeof filterCriteria === "string") {
        // Filtre par date spécifique
        monthMatch =
          transactionDate.toDateString() ===
          new Date(filterCriteria).toDateString();
      }

      return categoryMatch && searchMatch && monthMatch;
    });

    setFilteredTransactions(filtered);
  };

  const mapCategory = (transaction) => {
    if (transaction.transaction_type === "credit") {
      return 8; // ID de la catégorie "Crédit"
    }
    return transaction.id_category;
  };

  const handleSearchChange = (searchTerm) => {
    setSearchTerm(searchTerm);
    handleFilter({ searchTerm, category: selectedCategory, month: "" });
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    handleFilter({ searchTerm, category: categoryId, month: "" });
  };

  const filterTransactions = (term, categoryId) => {
    const filtered = transactions.filter((transaction) => {
      const descriptionMatches = transaction.description
        .toLowerCase()
        .includes(term.toLowerCase());

      const mappedCategory = mapCategory(transaction);

      const categoryMatches =
        categoryId === "" || mappedCategory === parseInt(categoryId);

      return descriptionMatches && categoryMatches;
    });

    setFilteredTransactions(filtered);
  };

  const handleAccountChange = (accountId) => {
    setSelectedAccount(accountId);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="transaction-page">
      <Header
        user={user}
        bankAccounts={bankAccounts}
        onAccountChange={handleAccountChange}
      />

      {/* Utilisation de TransactionFilter pour les filtres et la recherche */}
      <TransactionFilter
        onFilter={handleFilter}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onMonthChange={handleMonthChange}
      />

      {filteredTransactions.length > 0 ? (
        <Transaction
          transactions={filteredTransactions}
          onDeleteTransaction={handleDeleteTransaction}
        />
      ) : (
        <p>Aucune transaction disponible.</p>
      )}
    </div>
  );
};

export default TransactionsPage;
