import React from "react";
import HeaderPW from "./components/HeaderPW";
import DeviceList from "./components/DeviceList";
import MenuBar from "./components/MenuBar";

const App= () => {

  return (
    <>
      <div className="appHeader">
        <HeaderPW/>
        <MenuBar/>
      </div>
      <div className="appBody">
        <DeviceList/>
      </div>
    </>
  )
}

export default App
