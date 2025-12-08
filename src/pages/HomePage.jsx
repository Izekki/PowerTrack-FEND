import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/HomePage.css";
import { WIDGET_REGISTRY } from "../config/widgetRegistry";
import { showAlert } from "../components/Alert";

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

const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL;

const HomePage = () => {
  const { userId } = useAuth();

  // Estados de Datos
  const [summaryData, setSummaryData] = useState({ consumoDia: 0, costoMes: 0, alertasDia: 0 });
  const [chartData, setChartData] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de Configuración
  const [layout, setLayout] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  // Eliminamos showAddModal, ya no se usa.
  
  const [trends, setTrends] = useState({ consumoTrend: 0, consumoSign: 'neutral', costoStatus: 'neutral' });

  // --- SENSORES DND ---
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // 1. Cargar Datos
  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resConsumo, resHistorial, resAlertas, resConfig] = await Promise.all([
          fetch(`${DOMAIN_URL}/electrical_analysis/consumoPorDispositivosGrupos/${userId}`),
          fetch(`${DOMAIN_URL}/electrical_analysis/historial_detallado/${userId}`),
          fetch(`${DOMAIN_URL}/alertas/usuario/${userId}?limit=100&filtro=todos`),
          fetch(`${DOMAIN_URL}/user/dashboard-config/${userId}`)
        ]);

        const dataConsumo = await resConsumo.json();
        const dataHistorial = await resHistorial.json();
        const dataAlertas = await resAlertas.json();
        const dataConfig = await resConfig.json();

        // Configuración Layout
        const defaultLayout = ["kpi_consumo", "kpi_costo", "kpi_alertas", "chart_historial", "list_top_devices"];
        setLayout(dataConfig.layout || defaultLayout);

        // Procesamiento de Datos
        const dispositivos = Array.isArray(dataConsumo.resumenDispositivos) ? dataConsumo.resumenDispositivos : [];
        const consumoTotalDia = dispositivos.reduce((acc, curr) => acc + (Number(curr.consumoActualKWh) || 0), 0);
        const costoMensualEstimado = consumoTotalDia * 30 * 1.5;
        
        let diff = 0; let sign = 'neutral';
        const sem = Array.isArray(dataHistorial) ? dataHistorial.find(d => d.rango === 'semana') : null;
        if(sem?.detalles?.length >= 2) {
           const ayer = Number(sem.detalles[sem.detalles.length-2].promedio)||0;
           if(ayer>0) {
             diff = ((consumoTotalDia - ayer)/ayer)*100;
             sign = diff > 0 ? 'negative' : 'positive';
           }
        }
        
        const hoy = new Date().toLocaleDateString('es-MX');
        const alertas = Array.isArray(dataAlertas) ? dataAlertas.filter(a => new Date(a.fecha).toLocaleDateString('es-MX') === hoy).length : 0;

        setSummaryData({ consumoDia: consumoTotalDia.toFixed(2), costoMes: costoMensualEstimado.toFixed(2), alertasDia: alertas });
        setDeviceList([...dispositivos].sort((a,b) => b.consumoActualKWh - a.consumoActualKWh).slice(0,3));
        setChartData(Array.isArray(dataHistorial) ? dataHistorial.find(d => d.rango === 'dia')?.detalles || [] : []);
        setTrends({ consumoTrend: Math.abs(diff).toFixed(1), consumoSign: sign, costoStatus: costoMensualEstimado > 1000 ? 'warning' : 'ok' });

      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchData();
  }, [userId]);

  // --- HANDLERS DND ---
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

  // --- Funciones de Edición ---
  const handleSaveLayout = async () => {
    try {
      const response = await fetch(`${DOMAIN_URL}/user/dashboard-config/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layout })
      });
      if (response.ok) { 
        setIsEditMode(false); 
        showAlert("success", "Guardado"); 
      }
    } catch (e) { showAlert("error", "Error al guardar"); }
  };

  const removeWidget = (key) => setLayout(l => l.filter(k => k !== key));
  
  // Agregar widget: Se añade al inicio
  const addWidget = (widgetKey) => {
    if (!layout.includes(widgetKey)) {
      setLayout(prev => [widgetKey, ...prev]);
    }
  };
  
  const availableWidgets = Object.keys(WIDGET_REGISTRY).filter(k => !layout.includes(k));

  const renderContent = (widgetKey) => {
    const config = WIDGET_REGISTRY[widgetKey];
    if (!config) return null;
    const Component = config.component;
    
    const props = { loading };
    if (config.needsData === 'summary') { props.data = summaryData; props.trends = trends; }
    else if (config.needsData === 'chart') props.chartData = chartData;
    else if (config.needsData === 'devices') props.deviceList = deviceList;

    return (
        <div className="widget-inner-content">
            {isEditMode && (
                <button className="delete-widget-btn" onPointerDown={(e) => e.stopPropagation()} onClick={() => removeWidget(widgetKey)}>✕</button>
            )}
            <Component {...props} />
        </div>
    );
  };

  return (
    // Agregamos padding-bottom grande cuando está en modo edición para que el panel no tape el contenido
    <div className={`home-dashboard ${isEditMode ? 'edit-mode' : ''}`} style={{ paddingBottom: isEditMode ? '280px' : '100px' }}>
      <div className="dashboard-header">
        <h1>Monitoreo de consumo eléctrico</h1>
      </div>

      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={layout} strategy={rectSortingStrategy}>
          <div className="dashboard-unified-grid">
            {layout.map((key) => (
              <SortableWidget 
                key={key} 
                id={key} 
                isEditMode={isEditMode}
                widgetType={key}
              >
                {renderContent(key)}
              </SortableWidget>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* BOTÓN UNIFICADO: CENTRADO Y AL FINAL */}
      <div className="edit-button-container">
         <button 
            className={isEditMode ? "btn-save-mode-bottom" : "btn-edit-mode-bottom"}
            onClick={isEditMode ? handleSaveLayout : () => setIsEditMode(true)}
         >
           {isEditMode ? "Guardar Dashboard" : "Editar widgets"}
         </button>
      </div>

      {/* PANEL DE WIDGETS PERSISTENTE (Solo en modo edición) */}
      {isEditMode && (
        <div className="add-widget-modal persistent-drawer">
          <div className="modal-header">
            <h3 className="modal-title">Widgets Disponibles</h3>
            {/* No hay botón de cerrar, se cierra al dar clic en "Guardar" */}
          </div>
          
          <div className="available-widgets-grid">
            {availableWidgets.length > 0 ? (
              availableWidgets.map(key => (
                <div key={key} className="widget-option" onClick={() => addWidget(key)}>
                  <span>{WIDGET_REGISTRY[key].label}</span>
                  <div style={{fontSize: '24px', marginTop: '5px', color: 'var(--btn-primary-bg)'}}>+</div>
                </div>
              ))
            ) : (
              <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem', width: '100%', textAlign: 'center', fontStyle: 'italic'}}>
                Todos los widgets están activos.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;