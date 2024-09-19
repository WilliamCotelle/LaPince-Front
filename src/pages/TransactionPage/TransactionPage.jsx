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

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchBankAccounts = async () => {
      try {
        const response = await fetchDashboardData(token);
        const accounts = response.user.bankAccounts;
        setBankAccounts(accounts);
        setUser(response.user);

        if (accounts.length > 0 && !selectedAccount) {
          const initialAccount = accounts[0].id;
          setSelectedAccount(initialAccount);
          setIsLoading(false);
        }
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

  const handleFilter = (filterType) => {
    if (filterType === "reset") {
      setFilteredTransactions(transactions);
      setIsLoading(false);
      return;
    }

    const currentDate = new Date();
    let filtered = [];

    if (filterType === "thisMonth") {
      filtered = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.transaction_date);
        return (
          transactionDate.getMonth() === currentDate.getMonth() &&
          transactionDate.getFullYear() === currentDate.getFullYear()
        );
      });
    } else if (filterType === "lastMonth") {
      const lastMonthDate = new Date();
      lastMonthDate.setMonth(currentDate.getMonth() - 1);
      filtered = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.transaction_date);
        return (
          transactionDate.getMonth() === lastMonthDate.getMonth() &&
          transactionDate.getFullYear() === lastMonthDate.getFullYear()
        );
      });
    } else {
      filtered = transactions.filter((transaction) => {
        const transactionDate = new Date(
          transaction.transaction_date
        ).toDateString();
        return transactionDate === new Date(filterType).toDateString();
      });
    }

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
    filterTransactions(searchTerm, selectedCategory);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    filterTransactions(searchTerm, categoryId);
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
