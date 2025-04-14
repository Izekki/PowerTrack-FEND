import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HeaderPW from "./components/HeaderPW";
import MenuBar from "./components/MenuBar";
import LoginForm from "./components/LoginForm";
import DispositivosPage from "./pages/DevicesPages";
import LogoutConfirmModal from "./components/LogoutConfirmModal";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("isAuthenticated") === "true"
  );
  const [userId, setUserId] = useState(sessionStorage.getItem("userId"));
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const handleLoginSuccess = () => {
    const newUserId = sessionStorage.getItem("userId");
    setUserId(newUserId);
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
