// URL de base de l'API, configurée via les variables d'environnement
const APIBaseURL = import.meta.env.VITE_API_BASE_URL;

/**
 * Récupère les données du tableau de bord en utilisant le token d'authentification.
 * Effectue une requête GET pour obtenir les données du tableau de bord.
 * Lance une erreur en cas de problème et relance l'erreur pour gestion ultérieure.
 */
export const fetchDashboardData = async (token) => {
  try {
    const response = await fetch(`${APIBaseURL}/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Indique que le corps de la requête est en JSON
        // Inclut le token d'authentification pour la requête
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Lance une erreur si la réponse n'est pas OK
      throw new Error(
        "Erreur lors de la récupération des données du tableau de bord"
      );
    }

    // Retourne les données JSON du tableau de bord
    return await response.json();
  } catch (error) {
    // Relance l'erreur pour la gérer dans le composant appelant
    throw error;
  }
};

/**
 * Récupère les transactions associées à un compte spécifique en utilisant le token d'authentification.
 * Effectue une requête GET pour obtenir les transactions pour un compte donné.
 * Lance une erreur en cas de problème et relance l'erreur pour gestion ultérieure.
 */
export const fetchTransactions = async (token, accountId) => {
  try {
    const response = await fetch(`${APIBaseURL}/transactions/${accountId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Indique que le corps de la requête est en JSON
        // Inclut le token d'authentification pour la requête
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Lance une erreur si la réponse n'est pas OK
      throw new Error("Erreur lors de la récupération des transactions");
    }

    // Retourne les données JSON des transactions
    return await response.json();
  } catch (error) {
    // Relance l'erreur pour la gérer dans le composant appelant
    throw error;
  }
};
