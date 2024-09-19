import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authService";
import { useAuth } from "../../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login-Register.css";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Pour gérer la visibilité du mot de passe
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };
  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(form); // Utiliser le service API pour la connexion
      setSuccess(data.message);
      setError("");

      // Stocker le jeton JWT et les informations utilisateur dans le localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      // Utiliser la fonction de connexion du contexte
      login(data.token); // Rediriger vers la page d'accueil après la connexion réussie
      navigate("/dashboard");
    } catch (error) {
      setError(error.message); // Afficher l'erreur si la connexion échoue
    }
  };

  return (
    <div className="auth-container">
      <h2>Connexion</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
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
            required
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
              required
            />
            <span
              className="password-toggle"
              onClick={handlePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <button type="submit" className="form-button">
          Se Connecter
        </button>
      </form>
      <p>
        <NavLink to="/forgot-password">Mot de passe oublié ?</NavLink>
      </p>
    </div>
  );
};

export default Login;
