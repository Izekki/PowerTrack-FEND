import "../styles/EditDeviceCard.css";
import EditDeviceImageCard from "./EditDeviceImageCard";


const EditDeviceCard = () =>{
    return(
        <>
        <div className="edit-device-card">
          <h1>DATOS DEL DISPOSITIVO</h1>
          <p>Aqui ira el nombre del dispositivo</p>
          <form className="edit-device-form">
            <div className="edit-device-card-columns">
            <div>
              <label className="lbl1">Nombre del dispositivo</label>
              <input type="text" placeholder="Introuduzca el nombre del dispositivo" required/>
              <label className="lbl2">Ubicación</label>
              <input type="text" placeholder="Introduzca la ubicacion del dispositivo" required/>
            </div>
            </div>
            <button>Editar</button>
          </form>
        </div>
        <div className="edit-device-image">
        <EditDeviceImageCard/>
        </div>
        
        </> 
      )
};

export default EditDeviceCard;