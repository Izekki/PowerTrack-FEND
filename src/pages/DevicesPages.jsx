import React, { useEffect, useState } from "react";
import CreateGroupModal from "../components/CreateGroupModal";
import CreateDeviceModal from "../components/CreateDeviceModal";
import DeviceList from "../components/DeviceList";
import ActionButtons from "../components/ActionButtons";
import SearchBar from "../components/SearchBar";
import EditDevicePage from "../pages/EditDevicePage";
import EditGroupPage from "../pages/EditGroupPage";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import speedometer from "../assets/speedometer.svg";
import "../styles/DevicesPages.css";
import { useAuth } from "../context/AuthContext";

const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL;


const DispositivosPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
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
    console.log("Dispositivo a editar:", device);
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

  const deleteGroup = (groupId) => {
    fetch(`${DOMAIN_URL}/groups/deleteGroup/${groupId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usuarioId: userId })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al eliminar el grupo');
        }
        return response.json();
      })
      .then(() => {
        fetchGroups();
        fetchDevices();
        setIsDeleteModalOpen(false);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  };

  const deleteDevice = (deviceId) => {
    fetch(`${DOMAIN_URL}/device/deleteDevice/${deviceId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usuarioId: userId })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al eliminar el dispositivo');
        }
        return response.json();
      })
      .then(() => {
        fetchDevices();
        setIsDeleteModalOpen(false);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  };

  const fetchGroups = () => {
    if (!userId) return;
    fetch(`${DOMAIN_URL}/groups/byUser/${userId}`)
      .then(response => {
        if (!response.ok) throw new Error('Error en la respuesta');
        return response.json();
      })
      .then(groupsData => {
        // Asegúrate de que groupsData sea un array
        setGroups(Array.isArray(groupsData) ? groupsData : []);
      })
      .catch(error => {
        console.error("Error al obtener grupos:", error);
        setGroups([]); // En caso de error, establece un array vacío
      });
  };
  
  const fetchDevices = () => {
    if (!userId) return;
    setLoading(true);
    fetch(`${DOMAIN_URL}/device/dispositivosPorUsuario/${userId}`)
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
          <div className="bodyHeaderTop">
          <div className="headerTitle">
            <img src={speedometer} alt="Icono de dispositivos" className="headerIcon" />
            <h2>Dispositivos</h2>
          </div>
          <div className="bodyContainerButtons">
            <ActionButtons
              onAddGroup={() => setIsGroupModalOpen(true)}
              onAddDevice={() => setIsDeviceModalOpen(true)}
            />
          </div>
        </div>
        
        )}
        {!isEditing && <SearchBar onSearch={setSearchQuery} />}
      </div>

      <div className="bodyContent">
        {!isEditing && (
          <DeviceList
            searchQuery={searchQuery}
            devices={devices}
            groups={groups}
            loading={loading}
            onDeviceUpdate={handleDeviceUpdated}
            onEditDevice={handleOpenEditModal}
            onEditGroup={handleOpenEditGroupModal}
            onDeleteGroup={handleOpenDeleteGroupModal}
            onDeleteDevice={handleOpenDeleteDeviceModal}
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