import Swal from "sweetalert2";

export const showAlert = async (type, message) => {
  return await Swal.fire({
    icon: type === "success" ? "success" : "error",
    title: type === "success" ? "Éxito" : "Error",
    text: message,
    confirmButtonColor: type === "success" ? "#28a745" : "#dc3545",
  });
};

