import { useState } from "react";
import "../../styles/DeviceComponentsCss/EditDeviceImageCard.css";
import IconSelectorModal from "./IconSelectorModal";
import noImageCard from "../../assets/devices-icons/0.svg";


const images = import.meta.glob("../../assets/devices-icons/*.png", {
  eager: true,
  import: "default",
});

const EditDeviceImageCard = ({ device, onDeviceUpdated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const { id_tipo_dispositivo } = device;
  const imagePath = `../../assets/devices-icons/${id_tipo_dispositivo}.png`;
  const image =
    images[imagePath] ||
    images["../assets/devices-icons/noimage-card.svg"] ||
    noImageCard;

  return (
    <>
      <div className="image-upload" onClick={handleOpenModal}>
        <img src={image} alt="Cambiar icono" className="upload-icon" />
        <p>Cambiar Icono</p>
      </div>

      {isModalOpen && (
        <IconSelectorModal
          device={device}
          onClose={handleCloseModal}
          onDeviceUpdated={onDeviceUpdated}
        />
      )}
    </>
  );
};



export default EditDeviceImageCard;
