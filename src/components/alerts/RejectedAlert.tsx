import Swal from "sweetalert2";

export const RejectedAlert = (text: string) => {
  if (!text) return null;

  return Swal.fire({
    icon: "question",
    text,
    input: "text",
    inputPlaceholder: "Enter remarks",
    showCancelButton: true,
    confirmButtonText: "Submit",
    cancelButtonText: "Cancel",
    customClass: {
      confirmButton: "my-confirm-button",
      icon: "my-icon",
      title: "my-title",
      popup: "my-popup-reject",
      htmlContainer: "my-text",
    },
    inputAttributes: {
      style:
        "height: 35px; borderRadius: 4px, backgroundColor: #F2F0F9; color: #413755, padding: 0px;",
    },
    preConfirm: (inputValue) => {
      if (!inputValue) {
        Swal.showValidationMessage("You need to enter a remarks");
        return false;
      }
      return inputValue;
    },
  });
};
