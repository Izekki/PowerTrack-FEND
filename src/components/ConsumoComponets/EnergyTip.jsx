import React, { useEffect, useState } from 'react';
import "../../styles/ConsumeComponentesCss/EnergyTip.css";


const EnergyTip = ({ tips }) => {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 10000); // cada 10 segundos
    return () => clearInterval(interval);
  }, [tips.length]);

  const { img, texto, titulo } = tips[currentTip];

  return (
    <div className="consejo">
      <img src={img} alt={`Consejo: ${titulo}`} className="tip-icon" />
      <div className="tip-texto">
        <h4>{titulo}</h4>
        <p>{texto}</p>
      </div>
    </div>
  );
};

export default EnergyTip;
