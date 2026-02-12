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
import HomePage from "../pages/HomePage";

// Usamos el nuevo layout V3 que combina Header + Sidebar
import AuthenticatedLayout from "../layaout/AuthenticatedLayaoutV3"; 

const AppRoutes = ({ isModalOpen, onLogoutClick, onConfirmLogout, onCancelLogout }) => {
  const { isAuthenticated, login } = useAuth();

  return (
    <Routes>
      <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
      
      {isAuthenticated ? (
        <>
          {/* Ruta Dashboard - Muestra "Dashboard, {userName}" */}
          <Route
            path="/dashboard"
            element={
              <AuthenticatedLayout
                onLogout={onLogoutClick}
                isModalOpen={isModalOpen}
                onConfirm={onConfirmLogout}
                onCancel={onCancelLogout}
                pageTitle="Dashboard"
              >
                <HomePage />
              </AuthenticatedLayout>
            }
          />

          {/* Ruta Consumo - Muestra "Consumo" */}
          <Route
            path="/consumo"
            element={
              <AuthenticatedLayout
                onLogout={onLogoutClick}
                isModalOpen={isModalOpen}
                onConfirm={onConfirmLogout}
                onCancel={onCancelLogout}
                pageTitle="Consumo"
              >
                <ConsumoPage />
              </AuthenticatedLayout>
            }
          />

          {/* Ruta Alertas - Muestra "Alertas" */}
          <Route
            path="/alertas"
            element={
              <AuthenticatedLayout
                onLogout={onLogoutClick}
                isModalOpen={isModalOpen}
                onConfirm={onConfirmLogout}
                onCancel={onCancelLogout}
                pageTitle="Alertas"
              >
                <AlertasPage />
              </AuthenticatedLayout>
            }
          />

          {/* Ruta Dispositivos - Muestra "Dispositivos" */}
          <Route
            path="/dispositivos"
            element={
              <AuthenticatedLayout
                onLogout={onLogoutClick}
                isModalOpen={isModalOpen}
                onConfirm={onConfirmLogout}
                onCancel={onCancelLogout}
                pageTitle="Dispositivos"
              >
                <DispositivosPage />
              </AuthenticatedLayout>
            }
          />

          {/* Ruta Mi Perfil - Muestra "Mi Perfil" */}
          <Route
            path="/miperfil"
            element={
              <AuthenticatedLayout
                onLogout={onLogoutClick}
                isModalOpen={isModalOpen}
                onConfirm={onConfirmLogout}
                onCancel={onCancelLogout}
                pageTitle="Mi Perfil"
              >
                <ProfilePage />
              </AuthenticatedLayout>
            }
          />

          {/* Ruta Configuración - Muestra "Configuración" */}
          <Route
            path="/configuracion"
            element={
              <AuthenticatedLayout
                onLogout={onLogoutClick}
                isModalOpen={isModalOpen}
                onConfirm={onConfirmLogout}
                onCancel={onCancelLogout}
                pageTitle="Configuración"
              >
                <ConfigurationPage />
              </AuthenticatedLayout>
            }
          />

          {/* Ruta Historial - Muestra "Historial" */}
          <Route
            path="/historial"
            element={
              <AuthenticatedLayout
                onLogout={onLogoutClick}
                isModalOpen={isModalOpen}
                onConfirm={onConfirmLogout}
                onCancel={onCancelLogout}
                pageTitle="Historial"
              >
                <HistorialPage />
              </AuthenticatedLayout>
            }
          />

          {/* Redirección por defecto a /dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
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
