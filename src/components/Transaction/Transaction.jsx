import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import "./Transaction.css";
import alimentation from "../../assets/alimentation.png";
import logement from "../../assets/logement.png";
import loisirs from "../../assets/loisirs.png";
import sante from "../../assets/sante.png";
import transport from "../../assets/transport.png";
import divertissement from "../../assets/divertissement.png";
import autre from "../../assets/autre.png";
import carte from "../../assets/carte.png";

export const imageMapping = {
  1: alimentation,
  2: logement,
  3: loisirs,
  4: sante,
  5: transport,
  6: divertissement,
  7: autre,
  credit: carte,
};

const Transaction = ({ transactions, onDeleteTransaction }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const reversedTransactions = [...transactions].reverse();
  const totalPages = Math.ceil(reversedTransactions.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const displayedTransactions = reversedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="transaction-container">
      {displayedTransactions.length > 0 ? (
        <>
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
              {displayedTransactions.map((transaction) => (
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
                    {new Date(
                      transaction.transaction_date
                    ).toLocaleDateString()}
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

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`page-button ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="no-data-message">
          <h2>Aucune donnée disponible</h2>
          <p>
            Vous n'avez pas encore de transactions. Veuillez effectuer des
            transactions pour visualiser la liste des transactions.
          </p>
        </div>
      )}
    </div>
  );
};

export default Transaction;
