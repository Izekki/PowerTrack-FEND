import React, { useEffect, useState } from 'react';
import AlertsCard from '../components/AlertasComponents/AlertsCard';
import { useAuth } from '../context/AuthContext';
import '../styles/AlertasPage.css';

const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL;

const AlertasPage = () => {
  const { userId } = useAuth();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (userId) {
      fetch(`${DOMAIN_URL}/alertas/usuario/${userId}`)
        .then(res => res.json())
        .then(data => {
          const formatted = data.map(alert => ({
            id: alert.id,
            mensaje: alert.mensaje,
            nivel: alert.nivel,
            fecha: new Date(alert.fecha).toLocaleString('es-MX'),
            tipo: alert.tipo_dispositivo || 'Sin tipo',
          }));
          setAlerts(formatted);
        })
        .catch(err => console.error('Error cargando alertas:', err));
    }
  }, [userId]);

  return (
    <div className="alertas-page-container">
      <div className="alertas-header">
        <h1 className="alertas-title-header">Alertas del sistema</h1>
        <button className="btn-style-default btn-configurar">Configurar</button>
      </div>

      <div className="alertas-body">
        <div className="alertas-list">
          {alerts.map((alert) => (
            <AlertsCard
              key={alert.id}
              name={alert.mensaje}
              nivel={alert.nivel}
              fecha={alert.fecha}
              tipo={alert.tipo}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertasPage;
