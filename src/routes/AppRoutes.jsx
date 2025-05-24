import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import LoginForm from "../components/LoginForm";
import ResetPasswordForm from "../components/ResetPasswordForm";
import DispositivosPage from "../pages/DevicesPages";
import ProfilePage from "../pages/ProfilePage";
import ConfigurationPage from "../pages/ConfigurationPage";
import AlertasPage from "../pages/AlertasPage";
import ConsumoPage from "../pages/ConsumoPage";
import HistorialPage from "../pages/HistorialPage";


import AuthenticatedLayout from "../layaout/AuthenticatedLayaout";

const AppRoutes = ({ isModalOpen, onLogoutClick, onConfirmLogout, onCancelLogout }) => {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <Routes>
      <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
      
      {isAuthenticated ? (
        <>
          <Route
            path="/consumo"
            element={
              <AuthenticatedLayout
                onLogout={onLogoutClick}
                isModalOpen={isModalOpen}
                onConfirm={onConfirmLogout}
                onCancel={onCancelLogout}
              >
                <ConsumoPage />
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/alertas"
            element={
              <AuthenticatedLayout
                onLogout={onLogoutClick}
                isModalOpen={isModalOpen}
                onConfirm={onConfirmLogout}
                onCancel={onCancelLogout}
              >
                <AlertasPage />
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/dispositivos"
            element={
              <AuthenticatedLayout
                onLogout={onLogoutClick}
                isModalOpen={isModalOpen}
                onConfirm={onConfirmLogout}
                onCancel={onCancelLogout}
              >
                <DispositivosPage />
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/miperfil"
            element={
              <AuthenticatedLayout
                onLogout={onLogoutClick}
                isModalOpen={isModalOpen}
                onConfirm={onConfirmLogout}
                onCancel={onCancelLogout}
              >
                <ProfilePage />
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/configuracion"
            element={
              <AuthenticatedLayout
                onLogout={onLogoutClick}
                isModalOpen={isModalOpen}
                onConfirm={onConfirmLogout}
                onCancel={onCancelLogout}
              >
                <ConfigurationPage />
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/historial"
            element={
              <AuthenticatedLayout
                onLogout={onLogoutClick}
                isModalOpen={isModalOpen}
                onConfirm={onConfirmLogout}
                onCancel={onCancelLogout}
              >
                <HistorialPage />
              </AuthenticatedLayout>
            }
          />

          <Route path="/" element={<Navigate to="/dispositivos" />} />
          <Route path="*" element={<Navigate to="/dispositivos" />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<LoginForm onLoginSuccess={login} />} />
          <Route path="/" element={<LoginForm onLoginSuccess={login} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;
