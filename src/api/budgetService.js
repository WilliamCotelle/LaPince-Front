import { toast } from "react-toastify";

// URL de base de l'API, configurée via les variables d'environnement
const APIBaseURL = import.meta.env.VITE_API_BASE_URL;

/**
 * Récupère les transactions associées à une catégorie spécifique et un compte bancaire.
 * Effectue une requête GET et retourne les données des transactions.
 * Affiche une erreur via toast en cas de problème.
 */
export const fetchTransactionsByCategory = async (
  categoryId,
  bankAccountId
) => {
  try {
    const response = await fetch(
      `${APIBaseURL}/transactions/category/${categoryId}/${bankAccountId}`,
      {
        method: "GET",
        headers: {
          // Inclut le token d'authentification pour la requête
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (!response.ok) {
      // Lance une erreur si la réponse n'est pas OK
      throw new Error("Erreur lors de la récupération des transactions");
    }
    // Retourne les données JSON des transactions
    return await response.json();
  } catch (error) {
    // Affiche un message d'erreur en cas d'exception
    return null;
  }
};

/**
 * Récupère tous les budgets pour un compte bancaire spécifique.
 * Effectue une requête GET et retourne les données des budgets.
 * Affiche une erreur via toast en cas de problème.
 */
export const fetchBudgets = async (accountId) => {
  try {
    const response = await fetch(`${APIBaseURL}/budget/${accountId}`, {
      method: "GET",
      headers: {
        // Inclut le token d'authentification pour la requête
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      // Lance une erreur si la réponse n'est pas OK
      throw new Error("Erreur lors de la récupération des budgets");
    }
    // Retourne les données JSON des budgets
    return await response.json();
  } catch (error) {
    // Affiche un message d'erreur en cas d'exception
    return [];
  }
};

/**
 * Crée un nouveau budget pour un compte bancaire donné.
 * Envoie une requête POST avec les détails du nouveau budget.
 * Affiche une erreur via toast en cas de problème.
 */
export const createBudget = async (accountId, newBudget) => {
  try {
    const response = await fetch(`${APIBaseURL}/budget`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Indique que le corps de la requête est en JSON
        // Inclut le token d'authentification pour la requête
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ ...newBudget, id_bank_account: accountId }), // Envoie les données du budget
    });
    if (!response.ok) {
      // Lance une erreur si la réponse n'est pas OK
      throw new Error("Erreur lors de la création du budget");
    }
    // Retourne les données JSON du budget créé
    return await response.json();
  } catch (error) {
    // Affiche un message d'erreur en cas d'exception
    toast.error("Erreur lors de la création du budget");
    return null;
  }
};

/**
 * Supprime un budget spécifique en fonction de son identifiant.
 * Envoie une requête DELETE pour supprimer le budget.
 * Affiche une erreur via toast en cas de problème.
 */
export const deleteBudget = async (id) => {
  try {
    const response = await fetch(`${APIBaseURL}/budget/${id}`, {
      method: "DELETE",
      headers: {
        // Inclut le token d'authentification pour la requête
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      // Lance une erreur si la réponse n'est pas OK
      throw new Error("Erreur lors de la suppression du budget");
    }
  } catch (error) {
    // Affiche un message d'erreur en cas d'exception
    toast.error("Erreur lors de la suppression du budget");
  }
};

/**
 * Met à jour les détails d'un budget spécifique.
 * Envoie une requête PUT avec les informations mises à jour du budget.
 * Affiche une erreur via toast en cas de problème.
 */
export const updateBudget = async (id, updatedBudget) => {
  try {
    const response = await fetch(`${APIBaseURL}/budget/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // Indique que le corps de la requête est en JSON
        // Inclut le token d'authentification pour la requête
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedBudget), // Envoie les données mises à jour du budget
    });
    if (!response.ok) {
      // Lance une erreur si la réponse n'est pas OK
      throw new Error("Erreur lors de la mise à jour du budget");
    }
    // Retourne les données JSON du budget mis à jour
    return await response.json();
  } catch (error) {
    // Affiche un message d'erreur en cas d'exception
    toast.error("Erreur lors de la mise à jour du budget");
    return null;
  }
};
