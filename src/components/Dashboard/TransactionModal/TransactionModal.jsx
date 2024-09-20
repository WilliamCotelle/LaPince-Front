import React, { useState, useEffect } from "react";
import {
  fetchCategories,
  createTransaction,
} from "../../../api/transactionService";
import "./TransactionModal.css";
import Calculator from "../Calculator/Calculator";

// Import icons
import alimentationIcon from "../../../assets/alimentation.png";
import logementIcon from "../../../assets/logement.png";
import loisirsIcon from "../../../assets/loisirs.png";
import santeIcon from "../../../assets/sante.png";
import transportIcon from "../../../assets/transport.png";

// Category icons mapping
const categoryIcons = {
  Alimentation: alimentationIcon,
  Logement: logementIcon,
  Loisirs: loisirsIcon,
  Santé: santeIcon,
  Transport: transportIcon,
};

const TransactionModal = ({
  isOpen,
  onClose,
  bankAccounts,
  onTransactionCreated,
  initialTransactionType,
  selectedAccount,
  selectedAccountName,
}) => {
  const [transactionType, setTransactionType] = useState(
    initialTransactionType || "credit"
  );
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setTransactionType(initialTransactionType || "credit");
  }, [initialTransactionType]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (transactionType === "debit") {
      fetchCategories(token)
        .then((data) => setCategories(data))
        .catch((err) => setError(err.message));
    }
  }, [transactionType]);

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setDescription("");
    }
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && Number(value) >= 0) {
      setAmount(value);
    }
  };

  const handleCreateTransaction = async () => {
    try {
      if (transactionType === "debit" && !categoryId) {
        setError("Veuillez sélectionner une catégorie pour les dépenses.");
        return;
      }

      const token = localStorage.getItem("token");
      const transactionData = {
        id_bank_account: selectedAccount,
        transaction_type: transactionType,
        amount: parseFloat(amount),
        id_category: transactionType === "debit" ? categoryId : null,
        description,
      };

      const transaction = await createTransaction(token, transactionData);

      onTransactionCreated(transaction);
      onClose();
      setError("");
    } catch (err) {
      setError(err.message);
      console.error("Erreur lors de la création de la transaction:", err);
    }
  };

  if (!isOpen) return null;

  const selectedCategory = categories.find((cat) => cat.id === categoryId);
  const iconSrc = selectedCategory
    ? categoryIcons[selectedCategory.name_category]
    : null;

  return (
    <div className="modal-overlay-dashboard" onClick={handleOverlayClick}>
      <div className="modal-content-dashboard">
        <button className="modal-close-button" onClick={onClose}>
          ×
        </button>
        <h3 className="modal-title">
          Ajouter une transaction pour {selectedAccountName}
        </h3>
        {error && <p className="error-message">{error}</p>}

        <div className="modal-form">
          {transactionType === "debit" && (
            <div className="form-group-modal">
              <label htmlFor="category" className="form-label-modal">
                Catégorie
              </label>
              <select
                id="category"
                className="modal-select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name_category}
                  </option>
                ))}
              </select>
              {iconSrc && (
                <img
                  src={iconSrc}
                  alt="Category Icon"
                  className="category-icon"
                />
              )}
            </div>
          )}

          <div className="form-group-modal">
            <label htmlFor="amount" className="form-label-modal">
              Montant
            </label>
            <input
              id="amount"
              className="modal-input"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Montant"
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e" || e.key === "+") {
                  e.preventDefault();
                }
              }}
            />
          </div>

          <div className="form-group-modal">
            <label htmlFor="description" className="form-label-modal">
              Description (optionnelle)
            </label>
            <input
              id="description"
              className="modal-input"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
          </div>

          <Calculator amount={amount} setAmount={setAmount} />

          <div className="modal-actions">
            <button className="add-button" onClick={handleCreateTransaction}>
              Ajouter
            </button>
            <button onClick={onClose} className="cancel-button">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
