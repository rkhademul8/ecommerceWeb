import Swal from "sweetalert2";

export const InfoAlert = (text: string) => {
  if (!text) return null;

  return Swal.fire({
    icon: "info",
    text,
  });
};
