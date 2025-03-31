import React, { useState, useEffect } from "react";
import HeaderPW from "./components/HeaderPW";
import DeviceList from "./components/DeviceList";
import MenuBar from "./components/MenuBar";
import SearchBar from "./components/SearchBar";
import ActionButtons from "./components/ActionButtons";
import CreateGroupModal from "./components/CreateGroupModal";
import CreateDeviceModal from "./components/CreateDeviceModal";
import LoginForm from "./components/LoginForm";
import EditDevicePage from "./components/EditDevicePage";

const App = () => {
  // Estados de la aplicación
  const [searchQuery, setSearchQuery] = useState("");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isEditDeviceOpen, setIsEditDeviceOpen] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Controla si estamos en modo de edición

  // Función para abrir el modal de edición de un dispositivo
  const handleOpenEditModal = (device) => {
    setDeviceToEdit(device);
    setIsEditDeviceOpen(true);
    setIsEditing(true); // Se activa el modo de edición
  };

  // Función para manejar la actualización de un dispositivo
  const handleDeviceUpdated = () => {
    fetchDevices(); // Vuelve a cargar los dispositivos
    setIsEditDeviceOpen(false);
    setIsEditing(false); // Desactiva el modo de edición
  };

  // Fetch de dispositivos
  const fetchDevices = () => {
    setLoading(true);
    const userId = sessionStorage.getItem("userId");
    fetch(`http://localhost:5051/device/dispositivosPorUsuario/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setDevices(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener dispositivos:", error);
        setLoading(false);
      });
  };

  // Control de la autenticación del usuario
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("isAuthenticated") === "true"
  );

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("isAuthenticated");
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem("isAuthenticated", "true");
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDevices();
    }
  }, [isAuthenticated]);

  // Si no está autenticado, muestra el formulario de login
  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      <div className="appHeader">
        <HeaderPW onLogout={handleLogout} />
        <MenuBar />
      </div>
      <div className="appBody">
        <div className="bodyHeader">
          {/* Ocultar SearchBar y ActionButtons si estamos editando */}
          {!isEditing && (
            <div className="bodyContainerButtons">
              <ActionButtons onAddGroup={() => setIsGroupModalOpen(true)} onAddDevice={() => setIsDeviceModalOpen(true)} />
            </div>
          )}
          {!isEditing && <SearchBar onSearch={setSearchQuery} />}
        </div>

        <div className="bodyContent">
          {/* Solo mostrar DeviceList si no estamos en modo de edición */}
          {!isEditing && (
            <DeviceList
              searchQuery={searchQuery}
              devices={devices}
              loading={loading}
              onDeviceUpdate={handleDeviceUpdated}
              onEditDevice={handleOpenEditModal}
            />
          )}
        </div>
      </div>

      {/* Modales */}
      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onGroupCreated={fetchDevices}
      />
      <CreateDeviceModal
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
        onDeviceCreated={fetchDevices}
      />
      {isEditDeviceOpen && (
        <EditDevicePage
          isOpen={isEditDeviceOpen}
          onClose={() => {
            setIsEditDeviceOpen(false);
            setIsEditing(false); // Si cancela la edición, vuelve a mostrar los dispositivos
          }}
          onDeviceUpdated={handleDeviceUpdated}
          device={deviceToEdit}
        />
      )}
    </>
  );
};

export default App;
