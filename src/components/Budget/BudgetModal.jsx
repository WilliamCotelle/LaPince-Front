import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fetchCategories } from "../../api/transactionService";
import "./BudgetPage.css";

const BudgetModal = ({
  isOpen,
  onClose,
  handleSubmit,
  newBudget,
  handleInputChange,
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchCategoriesData = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("Token non trouvé");
          }
          const data = await fetchCategories(token);
          setCategories(data);
        } catch (error) {
          toast.error("Erreur lors de la récupération des catégories");
        } finally {
          setLoading(false);
        }
      };
      fetchCategoriesData();
    }
  }, [isOpen]);

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
