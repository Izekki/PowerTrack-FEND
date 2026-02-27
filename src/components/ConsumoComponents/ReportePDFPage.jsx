import React, { useRef } from 'react';
import Header from '../AuthComponents/Header';
import Chart from 'react-apexcharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import DevicePieChart from './DeviceConsumeChart';

const ReportePDFPage = ({ reporte, onGeneratePDF, isGenerating }) => {
  const [mostrarBoton, setMostrarBoton] = React.useState(true);
  const pdfRef = useRef();
  console.log('Datos para el reporte', reporte);

  // Referencias individuales para cada bloque del PDF
  const headerRef = useRef();
  const resumenRef = useRef();
  const gruposRef = useRef();
  const pastelRef = useRef();
  const barrasRef = useRef();

  const generarPDF = async () => {
    const shouldProceed = await onGeneratePDF();
    if (!shouldProceed) return;

    setMostrarBoton(false);

    const sections = [headerRef, resumenRef, gruposRef, pastelRef, ...porGrupoRefs.current, barrasRef];
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    try {
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i].current;
        if (!section) continue;

        section.classList.add('pdf-light-mode');

        await new Promise(resolve => setTimeout(resolve, 800));
        section.scrollIntoView({ behavior: 'auto', block: 'start' });
        await new Promise(resolve => setTimeout(resolve, 500)); // Espera a que el scroll se estabilice

        const canvas = await html2canvas(section, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          windowWidth: document.body.scrollWidth,
          windowHeight: section.scrollHeight + 100, // asegura altura total del bloque
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }

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
      alert('Hubo un error al generar el PDF. Intenta de nuevo.');
    } finally {
      setMostrarBoton(true);
      document.querySelectorAll('.pdf-light-mode').forEach(el => el.classList.remove('pdf-light-mode'));
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

  const gruposPorBloque = 2;
  const bloquesPorGrupo = Array.from({ length: Math.ceil(graficosPorGrupo.length / gruposPorBloque) }, (_, i) =>
    graficosPorGrupo.slice(i * gruposPorBloque, i * gruposPorBloque + gruposPorBloque)
  );
  const porGrupoRefs = useRef([]);
  porGrupoRefs.current = bloquesPorGrupo.map((_, i) => porGrupoRefs.current[i] || React.createRef());

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
          color: 'var(--text-primary)',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Consumo (kWh)',
        style: {
          fontSize: '12px',
          color: 'var(--text-primary)',
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
      style: {
        backgroundColor: 'var(--consumo-consejo-bg)',
        color: 'var(--text-primary)',
      }
    },
    title: {
      text: 'Consumo Real por Fecha',
      style: {
        fontSize: '16px',
        color: 'var(--text-primary)',
      },
    },
    legend: {
      show: true,
    },
  };

  return (
    <div style={{ padding: '30px 40px 60px', fontFamily: 'Nunito, sans-serif', lineHeight: '1.6' }}>
      <div ref={headerRef}>
        {/* Encabezado y botón */}
        <div style={{ pageBreakAfter: 'avoid', marginBottom: '0px' }}>
          <div
            style={{
              pageBreakAfter: 'avoid',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap' // Por si en pantallas pequeñas se rompe bien
            }}
          >
            <h1 style={{ marginBottom: '0' }}>Reporte de Consumo Energético</h1>
            {mostrarBoton && (
              <button
                onClick={generarPDF}
                disabled={isGenerating}
                style={{
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
            )}
          </div>
        </div>
        <p>
          Hola <strong>{usuario.nombre}</strong>, este reporte resume tu consumo eléctrico del{' '}
          <strong>{new Date(usuario.fechaInicio).toLocaleDateString()}</strong> al{' '}
          <strong>{new Date(usuario.fechaFinal).toLocaleDateString()}</strong>.<br />
          Fecha de generación del reporte: {usuario.fechaGeneracion}.<br />
          Período analizado: <strong>{usuario.diasEnPeriodo} días</strong>
        </p>

        {/* Sección del Resumen General */}
        <div style={{
          backgroundColor: 'var(--consumo-consejo-bg)',
          color: 'var(--text-primary)',
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
      </div>

      {/* Información de Grupos */}
      <div ref={gruposRef}>
        {/* Desglose por grupos */}
        <div style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
          <h2>📋 Desglose por Grupos</h2>
          {grupos.map((grupo, index) => (
            <div key={index} style={{
              marginBottom: '15px',
              padding: '10px',
              border: '1px solid var(--border-color)',
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
      </div>
      
      {bloquesPorGrupo.map((bloque, bloqueIndex) => (
        <div
          key={bloqueIndex}
          ref={porGrupoRefs.current[bloqueIndex]}
          style={{ pageBreakBefore: bloqueIndex > 0 ? 'always' : 'auto', marginBottom: '40px' }}
        >
          {bloque.map((grupo, index) => {
            const globalIndex = bloqueIndex * gruposPorBloque + index;
            return (
              <div key={globalIndex} style={{
                marginBottom: '40px',
                pageBreakInside: 'avoid',
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
                      <tr style={{ backgroundColor: 'var(--consumo-card-bg)' }}>
                        <th style={{ border: '1px solid #ddd', padding: '6px', fontSize: '10px' }}>Dispositivo</th>
                        <th style={{ border: '1px solid #ddd', padding: '6px', fontSize: '10px' }}>Potencia (W)</th>
                        <th style={{ border: '1px solid #ddd', padding: '6px', fontSize: '10px' }}>Consumo Actual (kWh)</th>
                        <th style={{ border: '1px solid #ddd', padding: '6px', fontSize: '10px' }}>Consumo/Día (kWh)</th>
                        <th style={{ border: '1px solid #ddd', padding: '6px', fontSize: '10px' }}>Proyección Mensual (kWh)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grupos[globalIndex].dispositivos.map((dispositivo, dispIndex) => (
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
            );
          })}
        </div>
      ))}

      {/* Gráfico de Barras por Fechas */}
      <div ref={barrasRef}>
        {/* Gráfico de barras */}
        <div style={{ pageBreakBefore: 'always' }}>
          <h2 style={{ marginTop: '0', marginBottom: '20px' }}>📈 Consumo Promedio Diario en el Período</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-dark)', marginBottom: '20px' }}>
            *Este gráfico muestra el consumo promedio diario ({consumoPorDia.toFixed(4)} kWh)
            distribuido a lo largo del período de {usuario.diasEnPeriodo} días.
          </p>
          <div style={{
            color: 'var(--text-primary)',
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
      </div>
    </div>
  );
};

export default ReportePDFPage;
