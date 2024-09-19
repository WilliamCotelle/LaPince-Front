import "./PrivacyPolicy.css"; // Ce fichier CSS peut être similaire à ton auth.css

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
      <h2>Politique de Confidentialité</h2>

      <section className="privacy-section">
        <h3>Introduction</h3>
        <p>
          Bienvenue sur notre site "La Pince". Nous prenons très au sérieux la
          protection de vos données personnelles. Cette politique de
          confidentialité explique quelles informations nous collectons, comment
          nous les utilisons, et quels sont vos droits en matière de protection
          des données.
        </p>
      </section>

      <section className="privacy-section">
        <h3>Les données que nous collectons</h3>
        <p>
          Lorsque vous vous inscrivez sur notre site, nous collectons les
          informations suivantes :
        </p>
        <ul>
          <li>Nom et prénom</li>
          <li>Adresse e-mail</li>
          <li>Mot de passe (crypté)</li>
          <li>Consentement pour la collecte de ces données</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h3>Comment nous utilisons vos données</h3>
        <p>Les données collectées sont utilisées pour :</p>
        <ul>
          <li>Vous fournir l'accès à nos services de gestion de budget.</li>
          <li>Assurer la sécurité de votre compte.</li>
          <li>Améliorer nos services en fonction de vos retours.</li>
          <li>Vous envoyer des notifications concernant votre compte.</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h3>Partage de vos données</h3>
        <p>
          Nous ne partageons vos données personnelles avec aucun tiers, sauf si
          cela est nécessaire pour se conformer à une obligation légale ou pour
          protéger nos droits.
        </p>
      </section>

      <section className="privacy-section">
        <h3>Vos droits</h3>
        <p>
          Conformément au RGPD, vous avez les droits suivants concernant vos
          données personnelles :
        </p>
        <ul>
          <li>Accès à vos données.</li>
          <li>Rectification de vos données.</li>
          <li>Suppression de vos données.</li>
          <li>Opposition au traitement de vos données.</li>
          <li>Portabilité de vos données.</li>
        </ul>
        <p>
          Pour exercer ces droits, veuillez nous contacter à l'adresse e-mail
          suivante : support@lapince.com.
        </p>
      </section>

      <section className="privacy-section">
        <h3>Sécurité de vos données</h3>
        <p>
          Nous mettons en œuvre des mesures de sécurité pour protéger vos
          données contre tout accès non autorisé ou toute modification,
          divulgation ou destruction non autorisée.
        </p>
      </section>

      <section className="privacy-section">
        <h3>Modifications de cette politique</h3>
        <p>
          Nous nous réservons le droit de modifier cette politique de
          confidentialité à tout moment. Nous vous informerons de toute
          modification via notre site web ou par e-mail.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
