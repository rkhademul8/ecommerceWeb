import Swal from "sweetalert2";

export const SuccessAlertRegister = (text: string) => {
  if (!text) return null;

  return Swal.fire({
    icon: "success",
    title: "Success",
    text,
    timer: 10000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
};
