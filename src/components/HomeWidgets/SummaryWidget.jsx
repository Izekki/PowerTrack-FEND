import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL;

const SummaryWidget = ({ 
  dispositivos: propDispositivos, 
  grupos: propGrupos, 
  totalDispositivos: propTotalD, 
  totalGrupos: propTotalG 
}) => {
  const { userId, token } = useAuth();
  
  // NEW STATE: Controla si el widget está expandido o colapsado
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(prev => !prev);
  
  // Estado local para cuando el componente necesita hacer fetch por su cuenta
  const [localData, setLocalData] = useState({
    dispositivos: [],
    grupos: [],
    totalDispositivos: 0,
    totalGrupos: 0,
    loading: false
  });

  // Determinamos si estamos usando datos de props o datos locales
  const isUsingProps = propDispositivos !== undefined;
  
  const displayData = isUsingProps ? {
    dispositivos: propDispositivos,
    grupos: propGrupos,
    totalDispositivos: propTotalD,
    totalGrupos: propTotalG
  } : localData;

  // Efecto: Solo se ejecuta si NO se pasaron props (Modo Autónomo / HomePage)
  useEffect(() => {
    if (isUsingProps || !userId) return;

    const fetchData = async () => {
      try {
        setLocalData(prev => ({ ...prev, loading: true }));
        // Usamos el endpoint que trae la DATA COMPLETA (nombres, ubicaciones, etc)
        const response = await fetch(`${DOMAIN_URL}/user/show/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.success) {
          setLocalData({
            dispositivos: data.data.dispositivos || [],
            grupos: data.data.grupos || [],
            totalDispositivos: data.data.total_dispositivos || 0,
            totalGrupos: data.data.total_grupos || 0,
            loading: false
          });
        }
      } catch (error) {
        console.error("Error al cargar resumen en widget:", error);
        setLocalData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, [userId, token, isUsingProps]);

  if (!isUsingProps && localData.loading) {
    return (
      <div className="profilePage-card profileCard-summary">
        <p style={{ textAlign: 'center', padding: '20px' }}>Cargando resumen...</p>
      </div>
    );
  }

  // LÓGICA DE VISIBILIDAD: Muestra 2 o todos
  const displayedDevices = isExpanded 
    ? displayData.dispositivos 
    : displayData.dispositivos.slice(0, 2); // Limitar a 2

  const displayedGroups = isExpanded 
    ? displayData.grupos 
    : displayData.grupos.slice(0, 2); // Limitar a 2

  // Condición para mostrar el botón de toggle
  const needsExpansion = displayData.totalDispositivos > 2 || displayData.totalGrupos > 2;

  return (
    <div className="profilePage-card profileCard-summary" style={{ height: '100%' }}>
      <h3 className="profileCard-title">Resumen</h3>

      {/* Sección Dispositivos */}
      <div className="profileCard-subsection">
        <h4>Dispositivos ({displayData.totalDispositivos})</h4>
        {displayData.dispositivos?.length > 0 ? (
          <ul className="profileCard-list">
            {displayedDevices.map((d) => ( // Usar la lista reducida/completa
              <li key={d.id} className="profileCard-item">
                <strong>{d.nombre}</strong> 
                {d.ubicacion && <span> - {d.ubicacion}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>
            No hay dispositivos registrados.
          </p>
        )}
        {/* Indicador de elementos ocultos (solo si no está expandido y hay más de 2) */}
        {!isExpanded && displayData.totalDispositivos > 2 && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '5px' }}>
                ... y {displayData.totalDispositivos - 2} más.
            </p>
        )}
      </div>

      {/* Sección Grupos */}
      <div className="profileCard-subsection">
        <h4>Grupos ({displayData.totalGrupos})</h4>
        {displayData.grupos?.length > 0 ? (
          <ul className="profileCard-list">
            {displayedGroups.map((g) => ( // Usar la lista reducida/completa
              <li key={g.id} className="profileCard-item">
                <strong>{g.nombre}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>
            No hay grupos registrados.
          </p>
        )}
        {/* Indicador de elementos ocultos (solo si no está expandido y hay más de 2) */}
        {!isExpanded && displayData.totalGrupos > 2 && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '5px' }}>
                ... y {displayData.totalGrupos - 2} más.
            </p>
        )}
      </div>

      {/* Botón de Toggle (Flecha) */}
      {needsExpansion && (
        <button
          onClick={toggleExpand}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--link-color)',
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: '15px',
            padding: '5px 10px',
            alignSelf: 'center',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'color 0.2s ease',
          }}
          title={isExpanded ? "Mostrar menos" : "Mostrar todo"}
        >
          {isExpanded ? 'Mostrar menos' : 'Mostrar todo'}
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ 
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
            }}
          >
            {/* Ícono de flecha hacia abajo */}
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      )}
    </div>
  );
};

export default SummaryWidget;