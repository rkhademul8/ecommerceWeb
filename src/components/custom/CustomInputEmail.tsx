import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

export const CustomInputEmail = styled(TextField)(({}) => ({
  width: "100%",
  "& .MuiInputBase-root": {
    height: "35px",
    borderRadius: "4px",
    color: "#413755",
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
  },
  "& .MuiInputBase-input:focus": {
    fontWeight: 500,
  },
  "& .MuiFormHelperText-root": {
    fontSize: "12px",
    color: "red",
    fontFamily: "Outfit",
  },
}));
