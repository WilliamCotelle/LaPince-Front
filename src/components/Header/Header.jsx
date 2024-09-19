import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { IoSettingsOutline } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import { useProfileImage } from "../../context/ProfileImageContext";
import "./Header.css";
import NotificationBell from "../Notification/NotificationBell";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { isAuthenticated, userProfile, logout } = useAuth();
  const { profileImageUrl, setProfileImageUrl } = useProfileImage();
  const navigate = useNavigate();
  const APIBaseURL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated) {
        const token = localStorage.getItem("token");

        try {
          const response = await fetch(`${APIBaseURL}/profile`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (data.success && data.user.profilPicture) {
            setProfileImageUrl(`${APIBaseURL}${data.user.profilPicture}`);
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération de l'image de profil :",
            error
          );
        }
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, setProfileImageUrl]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = () => {
    if (isMobile) {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <header className="header">
      <div className="header-container">
        <NavLink to="/" className="logo">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/6fjoeflwaat-108%3A377?alt=media&token=7cdf9d4a-2207-4cb9-af9e-b9e758b9e55d"
            alt="Logo"
          />
          <span className="la-pince">La Pince</span>
        </NavLink>

        {isAuthenticated ? (
          <>
            <nav className={`menus ${isMenuOpen ? "open" : ""}`}>
              <NavLink
                to="/dashboard"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive ? "menus-item active" : "menus-item"
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/transactions"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive ? "menus-item active" : "menus-item"
                }
              >
                Transactions
              </NavLink>
              <NavLink
                to="/analysis"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive ? "menus-item active" : "menus-item"
                }
              >
                Analyse
              </NavLink>
              <NavLink
                to="/budget"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive ? "menus-item active" : "menus-item"
                }
              >
                Budget
              </NavLink>

              <NavLink
                to="/login"
                onClick={() => {
                  toggleMenu();
                  handleLogout();
                }}
                className="menus-item"
              >
                Déconnexion
              </NavLink>
            </nav>

            <div className="account-menu">
              <NotificationBell />

              {isMobile && (
                <NavLink to="/profile">
                  <IoSettingsOutline className="icon-bell" />
                </NavLink>
              )}

              {isMobile ? (
                <img
                  src={profileImageUrl || "https://via.placeholder.com/36"}
                  alt="Profile"
                  className="profile-picture"
                  style={{ borderRadius: "50%" }}
                  onClick={toggleMenu}
                />
              ) : (
                <NavLink to="/profile">
                  <img
                    src={profileImageUrl || "https://via.placeholder.com/36"}
                    alt="Profile"
                    className="profile-picture"
                    style={{ borderRadius: "50%" }}
                    onClick={toggleMenu}
                  />
                </NavLink>
              )}
            </div>
          </>
        ) : (
          <div className="auth-links">
            <NavLink to="/login" className="auth-link">
              Connexion
            </NavLink>
            <NavLink to="/register" className="auth-link">
              Inscription
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
}
