// PictureProfil.jsx

import React, { useState, useEffect } from "react";
import { useProfileImage } from "../../context/ProfileImageContext"; // Importer le contexte
import { getUserProfile, updateUserProfile } from "../../api/profileService"; // Importer les fonctions de service

const PictureProfil = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [user, setUser] = useState(null); // État pour stocker les données utilisateur
  const { setProfileImageUrl } = useProfileImage(); // Utiliser le contexte pour mettre à jour l'image
  const APIBaseURL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    // Fonction pour charger le profil utilisateur
    const loadUserProfile = async () => {
      try {
        const userProfile = await getUserProfile();
        setUser(userProfile);
        setProfileImageUrl(`${APIBaseURL}${userProfile.user.profilPicture}`); // Initialiser l'image de profil
      } catch (error) {
        setUploadMessage("Erreur lors du chargement du profil.");
      }
    };

    loadUserProfile();
  }, [setProfileImageUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setUploadMessage("Veuillez sélectionner une image.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePhoto", selectedFile);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${APIBaseURL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const newImageUrl = `${APIBaseURL}${data.user.profilPicture}`;
        setProfileImageUrl(newImageUrl);

        // Mettre à jour le profil utilisateur
        if (user) {
          const updatedUser = {
            ...user,
            profilPicture: data.user.profilPicture,
          };
          await updateUserProfile(updatedUser);

          // Mettre à jour le localStorage avec la nouvelle image de profil
          localStorage.setItem("user", JSON.stringify(updatedUser));

          setUploadMessage("Photo téléchargée avec succès.");
        }
      } else {
        setUploadMessage("Erreur lors du téléchargement de la photo.");
      }
    } catch (error) {
      setUploadMessage("Erreur lors du téléchargement de la photo.");
    }
  };

  return (
    <div>
      <h2>Changer la photo de profil</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Télécharger</button>
      </form>
      {uploadMessage && <p>{uploadMessage}</p>}
    </div>
  );
};

export default PictureProfil;
