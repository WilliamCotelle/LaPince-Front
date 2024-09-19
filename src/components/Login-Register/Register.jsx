import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authService"; // Importer le service API
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login-Register.css";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmation: "",
    consent: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Pour gérer la visibilité du mot de passe
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value, // Gestion des cases à cocher
    });
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmationVisibility = () => {
    setShowConfirmation(!showConfirmation);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Valider les champs avant l'envoi
    if (form.password !== form.confirmation) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (!form.consent) {
      setError(
        "Vous devez accepter la politique de confidentialité pour vous inscrire."
      );
      return;
    }

    try {
      // Utiliser le service API pour l'inscription
      const data = await registerUser(form);

      setSuccess(data.message);
      setError("");

      // Réinitialiser le formulaire
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmation: "",
        consent: false,
      });

      // Rediriger après inscription
      navigate("/login");
    } catch (error) {
      setError(error.message || "Une erreur interne est survenue");
    }
  };

  return (
    <div className="auth-container">
      <h2>Inscription</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName" className="form-label">
            Nom
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="form-input"
            value={form.firstName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName" className="form-label">
            Prénom
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="form-input"
            value={form.lastName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Adresse e-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Mot de passe
          </label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className="form-input"
              value={form.password}
              onChange={handleChange}
            />
            <span
              className="password-toggle"
              onClick={handlePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirmation" className="form-label">
            Vérification du mot de passe
          </label>
          <div className="password-container">
            <input
              type={showConfirmation ? "text" : "password"}
              id="confirmation"
              name="confirmation"
              className="form-input"
              value={form.confirmation}
              onChange={handleChange}
            />
            <span
              className="password-toggle"
              onClick={handleConfirmationVisibility}
            >
              {showConfirmation ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        {/* Ajout de la case de consentement */}
        <div className="form-group">
          <label htmlFor="consent" className="form-label">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              checked={form.consent}
              onChange={handleChange}
            />{" "}
            J'accepte la{" "}
            <NavLink to="/privacy-policy">Politique de Confidentialité</NavLink>
          </label>
        </div>

        <button type="submit" className="form-button">
          S'inscrire
        </button>
      </form>

      {/* Ajout du lien pour se connecter */}
      <div className="redirect-link">
        <p>Vous avez déjà un compte ?</p>
        <button className="form-button" onClick={() => navigate("/login")}>
          Se connecter
        </button>
      </div>
    </div>
  );
};

export default Register;
