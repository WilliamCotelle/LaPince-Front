import React, { useState, useEffect } from "react";
import "./Transaction.css";

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

const months = [
  { value: 1, label: "Janvier" },
  { value: 2, label: "Février" },
  { value: 3, label: "Mars" },
  { value: 4, label: "Avril" },
  { value: 5, label: "Mai" },
  { value: 6, label: "Juin" },
  { value: 7, label: "Juillet" },
  { value: 8, label: "Août" },
  { value: 9, label: "Septembre" },
  { value: 10, label: "Octobre" },
  { value: 11, label: "Novembre" },
  { value: 12, label: "Décembre" },
];

export default function TransactionFilter({
  onFilter,
  onCategoryChange,
  onSearchChange,
}) {
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    applyFilters();
  }, [selectedCategory, searchTerm, selectedMonth]);

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    onSearchChange(term);
  };

  const handleCategoryChange = (categoryId) => {
    const categoryIdNumber = Number(categoryId);
    const selectedCategoryNumber = Number(selectedCategory);
    if (selectedCategoryNumber === categoryIdNumber) {
      setSelectedCategory("");
      onCategoryChange("");
    } else {
      setSelectedCategory(categoryIdNumber);
      onCategoryChange(categoryIdNumber);
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const applyFilters = () => {
    onFilter({
      category: selectedCategory,
      searchTerm: searchTerm,
      month: selectedMonth,
    });
  };

  const handleFilter = (filterType) => {
    if (filterType === "thisMonth") {
      const currentMonth = new Date().getMonth() + 1;
      setSelectedMonth(currentMonth.toString());
    } else if (filterType === "lastMonth") {
      const lastMonth = new Date().getMonth();
      setSelectedMonth(lastMonth === 0 ? "12" : lastMonth.toString());
    } else if (filterType === "reset") {
      setSearchTerm("");
      setSelectedCategory("");
      setSelectedMonth("");
      onFilter({});
    } else {
      onFilter(filterType);
    }
  };

  return (
    <div className="transaction-filter-container">
      <input
        type="text"
        placeholder="Rechercher par description"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />

      <button
        className="category-toggle-button compact"
        onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
      >
        {isCategoryMenuOpen ? "Fermer Catégories" : "Choisir une Catégorie"}
      </button>

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

      <select
        className="filter-select"
        value={selectedMonth}
        onChange={handleMonthChange}
      >
        <option value="">Sélectionner un mois</option>
        {months.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>

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

      <input
        type="date"
        className="filter-date-input"
        onChange={(e) => handleFilter(e.target.value)}
        placeholder="Sélectionner une date"
      />

      <button
        className="filter-button reset-button"
        onClick={() => handleFilter("reset")}
      >
        Réinitialiser
      </button>
    </div>
  );
}
