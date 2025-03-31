import React, { useEffect, useState } from 'react';
import '../styles/LoginForm.css';
import emailIcon from "../assets/email-icon.svg"; // Ícono de correo
import passwordIcon from "../assets/password-icon.svg"; // Ícono de contraseña
import nameIcon from "../assets/name-icon.svg"; // Ícono de contraseña
import { showAlert } from "./Alert.jsx"; // Importa la función showAlert

import logo from "../assets/logo-pw.svg";



const RegisterForm = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({ nombre: '', correo: '', contraseña: '', confirmarContraseña: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [supplierList, setSupplierList] =  useState([]);

  const DOMAIN_URL = "localhost:5051";


  useEffect(() => {
    const fetchData = async () => {
      try {
        const respuesta = await fetch(`http://${DOMAIN_URL}/supplier`);
        if (!respuesta.ok) {
          try {
            const datos = await respuesta.json();
            if (datos && datos.message) {
              await showAlert("error", datos.message);
            } else {
              await showAlert("error", "Ocurrió un error al obtener los proveedores");
            }
          } catch (e) {
            await showAlert("error", "Ocurrió un error al obtener los proveedores");
          }
        } else {
          const datos = await respuesta.json();
          if (datos) {
            setSupplierList(datos);
          }
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

    if(formData.contraseña != formData.confirmarContraseña){
      await showAlert("error", "Las contraseñas no coinciden");
      return;
    }

    console.log(JSON.stringify(formData));

    try {
      const response = await fetch('http://localhost:5051/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        await showAlert("success", "Usuario registrado con exito");
        onRegisterSuccess();
      } else {
        await showAlert("error", data.message || "Error al registrarse");
      }
    } catch {
      await showAlert("error", "Error de conexión con el servidor");
    }
  };

  const handleGoBackClick = async () => 
    {
      onRegisterSuccess();
    }

  return (
    <div className="register-container">

        <header className="header"></header>
        <div className="logo">
          <img src={logo} alt="Logo" className="logo-img" />
        </div>
        <br/><br/>
        <h2 className="h2-iniciar-sesion"><a className="back-arrow" onClick={handleGoBackClick}>&larr; </a>Registro</h2>
        {error && <p className="error">{error}</p>}

        <div className="form-group">
          <label className="label-Form-Login" htmlFor="nombre">Introduzca su nombre:</label>
          <div className="input-container">
            <img src={nameIcon} alt="Nombre" />
            <input className='form-control-inputs'
              type="nombre" 
              name="nombre" 
              placeholder="Introduzca su nombre" 
              value={formData.nombre} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="label-Form-Login" htmlFor="correo">Correo electrónico</label>
          <div className="input-container">
          <img src={emailIcon} alt="Email" />
            <input className='form-control-inputs'
              type="correo" 
              name="correo" 
              placeholder="Introduzca su correo electrónico" 
              value={formData.correo} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="label-Form-Login" htmlFor="contraseña">Contraseña</label>
          <div className="input-container">
            <img src={[passwordIcon]} alt="Contraseña" />
            <input className='form-control-inputs'
              type="password" 
              name="contraseña" 
              placeholder="Introduzca su contraseña" 
              value={formData.contraseña} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="label-Form-Login" htmlFor="confirmarContraseña">Confirmar contraseña</label>
          <div className="input-container">
            <img src={[passwordIcon]} alt="Contraseña" />
            <input className='form-control-inputs'
              type="password" 
              name="confirmarContraseña" 
              placeholder="Vuelva a introducir la Contraseña" 
              value={formData.confirmarContraseña} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="form-group">
        <label className="label-Form-Login" htmlFor="proveedor">Proveedor</label>
        <select
        className='input-container'
          name="proveedor"
          value={formData.proveedor}
          onChange={handleChange}
        >
          <option value="">Seleccione un proveedor</option>
          {supplierList.map((proveedor) => (
            <option key={proveedor.id} value={proveedor.id}>
              {proveedor.nombre}
            </option>
          ))}
        </select>
      </div>

        <button className="login-btn" onClick={handleRegisterClick}>Registrarse</button>
    </div>
  );
};

export default RegisterForm;
