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
import HomePage from "../pages/HomePage"; // <--- Importar HomePage

// Usamos el layout V2 que tiene el Sidebar
import AuthenticatedLayout from "../layaout/AuthenticatedLayaoutV2"; 

const AppRoutes = ({ isModalOpen, onLogoutClick, onConfirmLogout, onCancelLogout }) => {
  const { isAuthenticated, login } = useAuth();

  return (
    <Routes>
      <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
      
      {isAuthenticated ? (
        <>
          {/* Nueva Ruta Home */}
          <Route
            path="/home"
            element={
              <AuthenticatedLayout
                onLogout={onLogoutClick}
                isModalOpen={isModalOpen}
                onConfirm={onConfirmLogout}
                onCancel={onCancelLogout}
              >
                <HomePage />
              </AuthenticatedLayout>
            }
          />

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
          {/* ... Resto de rutas igual, solo asegurate de que usen AuthenticatedLayoutV2 si quieres el sidebar en todas ... */}
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

          {/* Redirección por defecto a /home */}
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="*" element={<Navigate to="/home" />} />
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