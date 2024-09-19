import React from "react";
import { NavLink } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footers">
      <div className="footer-content">
        <p>© 2024 La Pince. Tous droits réservés.</p>
        <ul className="footer-links">
          <li>
            <NavLink to="/privacy-policy">Conditions d'utilisation</NavLink>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
