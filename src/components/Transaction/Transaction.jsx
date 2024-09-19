// Transaction.jsx

import React from "react";
import { FaTrash } from "react-icons/fa";
import "./Transaction.css";

const imageMapping = {
  1: "src/assets/alimentation.png",
  2: "src/assets/logement.png",
  3: "src/assets/loisirs.png",
  4: "src/assets/sante.png",
  5: "src/assets/transport.png",
  6: "src/assets/divertissement.png",
  7: "src/assets/autre.png",
  credit: "src/assets/carte.png",
  default: "/assets/default_image.png",
};

const Transaction = ({ transactions, onDeleteTransaction }) => {
  const reversedTransactions = [...transactions].reverse();

  return (
    <div className="transaction-container">
      {reversedTransactions.length > 0 ? (
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Catégorie</th>
              <th>Description</th>
              <th>Méthode</th>
              <th>Date</th>
              <th>Montant</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reversedTransactions.map((transaction) => (
              <tr key={transaction.id} className="transaction-row">
                <td data-label="Catégorie">
                  <img
                    src={
                      transaction.transaction_type === "credit"
                        ? imageMapping.credit
                        : imageMapping[transaction.id_category] ||
                          imageMapping.default
                    }
                    alt="Icône"
                    className="icon"
                  />
                </td>
                <td data-label="Description">
                  {transaction.description || "N/A"}
                </td>
                <td data-label="Méthode">
                  {transaction.transaction_type === "credit"
                    ? "Crédit"
                    : "Débit"}
                </td>
                <td data-label="Date">
                  {new Date(transaction.transaction_date).toLocaleDateString()}
                </td>
                <td
                  data-label="Montant"
                  className={
                    transaction.transaction_type === "credit"
                      ? "amount-positive"
                      : "amount-negative"
                  }
                >
                  {transaction.transaction_type === "credit"
                    ? `+${transaction.amount}€`
                    : `-${transaction.amount}€`}
                </td>
                <td data-label="">
                  <span
                    className="delete-icon"
                    onClick={() => onDeleteTransaction(transaction.id)}
                  >
                    <FaTrash />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-transaction">Aucune transaction disponible</div>
      )}
    </div>
  );
};

export default Transaction;
