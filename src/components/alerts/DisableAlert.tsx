import Swal, { SweetAlertResult } from "sweetalert2";

export const DisableAlert = (text: string): Promise<SweetAlertResult<any>> => {
  return Swal.fire({
    icon: "question",
    text,
    showCancelButton: true,
    customClass: {
      confirmButton: "my-confirm-button",
      icon: "my-icon",
      title: "my-title",
      popup: "my-popup",
      htmlContainer: "my-text",
    },
  });
};
