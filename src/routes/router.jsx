// src/router/index.jsx
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../components/Login-Register/Login";
import Register from "../components/Login-Register/Register";
import PrivacyPolicy from "../components/Login-Register/PrivacyPolicy/PrivacyPolicy";
import Dashboard from "../pages/Dashboard/Dashboard";
import HomePage from "../pages/HomePage/HomePage";
import TransactionPage from "../pages/TransactionPage/TransactionPage";
import BudgetPage from "../pages/BudgetPage/BudgetPage";
import AnalysisPage from "../pages/Analysis/AnalysisPage";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import DashboardProfile from "../pages/Profile/DashboardProfile";
import Picture from "../pages/Profile/PictureProfil";
import ForgotPassword from "../components/ForgotPassword/ForgotPassword";
import ResetPassword from "../components/ForgotPassword/ResetPassword";
import NotFound from "../pages/404/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Ceci rendra l'en-tête et les enfants via <Outlet />
    children: [
      {
        path: "/",
        element: <HomePage />, // Route pour la page d'accueil
      },
      {
        path: "login",
        element: <PublicRoute element={<Login />} />, // Route pour la connexion
      },
      {
        path: "register",
        element: <PublicRoute element={<Register />} />, // Route pour l'inscription
      },
      {
        path: "/forgot-password",
        element: <PublicRoute element={<ForgotPassword />} />,
      },
      {
        path: "/reset-password",
        element: <PublicRoute element={<ResetPassword />} />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />, // Route pour la politique de confidentialité
      },
      {
        path: "dashboard",
        element: <PrivateRoute element={<Dashboard />} />,
      },
      {
        path: "transactions",
        element: <PrivateRoute element={<TransactionPage />} />,
      },
      {
        path: "profile",
        element: <PrivateRoute element={<DashboardProfile />} />,
      },
      {
        path: "analysis",
        element: <PrivateRoute element={<AnalysisPage />} />,
      },
      {
        path: "upload",
        element: <PrivateRoute element={<Picture />} />,
      },
      {
        path: "budget", // Nouvelle route pour les budgets
        element: <PrivateRoute element={<BudgetPage />} />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
