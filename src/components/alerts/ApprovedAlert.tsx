import Swal from "sweetalert2";

export const approveAlert = (text: string) => {
  if (!text) return null;

  return Swal.fire({
    icon: "question",
    text,
    showCancelButton: true,
    confirmButtonText: "Approve",
    cancelButtonText: "Cancel",
    customClass: {
      confirmButton: "my-confirm-button",
      icon: "my-icon",
      title: "my-title",
      popup: "my-popup",
      htmlContainer: "my-text",
    },
  });
};
