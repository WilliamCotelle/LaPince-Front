// URL de base de l'API, configurée via les variables d'environnement
const APIBaseURL = import.meta.env.VITE_API_BASE_URL; // Remplacez par l'URL de votre API si nécessaire

/**
 * Récupère la liste des notifications pour l'utilisateur authentifié.
 * Effectue une requête GET pour obtenir les notifications en utilisant le token d'authentification.
 * Lance une erreur en cas de problème et relance l'erreur pour gestion ultérieure.
 */
export const getNotifications = async (token) => {
  try {
    const response = await fetch(`${APIBaseURL}/notifications`, {
      method: "GET",
      headers: {
        // Inclut le token d'authentification pour la requête
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Indique que la réponse attendue est en JSON
      },
    });

    if (!response.ok) {
      // Lance une erreur si la réponse n'est pas OK
      throw new Error("Erreur lors de la récupération des notifications");
    }

    // Retourne les données JSON des notifications
    const data = await response.json();
    return data;
  } catch (error) {
    // Affiche l'erreur dans la console et la relance pour gestion ultérieure
    console.error("Erreur lors de la récupération des notifications :", error);
    throw error;
  }
};

/**
 * Marque une notification comme lue en utilisant son identifiant.
 * Effectue une requête PUT pour mettre à jour l'état de la notification en utilisant le token d'authentification.
 * Lance une erreur en cas de problème et relance l'erreur pour gestion ultérieure.
 */
export const markNotificationAsRead = async (notificationId, token) => {
  try {
    const response = await fetch(
      `${APIBaseURL}/notifications/${notificationId}/read`,
      {
        method: "PUT",
        headers: {
          // Inclut le token d'authentification pour la requête
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Indique que le corps de la requête est en JSON
        },
        body: JSON.stringify({}), // Corps de la requête vide
      }
    );

    if (!response.ok) {
      // Lance une erreur si la réponse n'est pas OK
      throw new Error("Erreur lors de la mise à jour de la notification");
    }

    // Optionnellement, vous pouvez retourner des données ici si nécessaire
  } catch (error) {
    // Affiche l'erreur dans la console et la relance pour gestion ultérieure
    console.error("Erreur lors de la mise à jour de la notification :", error);
    throw error;
  }
};

/**
 * Crée une nouvelle notification pour un utilisateur spécifique.
 * Effectue une requête POST pour créer une notification en utilisant le token d'authentification.
 * Lance une erreur en cas de problème et relance l'erreur pour gestion ultérieure.
 */
export const createNotification = async (userId, message, token) => {
  try {
    const response = await fetch(`${APIBaseURL}/notifications`, {
      method: "POST",
      headers: {
        // Inclut le token d'authentification pour la requête
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Indique que le corps de la requête est en JSON
      },
      body: JSON.stringify({ userId, message }), // Corps de la requête avec les détails de la notification
    });

    if (!response.ok) {
      // Lance une erreur si la réponse n'est pas OK
      throw new Error("Erreur lors de la création de la notification");
    }

    // Optionnellement, vous pouvez retourner des données ici si nécessaire
  } catch (error) {
    // Affiche l'erreur dans la console et la relance pour gestion ultérieure
    console.error("Erreur lors de la création de la notification :", error);
    throw error;
  }
};
