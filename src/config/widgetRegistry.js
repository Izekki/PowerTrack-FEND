import KpiConsumo from '../components/HomeWidgets/KpiConsumo';
import KpiCosto from '../components/HomeWidgets/KpiCosto';
import KpiAlertas from '../components/HomeWidgets/KpiAlertas';
import ChartHistorial from '../components/HomeWidgets/ChartHistorial';
import TopDevicesList from '../components/HomeWidgets/TopDevicesList'; // (Si usas el antiguo o el nuevo, asegúrate de la ruta)
import SummaryWidget from '../components/HomeWidgets/SummaryWidget'; // <--- IMPORTAR NUEVO WIDGET

export const WIDGET_REGISTRY = {
  "kpi_consumo": {
    component: KpiConsumo,
    label: "Consumo estimado",
    needsData: "summary"
  },
  "kpi_costo": {
    component: KpiCosto,
    label: "Costo estimado",
    needsData: "summary"
  },
  "kpi_alertas": {
    component: KpiAlertas,
    label: "Alertas",
    needsData: "summary"
  },
  "chart_historial": {
    component: ChartHistorial,
    label: "Histórico de consumo",
    needsData: "chart"
  },
  "list_top_devices": {
    component: TopDevicesList,
    label: "Comparador de dispositivos",
    needsData: "devices"
  },
  "summary_widget": { 
    component: SummaryWidget,
    label: "Dispositivos Vinculados",
    needsData: "none" 
  }
};