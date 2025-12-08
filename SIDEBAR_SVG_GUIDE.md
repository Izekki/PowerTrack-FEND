/* 
 * Guía para cambiar iconos PNG a SVG en Sidebar
 * ================================================
 * 
 * Los iconos PNG actuales (alertas y configuración) están siendo invertidos
 * con filtros CSS en modo oscuro. Para mejor calidad y control, se recomienda
 * usar SVG inline.
 * 
 * PASOS PARA CAMBIAR:
 * 
 * 1. En Sidebar.jsx, agrega los componentes SVG al inicio del archivo:
 * 
 *    const AlertSvg = () => (
 *      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" 
 *           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 *        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
 *        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
 *      </svg>
 *    );
 * 
 *    const SettingsSvg = () => (
 *      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" 
 *           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 *        <circle cx="12" cy="12" r="3"></circle>
 *        <path d="M12 1v6m0 6v6m8.66-15.66l-4.24 4.24m-4.24 4.24l-4.24 4.24M23 12h-6m-6 0H1m20.66 8.66l-4.24-4.24m-4.24-4.24l-4.24-4.24"></path>
 *      </svg>
 *    );
 * 
 * 2. Reemplaza en el JSX:
 * 
 *    // En lugar de:
 *    <img src={alertsIcon} alt="Alertas" className="icon-img"/>
 * 
 *    // Usa:
 *    <span className="icon"><AlertSvg /></span>
 * 
 * 3. Los SVG responderán automáticamente al tema usando `currentColor`
 * 
 * VENTAJAS DE SVG:
 * - Cambian de color suavemente con el tema
 * - Mejor calidad en cualquier resolución
 * - Menor peso de archivo
 * - Más control sobre el estilo
 * 
 * ESTILOS YA CONFIGURADOS:
 * - .nav-item svg { color: var(--sidebar-text); }
 * - .nav-item.active svg { color: var(--sidebar-accent); }
 * - Transiciones suaves incluidas (0.3s ease)
 */
