import React from "react";
import ApexCharts from "react-apexcharts";
import { darkenHex } from "../../utils/colorUtils";

const DevicePieChart = ({ devices, activeDeviceButton }) => {
  const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
  const chartBorderColor = isDarkMode ? "#333333" : "#e0e0e0";
  const chartTextColor = isDarkMode ? "#f0f0f0" : "#333333";
  const generateRandomColor = (index) => {
    const hue = (index * 137.508) % 360;
    return `hsl(${hue}, 65%, ${isDarkMode ? "60%" : "50%"})`;
  };

  const colors = devices.map((device, index) => {
    const baseColor = generateRandomColor(index);
    return device.id === activeDeviceButton ? darkenHex(baseColor, 20) : baseColor;
  });

  const series = devices.map(device => device.consumoActual);

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
    labels: devices.map(device => device.nombre),
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
      key={JSON.stringify({ devices, activeDeviceButton })}
      options={options}
      series={series}
      type="pie"
      height={300}
    />
  );
};

export default DevicePieChart;