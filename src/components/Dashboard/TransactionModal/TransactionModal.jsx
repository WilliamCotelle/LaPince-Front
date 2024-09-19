import React, { useState, useEffect } from "react";
import {
  fetchCategories,
  createTransaction,
} from "../../../api/transactionService";
import "./TransactionModal.css";
import Calculator from "../Calculator/Calculator";

// Importer les icônes
import alimentationIcon from "../../../assets/alimentation.png";
import logementIcon from "../../../assets/logement.png";
import loisirsIcon from "../../../assets/loisirs.png";
import santeIcon from "../../../assets/sante.png";
import transportIcon from "../../../assets/transport.png";

// Dictionnaire pour mapper les catégories aux icônes
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
  const [description, setDescription] = useState(""); // Nouveau champ pour la description
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
      setAmount(""); // Réinitialise le montant à chaque ouverture
      setDescription(""); // Réinitialise la description à chaque ouverture
    }
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose(); // Ferme la modal si on clique en dehors
    }
  };

  // Empêche la saisie de valeurs négatives dans le champ de montant
  const handleAmountChange = (e) => {
    const value = e.target.value;

    // Vérifie que la valeur est un nombre valide et positif
    if (!isNaN(value) && Number(value) >= 0) {
      setAmount(value); // Met à jour seulement si la valeur est positive ou zéro
    }
  };

  const handleCreateTransaction = async () => {
    try {
      // Vérifier que la catégorie est obligatoire si le type de transaction est 'debit'
      if (transactionType === "debit" && !categoryId) {
        setError("Veuillez sélectionner une catégorie pour les dépenses.");
        return; // Arrête l'exécution si la catégorie n'est pas sélectionnée
      }

      const token = localStorage.getItem("token");
      const transactionData = {
        id_bank_account: selectedAccount,
        transaction_type: transactionType,
        amount: parseFloat(amount),
        id_category: transactionType === "debit" ? categoryId : null,
        description, // Inclure la description
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
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          ×
        </button>
        <h3>Ajouter une transaction pour {selectedAccountName}</h3>
        {error && <p className="error-message">{error}</p>}

        {transactionType === "debit" && (
          <select
            className="modal-option"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option className="modal-option" value="">
              Sélectionnez une catégorie
            </option>
            {categories.map((category) => (
              <option
                className="modal-option"
                key={category.id}
                value={category.id}
              >
                {category.name_category}
              </option>
            ))}
          </select>
        )}

        <input
          className="modal-input"
          type="text"
          value={amount}
          onChange={handleAmountChange} // Utilise handleAmountChange ici
          placeholder="Montant"
          onKeyDown={(e) => {
            if (e.key === "-" || e.key === "e" || e.key === "+") {
              e.preventDefault(); // Empêche la saisie du caractère "-" et de "e"
            }
          }}
        />

        <input
          className="modal-input"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optionnelle)"
        />

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
  );
};

export default TransactionModal;
