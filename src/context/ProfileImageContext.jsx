import React, { createContext, useContext, useState, useEffect } from "react";

// Créer le contexte pour l'image de profil
const ProfileImageContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const ProfileImageProvider = ({ children }) => {
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  return (
    <ProfileImageContext.Provider
      value={{ profileImageUrl, setProfileImageUrl }}
    >
      {children}
    </ProfileImageContext.Provider>
  );
};

// Hook pour utiliser le contexte dans les autres composants
export const useProfileImage = () => useContext(ProfileImageContext);
