import KpiConsumo from '../components/HomeWidgets/KpiConsumo';
import KpiCosto from '../components/HomeWidgets/KpiCosto';
import KpiAlertas from '../components/HomeWidgets/KpiAlertas';
import ChartHistorial from '../components/HomeWidgets/ChartHistorial';
import TopDevicesList from '../components/HomeWidgets/TopDevicesList'; // (Si usas el antiguo o el nuevo, asegúrate de la ruta)
import SummaryWidget from '../components/HomeWidgets/SummaryWidget'; // <--- IMPORTAR NUEVO WIDGET

export const WIDGET_REGISTRY = {
  "kpi_consumo": {
    component: KpiConsumo,
    label: "KPI Consumo",
    needsData: "summary"
  },
  "kpi_costo": {
    component: KpiCosto,
    label: "KPI Costo",
    needsData: "summary"
  },
  "kpi_alertas": {
    component: KpiAlertas,
    label: "KPI Alertas",
    needsData: "summary"
  },
  "chart_historial": {
    component: ChartHistorial,
    label: "Gráfica Histórica",
    needsData: "chart"
  },
  "list_top_devices": {
    component: TopDevicesList,
    label: "Top Dispositivos",
    needsData: "devices"
  },
  "summary_widget": { 
    component: SummaryWidget,
    label: "Resumen General",
    needsData: "none" 
  }
};