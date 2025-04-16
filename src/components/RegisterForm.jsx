import React, { useEffect, useState } from 'react';
import '../styles/RegisterForm.css';
import emailIcon from "../assets/email-icon.svg";
import passwordIcon from "../assets/password-icon.svg";
import nameIcon from "../assets/name-icon.svg";
import eyeIcon from "../assets/eye-icon.svg";
import eyeSlashIcon from "../assets/eye-slash-icon.svg";
import { showAlert } from "./Alert.jsx";
import Header from './Header.jsx';

const RegisterForm = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    confirmarContraseña: '',
    proveedor: ''
  });
  const [supplierList, setSupplierList] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const DOMAIN_URL = "localhost:5051";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://${DOMAIN_URL}/supplier`);
        const data = await res.json();
        if (res.ok) setSupplierList(data || []);
        else await showAlert("error", data?.message || "Error al obtener proveedores");
      } catch (error) {
        console.error('Ocurrió un problema al obtener los proveedores', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleRegisterClick = async () => {
    if (!formData.nombre || !formData.correo || !formData.contraseña || !formData.confirmarContraseña || !formData.proveedor) {
      return await showAlert("error", "Todos los campos son obligatorios");
    }
    if (formData.contraseña !== formData.confirmarContraseña) {
      return await showAlert("error", "Las contraseñas no coinciden");
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

  const handleGoBackClick = () => onRegisterSuccess();

  return (
    <div className="register-container">
      <Header />
      <div className='inputs-register-all-container'>
        <h2 className="register-title"><a className="register-back-arrow" onClick={handleGoBackClick}>&larr;</a> Registro</h2>

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
              type={showPassword ? "text" : "password"}
              name="contraseña"
              placeholder="Introduzca su contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              required
            />
            <img
              src={showPassword ? eyeSlashIcon : eyeIcon}
              alt="Toggle password visibility"
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>

        <div className="register-form-group">
          <label className="register-label" htmlFor="confirmarContraseña">Confirmar contraseña</label>
          <div className="register-input-container">
            <img src={passwordIcon} alt="Confirmar Contraseña" />
            <input
              className="register-input"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmarContraseña"
              placeholder="Vuelva a introducir la Contraseña"
              value={formData.confirmarContraseña}
              onChange={handleChange}
              required
            />
            <img
              src={showConfirmPassword ? eyeSlashIcon : eyeIcon}
              alt="Toggle confirm password visibility"
              className="eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
            {supplierList.map(proveedor => (
              <option key={proveedor.id} value={proveedor.id}>{proveedor.nombre}</option>
            ))}
          </select>
        </div>

        <button className="register-btn" onClick={handleRegisterClick}>Registrarse</button>
      </div>
    </div>
  );
};

export default RegisterForm;
