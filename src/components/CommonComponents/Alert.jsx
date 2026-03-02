import Swal from "sweetalert2";

export const showAlert = async (type, message) => {
  const confirmButtonColor = type === "success" ? "#28a745" : "#dc3545";

  return await Swal.fire({
    icon: type === "success" ? "success" : "error",
    title: type === "success" ? "Éxito" : "Error",
    text: message,
    confirmButtonColor,
    background: "var(--bg-light)",
    color: "var(--text-primary)",
    iconColor: "var(--text-primary)",
  });
};

export const showConfirmAlert = async ({
  title = "Confirmación",
  text = "¿Deseas continuar?",
  confirmButtonText = "Continuar",
  cancelButtonText = "Cancelar",
}) => {
  const result = await Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: "var(--btn-primary-bg)",
    cancelButtonColor: "var(--btn-secondary-bg)",
    background: "var(--bg-light)",
    color: "var(--text-primary)",
    iconColor: "var(--text-primary)",
    reverseButtons: true,
  });

  return result.isConfirmed;
};

