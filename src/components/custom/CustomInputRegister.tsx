import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

export const CustomInputRegister = styled(TextField)(() => ({
  width: "100%",
  "& .MuiInputBase-root": {
    height: "40px",
    borderRadius: "8px",
    color: "#000000",
    padding: "0 0px",
    boxSizing: "border-box",
    transition: "all 0.3s ease-in-out",
    fontFamily: "Outfit",
    fontSize: "14px",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#EAE8F4",
    },
    "&:hover fieldset": {
      borderColor: "#01783B",
    },
    "&.Mui-focused": {
      backgroundColor: "#fff",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#01783B",
    },
    "&.Mui-error fieldset": {
      borderColor: "#E42E44",
    },
  },
  "& .MuiInputBase-input": {
    fontWeight: 500,
    "&::placeholder": {
      color: "#4B5563",
      opacity: 1,
    },
  },
  "& .MuiFormHelperText-root": {
    fontSize: "12px",
    color: "red",
    fontFamily: "Outfit",
  },
}));
