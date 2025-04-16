import React, { useEffect, useState } from "react";
import "../styles/ProfilePage.css";
import eyeIcon from "../assets/eye-icon.svg";
import eyeSlashIcon from "../assets/eye-slash-icon.svg";
import { showAlert } from "../components/Alert";

const ProfilePage = ({ userId, token }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [proveedoresDisponibles, setProveedoresDisponibles] = useState([]);

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    id_proveedor: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Función reutilizable para cargar los datos del perfil
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5051/user/show/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProfileData(data.data);
        setFormData({
          nombre: data.data.nombre,
          correo: data.data.correo,
          id_proveedor: data.data.id_proveedor || "",
        });
        setProveedoresDisponibles(data.data.proveedores_disponibles || []);
      } else {
        showAlert("error", data.message || "Error al cargar el perfil");
      }
    } catch (err) {
      showAlert("error", "Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId || !token) return;
    fetchProfileData();
  }, [userId, token]);

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSave = async () => {
    try {
      // Validación de contraseña si se está cambiando
      if (passwordData.currentPassword && 
          (passwordData.newPassword !== passwordData.confirmPassword)) {
        showAlert("error", "Las contraseñas nuevas no coinciden");
        return;
      }

      // Primero actualizar los datos del perfil
      const updateResponse = await fetch(
        `http://localhost:5051/user/edit/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const updateData = await updateResponse.json();

      if (!updateData.success) {
        showAlert("error", updateData.message || "Error al actualizar perfil");
        return;
      }

      // Si hay cambio de contraseña, procesarlo
      if (passwordData.currentPassword && 
          passwordData.newPassword &&
          passwordData.newPassword === passwordData.confirmPassword) {
        await handleChangePassword();
      }

      // Recargar los datos actualizados
      await fetchProfileData();
      
      showAlert("success", "Perfil actualizado correctamente");
      setIsEditing(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      showAlert("error", "Error al guardar cambios");
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await fetch(
        `http://localhost:5051/user/${userId}/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        showAlert("success", "Contraseña actualizada correctamente");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        throw new Error(data.message || "Error al cambiar contraseña");
      }
    } catch (error) {
      showAlert("error", error.message);
      throw error; // Re-lanzar el error para manejarlo en handleSave
    }
  };

  return (
    <div className="profilePage-container">
      <h2 className="profilePage-title">Mi Perfil</h2>

      {loading ? (
        <p className="profilePage-loading">Cargando información...</p>
      ) : profileData ? (
        <div className="profilePage-content">
          <div className="profilePage-card profileCard-info">

                    <div className="profileCard-header">
        <h3 className="profileCard-title">Datos Personales</h3>
        <button
            className="editProfile-btn"
            onClick={() => setIsEditing(!isEditing)}
        >
            <svg width="20" height="20" viewBox="0 0 24 24">
            <path
                fill="currentColor"
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
            />
            </svg>
        </button>
</div>

            {isEditing ? (
              <>
                <div className="profileCard-row">
                  <label>Nombre:</label>
                  <input
                    className="input-style"
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                  />
                </div>
                <div className="profileCard-row">
                  <label>Correo:</label>
                  <input
                    className="input-style"
                    type="email"
                    value={formData.correo}
                    onChange={(e) =>
                      setFormData({ ...formData, correo: e.target.value })
                    }
                  />
                </div>
                <div className="profileCard-row">
                  <label>Proveedor:</label>
                  <select
                    className="input-style"
                    value={formData.id_proveedor}
                    onChange={(e) =>
                      setFormData({ ...formData, id_proveedor: e.target.value })
                    }
                  >
                    <option value="">Seleccione un proveedor</option>
                    {proveedoresDisponibles.map((prov) => (
                      <option key={prov.id} value={prov.id}>
                        {prov.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="profileCard-row">
                  <label>Contraseña actual:</label>
                  <input
                    className="input-style"
                    type={showPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="profileCard-row">
                  <label>Nueva contraseña:</label>
                  <div className="passwordField">
                    <input
                      className="input-style input-password"
                      type={showPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                    />
                    <img
                      src={showPassword ? eyeSlashIcon : eyeIcon}
                      onClick={() => setShowPassword(!showPassword)}
                      alt="Mostrar/Ocultar contraseña"
                      className="eye-icon"
                    />
                  </div>
                </div>
                <div className="profileCard-row">
                  <label>Confirmar nueva contraseña:</label>
                  <input
                    className="input-style"
                    type={showPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="profileCard-actions">
                  <button
                    onClick={handleSave}
                    className="btn-style-default btn-profile-save"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-style-default btb-cancel-profile"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="profileCard-row">
                  <strong>Nombre:</strong> {profileData.nombre}
                </div>
                <div className="profileCard-row">
                  <strong>Correo:</strong> {profileData.correo}
                </div>
                <div className="profileCard-row">
                  <strong>Proveedor:</strong> {profileData.proveedor_actual?.nombre || "N/A"}
                </div>
                <div className="profileCard-row">
                  <strong>Fecha de Registro:</strong>{" "}
                  {formatFecha(profileData.fecha_registro)}
                </div>
                <div className="profileCard-row">
                  <strong>Contraseña:</strong> ********
                </div>
              </>
            )}
          </div>

          <div className="profilePage-card profileCard-summary">
            <h3 className="profileCard-title">Resumen</h3>

            <div className="profileCard-subsection">
              <h4>Dispositivos ({profileData.total_dispositivos})</h4>
              <ul className="profileCard-list">
                {profileData.dispositivos.map((d) => (
                  <li key={d.id} className="profileCard-item">
                    <strong>{d.nombre}</strong> <span>- {d.ubicacion}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="profileCard-subsection">
              <h4>Grupos ({profileData.total_grupos})</h4>
              <ul className="profileCard-list">
                {profileData.grupos.map((g) => (
                  <li key={g.id} className="profileCard-item">
                    <strong>{g.nombre}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <p className="profilePage-error">No se pudo cargar el perfil.</p>
      )}
    </div>
  );
};

export default ProfilePage;
