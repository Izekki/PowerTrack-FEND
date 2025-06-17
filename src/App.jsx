import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import { AlertProvider } from "./context/AlertContext"



const AppContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { logout } = useAuth();
  
  const handleLogoutClick = () => setIsModalOpen(true);
  const handleLogoutCancel = () => setIsModalOpen(false);

  const handleLoginConfirm = () => {
    logout();
    setIsModalOpen(false);
  }

  return (
    <Router>
      <AppRoutes
        isModalOpen={isModalOpen}
        onLogoutClick={handleLogoutClick}
        onCancelLogout={handleLogoutCancel}
        onConfirmLogout={handleLoginConfirm}
      />
    </Router>
    
  )

}

const App = () => {

  return (
    <ThemeProvider attribute="data-theme">
      <AuthProvider>
        <AlertProvider>
          <AppContent />        
        </AlertProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
