import React, { useState, useEffect, useMemo } from "react";
import Header from "../../components/Dashboard/DashHeader/DashHeader.jsx";
import Card from "../../components/Dashboard/Card/Card.jsx";
import CTAButton from "../../components/Dashboard/CTAButtons/CTAButton";
import TransactionModal from "../../components/Dashboard/TransactionModal/TransactionModal";
import CategoryDoughnutChart from "../../components/Dashboard/CategoryDougnutChart.jsx";
import Transaction from "../../components/Transaction/Transaction";
import {
  fetchDashboardData,
  fetchTransactions,
} from "../../api/dashboardService";
import { deleteTransaction } from "../../api/transactionService";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Dashboard.css";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.jsx";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [income, setIncome] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialTransactionType, setInitialTransactionType] =
    useState("credit");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAccountName, setSelectedAccountName] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Chargement initial du dashboard et des données de l'utilisateur
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchDashboardData(token)
      .then((data) => {
        setUser(data.user);
        setBankAccounts(data.user.bankAccounts);
        if (data.user.bankAccounts.length > 0) {
          const initialAccount = data.user.bankAccounts[0];
          setSelectedAccount(initialAccount.id);
          setBalance(parseFloat(initialAccount.initial_balance));
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des données :", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  // Met à jour les dépenses et les revenus à chaque changement de compte sélectionné
  useEffect(() => {
    if (selectedAccount) {
      updateExpensesAndIncome(selectedAccount);
    }
  }, [selectedAccount]);

  // Fonction pour mettre à jour les dépenses et revenus
  const updateExpensesAndIncome = async (accountId) => {
    const token = localStorage.getItem("token");

    try {
      const transactionData = await fetchTransactions(token, accountId);
      setTransactions(transactionData);

      const updatedExpenses = transactionData
        .filter((tx) => tx.transaction_type === "debit")
        .reduce((acc, tx) => acc + parseFloat(tx.amount), 0);
      const updatedIncome = transactionData
        .filter((tx) => tx.transaction_type === "credit")
        .reduce((acc, tx) => acc + parseFloat(tx.amount), 0);

      setExpenses(updatedExpenses.toFixed(2));
      setIncome(updatedIncome.toFixed(2));
      // Mettre à jour le solde du compte ici si nécessaire
    } catch (err) {
      console.error(
        "Erreur lors de la mise à jour des dépenses et revenus :",
        err
      );
    }
  };

  const handleAccountChange = (accountId) => {
    // Convertir l'ID en chaîne si nécessaire pour éviter les erreurs de comparaison
    const normalizedAccountId = String(accountId);

    // Trouver le compte correspondant
    const selectedBankAccount = bankAccounts.find(
      (account) => String(account.id) === normalizedAccountId // Comparaison en tant que chaînes
    );

    if (selectedBankAccount) {
      setBalance(parseFloat(selectedBankAccount.initial_balance));
      setSelectedAccountName(selectedBankAccount.name);
    } else {
      console.error(
        "Compte bancaire non trouvé pour l'ID :",
        normalizedAccountId
      );
    }

    // Met à jour l'ID du compte sélectionné
    setSelectedAccount(accountId);
  };

  const handleOpenModal = (type) => {
    setInitialTransactionType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleDeleteTransaction = async (transactionId) => {
    const token = localStorage.getItem("token");
    const result = await deleteTransaction(transactionId, token);

    if (result.success) {
      setTransactions(
        transactions.filter((transaction) => transaction.id !== transactionId)
      );
    } else {
      console.error(
        "Erreur lors de la suppression de la transaction:",
        result.message
      );
    }
  };
  const handleTransactionCreated = async (transaction) => {
    const token = localStorage.getItem("token");
    try {
      const data = await fetchDashboardData(token);
      setBankAccounts(data.user.bankAccounts);

      const updatedAccount = data.user.bankAccounts.find(
        (account) => account.id === transaction.id_bank_account
      );
      if (updatedAccount) {
        setSelectedAccount(updatedAccount.id);
        setBalance(parseFloat(updatedAccount.initial_balance));
        updateExpensesAndIncome(updatedAccount.id);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour après transaction :", error);
    }
  };
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    // Nettoyage de l'écouteur lors du démontage du composant
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const cards = [
    {
      title: "Solde",
      value: parseFloat(balance).toLocaleString(),
    },
    {
      title: "Rentrées d'argent",
      value: parseFloat(income).toLocaleString(),
    },
    {
      title: "Dépenses",
      value: parseFloat(expenses).toLocaleString(),
    },
  ];

  const recentTransactions = useMemo(() => {
    return transactions.slice(-8);
  }, [transactions]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p>Erreur: {error}</p>;
  }

  return (
    <div className="dashboard">
      {/* Conteneur parent pour la grille */}
      <div className="parent">
        {/* Div 1: Header */}
        <div className="div1">
          <Header
            user={user}
            bankAccounts={bankAccounts}
            onAccountChange={handleAccountChange}
          />
        </div>
        {/* Div2, Div3, Div4: Cards section (Grid for Desktop, Carousel for Mobile) */}
        {!isMobile ? (
          <>
            <div className="div2">
              <Card title={cards[0].title} value={cards[0].value} />
            </div>
            <div className="div3">
              <Card title={cards[1].title} value={cards[1].value} />
            </div>
            <div className="div4">
              <Card title={cards[2].title} value={cards[2].value} />
            </div>
          </>
        ) : (
          <div className="carousel">
            <Slider {...settings}>
              {cards.map((card, index) => (
                <div key={index}>
                  <Card title={card.title} value={card.value} />
                </div>
              ))}
            </Slider>
          </div>
        )}
        {/* Div 6: Boutons pour ajouter un revenu et une dépense */}
        <div className="div6">
          <div className="actions">
            <CTAButton
              type="income"
              onClick={() => handleOpenModal("credit")}
            />
            <CTAButton
              type="expense"
              onClick={() => handleOpenModal("debit")}
            />
          </div>
        </div>
        {/* Div 5: Doughnut Chart */}
        <div className="div5">
          <CategoryDoughnutChart transactions={transactions} />
        </div>
        {/* Div 7: Tableau des transactions */}
        <div className="div7">
          <Transaction
            transactions={recentTransactions}
            onDeleteTransaction={handleDeleteTransaction}
          />
        </div>{" "}
        {/* Fin du conteneur parent */}
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        bankAccounts={bankAccounts}
        onTransactionCreated={handleTransactionCreated}
        initialTransactionType={initialTransactionType}
        selectedAccount={selectedAccount}
        selectedAccountName={selectedAccountName}
      />
    </div>
  );
};

export default Dashboard;
