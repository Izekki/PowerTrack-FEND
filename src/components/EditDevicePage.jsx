import React, { useEffect, useState } from "react";
import HeaderPW from "./HeaderPW";
import MenuBar from "./MenuBar";
import EditDeviceCard from "./EditDeviceCard";
import "../styles/EditDevicePage.css"

const EditDevicePage = () =>{
    return(
        <>
        <HeaderPW />
        <MenuBar />
        <div className="edit-device-container">
          <label htmlFor="">Editar Dispositivo</label>
          <div className="edit-device-page">
            <EditDeviceCard/>
            
          </div>
          
          
    
        </div>
        </> 
      )
};

export default EditDevicePage;
    