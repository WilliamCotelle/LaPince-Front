// ConfirmModal.jsx
import React from "react";
// Ajoute du style si nécessaire

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  transactionDescription,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirmer la suppression</h2>
        <p>
          Êtes-vous sûr de vouloir supprimer cette transaction : "
          {transactionDescription}" ?
        </p>
        <div className="modal-actions">
          <button className="confirm-btn" onClick={onConfirm}>
            Oui, supprimer
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
