import React, { useEffect, useState } from 'react';
import '../styles/RegisterForm.css';
import emailIcon from "../assets/email-icon.svg";
import passwordIcon from "../assets/password-icon.svg";
import nameIcon from "../assets/name-icon.svg";
import { showAlert } from "./Alert.jsx";
import Header from './Header.jsx';

const RegisterForm = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({ nombre: '', correo: '', contraseña: '', confirmarContraseña: '', proveedor: '' });
  const [error, setError] = useState('');
  const [supplierList, setSupplierList] = useState([]);

  const DOMAIN_URL = "localhost:5051";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const respuesta = await fetch(`http://${DOMAIN_URL}/supplier`);
        if (!respuesta.ok) {
          const datos = await respuesta.json();
          await showAlert("error", datos?.message || "Ocurrió un error al obtener los proveedores");
        } else {
          const datos = await respuesta.json();
          setSupplierList(datos || []);
        }
      } catch (error) {
        console.error('Ocurrió un problema al obtener los proveedores', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegisterClick = async () => {
    if (!formData.nombre || !formData.correo || !formData.contraseña || !formData.confirmarContraseña || !formData.proveedor) {
      await showAlert("error", "Todos los campos son obligatorios");
      return;
    }

    if (formData.contraseña !== formData.confirmarContraseña) {
      await showAlert("error", "Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch('http://localhost:5051/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        await showAlert("success", "Usuario registrado con éxito");
        onRegisterSuccess();
      } else {
        await showAlert("error", data.message || "Error al registrarse");
      }
    } catch {
      await showAlert("error", "Error de conexión con el servidor");
    }
  };

  const handleGoBackClick = () => {
    onRegisterSuccess();
  };

  return (
    <div className="register-container">
      <Header />
      <h2 className="register-title"><a className="register-back-arrow" onClick={handleGoBackClick}>&larr; </a>Registro</h2>
      {error && <p className="register-error">{error}</p>}

      <div className="register-form-group">
        <label className="register-label" htmlFor="nombre">Introduzca su nombre:</label>
        <div className="register-input-container">
          <img src={nameIcon} alt="Nombre" />
          <input
            className="register-input"
            type="text"
            name="nombre"
            placeholder="Introduzca su nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="register-form-group">
        <label className="register-label" htmlFor="correo">Correo electrónico</label>
        <div className="register-input-container">
          <img src={emailIcon} alt="Email" />
          <input
            className="register-input"
            type="email"
            name="correo"
            placeholder="Introduzca su correo electrónico"
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="register-form-group">
        <label className="register-label" htmlFor="contraseña">Contraseña</label>
        <div className="register-input-container">
          <img src={passwordIcon} alt="Contraseña" />
          <input
            className="register-input"
            type="password"
            name="contraseña"
            placeholder="Introduzca su contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="register-form-group">
        <label className="register-label" htmlFor="confirmarContraseña">Confirmar contraseña</label>
        <div className="register-input-container">
          <img src={passwordIcon} alt="Confirmar Contraseña" />
          <input
            className="register-input"
            type="password"
            name="confirmarContraseña"
            placeholder="Vuelva a introducir la Contraseña"
            value={formData.confirmarContraseña}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="register-form-group">
        <label className="register-label" htmlFor="proveedor">Proveedor</label>
        <select
          className="register-select"
          name="proveedor"
          value={formData.proveedor}
          onChange={handleChange}
        >
          <option value="">Seleccione un proveedor</option>
          {supplierList.map((proveedor) => (
            <option key={proveedor.id} value={proveedor.id}>{proveedor.nombre}</option>
          ))}
        </select>
      </div>

      <button className="register-btn" onClick={handleRegisterClick}>Registrarse</button>
    </div>
  );
};

export default RegisterForm;
