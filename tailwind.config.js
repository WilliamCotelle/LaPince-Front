// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#1D4ED8", // Un bleu plus vif pour la couleur principale
        "primary-light": "#E0F2FE", // Bleu clair, plus doux pour les arrière-plans
        "primary-lighter": "#DBEAFE", // Encore plus clair pour des sections sur fond coloré

        secondary: "#64748B", // Un gris légèrement plus prononcé pour le texte secondaire
        "secondary-light": "#F1F5F9", // Gris très doux pour les arrière-plans secondaires

        white: "#ffffff", // Reste inchangé
        background: "#F3F4F6", // Légèrement plus foncé pour offrir plus de contraste sur le blanc pur
        text: "#1F2937", // Un gris foncé, moins neutre, pour renforcer la lisibilité
        border: "#E5E7EB", // Légèrement plus contrasté pour les bordures
        shadow: "rgba(0, 0, 0, 0.1)", // Augmentation de l'opacité pour des ombres plus visibles
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#1D4ED8", // Bleu vif
          "primary-light": "#E0F2FE", // Bleu clair
          "primary-lighter": "#DBEAFE", // Encore plus clair

          secondary: "#64748B", // Gris plus sombre
          "secondary-light": "#F1F5F9", // Gris clair

          "base-100": "#ffffff", // Blanc pour les surfaces principales
          background: "#F3F4F6", // Fond général plus contrasté
          text: "#1F2937", // Texte foncé pour une meilleure lisibilité
          border: "#E5E7EB", // Bordures plus visibles

          // Amélioration des couleurs d'alerte et d'état
          info: "#2563EB", // Bleu plus vif pour les messages d'information
          success: "#22C55E", // Vert plus vif pour le succès
          warning: "#F59E0B", // Jaune légèrement plus prononcé pour les alertes
          error: "#EF4444", // Rouge vif pour les erreurs
        },
      },
    ],
  },
};
