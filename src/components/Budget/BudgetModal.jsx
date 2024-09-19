import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fetchCategories } from "../../api/transactionService";
import "./BudgetPage.css";

// Composant pour afficher un modal de création de budget
const BudgetModal = ({
  isOpen, // État pour déterminer si le modal est ouvert ou fermé
  onClose, // Fonction pour fermer le modal
  handleSubmit, // Fonction pour gérer la soumission du formulaire
  newBudget, // Données du nouveau budget
  handleInputChange, // Fonction pour gérer les changements dans les champs du formulaire
}) => {
  // État local pour stocker les catégories et l'état de chargement
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Effet pour récupérer les catégories lorsque le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      const fetchCategoriesData = async () => {
        try {
          // Récupère le token depuis le stockage local
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("Token non trouvé");
          }
          // Récupère les catégories depuis l'API
          const data = await fetchCategories(token);
          setCategories(data); // Met à jour l'état avec les catégories récupérées
        } catch (error) {
          toast.error("Erreur lors de la récupération des catégories");
        } finally {
          setLoading(false); // Met fin à l'état de chargement
        }
      };
      fetchCategoriesData();
    }
  }, [isOpen]); // Dépendance sur isOpen pour déclencher l'effet lorsque le modal s'ouvre

  // Retourne null si le modal n'est pas ouvert
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Créer un nouveau budget</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="limitAmount">Montant Limite (€):</label>
            <input
              type="number"
              id="limitAmount"
              name="limitAmount"
              value={newBudget.limitAmount}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="id_category">Catégorie :</label>
            {loading ? (
              <p>Chargement des catégories...</p>
            ) : (
              <select
                id="id_category"
                name="id_category"
                value={newBudget.id_category}
                onChange={handleInputChange}
                required
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name_category}
                  </option>
                ))}
              </select>
            )}
          </div>
          <button type="submit" className="btn-primary">
            Créer Budget
          </button>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Annuler
          </button>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
