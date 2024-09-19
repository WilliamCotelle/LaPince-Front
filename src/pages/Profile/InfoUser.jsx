import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfileImage } from "../../context/ProfileImageContext";
import "./ProfileCard.css";
import PictureProfil from "./PictureProfil";
import Profile from "./Profile";

const InfoUser = ({ user, onUserUpdate }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const navigate = useNavigate();
  const { profileImageUrl } = useProfileImage();

  const handleProfileUpdate = (updatedUser) => {
    // Vérifiez si onUserUpdate est une fonction avant de l'appeler
    if (typeof onUserUpdate === "function") {
      onUserUpdate(updatedUser);
    } else {
      console.error("onUserUpdate n'est pas une fonction");
    }
    setShowEditProfileModal(false);
  };

  return (
    <div className="profile-card">
      {user ? (
        <>
          <div className="profile-card-header">
            <img
              className="img-profile"
              src={profileImageUrl}
              alt="Profile"
              onClick={() => setShowUploadModal(true)}
            />
          </div>
          <div className="profile-card-body">
            <h3>
              {user.firstName} {user.lastName}
            </h3>
            <p>{user.email}</p>
            <button
              className="edit-button"
              onClick={() => setShowEditProfileModal(true)}
            >
              Modifier le profil
            </button>
          </div>

          {showUploadModal && (
            <div className="modals">
              <div className="modal-contents">
                <span
                  className="close-button"
                  onClick={() => setShowUploadModal(false)}
                >
                  &times;
                </span>
                <PictureProfil />
              </div>
            </div>
          )}

          {showEditProfileModal && (
            <div className="modals">
              <div className="modal-contents">
                <span
                  className="close-button"
                  onClick={() => setShowEditProfileModal(false)}
                >
                  &times;
                </span>
                <Profile userData={user} onUpdate={handleProfileUpdate} />
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Chargement des données du profil...</p>
      )}
    </div>
  );
};

export default InfoUser;
