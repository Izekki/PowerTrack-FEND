import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HeaderPW from "./components/HeaderPW";
import MenuBar from "./components/MenuBar";
import LoginForm from "./components/LoginForm";
import DispositivosPage from "./pages/DevicesPages";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("isAuthenticated") === "true"
  );
  const [userId, setUserId] = useState(sessionStorage.getItem("userId"));

  const handleLoginSuccess = () => {
    const newUserId = sessionStorage.getItem("userId");
    setUserId(newUserId);
    setIsAuthenticated(true);
    sessionStorage.setItem("isAuthenticated", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.clear();
    setUserId(null);
  };

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Router>
      <HeaderPW onLogout={handleLogout} />
      <MenuBar />
      <Routes>
        <Route path="/dispositivos" element={<DispositivosPage userId={userId} />} />
        {/* Agrega más rutas si deseas: */}
        <Route path="*" element={<Navigate to="/dispositivos" />} />
      </Routes>
    </Router>
  );
};

export default App;
