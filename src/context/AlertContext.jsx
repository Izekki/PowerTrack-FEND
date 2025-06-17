import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const { userId } = useAuth();
  const [hasNewAlerts, setHasNewAlerts] = useState(false);

  const checkNewAlerts = async () => {
  try {
    if (!userId) return;
    console.log('🔁 Verificando nuevas alertas para usuario', userId);

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/alertas/verificar-nuevas/${userId}`);
    const data = await res.json();

    console.log('✅ Respuesta de alertas nuevas:', data);
    setHasNewAlerts(data.nuevas);
  } catch (err) {
    console.error('❌ Error al verificar nuevas alertas:', err);
  }
};


  const markAlertsAsRead = async () => {
    try {
      if (!userId) return;
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/alertas/marcar-leidas/${userId}`, {
        method: 'PUT',
      });
      setHasNewAlerts(false);
    } catch (err) {
      console.error('Error al marcar alertas como leídas:', err);
    }
  };

  useEffect(() => {
  if (!userId) return;

  checkNewAlerts(); // primera verificación al montar

  // luego cada 15 segundos
  const interval = setInterval(() => {
    checkNewAlerts();
  }, 15000); // 15000 ms = 15 segundos

  return () => clearInterval(interval); // limpia al desmontar
}, [userId]);


  return (
    <AlertContext.Provider value={{ hasNewAlerts, checkNewAlerts, markAlertsAsRead }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
