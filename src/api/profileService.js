// URL de base de l'API, configurée via les variables d'environnement
const APIBaseURL = import.meta.env.VITE_API_BASE_URL;

/**
 * Récupère les informations du profil utilisateur.
 * Vérifie la présence d'un token dans le stockage local pour l'authentification.
 * Effectue une requête GET pour obtenir les données du profil en utilisant le token.
 * Lance une erreur si le token est manquant ou si la requête échoue.
 */
export const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token manquant. Veuillez vous reconnecter."); // Erreur si le token n'est pas trouvé
  }

  const response = await fetch(`${APIBaseURL}/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json", // Indique que la réponse attendue est en JSON
      Authorization: `Bearer ${token}`, // Inclut le token d'authentification dans les en-têtes
    },
  });

  const result = await response.json();
  if (!response.ok) {
    // Lance une erreur avec le message d'erreur de la réponse ou un message générique
    throw new Error(result.error || "Erreur lors du chargement du profil");
  }

  return result; // Retourne les données du profil utilisateur
};

/**
 * Met à jour les informations du profil utilisateur.
 * Vérifie la présence d'un token dans le stockage local pour l'authentification.
 * Effectue une requête PUT pour mettre à jour les données du profil en utilisant le token et les données mises à jour.
 * Lance une erreur si le token est manquant ou si la requête échoue.
 */
export const updateUserProfile = async (updatedData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token manquant. Veuillez vous reconnecter."); // Erreur si le token n'est pas trouvé
  }

  const response = await fetch(`${APIBaseURL}/profile/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json", // Indique que le corps de la requête est en JSON
      Authorization: `Bearer ${token}`, // Inclut le token d'authentification dans les en-têtes
    },
    body: JSON.stringify(updatedData), // Corps de la requête avec les données mises à jour
  });

  const result = await response.json();
  if (!response.ok) {
    // Lance une erreur avec le message d'erreur de la réponse ou un message générique
    throw new Error(result.error || "Erreur lors de la mise à jour du profil");
  }

  return result; // Retourne les données de la réponse après la mise à jour du profil
};
