import React, { useState, useEffect } from "react";
import HeaderPW from "./components/HeaderPW";
import DeviceList from "./components/DeviceList";
import MenuBar from "./components/MenuBar";
import SearchBar from "./components/SearchBar";
import ActionButtons from "./components/ActionButtons";
import CreateGroupModal from "./components/CreateGroupModal";
import CreateDeviceModal from "./components/CreateDeviceModal";
import LoginForm from "./components/LoginForm";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  
  // ------- Kevin -------
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("userId");
  };

  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("isAuthenticated") === "true"
  );
  // ------- Kevin -------

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
    if (isAuthenticated) {
      fetchDevices();
    }
  }, [isAuthenticated]);

  // ------- Kevin -------
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem("isAuthenticated", "true");
  };

  const userId = sessionStorage.getItem("userId"); 
  
  if (!isAuthenticated) {
    return <>
      <LoginForm onLoginSuccess={handleLoginSuccess} ></LoginForm>
      </>;
  }
  // ------- Kevin -------

  return (
    <>
      <div className="appHeader">
        <HeaderPW onLogout={handleLogout} />
        <MenuBar />
      </div>
      <div className="appBody">
        <div className="bodyHeader">
          <div className="bodyContainerButtons">
            <ActionButtons onAddGroup={() => setIsGroupModalOpen(true)} onAddDevice={() => setIsDeviceModalOpen(true)} />
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
       <CreateDeviceModal 
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
        onDeviceCreated={fetchDevices}
      />
    </>
  );
};

export default App;