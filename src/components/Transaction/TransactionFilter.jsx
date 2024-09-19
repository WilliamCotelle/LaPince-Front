import React, { useState } from "react";
import "./Transaction.css"; // Assurez-vous que le CSS est bien lié
const categoryMapping = {
  1: "alimentation",
  2: "logement",
  3: "loisirs",
  4: "santé",
  5: "transport",
  6: "divertissement",
  7: "autre",
  8: "crédit",
};
const iconMapping = {
  1: "src/assets/alimentation.png",
  2: "src/assets/logement.png",
  3: "src/assets/loisirs.png",
  4: "src/assets/sante.png",
  5: "src/assets/transport.png",
  6: "src/assets/divertissement.png",
  7: "src/assets/autre.png",
  8: "src/assets/carte.png",
  default: "src/assets/default_image.png",
};
const TransactionFilter = ({ onFilter, onCategoryChange, onSearchChange }) => {
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  // Gestion de la recherche par description
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    onSearchChange(term); // Appelle la fonction pour filtrer les transactions par description
  };
  // Gestion de la catégorie sélectionnée
  const handleCategoryChange = (categoryId) => {
    // Convertir categoryId en nombre
    const categoryIdNumber = Number(categoryId);
    const selectedCategoryNumber = Number(selectedCategory);
    // Comparaison des catégories comme nombres
    if (selectedCategoryNumber === categoryIdNumber) {
      // Si la catégorie est déjà sélectionnée, on la "décochera" (réinitialisation)
      setSelectedCategory("");
      onCategoryChange(""); // Aucune catégorie sélectionnée
    } else {
      // Sinon, on sélectionne la nouvelle catégorie
      setSelectedCategory(categoryIdNumber);
      onCategoryChange(categoryIdNumber); // Envoie la nouvelle catégorie au parent
    }
  };
  const handleFilter = (filterType) => {
    onFilter(filterType);
  };
  return (
    <div className="transaction-filter-container">
      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher par description"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />
      {/* Bouton pour afficher/fermer le menu des catégories */}
      <button
        className="category-toggle-button compact"
        onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
      >
        {isCategoryMenuOpen ? "Fermer Catégories" : "Choisir une Catégorie"}
      </button>
      {/* Menu des catégories */}
      {isCategoryMenuOpen && (
        <div className="category-dropdown">
          {Object.keys(categoryMapping).map((key) => (
            <img
              key={key}
              src={iconMapping[key] || iconMapping.default}
              alt={categoryMapping[key]}
              className={`category-icon ${
                selectedCategory === Number(key) ? "selected" : ""
              }`}
              onClick={() => handleCategoryChange(key)} // Passer l'ID au lieu du nom
              title={categoryMapping[key]}
            />
          ))}
        </div>
      )}
      {/* Filtres de date */}
      <button
        className="filter-button"
        onClick={() => handleFilter("thisMonth")}
      >
        Ce mois
      </button>
      <button
        className="filter-button"
        onClick={() => handleFilter("lastMonth")}
      >
        Le mois dernier
      </button>
      {/* Sélecteur de date */}
      <input
        type="date"
        className="filter-date-input"
        onChange={(e) => handleFilter(e.target.value)}
        placeholder="Sélectionner une date"
      />
      {/* Bouton de réinitialisation */}
      <button
        className="filter-button reset-button"
        onClick={() => handleFilter("reset")}
      >
        Réinitialiser
      </button>
    </div>
  );
};
export default TransactionFilter;
