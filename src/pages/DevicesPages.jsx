import React, { useEffect, useState } from "react";
import CreateGroupModal from "../components/DeviceComponents/CreateGroupModal";
import CreateDeviceModal from "../components/DeviceComponents/CreateDeviceModal";
import DeviceList from "../components/DeviceComponents/DeviceList";
import SearchBar from "../components/CommonComponents/SearchBar";
import EditDevicePage from "../pages/EditDevicePage";
import EditGroupPage from "../pages/EditGroupPage";
import DeleteConfirmModal from "../components/CommonComponents/DeleteConfirmModal";
import "../styles/DevicesPages.css";
import { useAuth } from "../context/AuthContext";
import { apiGet, apiDelete } from "../utils/apiHelper";


const DispositivosPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("devices");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isEditDeviceOpen, setIsEditDeviceOpen] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState(null);
  const [groupToEdit, setGroupToEdit] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [devices, setDevices] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId, token } = useAuth();


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

  const handleOpenEditGroupModal = (groupName) => {
    const selectedGroup = groups.find(g => g.name === groupName);
    
    if (!selectedGroup) {
      console.error("Grupo no encontrado");
      return;
    }
  
    setGroupToEdit({
      ...selectedGroup,
      usuario_id: userId
    });
    
    setIsEditGroupOpen(true);
    setIsEditing(true);
  };
  
  const handleGroupUpdated = () => {
    fetchDevices();
    fetchGroups();
    setIsEditGroupOpen(false);
    setIsEditing(false);
  };

  // Manejar apertura del modal para eliminar grupo
  const handleOpenDeleteGroupModal = (groupName) => {
    const selectedGroup = groups.find(g => g.name === groupName);
    
    if (!selectedGroup) {
      console.error("Grupo no encontrado");
      return;
    }

    setItemToDelete(selectedGroup);
    setDeleteType('group');
    setIsDeleteModalOpen(true);
  };

  // Manejar apertura del modal para eliminar dispositivo
  const handleOpenDeleteDeviceModal = (device) => {
    if (!device) {
      console.error("Dispositivo no encontrado");
      return;
    }

    setItemToDelete(device);
    setDeleteType('device');
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteType === 'group' && itemToDelete) {
      deleteGroup(itemToDelete.id);
    } else if (deleteType === 'device' && itemToDelete) {
      deleteDevice(itemToDelete.id);
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      await apiDelete(`/groups/deleteGroup/${groupId}`);
      fetchGroups();
      fetchDevices();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar el grupo:", error);
      alert(error.message || 'Error al eliminar el grupo');
    }
  };

  const deleteDevice = async (deviceId) => {
    try {
      await apiDelete(`/device/deleteDevice/${deviceId}`);
      fetchDevices();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar el dispositivo:", error);
      alert(error.message || 'Error al eliminar el dispositivo');
    }
  };

  const fetchGroups = async () => {
    if (!userId) return;
    try {
      const groupsData = await apiGet(`/groups/byUser/${userId}`);
      setGroups(Array.isArray(groupsData) ? groupsData : []);
    } catch (error) {
      console.error("Error al obtener grupos:", error);
      setGroups([]);
    }
  };
  
  const fetchDevices = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await apiGet(`/device/dispositivosPorUsuario/${userId}`);
      setDevices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener dispositivos:", error);
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchDevices();
      fetchGroups();
    }
  }, [userId]);

  // Configuración del modal según el tipo de eliminación
  const getDeleteModalConfig = () => {
    if (deleteType === 'group') {
      return {
        title: "Eliminar Grupo",
        message: `¿Estás seguro de que quieres eliminar el grupo "${itemToDelete?.name}"? Esta acción no se puede deshacer.`,
        confirmButtonText: "Eliminar",
        type: "danger"
      };
    } else if (deleteType === 'device') {
      return {
        title: "Eliminar Dispositivo",
        message: `¿Estás seguro de que quieres eliminar el dispositivo "${itemToDelete?.dispositivo_nombre}"? Esta acción no se puede deshacer.`,
        confirmButtonText: "Eliminar",
        type: "danger"
      };
    }
    // Configuraciones futuras para otros tipos
    return {};
  };


  return (
    <div className="appBody">
      <div className="bodyHeader">
        {!isEditing && (
          <div className="devices-header-controls">
            <SearchBar onSearch={setSearchQuery} />
            <div
              className="devices-view-toggle"
              role="tablist"
              aria-label="Vista de dispositivos y grupos"
            >
              <button
                type="button"
                className={activeView === "devices" ? "active" : ""}
                onClick={() => setActiveView("devices")}
                aria-pressed={activeView === "devices"}
              >
                Dispositivos
              </button>
              <button
                type="button"
                className={activeView === "groups" ? "active" : ""}
                onClick={() => setActiveView("groups")}
                aria-pressed={activeView === "groups"}
              >
                Grupos
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bodyContent">
        {!isEditing && (
          <DeviceList
            searchQuery={searchQuery}
            devices={devices}
            groups={groups}
            loading={loading}
            viewMode={activeView}
            onDeviceUpdate={handleDeviceUpdated}
            onEditDevice={handleOpenEditModal}
            onEditGroup={handleOpenEditGroupModal}
            onDeleteGroup={handleOpenDeleteGroupModal}
            onDeleteDevice={handleOpenDeleteDeviceModal}
            onAddGroup={() => setIsGroupModalOpen(true)}
            onAddDevice={() => setIsDeviceModalOpen(true)}
          />
        )}
      </div>

      {/* Modales */}
      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onGroupCreated={() => {
          fetchDevices();
          fetchGroups();
        }}
        onDeviceCreated={fetchDevices}
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
      {isEditGroupOpen && (
        <EditGroupPage
          isOpen={isEditGroupOpen}
          onClose={() => {
            setIsEditGroupOpen(false);
            setIsEditing(false);
          }}
          group={groupToEdit}
          onGroupUpdated={handleGroupUpdated}
        />
      )}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        {...getDeleteModalConfig()}
      />
    </div>
  );
};

export default DispositivosPage;