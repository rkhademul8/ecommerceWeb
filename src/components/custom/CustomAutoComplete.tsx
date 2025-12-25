import { Autocomplete, styled } from "@mui/material";

export const CustomAutocomplete = styled(Autocomplete)(({}) => ({
  width: "100%",
  "& .MuiOutlinedInput-root": {
    height: "40px",
    borderRadius: "8px",
    color: "#413755",
    fontSize: "14px",
    fontFamily: "Outfit",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#01783B",
    },
    "&.Mui-focused": {
      backgroundColor: "#fff",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#01783B",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#EAE8F4",
    }, 
  },
  "& .MuiInputBase-input": {
    fontWeight: 500,
    "&::placeholder": {
      color: "#4B5563",
      opacity: 1,
    },
  },
}));
