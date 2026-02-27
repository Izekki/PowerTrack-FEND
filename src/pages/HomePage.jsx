import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/HomePage.css";
import { WIDGET_REGISTRY } from "../config/widgetRegistry";
import { showAlert } from "../components/CommonComponents/Alert";
import { createAuthHeaders, getApiDomain } from "../utils/apiHelper";

// --- DND KIT IMPORTS ---
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
  MouseSensor
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import SortableWidget from "../components/HomeWidgets/SortableWidget";

const DOMAIN_URL = getApiDomain();

const HomePage = () => {
  const { userId } = useAuth();

  // Estados
  const [summaryData, setSummaryData] = useState({ consumoDia: 0, costoMes: 0, alertasDia: 0 });
  const [chartData, setChartData] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupList, setGroupList] = useState([]); // <--- NUEVO ESTADO PARA GRUPOS
  
  // Rango de Tiempo (Zoom)
  const [timeRange, setTimeRange] = useState(24); // 1, 8, 12, 24
  
  // REFERENCIA PARA EL LÍMITE FUTURO (Evita problemas de closure en setInterval)
  const futureLimitRef = useRef(null);

  // Configuración Dashboard
  const [layout, setLayout] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [trends, setTrends] = useState({ consumoTrend: 0, consumoSign: 'neutral', costoStatus: 'neutral' });

  // Sensores DnD
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // RESETEAR EL LÍMITE CUANDO CAMBIA EL ZOOM
  useEffect(() => {
    futureLimitRef.current = null;
  }, [timeRange]);

  // 1. Cargar Datos + Polling
  useEffect(() => {
    if (!userId) return;

    // Formateador para MySQL
    const formatDateForMySQL = (date) => {
      const pad = (n) => n.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    // Formateador para la etiqueta de la gráfica (HH:mm)
    const formatLabel = (date) => {
      const pad = (n) => n.toString().padStart(2, '0');
      return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    // Parsea etiqueta del backend (YYYY-MM-DD HH:mm) a Date en UTC
    const parseBackendEtiqueta = (etiqueta) => {
      if (!etiqueta) return null;
      // Formato: "YYYY-MM-DD HH:mm"
      const match = etiqueta.match(/^(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2})/);
      if (match) {
        const [, year, month, day, hour, min] = match;
        // Parsear como UTC
        return new Date(`${year}-${month}-${day}T${hour}:${min}:00Z`);
      }
      return null;
    };

    const fetchData = async (isBackgroundRefresh = false) => {
      try {
        if (!isBackgroundRefresh) setLoading(true);

        const now = new Date();
        let bufferMs = 0;
        let pastMs = 0;

        // --- CONFIGURACIÓN DE RANGOS ---
        if (timeRange === 24) {
            pastMs = 23 * 60 * 60 * 1000;
            bufferMs = 1 * 60 * 60 * 1000;
        } else if (timeRange === 1) {
            pastMs = 60 * 60 * 1000;
            bufferMs = 60 * 60 * 1000;
        } else {
            const totalMs = timeRange * 60 * 60 * 1000;
            pastMs = totalMs * 0.9;
            bufferMs = totalMs * 0.1;
        }

        // --- LÓGICA DE "OBJETIVO FUTURO ESTABLE" ---
        let currentFuture = futureLimitRef.current ? new Date(futureLimitRef.current) : null;

        if (!currentFuture || now >= currentFuture) {
            console.log("🔄 Actualizando límite futuro...");
            currentFuture = new Date(now.getTime() + bufferMs);
            futureLimitRef.current = currentFuture.toISOString();
        }

        // SEPARAR: Límite Visual vs Límite de Petición
        const end = currentFuture; // Límite visual (gráfica)
        const start = new Date(now.getTime() - pastMs);

        // Petición con 2h extra para detectar datos adelantados del simulador
        const BUFFER_MINUTES_FETCH = 120; // 2 horas
        const endForFetch = new Date(end.getTime() + (BUFFER_MINUTES_FETCH * 60000));

        const fechaInicio = formatDateForMySQL(start);
        const fechaFin = formatDateForMySQL(endForFetch);
        const queryParams = `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;

        const authHeaders = createAuthHeaders();
        const promises = [
          fetch(`${DOMAIN_URL}/electrical_analysis/consumoPorDispositivosGruposReal/${userId}${queryParams}`, { headers: authHeaders }),
          fetch(`${DOMAIN_URL}/electrical_analysis/historial_detallado/${userId}${queryParams}`, { headers: authHeaders }),
          fetch(`${DOMAIN_URL}/alertas/usuario/${userId}?limit=100&filtro=todos`, { headers: authHeaders })
        ];

        if (!isBackgroundRefresh) promises.push(fetch(`${DOMAIN_URL}/user/dashboard-config/${userId}`, { headers: authHeaders }));

        const responses = await Promise.all(promises);
        const [resConsumo, resHistorial, resAlertas, resConfig] = responses;

        const dataConsumo = await resConsumo.json();
        const dataHistorial = await resHistorial.json();
        const dataAlertas = await resAlertas.json();

        // --- VERIFICAR SI LLEGÓ UNA NUEVA MEDICIÓN EN EL LÍMITE ---
        const historialDiaTemp = Array.isArray(dataHistorial) ? dataHistorial.find(d => d.rango === 'dia')?.detalles || [] : [];
        
        if (historialDiaTemp.length > 0) {
            const ultimaMedicion = historialDiaTemp[historialDiaTemp.length - 1];
            const fechaUltimaMedicion = parseBackendEtiqueta(ultimaMedicion.etiqueta);
            
            if (fechaUltimaMedicion && currentFuture) {
                // Comparar fechas completas (no solo horas) - Resuelve el problema de medianoche
                if (fechaUltimaMedicion >= currentFuture) {
                    console.log(`⚡ Nueva medición alcanzó el límite: ${ultimaMedicion.etiqueta} >= ${formatLabel(currentFuture)}`);
                    console.log("🔄 Recalculando límite futuro...");
                    
                    // Recalcular: límite = timestamp de la última medición + 1h
                    currentFuture = new Date(fechaUltimaMedicion.getTime() + (60 * 60 * 1000));
                    futureLimitRef.current = currentFuture.toISOString();
                    
                    console.log(`✅ Nuevo límite futuro: ${formatLabel(currentFuture)}`);
                }
            }
        }

        if (resConfig && !isBackgroundRefresh) {
            const dataConfig = await resConfig.json();
            const defaultLayout = ["kpi_consumo", "kpi_costo", "kpi_alertas", "chart_historial", "list_top_devices"];
            const layoutData = dataConfig.layout;
            
            // Si layout es un string JSON, parsearlo; si es array, usarlo directo
            let parsedLayout = defaultLayout;
            if (layoutData) {
                try {
                    parsedLayout = typeof layoutData === 'string' ? JSON.parse(layoutData) : layoutData;
                } catch (e) {
                    console.error('Error parsing layout:', e);
                    parsedLayout = defaultLayout;
                }
            }
            setLayout(Array.isArray(parsedLayout) ? parsedLayout : defaultLayout);
        }

        // --- PROCESAMIENTO ---
        const resumenGeneral = dataConsumo?.resumenGeneral || {};
        const dispositivos = Array.isArray(dataConsumo?.resumenDispositivos) ? dataConsumo.resumenDispositivos : [];
        const consumoTotalDia = Number(resumenGeneral.consumoRealKWh || 0);
        const costoMensualEstimado = Number(resumenGeneral.costoMensualProyectadoMXN || 0);
        
        const hoyString = new Date().toLocaleDateString('es-MX');
        const alertas = Array.isArray(dataAlertas) ? dataAlertas.filter(a => new Date(a.fecha).toLocaleDateString('es-MX') === hoyString).length : 0;

        setSummaryData({ consumoDia: consumoTotalDia.toFixed(2), costoMes: costoMensualEstimado.toFixed(2), alertasDia: alertas });
        setDeviceList([...dispositivos].sort((a,b) => (b.consumoRealKWh || 0) - (a.consumoRealKWh || 0)).slice(0,3));
        
        // --- GRÁFICA CON PUNTO FANTASMA ESTABLE ---
        let historialDia = Array.isArray(dataHistorial) ? dataHistorial.find(d => d.rango === 'dia')?.detalles || [] : [];
        
        // PRIMERO filtrar con etiquetas completas, LUEGO limpiar para visualización
        historialDia = historialDia
          .filter(item => {
            // Parsear la etiqueta completa (YYYY-MM-DD HH:mm) para comparar con el límite visual
            const fechaParsed = parseBackendEtiqueta(item.etiqueta);
            if (!fechaParsed) return true; // Si no se puede parsear, incluir
            // Solo incluir si es <= límite visual
            return fechaParsed <= end;
          })
          .map(item => {
            // Ahora sí limpiar etiquetas: extraer solo HH:mm para visualización
            const match = item.etiqueta.match(/(\d{2}:\d{2})/);
            const etiquetaLimpia = match ? match[1] : item.etiqueta;
            return { ...item, etiqueta: etiquetaLimpia };
          });
        
        if (historialDia.length > 0) {
            // NO agregamos el punto futuro, dejamos que la gráfica siga avanzando naturalmente
            // La lógica de límite sigue funcionando para detectar cuando actualizar el rango
        }
        
        setChartData(historialDia);
        setTrends({ consumoTrend: '0.0', consumoSign: 'neutral', costoStatus: costoMensualEstimado > 1000 ? 'warning' : 'ok' });

      } catch (error) { console.error(error); } finally { if (!isBackgroundRefresh) setLoading(false); }
    };

    fetchData(false);
    const intervalId = setInterval(() => fetchData(true), 5000); 
    return () => clearInterval(intervalId);

  }, [userId, timeRange]);

  // ... (Resto de handlers DragEnd, EditMode, RenderContent igual que antes)
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setLayout((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSaveLayout = async () => {
    try {
      const authHeaders = createAuthHeaders();
      const response = await fetch(`${DOMAIN_URL}/user/dashboard-config/${userId}`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ layout })
      });
      if (response.ok) { setIsEditMode(false); showAlert("success", "Guardado"); }
    } catch { showAlert("error", "Error al guardar"); }
  };

  const removeWidget = (key) => setLayout(l => l.filter(k => k !== key));
  const addWidget = (widgetKey) => { if (!layout.includes(widgetKey)) setLayout(prev => [widgetKey, ...prev]); };
  const availableWidgets = Object.keys(WIDGET_REGISTRY).filter(k => !layout.includes(k));

const renderContent = (widgetKey) => {
    const config = WIDGET_REGISTRY[widgetKey];
    if (!config) return null;
    const Component = config.component;
    const props = { loading };
    
    // Configuración de props para los widgets existentes
    if (config.needsData === 'summary') { 
        props.data = summaryData; 
        props.trends = trends; 
    }
    else if (config.needsData === 'chart') {
        props.chartData = chartData;
        props.timeRange = timeRange;
        props.setTimeRange = setTimeRange;
    }
    // "devices" y "full_summary" YA NO NECESITAN PROPS ESPECÍFICAS
    // porque TopDevicesList y SummaryWidget ahora se auto-gestionan.
    // Puedes dejar el 'else if' vacío o simplemente no pasar nada.

    return (
        <div className="widget-inner-content">
            {isEditMode && <button className="delete-widget-btn" onPointerDown={(e)=>e.stopPropagation()} onClick={()=>removeWidget(widgetKey)}>✕</button>}
            <Component {...props} />
        </div>
    );
};

  return (
    <div className={`home-dashboard ${isEditMode ? 'edit-mode' : ''}`} style={{ paddingBottom: isEditMode ? '280px' : '100px' }}>
      <div className="dashboard-header">
        
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={layout} strategy={rectSortingStrategy}>
          <div className="dashboard-unified-grid">
            {layout.map((key) => (
              <SortableWidget key={key} id={key} isEditMode={isEditMode} widgetType={key}>
                {renderContent(key)}
              </SortableWidget>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="edit-button-container">
         <button className={isEditMode ? "btn-save-mode-bottom" : "btn-edit-mode-bottom"} onClick={isEditMode ? handleSaveLayout : () => setIsEditMode(true)}>
           {isEditMode ? "Guardar Dashboard" : "Editar widgets"}
         </button>
      </div>

      {isEditMode && (
        <div className="add-widget-modal persistent-drawer">
          <div className="modal-header"><h3 className="modal-title">Widgets Disponibles</h3></div>
          <div className="available-widgets-grid">
            {availableWidgets.map(key => (
                <div key={key} className="widget-option" onClick={() => addWidget(key)}>
                  <span>{WIDGET_REGISTRY[key].label}</span>
                  <div style={{fontSize: '24px', marginTop: '5px', color: 'var(--btn-primary-bg)'}}>+</div>
                </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;