import React from "react";
import ApexCharts from "react-apexcharts";
import { darkenHex } from "../../utils/colorUtils";

const DevicePieChart = ({ devices, activeButton }) => {
  const defaultColors = ["#81c784", "#ffeb3b", "#ffa726", "#e53935"];

  const series = devices.map(device => device.consumoActual);

  const colors = devices.map((device, index) => {
    const baseColor = defaultColors[index % defaultColors.length];
    return device.id === activeButton ? darkenHex(baseColor, 50) : baseColor;
  });

  const options = {
      chart: {
        type: "pie",
        height: 300,
        animations: { enabled: true },
        foreColor: "var(--text-primary)",
        fontFamily: "Nunito",
        zoom: { enabled: false },
        selection: { enabled: false },
        toolbar: { show: false },
        events: {
          dataPointSelection: () => false,
          dataPointMouseEnter: () => false,
          dataPointMouseLeave: () => false,
          click: () => false,
        },
      },
      plotOptions: {
        pie: {
          offsetX: -75,
          expandOnClick: false,
          dataLabels: { enabled: false },
          donut: {
            labels: {
              show: false, // opcional, si no usas donut
              name: {},
              value: {},
              total: {}
            },
          },
        },
      },
      fill: {
        colors: colors,
        opacity: 1,
      },
      labels: devices.map(device => device.dispositivo_nombre),
      legend: {
        position: "left",
        fontSize: 14,
        offsetX: 25,
        itemMargin: { vertical: 0 },
        markers: { size: 7 },
        onItemClick: {
          toggleDataSeries: false,
        },
        onItemHover: {
          highlightDataSeries: false,
        },
      },
      tooltip: {
        hideEmptySeries: false,
        fillSeriesColor: true,
        theme: "dark",
      }
    };


  return (
    <ApexCharts
      key={JSON.stringify({ devices, activeButton })}
      options={options}
      series={series}
      type="pie"
      height={300}
    />
  );
};
export default DevicePieChart;
