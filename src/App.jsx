import React, { useState } from "react";
import HeaderPW from "./components/HeaderPW";
import DeviceList from "./components/DeviceList";
import MenuBar from "./components/MenuBar";
import SearchBar from "./components/SearchBar";
import ActionButtons from "./components/ActionButtons";
import CreateGroupModal from "./components/CreateGroupModal";

const App= () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const handleAddGroup = () => {
    setIsGroupModalOpen(true)
  }
  return (
    <>
      <div className="appHeader">
        <HeaderPW />
        <MenuBar />
      </div>
      <div className="appBody">
        <div className="bodyHeader">
          <div className="bodyContainerButtons">
            <ActionButtons onAddGroup={handleAddGroup} />
          </div>
          <SearchBar onSearch={setSearchQuery} />
        </div>
        <div className="bodyContent">
          <DeviceList searchQuery={searchQuery} />
        </div>
      </div>
      <CreateGroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} />
    </>
  );
};

export default App
