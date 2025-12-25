import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { color } from "chart.js/helpers";

export const PassengerCustomInput = styled(TextField)(({}) => ({
  width: "100%",
  "& .MuiInputBase-root": {
    height: "35px",
    borderRadius: "4px",
    color: "#413755",
    padding: "0 0px",
    boxSizing: "border-box",
    transition: "all 0.3s ease-in-out",
    fontFamily: "Outfit",
    fontSize: "12px",
  },
  "&.Mui-disabled": {
    backgroundColor: "green !important",
    color: "green !important",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#EAE8F4",
    },
    "&:hover fieldset": {
      borderColor: "#C3A0CD",
    },
    "&.Mui-focused": {
      backgroundColor: "#F2F0F9",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#C3A0CD",
    },
    "&.Mui-error fieldset": {
      borderColor: "#FF7D95",
    },
  },
  "& .MuiInputBase-input": {
    fontWeight: 500,
    textTransform: "uppercase",
    "&::placeholder": {
      fontSize: "12px",
      textTransform: "none",
      fontFamilly: "Outfit",
    },
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
