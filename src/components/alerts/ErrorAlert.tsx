import Swal from "sweetalert2";

export const ErrorAlert = (text: string) => {
  if (!text) return null;

  return Swal.fire({
    icon: "error",
    title: "Request Failed",
    text,
  });
};
