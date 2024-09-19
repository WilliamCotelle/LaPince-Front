import { Link } from "react-router-dom";
import "./HomePage.css";
import screenshot1 from "../../assets/screenshot1.png";
import screenshot2 from "../../assets/screenshot2.png";
import screenshot3 from "../../assets/screenshot3.png";
// import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Gérez vos finances comme jamais auparavant</h1>
          <p>
            La Pince vous permet de suivre et gérer vos finances personnelles en
            toute simplicité, avec une interface claire et intuitive.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">
              Commencer Maintenant
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src={screenshot1} alt="Présentation de l'application" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <h2>Fonctionnalités principales</h2>
        <div className="features-grid">
          <div className="feature-item">
            <img src={screenshot2} alt="Fonctionnalité 1" />
            <div className="feature-text">
              <h3>Suivi des comptes</h3>
              <p>
                Gardez un œil sur tous vos comptes bancaires en un seul endroit.
              </p>
            </div>
          </div>
          <div className="feature-item">
            <img src={screenshot3} alt="Fonctionnalité 2" />
            <div className="feature-text">
              <h3>Analyse des dépenses</h3>
              <p>
                Comprenez où va votre argent avec des graphiques clairs et
                détaillés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Prêt à gérer vos finances ?</h2>
        <p>
          Inscrivez-vous gratuitement dès maintenant et prenez le contrôle de
          vos finances personnelles.
        </p>
        <div className="cta-buttons">
          <Link to="/register" className="btn-primary">
            Inscription Gratuite
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
