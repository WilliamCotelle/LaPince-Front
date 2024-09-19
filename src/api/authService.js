// URL de base de l'API, récupérée depuis les variables d'environnement.
const APIBaseURL = import.meta.env.VITE_API_BASE_URL;

/**
 * Authentifie un utilisateur en envoyant les informations de connexion à l'API.
 * Gère les erreurs et renvoie les données de l'utilisateur en cas de succès.
 */
export const loginUser = async (formData) => {
  try {
    const response = await fetch(`${APIBaseURL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erreur lors de la connexion");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Enregistre un nouvel utilisateur en envoyant les informations à l'API.
 * Gère les erreurs et renvoie les données de l'utilisateur en cas de succès.
 */
export const registerUser = async (formData) => {
  try {
    const response = await fetch(`${APIBaseURL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erreur lors de l'enregistrement");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Envoie une demande de réinitialisation du mot de passe à l'API.
 * Renvoie les données de confirmation ou lance une erreur en cas de problème.
 */
export const forgotPassword = async (email) => {
  const response = await fetch(`${APIBaseURL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

/**
 * Réinitialise le mot de passe en envoyant le token et le nouveau mot de passe à l'API.
 * Renvoie les données de confirmation ou lance une erreur en cas de problème.
 */
export const resetPassword = async (token, newPassword) => {
  const response = await fetch(`${APIBaseURL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};
