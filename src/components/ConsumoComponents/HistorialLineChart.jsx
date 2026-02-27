import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const HistorialLineChart = ({ detalles, onClick, isModal = false }) => {
  return (
    <div
      className={isModal ? "modal-chart-container" : "grafica-placeholder"}
      style={{ cursor: isModal ? "default" : "pointer", width: "100%", height: isModal ? "100%" : 300 }}
      onClick={!isModal ? onClick : undefined}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={detalles}
          margin={isModal ? { top: 10, right: 30, left: 10, bottom: 20 } : { top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="etiqueta" />
          <YAxis unit=" kWh" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="promedio"
            stroke={isModal ? "#82ca9d" : "#8884d8"}
            strokeWidth={isModal ? 3 : 2}
            dot={{ r: isModal ? 5 : 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistorialLineChart;
