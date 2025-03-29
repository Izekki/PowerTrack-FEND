import noimagecard from "../assets/noimage-card.svg";
import { useRef } from "react";
import "../styles/EditDeviceImageCard.css";

const EditDeviceImageCard = () =>{
    const fileInputRef = useRef(null);

  const handleImageUpload = () => {
    fileInputRef.current.click(); // Activa el input al hacer clic en el div
  };
    return (
        <div className="image-upload" onClick={handleImageUpload}>
          <img src={noimagecard} alt="Subir imagen" className="upload-icon" />
          <p>SUBIR IMAGEN</p>
          <input type="file" accept="image/*" className="file-input" />
        </div>
      );
};

export default EditDeviceImageCard;