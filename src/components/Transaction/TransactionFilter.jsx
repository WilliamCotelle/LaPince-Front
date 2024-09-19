import React, { useState } from "react";
import "./Transaction.css"; // Assurez-vous que le CSS est bien lié

// Importation des images
import alimentationIcon from "../../assets/alimentation.png";
import logementIcon from "../../assets/logement.png";
import loisirsIcon from "../../assets/loisirs.png";
import santeIcon from "../../assets/sante.png";
import transportIcon from "../../assets/transport.png";
import divertissementIcon from "../../assets/divertissement.png";
import autreIcon from "../../assets/autre.png";
import carteIcon from "../../assets/carte.png";

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
  1: alimentationIcon,
  2: logementIcon,
  3: loisirsIcon,
  4: santeIcon,
  5: transportIcon,
  6: divertissementIcon,
  7: autreIcon,
  8: carteIcon,
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
    const categoryIdNumber = Number(categoryId);
    const selectedCategoryNumber = Number(selectedCategory);

    if (selectedCategoryNumber === categoryIdNumber) {
      setSelectedCategory("");
      onCategoryChange(""); // Aucune catégorie sélectionnée
    } else {
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
              onClick={() => handleCategoryChange(key)}
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
