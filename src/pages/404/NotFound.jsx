import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // Redirige vers la page d'accueil
  };

  return (
    <div className="not-found-container">
      <div className="not-found-title">
        Oups ! Notre crabe a perdu sa pièce...
      </div>
      <p className="not-found-message">
        La page que vous cherchez est introuvable.
      </p>
      <img
        src="../src/assets/404.png"
        alt="Crabe perdu"
        className="crab-image"
      />
      <button onClick={handleGoHome} className="home-button">
        Retour à l'accueil
      </button>
    </div>
  );
};

export default NotFoundPage;
