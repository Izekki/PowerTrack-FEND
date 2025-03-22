import React, { useState, useEffect } from "react";
import HeaderPW from "./components/HeaderPW";
import DeviceList from "./components/DeviceList";
import MenuBar from "./components/MenuBar";
import SearchBar from "./components/SearchBar";
import ActionButtons from "./components/ActionButtons";
import CreateGroupModal from "./components/CreateGroupModal";

const App= () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDevices = () => {
    setLoading(true);
    fetch("http://localhost:5051/device/obtener")
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

  
  const handleDeviceUpdated = () => {
    fetchDevices(); // Vuelve a obtener la lista de dispositivos
  };


  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <>
      <div className="appHeader">
        <HeaderPW />
        <MenuBar />
      </div>
      <div className="appBody">
        <div className="bodyHeader">
          <div className="bodyContainerButtons">
            <ActionButtons onAddGroup={() => setIsGroupModalOpen(true)} />
          </div>
          <SearchBar onSearch={setSearchQuery} />
        </div>
        <div className="bodyContent">
        <DeviceList 
            searchQuery={searchQuery}
            devices={devices}
            loading={loading}
            onDeviceUpdate={handleDeviceUpdated} // Aquí lo pasas
           />

        </div>
      </div>
      <CreateGroupModal 
        isOpen={isGroupModalOpen} 
        onClose={() => setIsGroupModalOpen(false)} 
        onGroupCreated={fetchDevices}
      />
    </>
  );
};


export default App
