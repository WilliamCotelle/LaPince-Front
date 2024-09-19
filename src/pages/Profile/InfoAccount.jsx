import React, { useState } from "react";
import "./ProfileCard.css";
import { ToastContainer, toast } from "react-toastify"; // Importer toast de React Toastify

const InfoAccount = ({ accounts, refreshAccounts, user_id }) => {
  const [newAccountName, setNewAccountName] = useState("");
  const [editingAccountId, setEditingAccountId] = useState(null);
  const [editedAccountName, setEditedAccountName] = useState("");

  const handleDeleteAccount = async (accountId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/bank-accounts/${accountId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Compte supprimé avec succès.");
        refreshAccounts(); // Rafraîchir la liste des comptes
      } else {
        toast.error("Erreur lors de la suppression du compte.");
      }
    } catch (error) {
      toast.error("Erreur réseau ou serveur.");
    }
  };

  const handleRenameAccount = async (accountId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/bank-accounts/${accountId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: editedAccountName }),
        }
      );

      if (response.ok) {
        toast.success("Compte renommé avec succès.");
        setEditingAccountId(null); // Sortir du mode édition
        refreshAccounts(); // Rafraîchir la liste des comptes
      } else {
        toast.error("Erreur lors du renommage du compte.");
      }
    } catch (error) {
      toast.error("Erreur réseau ou serveur.");
    }
  };

  const handleAddAccount = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/bank-accounts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newAccountName,
            initial_balance: 0,
            id_user: user_id,
          }),
        }
      );

      if (response.ok) {
        toast.success("Compte ajouté avec succès.");
        setNewAccountName(""); // Réinitialiser le champ de texte
        refreshAccounts(); // Rafraîchir la liste des comptes
      } else {
        toast.error("Erreur lors de l'ajout du compte.");
      }
    } catch (error) {
      toast.error("Erreur réseau ou serveur.");
    }
  };

  return (
    <div className="profile-card">
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
        transition:Bounce
      />
      <div className="profile-card-body">
        <h4 className="title">Comptes et Soldes</h4>
        {accounts && accounts.length > 0 ? (
          <ul className="account-list">
            {accounts.map((account) => (
              <li key={account.id} className="account-item">
                {editingAccountId === account.id ? (
                  <input
                    type="text"
                    value={editedAccountName}
                    onChange={(e) => setEditedAccountName(e.target.value)}
                    className="input-edit"
                  />
                ) : (
                  <span className="account-name">{account.name}</span>
                )}
                <span className="account-balance_dash">
                  {account.initial_balance !== "NaN"
                    ? parseFloat(account.initial_balance).toLocaleString(
                        "fr-FR",
                        { style: "currency", currency: "EUR" }
                      )
                    : "Non disponible"}
                </span>
                {editingAccountId === account.id ? (
                  <>
                    <button
                      onClick={() => handleRenameAccount(account.id)}
                      className="button save-btn"
                    >
                      Enregistrer
                    </button>
                    <button
                      onClick={() => setEditingAccountId(null)}
                      className="button cancel-btn"
                    >
                      Annuler
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingAccountId(account.id);
                        setEditedAccountName(account.name);
                      }}
                      className="button edit-btn"
                    >
                      Renommer
                    </button>
                    <button
                      onClick={() => handleDeleteAccount(account.id)}
                      className="button delete-btn"
                    >
                      Supprimer
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun compte trouvé</p>
        )}
        <div className="add-account">
          <input
            type="text"
            value={newAccountName}
            onChange={(e) => setNewAccountName(e.target.value)}
            className="input-add"
            placeholder="Nom du nouveau compte"
          />
          <button onClick={handleAddAccount} className="button add-btn">
            Ajouter un compte
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoAccount;
