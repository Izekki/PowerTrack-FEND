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
  
  // Estados de Configuración y Tendencias
  const [layout, setLayout] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [trends, setTrends] = useState({ consumoTrend: 0, consumoSign: 'neutral', costoStatus: 'neutral' });

  // --- CONFIGURACIÓN DE SENSORES DND ---
  // Configuramos para que requiera "mantener pulsado" un poco para arrastrar, como en iOS
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10, // Mover 10px antes de empezar a arrastrar (evita clicks falsos)
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Mantener presionado 250ms en móvil para arrastrar
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 1. Cargar Datos (Igual que antes)
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

        // Procesamiento de Datos (Resumido para brevedad, misma lógica previa)
        const dispositivos = Array.isArray(dataConsumo.resumenDispositivos) ? dataConsumo.resumenDispositivos : [];
        const consumoTotalDia = dispositivos.reduce((acc, curr) => acc + (Number(curr.consumoActualKWh) || 0), 0);
        const costoMensualEstimado = consumoTotalDia * 30 * 1.5;
        
        // Tendencias
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

  // --- Handlers Edición ---
  const handleSaveLayout = async () => {
    try {
      const response = await fetch(`${DOMAIN_URL}/user/dashboard-config/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layout })
      });
      if (response.ok) { setIsEditMode(false); showAlert("success", "Guardado"); }
    } catch (e) { showAlert("error", "Error al guardar"); }
  };

  const removeWidget = (key) => setLayout(l => l.filter(k => k !== key));
  const addWidget = (widgetKey) => {
    if (!layout.includes(widgetKey)) {
      setLayout(prev => [widgetKey, ...prev]);
    }
    setShowAddModal(false);
  };
  const availableWidgets = Object.keys(WIDGET_REGISTRY).filter(k => !layout.includes(k));

  // Render Widget
  const renderContent = (widgetKey) => {
    const config = WIDGET_REGISTRY[widgetKey];
    if (!config) return null;
    const Component = config.component;
    
    // Props dinámicas
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
    <div className={`home-dashboard ${isEditMode ? 'edit-mode' : ''}`}>
      <div className="dashboard-header">
        <h1>Monitoreo de consumo eléctrico</h1>
        <div className="header-controls">
          {!isEditMode ? (
            <button className="btn-edit-mode" onClick={() => setIsEditMode(true)}>Editar</button>
          ) : (
            <>
              <button className="btn-add-widget" onClick={() => setShowAddModal(true)}>+ Agregar</button>
              <button className="btn-save-mode" onClick={handleSaveLayout}>Guardar</button>
            </>
          )}
        </div>
      </div>

      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
        // Solo permitimos drag en modo edición
        // Si quieres permitirlo siempre, quita esta prop o ponla en true
        // disabled={!isEditMode} 
      >
        <SortableContext items={layout} strategy={rectSortingStrategy}>
          <div className="dashboard-unified-grid">
            {layout.map((key) => (
              <SortableWidget 
                key={key} 
                id={key} 
                isEditMode={isEditMode}
                widgetType={key} // Para saber si es kpi o full
              >
                {renderContent(key)}
              </SortableWidget>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {showAddModal && (
        <div className="add-widget-modal">
          <div className="modal-header">
            <h3>Agregar Widget</h3>
            <button onClick={() => setShowAddModal(false)}>✕</button>
          </div>
          <div className="available-widgets-grid">
            {availableWidgets.map(key => (
              <div key={key} className="widget-option" onClick={() => addWidget(key)}>
                {WIDGET_REGISTRY[key].label} +
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;