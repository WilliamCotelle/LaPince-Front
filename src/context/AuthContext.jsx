import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp > currentTime) {
            setIsAuthenticated(true);
            setUserProfile(decodedToken);
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem("token");
            setError("Session expirée. Veuillez vous reconnecter.");
          }
        } catch (error) {
          console.log(error);
          setIsAuthenticated(false);
          localStorage.removeItem("token");
          setError("Session invalide. Veuillez vous reconnecter.");
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    verifyToken();
  }, []);

  const login = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
      setUserProfile(decodedToken); // Mise à jour du profil utilisateur
      setError(null);
    } catch (error) {
      console.error("Erreur lors de la décode du token:", error);
      setIsAuthenticated(false);
      setError("Erreur d'authentification");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedAccount");
    setIsAuthenticated(false);
    setError(null);
    setUserProfile(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, login, logout, error, userProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
