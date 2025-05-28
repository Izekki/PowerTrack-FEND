import React, { useRef } from 'react';
import Header from '../Header';
import Chart from 'react-apexcharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import DevicePieChart from './DeviceConsumeChart';


const ReportePDFPage = ({ reporte, onGeneratePDF, isGenerating }) => {
  const pdfRef = useRef();
  console.log('Datos para el reporte', reporte);
  
  const generarPDF = async () => {
    // Llamar a la función del modal que maneja el estado de carga
    const shouldProceed = await onGeneratePDF();
    
    if (!shouldProceed) return;

    try {
      // Esperar un poco más para asegurar que todos los gráficos estén renderizados
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const canvas = await html2canvas(pdfRef.current, {
        scale: 1.5, // Buena calidad sin ser muy pesado
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        height: pdfRef.current.scrollHeight,
        width: pdfRef.current.scrollWidth,
        scrollX: 0,
        scrollY: 0
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      let pageNumber = 1;
      
      // Primera página
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Páginas adicionales
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        pageNumber++;
      }
      
      // Agregar numeración de páginas
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(128, 128, 128);
        pdf.text(`Página ${i} de ${totalPages}`, pageWidth - 40, pageHeight - 10);
      }
      
      pdf.save(`reporte_${reporte.usuario.nombre.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor intenta nuevamente.');
    }
  };

  const { usuario, resumenGeneral, grupos } = reporte;
  // Datos para gráfico de pastel principal - usando los datos correctos de cada grupo
  const pastelResumen = grupos.map((grupo) => ({
    nombre: grupo.nombre,
    consumoActual: parseFloat(grupo.consumoTotalKWh),
  }));

  // Preparar datos para gráficos de dispositivos por grupo
  const graficosPorGrupo = grupos
    .filter(grupo => grupo.dispositivos?.length > 0)
    .map(grupo => ({
      nombre: grupo.nombre,
      dispositivos: grupo.dispositivos.map(disp => ({
        id: disp.dispositivo_id,
        nombre: disp.nombre,
        consumoActual: parseFloat(disp.consumoActualKWh),
      })),
    }));

  // Interpretación del consumo usando los datos del resumen general
  const totalKWh = parseFloat(resumenGeneral.consumoTotalPeriodoKWh);
  const consumoMensual = parseFloat(resumenGeneral.consumoMensualTotalKWh);
  let mensajeInterpretativo = '';
  
  if (totalKWh < 1) {
    mensajeInterpretativo = 'Tu consumo ha sido muy bajo en este período.';
  } else if (totalKWh < 5) {
    mensajeInterpretativo = 'Tu consumo es moderado para este período.';
  } else {
    mensajeInterpretativo = 'Tu consumo es considerable para este período.';
  }

  // Generar fechas dinámicas entre fechaInicio y fechaFinal
  const getFechasRango = () => {
    const start = new Date(usuario.fechaInicio);
    const end = new Date(usuario.fechaFinal);
    const fechas = [];
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      fechas.push(new Date(date));
    }
    return fechas;
  };

  const fechas = getFechasRango();
  
  // Consumo promedio por día calculado correctamente
  const consumoPorDia = parseFloat(resumenGeneral.consumoPorDiaKWh) || 0;

  // Datos para gráfico de barras - distribuyendo el consumo total entre los días
  const barrasData = [
    {
      name: "Consumo Diario (kWh)",
      data: reporte.consumoPorDia.map((item) => parseFloat(item.consumoKWh)),
    },
  ];

  const categorias = reporte.consumoPorDia.map((item) => {
    const fecha = new Date(item.fecha);
    return `${fecha.getDate()}/${fecha.getMonth() + 1}`;
  });

  const barOptions = {
    chart: {
      type: 'bar',
      animations: {
        enabled: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '80%',
      },
    },
    xaxis: {
      categories: categorias,
      title: {
        text: 'Fecha (Día/Mes)',
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Consumo (kWh)',
        style: {
          fontSize: '12px',
        },
      },
      labels: {
        formatter: (value) => `${value.toFixed(2)} kWh`,
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toFixed(2)} kWh`,
      },
    },
    title: {
      text: 'Consumo Real por Fecha',
    },
    legend: {
      show: true,
    },
  };

  return (
    <div ref={pdfRef} style={{ padding: '20px', fontFamily: 'Nunito, sans-serif', lineHeight: '1.4' }}>
      <div style={{ pageBreakAfter: 'avoid', marginBottom: '30px' }}>
        <h1 style={{ marginBottom: '20px' }}>Reporte de Consumo Energético</h1>
        <p>
          Hola <strong>{usuario.nombre}</strong>, este reporte resume tu consumo eléctrico del{' '}
          <strong>{new Date(usuario.fechaInicio).toLocaleDateString()}</strong> al{' '}
          <strong>{new Date(usuario.fechaFinal).toLocaleDateString()}</strong>.<br />
          Fecha de generación del reporte: {usuario.fechaGeneracion}.<br />
          Período analizado: <strong>{usuario.diasEnPeriodo} días</strong>
        </p>
      </div>

      {/* Sección del Resumen General */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '15px', 
        marginBottom: '30px', 
        borderRadius: '8px',
        pageBreakInside: 'avoid',
        pageBreakAfter: 'auto'
      }}>
        <h2 style={{ marginTop: '0' }}>📊 Resumen General del Período</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
          <div>
            <p><strong>Consumo Total del Período:</strong> {resumenGeneral.consumoTotalPeriodoKWh} kWh</p>
            <p><strong>Costo Total del Período:</strong> ${resumenGeneral.costoTotalPeriodoMXN} MXN</p>
            <p><strong>Consumo Promedio por Día:</strong> {resumenGeneral.consumoPorDiaKWh} kWh</p>
            <p><strong>Costo Promedio por Día:</strong> ${resumenGeneral.costoPorDiaMXN} MXN</p>
          </div>
          <div>
            <p><strong>Proyección Consumo Diario:</strong> {resumenGeneral.consumoDiarioTotalKWh} kWh</p>
            <p><strong>Proyección Costo Diario:</strong> ${resumenGeneral.costoDiarioTotalMXN} MXN</p>
            <p><strong>Proyección Consumo Mensual:</strong> {resumenGeneral.consumoMensualTotalKWh} kWh</p>
            <p><strong>Proyección Costo Mensual:</strong> ${resumenGeneral.costoMensualTotalMXN} MXN</p>
          </div>
        </div>
      </div>

      <div style={{ pageBreakInside: 'avoid', marginBottom: '20px' }}>
        <p><em>{mensajeInterpretativo}</em></p>
      </div>

      {/* Información de Grupos */}
      <div style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
        <h2>📋 Desglose por Grupos</h2>
        {grupos.map((grupo, index) => (
          <div key={index} style={{ 
            marginBottom: '15px', 
            padding: '10px', 
            border: '1px solid #ddd', 
            borderRadius: '5px',
            pageBreakInside: 'avoid'
          }}>
            <h3 style={{ marginTop: '0' }}>{grupo.nombre}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '14px' }}>
              <p><strong>Consumo Total:</strong> {grupo.consumoTotalKWh} kWh</p>
              <p><strong>Costo Total:</strong> ${grupo.costoTotalMXN} MXN</p>
              <p><strong>Consumo por Día:</strong> {grupo.consumoPorDiaKWh} kWh</p>
              <p><strong>Proyección Mensual:</strong> {grupo.consumoMensualTotalKWh} kWh</p>
              <p><strong>Costo Mensual Proyectado:</strong> ${grupo.costoMensualTotalMXN} MXN</p>
              <p><strong>Dispositivos:</strong> {grupo.dispositivos?.length || 0}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico de Pastel Principal - Distribución por Grupos */}
      <div style={{ pageBreakInside: 'avoid', marginBottom: '40px' }}>
        <h2>🥧 Distribución del Consumo por Grupos</h2>
        <div style={{ height: '400px', marginBottom: '20px' }}>
          <DevicePieChart devices={pastelResumen} activeDeviceButton={null} />
        </div>
      </div>

      {/* Gráficos de Pastel por Grupo */}
      {graficosPorGrupo.length > 0 && (
        <>
          <div style={{ pageBreakBefore: 'always' }}>
            <h2 style={{ marginTop: '0', marginBottom: '30px' }}>📊 Consumo por Dispositivos en cada Grupo</h2>
          </div>
          {graficosPorGrupo.map((grupo, index) => (
            <div key={index} style={{ 
              marginBottom: '40px',
              pageBreakInside: 'avoid',
              pageBreakAfter: index === graficosPorGrupo.length - 1 ? 'auto' : 'always'
            }}>
              <h3 style={{ marginTop: '0', marginBottom: '20px' }}>
                {`${grupo.nombre} (${grupo.dispositivos.length} dispositivos)`}
              </h3>
              
              {/* Tabla de dispositivos del grupo */}
              <div style={{ marginBottom: '20px', pageBreakInside: 'avoid' }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse', 
                  fontSize: '11px',
                  marginBottom: '15px'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      <th style={{ border: '1px solid #ddd', padding: '6px', fontSize: '10px' }}>Dispositivo</th>
                      <th style={{ border: '1px solid #ddd', padding: '6px', fontSize: '10px' }}>Potencia (W)</th>
                      <th style={{ border: '1px solid #ddd', padding: '6px', fontSize: '10px' }}>Consumo Actual (kWh)</th>
                      <th style={{ border: '1px solid #ddd', padding: '6px', fontSize: '10px' }}>Consumo/Día (kWh)</th>
                      <th style={{ border: '1px solid #ddd', padding: '6px', fontSize: '10px' }}>Proyección Mensual (kWh)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grupos[index].dispositivos.map((dispositivo, dispIndex) => (
                      <tr key={dispIndex}>
                        <td style={{ border: '1px solid #ddd', padding: '6px', fontSize: '10px' }}>{dispositivo.nombre}</td>
                        <td style={{ border: '1px solid #ddd', padding: '6px', fontSize: '10px' }}>{dispositivo.potenciaW} W</td>
                        <td style={{ border: '1px solid #ddd', padding: '6px', fontSize: '10px' }}>{dispositivo.consumoActualKWh} kWh</td>
                        <td style={{ border: '1px solid #ddd', padding: '6px', fontSize: '10px' }}>{dispositivo.consumoPorDiaKWh} kWh</td>
                        <td style={{ border: '1px solid #ddd', padding: '6px', fontSize: '10px' }}>{dispositivo.consumoMensualKWh} kWh</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Gráfico del grupo con altura fija */}
              <div style={{ 
                height: '350px', 
                width: '100%',
                pageBreakInside: 'avoid'
              }}>
                <DevicePieChart devices={grupo.dispositivos} activeDeviceButton={null} />
              </div>
            </div>
          ))}
        </>
      )}

      {/* Gráfico de Barras por Fechas */}
      <div style={{ pageBreakBefore: 'always' }}>
        <h2 style={{ marginTop: '0', marginBottom: '20px' }}>📈 Consumo Promedio Diario en el Período</h2>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '20px' }}>
          *Este gráfico muestra el consumo promedio diario ({consumoPorDia.toFixed(4)} kWh) 
          distribuido a lo largo del período de {usuario.diasEnPeriodo} días.
        </p>
        <div style={{ 
          height: '400px', 
          width: '100%',
          pageBreakInside: 'avoid',
          marginBottom: '30px'
        }}>
          <Chart
            type="bar"
            series={barrasData}
            options={barOptions}
            height={350}
          />
        </div>
      </div>

      <button 
        onClick={generarPDF}
        disabled={isGenerating}
        style={{ 
          marginTop: '40px', 
          padding: '12px 24px', 
          backgroundColor: isGenerating ? '#6c757d' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isGenerating ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          opacity: isGenerating ? 0.7 : 1
        }}
      >
        {isGenerating ? '⏳ Generando...' : '📄 Exportar PDF'}
      </button>
    </div>
  );
};

export default ReportePDFPage;