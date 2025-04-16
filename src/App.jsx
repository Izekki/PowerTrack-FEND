import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HeaderPW from "./components/HeaderPW";
import MenuBar from "./components/MenuBar";
import LoginForm from "./components/LoginForm";
import DispositivosPage from "./pages/DevicesPages";
import LogoutConfirmModal from "./components/LogoutConfirmModal";
import ProfilePage from "./pages/ProfilePage";

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

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Router>
      <HeaderPW onLogout={handleLogoutClick} />
      <MenuBar />
      <Routes>
        <Route path="/dispositivos" element={<DispositivosPage userId={userId} />} />
        <Route path="/miperfil" element={<ProfilePage userId={userId} token={token}/>} />
        <Route path="*" element={<Navigate to="/dispositivos" />} />
      </Routes>

      {isModalOpen && (
        <LogoutConfirmModal 
          onConfirm={handleLogoutConfirm} 
          onCancel={handleLogoutCancel} 
        />
      )}
    </Router>
  );
};

export default App;
