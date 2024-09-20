import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login-Register.css";
import { useAuth } from "../../context/AuthContext";

const passwordCriteria = {
  length: (password) => password.length >= 8,
  uppercase: (password) => /[A-Z]/.test(password),
  lowercase: (password) => /[a-z]/.test(password),
  digit: (password) => /[0-9]/.test(password),
  specialChar: (password) => /[\W_]/.test(password),
};

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    specialChar: false,
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, password: value });

    // Validation du mot de passe en temps réel
    setPasswordValidations({
      length: passwordCriteria.length(value),
      uppercase: passwordCriteria.uppercase(value),
      lowercase: passwordCriteria.lowercase(value),
      digit: passwordCriteria.digit(value),
      specialChar: passwordCriteria.specialChar(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

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
      const response = await registerUser(form);
      if (response.token) {
        login(response.token);
        navigate("/dashboard");
      }
      setSuccess(response.message);
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
              onChange={handlePasswordChange}
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Indicateur visuel des exigences */}
          <div className="password-criteria">
            <p className={passwordValidations.length ? "valid" : ""}>
              • Au moins 8 caractères
            </p>
            <p className={passwordValidations.uppercase ? "valid" : ""}>
              • Une majuscule
            </p>
            <p className={passwordValidations.lowercase ? "valid" : ""}>
              • Une minuscule
            </p>
            <p className={passwordValidations.digit ? "valid" : ""}>
              • Un chiffre
            </p>
            <p className={passwordValidations.specialChar ? "valid" : ""}>
              • Un caractère spécial
            </p>
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
              onClick={() => setShowConfirmation(!showConfirmation)}
            >
              {showConfirmation ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

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
