import Swal from "sweetalert2";

export const alertSuccess = (message) => {
  Swal.fire({
    icon: "success",
    title: "Éxito",
    text: message,
    background: "#ffffff",
    showConfirmButton: false,
    timer: 1000
  });
};

export const alertError = (message) => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    background: "#ffffff",
    confirmButtonColor: "#d32f2f",
    zIndex: 50000
  });
};

export const alertWarning = (message) => {
  Swal.fire({
    icon: "warning",
    title: "Atención",
    text: message,
    background: "#ffffff",
    showConfirmButton: false,
    timer: 2000
  });
};

export const alertConfirm = async (message) => {
  const result = await Swal.fire({
    icon: "warning",
    title: "Confirmar eliminación",
    text: message,
    background: "#ffffff",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6"
  });

  return result.isConfirmed;
};
