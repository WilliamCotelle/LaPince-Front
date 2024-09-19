// URL de base de l'API, configurée via les variables d'environnement
const APIBaseURL = import.meta.env.VITE_API_BASE_URL;

/**
 * Récupère toutes les catégories disponibles.
 * Utilise le token d'authentification pour faire une requête GET vers l'API.
 * Lance une erreur si la réponse n'est pas correcte ou si la requête échoue.
 */
export const fetchCategories = async (token) => {
  try {
    const response = await fetch(`${APIBaseURL}/category`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Indique que la réponse attendue est en JSON
        Authorization: `Bearer ${token}`, // Inclut le token d'authentification dans les en-têtes
      },
    });

    if (!response.ok) {
      // Lance une erreur si la réponse n'est pas correcte
      throw new Error("Erreur lors de la récupération des catégories");
    }

    return await response.json(); // Retourne les données des catégories
  } catch (error) {
    // Relance l'erreur pour que l'appelant puisse la gérer
    throw error;
  }
};

/**
 * Crée une nouvelle transaction.
 * Utilise le token d'authentification pour faire une requête POST avec les données de la transaction.
 * Lance une erreur si la réponse n'est pas correcte ou si la requête échoue.
 */
export const createTransaction = async (token, transactionData) => {
  try {
    const response = await fetch(`${APIBaseURL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Indique que le corps de la requête est en JSON
        Authorization: `Bearer ${token}`, // Inclut le token d'authentification dans les en-têtes
      },
      body: JSON.stringify(transactionData), // Corps de la requête avec les données de la transaction
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Lance une erreur avec le message d'erreur de la réponse ou un message générique
      throw new Error(
        errorData.message || "Erreur lors de la création de la transaction"
      );
    }

    return await response.json(); // Retourne les données de la transaction créée
  } catch (error) {
    // Relance l'erreur pour que l'appelant puisse la gérer
    throw error;
  }
};

/**
 * Récupère toutes les transactions.
 * Utilise le token d'authentification pour faire une requête GET vers l'API.
 * Lance une erreur si la réponse n'est pas correcte ou si la requête échoue.
 */
export const fetchAllTransactions = async (token) => {
  try {
    const response = await fetch(`${APIBaseURL}/transactions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Indique que la réponse attendue est en JSON
        Authorization: `Bearer ${token}`, // Inclut le token d'authentification dans les en-têtes
      },
    });

    if (!response.ok) {
      // Lance une erreur si la réponse n'est pas correcte
      throw new Error("Erreur lors de la récupération des transactions");
    }

    return await response.json(); // Retourne les données des transactions
  } catch (error) {
    // Relance l'erreur pour que l'appelant puisse la gérer
    throw error;
  }
};

/**
 * Supprime une transaction spécifique.
 * Utilise le token d'authentification pour faire une requête DELETE vers l'API.
 * Gère les erreurs et retourne un objet indiquant le succès ou l'échec de l'opération.
 */
export const deleteTransaction = async (id, token) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/transactions/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Inclut le token d'authentification dans les en-têtes
          "Content-Type": "application/json", // Indique que la réponse attendue est en JSON
        },
      }
    );

    if (response.ok) {
      // Retourne un objet de succès si la suppression est réussie
      return { success: true };
    } else {
      // Retourne une erreur personnalisée si la suppression échoue
      console.error(
        "Erreur lors de la suppression de la transaction:",
        response.statusText
      );
      return { success: false, message: response.statusText };
    }
  } catch (error) {
    // Retourne l'erreur attrapée si une exception se produit
    console.error("Erreur lors de la suppression de la transaction:", error);
    return { success: false, message: error.message };
  }
};
