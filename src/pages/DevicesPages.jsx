import React, { useEffect, useState } from "react";
import DeviceList from "../components/DeviceList";
import SearchBar from "../components/SearchBar";
import ActionButtons from "../components/ActionButtons";
import CreateGroupModal from "../components/CreateGroupModal";
import CreateDeviceModal from "../components/CreateDeviceModal";
import EditDevicePage from "../pages/EditDevicePage";

const DispositivosPage = ({ userId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isEditDeviceOpen, setIsEditDeviceOpen] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleOpenEditModal = (device) => {
    setDeviceToEdit(device);
    setIsEditDeviceOpen(true);
    setIsEditing(true);
  };

  const handleDeviceUpdated = () => {
    fetchDevices();
  };

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

  useEffect(() => {
    if (userId) {
      fetchDevices();
    }
  }, [userId]);

  return (
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
    </div>
  );
};

export default DispositivosPage;
