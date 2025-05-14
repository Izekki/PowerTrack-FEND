import React from "react";
import ApexCharts from "react-apexcharts";
import { darkenHex } from "../../utils/colorUtils";

const DevicePieChart = ({ devices, activeButton }) => {
  const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
  const chartBorderColor = isDarkMode ? "#333333" : "#e0e0e0";
  const chartShadow = isDarkMode
    ? "0 2px 6px rgba(255, 255, 255, 0.05)"
    : "0 2px 6px rgba(0, 0, 0, 0.1)";
  const chartTextColor = isDarkMode ? "#f0f0f0" : "#333333";
  const defaultColors = isDarkMode
    ? ["#81c784", "#fff176", "#ffb74d", "#ef5350"]
    : ["#4caf50", "#ffeb3b", "#ffa726", "#e53935"];

  const series = devices.map(device => device.consumoActual);

  const colors = devices.map((device, index) => {
    const baseColor = defaultColors[index % defaultColors.length];
    return device.id === activeButton ? darkenHex(baseColor, 100) : baseColor;
  });

  const options = {
    chart: {
      type: "pie",
      height: 300,
      animations: { enabled: true },
      foreColor: chartTextColor,
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
        customScale: 1,
        dataLabels: { enabled: false },
        donut: {
          labels: {
            show: false,
            name: {},
            value: {},
            total: {},
          },
        },
      },
    },
    fill: {
      colors: colors,
      opacity: 1,
    },
    stroke: {
      show: true,
      width: 5,
      colors: [chartBorderColor],
    },
    dropShadow: {
      enabled: true,
      top: 2,
      left: 0,
      blur: 4,
      color: chartBorderColor,
      opacity: 0.15,
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'darken',
          value: 0.3,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
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
      theme: isDarkMode ? "dark" : "light",
    },
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