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
  // Estado de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("isAuthenticated") === "true"
  );

  // Nuevo estado para userId
  const [userId, setUserId] = useState(sessionStorage.getItem("userId"));

  // Estados de la app
  const [searchQuery, setSearchQuery] = useState("");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isEditDeviceOpen, setIsEditDeviceOpen] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Funciones de edición ---
  const handleOpenEditModal = (device) => {
    setDeviceToEdit(device);
    setIsEditDeviceOpen(true);
    setIsEditing(true);
  };

  const handleDeviceUpdated = () => {
    fetchDevices();
    setIsEditDeviceOpen(false);
    setIsEditing(false);
  };

  // --- Fetch dispositivos ---
  const fetchDevices = () => {
    if (!userId) return;

    setLoading(true);
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

  // --- Logout ---
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("isAuthenticated");
    setUserId(null);
    setDevices([]);
    setIsEditDeviceOpen(false);
    setIsEditing(false);
    setDeviceToEdit(null);
  };

  // --- Login ---
  const handleLoginSuccess = () => {
    const newUserId = sessionStorage.getItem("userId");
    setUserId(newUserId);
    setIsAuthenticated(true);
    sessionStorage.setItem("isAuthenticated", "true");
    setDevices([]);
    setIsEditDeviceOpen(false);
    setIsEditing(false);
    setDeviceToEdit(null);
  };

  // Cargar dispositivos al iniciar sesión o cuando cambia el usuario
  useEffect(() => {
    if (userId && isAuthenticated) {
      fetchDevices();
    }
  }, [userId, isAuthenticated]);

  // --- Si no está autenticado, mostrar login ---
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
          {!isEditing && (
            <div className="bodyContainerButtons">
              <ActionButtons
                onAddGroup={() => setIsGroupModalOpen(true)}
                onAddDevice={() => setIsDeviceModalOpen(true)}
              />
            </div>
          )}
          {!isEditing && <SearchBar onSearch={setSearchQuery} />}
        </div>

        <div className="bodyContent">
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
            setIsEditing(false);
          }}
          onDeviceUpdated={handleDeviceUpdated}
          device={deviceToEdit}
        />
      )}
    </>
  );
};

export default App;
