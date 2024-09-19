import React, { useState, useEffect } from "react";
import InfoUser from "./InfoUser";
import InfoAccount from "./InfoAccount";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const DashboardProfile = () => {
  const [profileData, setProfileData] = useState(null);

  const fetchProfileData = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/dashboard`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setProfileData(data.user); // Récupère les données utilisateur
      } else {
        console.error("Erreur lors de la récupération des données");
      }
    } catch (error) {
      console.error("Erreur réseau ou serveur:", error);
    }
  };

  // Appeler fetchProfileData au chargement du composant
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Fonction pour rafraîchir les comptes
  const refreshAccounts = async () => {
    // Refetch les données utilisateur pour mettre à jour les comptes
    await fetchProfileData();
  };

  return (
    <div className="dashboard-container">
      <div className="profile-section">
        {profileData ? (
          <>
            <InfoUser user={profileData} />
            <InfoAccount
              accounts={profileData.bankAccounts}
              user_id={profileData.id}
              refreshAccounts={refreshAccounts} // Passer refreshAccounts à InfoAccount
            />
          </>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </div>
  );
};

export default DashboardProfile;
