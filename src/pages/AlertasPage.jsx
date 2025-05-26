import React, { useEffect, useState } from 'react';
import AlertsCard from '../components/AlertasComponents/AlertsCard';
import { useAuth } from '../context/AuthContext';
import '../styles/AlertasPage.css';

const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL;

const AlertasPage = () => {
  const { userId } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('consumo');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    if (userId) {
      fetch(`${DOMAIN_URL}/alertas/usuario/${userId}`)
        .then(res => res.json())
        .then(data => {
          const formatted = data.map(alert => ({
            id: alert.id,
            mensaje: alert.mensaje,
            fecha: new Date(alert.fecha).toLocaleString('es-MX'),
            tipo: alert.tipo_alerta_clave || 'Sin tipo',
            iconoId: alert.icono_svg,
          }));
          setAlerts(formatted);
        })
        .catch(err => console.error('Error cargando alertas:', err));
    }
  }, [userId]);

  // Filtra las alertas según el filtro seleccionado
  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'todos') return true;
    return alert.tipo.toLowerCase() === filter;
  });

  return (
    <div className="alertas-page-container">
      <div className="alertas-header">
        <h1 className="alertas-title-header">Alertas</h1>

        {/* Botón para desplegar el menú de filtros */}
        <div className="filter-config-container">
          <button
            className="btn-style-default btn-configurar"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            aria-label="Configuración"
            style={{ width: 24, height: 24, padding: 0, border: 'none', background: 'transparent' }}
          >
            <svg fill="#000000" width="64px" height="64px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M0 3.7L11 3.7 11 2.3 0 2.3 0 3.7zM13 0C12.4477153 0 12 .44771525 12 1L12 5C12 5.55228475 12.4477153 6 13 6 13.5522847 6 14 5.55228475 14 5L14 1C14 .44771525 13.5522847 0 13 0zM7 8.3L7 7C7 6.44771525 6.55228475 6 6 6 5.44771525 6 5 6.44771525 5 7L5 11C5 11.5522847 5.44771525 12 6 12 6.55228475 12 7 11.5522847 7 11L7 9.7 14 9.7 14 8.3 7 8.3zM0 9.7L4 9.7 4 8.3 0 8.3 0 9.7z" transform="translate(1 2)"></path> </g> </g></svg>
          </button>

          {showFilterMenu && (
            <div className="filter-menu">
              <button onClick={() => { setFilter('consumo'); setShowFilterMenu(false); }}>
                Mostrar solo consumo
              </button>
              <button onClick={() => { setFilter('sistema'); setShowFilterMenu(false); }}>
                Mostrar solo sistema
              </button>
              <button onClick={() => { setFilter('todos'); setShowFilterMenu(false); }}>
                Mostrar todos
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="alertas-body">
        {filteredAlerts.length === 0 ? (
          <p>No hay alertas para mostrar.</p>
        ) : (
          <div className="alertas-list">
            {filteredAlerts.map((alert) => (
              <AlertsCard
                key={alert.id}
                name={alert.mensaje}
                iconoId={alert.iconoId}
                fecha={alert.fecha}
                tipo={alert.tipo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertasPage;
