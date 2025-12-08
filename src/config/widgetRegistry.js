import KpiConsumo from '../components/HomeWidgets/KpiConsumo';
import KpiCosto from '../components/HomeWidgets/KpiCosto';
import KpiAlertas from '../components/HomeWidgets/KpiAlertas';
import ChartHistorial from '../components/HomeWidgets/ChartHistorial';
import TopDevicesList from '../components/HomeWidgets/TopDevicesList';

// Este objeto mapea la "clave" de la BD con el Componente real
export const WIDGET_REGISTRY = {
  "kpi_consumo": {
    component: KpiConsumo,
    label: "KPI Consumo",
    needsData: "summary" // Indicador para saber qué props pasarle
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
  }
};