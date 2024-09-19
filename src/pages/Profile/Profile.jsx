import React, { useState, useEffect } from "react";
import { updateUserProfile } from "../../api/profileService";

const Profile = ({ userData, onUpdate }) => {
  const [profileData, setProfileData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    oldPassword: "",
    newPassword: "",
    confirmation: "",
  });
  const [initialData, setInitialData] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (userData) {
      const initialProfileData = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        oldPassword: "",
        newPassword: "",
        confirmation: "",
      };
      setProfileData(initialProfileData);
      setInitialData(initialProfileData);
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => {
      const newData = { ...prevData, [name]: value };
      setHasChanged(JSON.stringify(newData) !== JSON.stringify(initialData));
      return newData;
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!profileData.firstName.trim())
      newErrors.firstName = "Le prénom est requis";
    if (!profileData.lastName.trim()) newErrors.lastName = "Le nom est requis";

    if (profileData.oldPassword) {
      if (!profileData.newPassword)
        newErrors.newPassword = "Le nouveau mot de passe est requis";
      if (profileData.newPassword !== profileData.confirmation) {
        newErrors.confirmation = "Les mots de passe ne correspondent pas";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !hasChanged) return;

    setLoading(true);
    setMessage("");

    try {
      const result = await updateUserProfile(profileData);
      setMessage("Profil mis à jour avec succès");
      onUpdate(result);
      setInitialData(profileData);
      setHasChanged(false);
    } catch (error) {
      setMessage(
        error.message ||
          "Une erreur est survenue lors de la mise à jour du profil"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Modifier le profil</h2>
      {message && (
        <p
          className={
            message.includes("succès") ? "success-message" : "error-message"
          }
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName" className="form-label">
            Prénom
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className={`form-input ${errors.firstName ? "error-input" : ""}`}
            value={profileData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <p className="error-text">{errors.firstName}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName" className="form-label">
            Nom
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className={`form-input ${errors.lastName ? "error-input" : ""}`}
            value={profileData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <p className="error-text">{errors.lastName}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input disabled-input"
            value={profileData.email}
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="oldPassword" className="form-label">
            Ancien mot de passe
          </label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            className="form-input"
            value={profileData.oldPassword}
            onChange={handleChange}
            placeholder="Entrez votre mot de passe actuel"
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword" className="form-label">
            Nouveau mot de passe
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            className={`form-input ${
              !profileData.oldPassword ? "disabled-input" : ""
            } ${errors.newPassword ? "error-input" : ""}`}
            value={profileData.newPassword}
            onChange={handleChange}
            placeholder="Entrez votre nouveau mot de passe"
            disabled={!profileData.oldPassword}
          />
          {errors.newPassword && (
            <p className="error-text">{errors.newPassword}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmation" className="form-label">
            Confirmez le nouveau mot de passe
          </label>
          <input
            type="password"
            id="confirmation"
            name="confirmation"
            className={`form-input ${
              !profileData.oldPassword ? "disabled-input" : ""
            } ${errors.confirmation ? "error-input" : ""}`}
            value={profileData.confirmation}
            onChange={handleChange}
            placeholder="Confirmez votre nouveau mot de passe"
            disabled={!profileData.oldPassword}
          />
          {errors.confirmation && (
            <p className="error-text">{errors.confirmation}</p>
          )}
        </div>

        <button
          type="submit"
          className={`form-button ${
            !hasChanged || loading ? "button-disabled" : ""
          }`}
          disabled={loading || !hasChanged}
        >
          {loading ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
