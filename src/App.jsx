import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import DispositivosPage from "./pages/DevicesPages";
import ProfilePage from "./pages/ProfilePage";
import ResetPasswordForm from './components/ResetPasswordForm';
import AuthenticatedLayout from "./layaout/AuthenticatedLayaout";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("isAuthenticated") === "true"
  );
  const [userId, setUserId] = useState(sessionStorage.getItem("userId"));
  const [token, setTokenId] = useState(sessionStorage.getItem("token"));
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const handleLoginSuccess = () => {
    const newUserId = sessionStorage.getItem("userId");
    const newTokenId = sessionStorage.getItem("token")
    setUserId(newUserId);
    setTokenId(newTokenId);
    setIsAuthenticated(true);
    sessionStorage.setItem("isAuthenticated", "true");
  };

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    setIsAuthenticated(false);
    sessionStorage.clear();
    setUserId(null);
    setIsModalOpen(false);
  };

  const handleLogoutCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Router>
      <Routes>
        {/* Ruta pública - Restablecer contraseña */}
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
        
        {isAuthenticated ? (
          /* Rutas autenticadas */
          <>
            <Route 
              path="/dispositivos" 
              element={
                <AuthenticatedLayout 
                  onLogout={handleLogoutClick}
                  isModalOpen={isModalOpen}
                  onConfirm={handleLogoutConfirm}
                  onCancel={handleLogoutCancel}
                >
                  <DispositivosPage userId={userId} />
                </AuthenticatedLayout>
              } 
            />
            
            <Route 
              path="/miperfil" 
              element={
                <AuthenticatedLayout 
                  onLogout={handleLogoutClick}
                  isModalOpen={isModalOpen}
                  onConfirm={handleLogoutConfirm}
                  onCancel={handleLogoutCancel}
                >
                  <ProfilePage userId={userId} token={token} />
                </AuthenticatedLayout>
              } 
            />
            
            <Route path="/" element={<Navigate to="/dispositivos" />} />
            <Route path="*" element={<Navigate to="/dispositivos" />} />
          </>
        ) : (
          /* Rutas no autenticadas */
          <>
            <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;