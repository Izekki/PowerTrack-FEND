import React, { useEffect, useState } from 'react';
import AlertsCard from '../components/AlertasComponents/AlertsCard';
import '../styles/AlertasPage.css';

import AlertIcon from '../assets/tips-icons/tip-1.svg';

const AlertasPage = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const data = [
        { id: 1, name: 'Alerta de temperatura', icon: <img src={AlertIcon} alt="Alert" /> },
        { id: 2, name: 'Corte de energía', icon: <img src={AlertIcon} alt="Alert" /> },
        { id: 3, name: 'Sobreconsumo', icon: <img src={AlertIcon} alt="Alert" /> }
      ];
      setAlerts(data);
    };

    fetchAlerts();
  }, []);

  return (
    <div className="alertas-page">
      <div className="alertas-header">
        <h1 className='alertas-title-header'>Alertas</h1>
        <button className="btn-style-default btn-configurar">Configurar</button>
      </div>

      <div className="alertas-list">
        {alerts.map((alert) => (
          <AlertsCard key={alert.id} icon={alert.icon} name={alert.name} />
        ))}
      </div>
    </div>
  );
};

export default AlertasPage;