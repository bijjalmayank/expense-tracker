import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ExpensesPage from "./pages/ExpensesPage.jsx";
import BudgetPage from "./pages/BudgetPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return null;

  const isAuthenticated = Boolean(user);

  return (
    <div className="min-h-screen bg-slate-50">
      {isAuthenticated && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/expenses"
          element={
            isAuthenticated ? (
              <ProtectedRoute>
                <ExpensesPage />
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/budget"
          element={
            isAuthenticated ? (
              <ProtectedRoute>
                <BudgetPage />
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />

        <Route
          path="/forgot-password"
          element={isAuthenticated ? <Navigate to="/" replace /> : <ForgotPasswordPage />}
        />

        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />}
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}
