import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { darkenHex } from "../../utils/colorUtils";

const DevicePieChart = ({ devices, activeDeviceButton }) => {
  const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
  const chartBorderColor = isDarkMode ? "#333333" : "#e0e0e0";
  const chartTextColor = isDarkMode ? "#f0f0f0" : "#333333";
  const toolbarTextColor = isDarkMode ? "#e0e0e0" : "#333333";
  
  const generateRandomColor = (index) => {
    const hue = (index * 137.508) % 360;
    return `hsl(${hue}, 65%, ${isDarkMode ? "60%" : "50%"})`;
  };

  const colors = devices.map((device, index) => {
    const baseColor = generateRandomColor(index);
    return device.id === activeDeviceButton ? darkenHex(baseColor, 20) : baseColor;
  });

  const series = [
    {
      name: "Consumo (kWh)",
      data: devices.map(device => ({
        x: device.nombre,
        y: device.consumoActual,
        fillColor: colors[devices.indexOf(device)]
      }))
    }
  ];

  // Función para calcular la escala dinámicamente
  const calculateDynamicScale = (maxValue) => {
    if (maxValue <= 0) return { max: 100, tickAmount: 5, decimals: 2 };

    // Calcular orden de magnitud
    const magnitude = Math.floor(Math.log10(maxValue));
    const normalized = maxValue / Math.pow(10, magnitude);

    let step, decimals, tickAmount;

    if (magnitude < 0) {
      // Valores muy pequeños (decimales)
      decimals = 2;
      step = Math.pow(10, magnitude - 1);
      tickAmount = 5;
    } else if (maxValue < 1) {
      // Menores a 1
      decimals = 2;
      step = 0.1;
      tickAmount = 5;
    } else if (maxValue < 10) {
      // Entre 1 y 10
      decimals = 2;
      step = 1;
      tickAmount = 5;
    } else if (maxValue < 100) {
      // Entre 10 y 100
      decimals = 1;
      step = 5;
      tickAmount = 5;
    } else if (maxValue < 1000) {
      // Entre 100 y 1000
      decimals = 0;
      step = 50;
      tickAmount = 5;
    } else {
      // Mayores a 1000
      decimals = 0;
      step = Math.pow(10, Math.floor(Math.log10(maxValue)) - 1);
      tickAmount = 5;
    }

    // Redondear hacia arriba
    const maxScale = Math.ceil(maxValue * 1.1 / step) * step;

    return { 
      max: maxScale, 
      tickAmount, 
      decimals,
      step
    };
  };

  const maxValue = Math.max(...devices.map(d => d.consumoActual), 0);
  const scaleConfig = calculateDynamicScale(maxValue);

  const options = {
    chart: {
      type: "bar",
      height: 400,
      animations: { enabled: true },
      foreColor: chartTextColor,
      fontFamily: "Nunito",
      zoom: { enabled: false },
      selection: { enabled: false },
      toolbar: { 
        show: true, 
        tools: { 
          download: true, 
          selection: false, 
          zoom: false, 
          zoomin: false, 
          zoomout: false, 
          pan: false, 
          reset: false 
        },
        offsetX: 0,
        offsetY: 0,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        dataLabels: {
          position: "right",
          maxWidth: 200,
          offsetX: 10,
        },
        columnWidth: "75%",
      },
    },
    fill: {
      opacity: 1,
    },
    stroke: {
      show: false,
      width: 2,
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
    xaxis: {
      type: "numeric",
      min: 0,
      max: scaleConfig.max,
      tickAmount: scaleConfig.tickAmount,
      labels: {
        formatter: (value) => {
          if (scaleConfig.decimals === 0) {
            return Math.round(value).toString();
          } else if (scaleConfig.decimals === 1) {
            return value.toFixed(1);
          } else {
            return value.toFixed(2);
          }
        },
        style: {
          fontSize: "11px",
          colors: chartTextColor,
        },
      },
      title: {
        text: "Consumo (kWh)",
        style: {
          fontSize: "12px",
          fontWeight: 600,
          color: chartTextColor,
        },
      },
    },
    yaxis: {
      title: {
        text: undefined,
      },
      labels: {
        style: {
          fontSize: "12px",
          colors: chartTextColor,
        },
      },
    },
    tooltip: {
      hideEmptySeries: false,
      fillSeriesColor: true,
      theme: isDarkMode ? "dark" : "light",
      y: {
        formatter: (value) => `${value.toFixed(2)} kWh`
      }
    },
    dataLabels: {
      enabled: true,
      offsetX: 10,
      style: {
        fontSize: "12px",
        colors: [chartTextColor],
      },
      formatter: (value) => `${value.toFixed(2)} kWh`
    },
    legend: {
      show: false,
    },
  };

  return (
    <ApexCharts
      key={JSON.stringify({ devices, activeDeviceButton })}
      options={options}
      series={series}
      type="bar"
      height={Math.max(300, devices.length * 50)}
    />
  );
};

export default DevicePieChart;