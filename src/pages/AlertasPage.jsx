import React, { useCallback, useEffect, useRef, useState } from 'react';
import AlertsCard from '../components/AlertasComponents/AlertsCard';
import { useAuth } from '../context/AuthContext';
import '../styles/AlertasPage.css';
import { useAlert } from '../context/AlertContext';
import { apiGet, apiPut } from '../utils/apiHelper';
import { useNavigate } from 'react-router-dom';

const AlertasPage = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;
  const { markAlertsAsRead } = useAlert();
  const filter = 'todos';

  const observer = useRef();
  const isFetchingRef = useRef(false);
  const pageRef = useRef(0);
  const hasMoreRef = useRef(true);
  const alertsRef = useRef([]);

  // Cargar más alertas cuando llegamos al final
  const lastAlertRef = useRef();

  const loadAlerts = useCallback(async (reset = false) => {
    if (isFetchingRef.current || (!hasMoreRef.current && !reset)) return;

    isFetchingRef.current = true;
    setLoading(true);

    const offset = reset ? 0 : pageRef.current * limit;

    try {
      // Añadimos el filtro en la URL
      const response = await apiGet(
        `/alertas/usuario/${userId}?limit=${limit}&offset=${offset}&filtro=${filter}`
      );
           
      // Manejar diferentes formatos de respuesta
      let data = response;
      if (response && !Array.isArray(response)) {
        // Si no es un array, intentar extraer el array de diferentes propiedades comunes
        data = response.data || response.alertas || response.results || [];
      }

      // Validar que data sea un array
      if (!Array.isArray(data)) {
        throw new Error('Formato de respuesta inválido');
      }

      const formatted = data.map(alert => ({
        id: alert.id,
        mensaje: alert.mensaje,
        fecha: new Date(alert.fecha).toLocaleString('es-MX'),
        tipo: alert.tipo_alerta_clave || 'Sin tipo',
        iconoId: alert.icono_svg,
        dispositivo: alert.tipo_dispositivo,
      }));

      if (reset) {
        setAlerts(formatted);
        pageRef.current = 1;
        const nextHasMore = formatted.length === limit;
        setHasMore(nextHasMore);
        hasMoreRef.current = nextHasMore;
      } else {
        setAlerts(prev => [...prev, ...formatted]);
        pageRef.current = pageRef.current + 1;
        const nextHasMore = formatted.length === limit;
        setHasMore(nextHasMore);
        hasMoreRef.current = nextHasMore;
      }

    } catch (err) {
      console.error('Error cargando alertas:', err);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [filter, limit, userId]);

  // Inicializar carga
  useEffect(() => {
    if (userId) {
      pageRef.current = 0;
      hasMoreRef.current = true;
      setHasMore(true);
      loadAlerts(true);
    }
  }, [userId, loadAlerts]);

  useEffect(() => {
    alertsRef.current = alerts;
  }, [alerts]);


  useEffect(() => {
  if (!userId) return;

  const interval = setInterval(async () => {
    try {
      const response = await apiGet(
        `/alertas/usuario/${userId}?limit=10&offset=0&filtro=${filter}`
      );
      
      // Manejar diferentes formatos de respuesta
      let data = response;
      if (response && !Array.isArray(response)) {
        data = response.data || response.alertas || response.results || [];
      }

      // Validar que data sea un array
      if (!Array.isArray(data)) {
        console.error('Formato de respuesta inválido en polling:', response);
        return;
      }

      const nuevas = data
        .map(alert => ({
          id: alert.id,
          mensaje: alert.mensaje,
          fecha: new Date(alert.fecha).toLocaleString('es-MX'),
          tipo: alert.tipo_alerta_clave || 'Sin tipo',
          iconoId: alert.icono_svg,
          dispositivo: alert.tipo_dispositivo,
        }))
        .filter(alertNueva => !alertsRef.current.some(alertExistente => alertExistente.id === alertNueva.id));

      if (nuevas.length > 0) {
        setAlerts(prev => [...nuevas, ...prev]);
      }
    } catch (err) {
      console.error("Error al verificar nuevas alertas:", err);
    }
  }, 15000); // cada 15 segundos

  return () => clearInterval(interval);
}, [userId, filter]);


  // Observar último elemento para cargar más
  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    if (loading || !hasMore) return;

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMoreRef.current) {
        observer.current?.disconnect();
        loadAlerts();
      }
    });

    if (lastAlertRef.current) observer.current.observe(lastAlertRef.current);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loading, hasMore, loadAlerts]);

  return (
  <div className="alertas-page-container">
    <div className="alertas-header">
      {/* Botón configuración de alertas (Izquierda) */}
      <div className="left-side">
        <button
          className="btn-style-default btn-configurar"
          onClick={() => navigate('/alertas/configuracion')}
          aria-label="Configuración"
          title="Configuración"
          style={{
            width: 24,
            height: 24,
            padding: 0,
            border: "none",
            background: "transparent",
          }}
        >
          <svg
            className="alertas-config-icon"
            width="64px"
            height="64px"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
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
      </div>

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
                      await apiPut(`/alertas/marcar-una/${id}`);
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
                    await apiPut(`/alertas/marcar-una/${id}`);
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

      {loading && hasMore && <p>Cargando más alertas...</p>}
      {!hasMore && alerts.length > 0 && <p>No hay más alertas disponibles.</p>}
    </div>
  </div>
);
};

export default AlertasPage;