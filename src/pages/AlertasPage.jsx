import React, { useEffect, useState, useRef } from 'react';
import AlertsCard from '../components/AlertasComponents/AlertsCard';
import { useAuth } from '../context/AuthContext';
import '../styles/AlertasPage.css';
import { useAlert } from '../context/AlertContext';

const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL;

const AlertasPage = () => {
  const { userId } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('consumo');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0); // Página actual
  const limit = 10;
  const { markAlertsAsRead } = useAlert();

  const observer = useRef();

  const formatFechaUTC = (fechaISO) => {
    const date = new Date(fechaISO);
    const options = {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    return new Intl.DateTimeFormat('es-MX', options).format(date);
  };

  // Cargar más alertas cuando llegamos al final
  const loadAlerts = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);

    const offset = reset ? 0 : page * limit;

    try {
      // Añadimos el filtro en la URL
      const res = await fetch(`${DOMAIN_URL}/alertas/usuario/${userId}?limit=${limit}&offset=${offset}&filtro=${filter}`);
      const data = await res.json();

      const formatted = data.map(alert => ({
        id: alert.id,
        mensaje: alert.mensaje,
        fecha: formatFechaUTC(alert.fecha),
        tipo: alert.tipo_alerta_clave || 'Sin tipo',
        iconoId: alert.icono_svg,
        dispositivo: alert.tipo_dispositivo,
      }));

      if (reset) {
        setAlerts(formatted);
        setPage(1);
        setHasMore(formatted.length === limit);
      } else {
        setAlerts(prev => [...prev, ...formatted]);
        setPage(prev => prev + 1);
        setHasMore(formatted.length === limit);
      }

    } catch (err) {
      console.error('Error cargando alertas:', err);
    } finally {
      setLoading(false);
    }
  };

  // Inicializar carga
  useEffect(() => {
    if (userId) {
      loadAlerts(true);
    }
  }, [userId, filter]);

  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${DOMAIN_URL}/alertas/usuario/${userId}?limit=10&offset=0&filtro=${filter}`);
        const data = await res.json();

        const nuevas = data
          .map(alert => ({
            id: alert.id,
            mensaje: alert.mensaje,
            fecha: formatFechaUTC(alert.fecha),
            tipo: alert.tipo_alerta_clave || 'Sin tipo',
            iconoId: alert.icono_svg,
            dispositivo: alert.tipo_dispositivo,
          }))
          .filter(alertNueva => !alerts.some(alertExistente => alertExistente.id === alertNueva.id));

        if (nuevas.length > 0) {
          setAlerts(prev => [...nuevas, ...prev]);
        }
      } catch (err) {
        console.error("Error al verificar nuevas alertas:", err);
      }
    }, 15000); // cada 15 segundos

    return () => clearInterval(interval);
  }, [userId, filter, alerts]);

  // Observar último elemento para cargar más
  useEffect(() => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadAlerts();
      }
    });

    if (lastAlertRef.current) observer.current.observe(lastAlertRef.current);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loading, hasMore, filter]);

  const lastAlertRef = useRef();

  return (
    <div className="alertas-page-container">
      <div className="alertas-header">
        {/* Botón Filtros (Izquierda) */}
        <div className="left-side">
          <button
            className="btn-style-default btn-configurar"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            aria-label="Configuración"
            style={{
              width: 24,
              height: 24,
              padding: 0,
              border: "none",
              background: "transparent",
            }}
          >
            <svg
              fill="#000000"
              width="64px"
              height="64px"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <g>
                  <path
                    d="M0 3.7L11 3.7 11 2.3 0 2.3 0 3.7zM13 0C12.4477153 0 12 .44771525 12 1L12 5C12 5.55228475 12.4477153 6 13 6 13.5522847 6 14 5.55228475 14 5L14 1C14 .44771525 13.5522847 0 13 0zM7 8.3L7 7C7 6.44771525 6.55228475 6 6 6 5.44771525 6 5 6.44771525 5 7L5 11C5 11.5522847 5.44771525 12 6 12 6.55228475 12 7 11.5522847 7 11L7 9.7 14 9.7 14 8.3 7 8.3zM0 9.7L4 9.7 4 8.3 0 8.3 0 9.7z"
                    transform="translate(1 2)"
                  ></path>
                </g>
              </g>
            </svg>
          </button>

          {showFilterMenu && (
            <div className="filter-menu">
              <button
                onClick={() => {
                  setFilter("consumo");
                  setShowFilterMenu(false);
                }}
              >
                Mostrar solo consumo
              </button>
              <button
                onClick={() => {
                  setFilter("sistema");
                  setShowFilterMenu(false);
                }}
              >
                Mostrar solo sistema
              </button>
              <button
                onClick={() => {
                  setFilter("todos");
                  setShowFilterMenu(false);
                }}
              >
                Mostrar todos
              </button>
            </div>
          )}
        </div>

        {/* Título centrado */}
        <h1 className="alertas-title-header">Alertas</h1>

        {/* Botón Marcar Leídas (Derecha) */}
        <div className="right-side">
          <button
            onClick={async () => {
              await markAlertsAsRead();
              loadAlerts(true);
            }}
            className="btn-limpiar-icono"
            aria-label="Marcar todas como leídas"
            title="Marcar todas como leídas"
            disabled={alerts.length === 0}
          >
            Marcar Leídas
          </button>
        </div>
      </div>

      {/* Cuerpo de alertas */}
      <div className="alertas-body">
        {alerts.length === 0 ? (
          <p>No hay alertas para mostrar.</p>
        ) : (
          <div className="alertas-list">
            {alerts.map((alert, index) => {
              if (alerts.length === index + 1) {
                return (
                  <div key={alert.id} ref={lastAlertRef}>
                    <AlertsCard
                      key={alert.id}
                      id={alert.id}
                      name={alert.mensaje}
                      iconoId={alert.iconoId}
                      fecha={alert.fecha}
                      tipo={alert.tipo}
                      dispositivo={alert.dispositivo}
                      onMarcarLeida={async (id) => {
                        await fetch(`${DOMAIN_URL}/alertas/marcar-una/${id}`, {
                          method: "PUT",
                        });
                        setAlerts((prev) =>
                          prev.filter((alert) => alert.id !== id)
                        );
                      }}
                    />
                  </div>
                );
              } else {
                return (
                  <AlertsCard
                    key={alert.id}
                    id={alert.id}
                    name={alert.mensaje}
                    iconoId={alert.iconoId}
                    fecha={alert.fecha}
                    tipo={alert.tipo}
                    dispositivo={alert.dispositivo}
                    onMarcarLeida={async (id) => {
                      await fetch(`${DOMAIN_URL}/alertas/marcar-una/${id}`, {
                        method: "PUT",
                      });
                      setAlerts((prev) =>
                        prev.filter((alert) => alert.id !== id)
                      );
                    }}
                  />
                );
              }
            })}
          </div>
        )}

        {loading && <p>Cargando más alertas...</p>}
        {!hasMore && <p>No hay más alertas disponibles.</p>}
      </div>
    </div>
  );
};

export default AlertasPage;
