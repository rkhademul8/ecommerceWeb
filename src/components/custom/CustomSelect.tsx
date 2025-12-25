import { Select } from "@mui/material";
import { styled } from "@mui/material/styles";

export const CustomSelect = styled(Select)(({ theme }) => ({
  width: "100%",
  height: "40px",
  borderRadius: "8px",
  color: "#000000",
  outline: "none",
  fontSize: "14px",
  fontFamily: "Outfit",
  transition: "background-color 0.3s ease, border-color 0.3s ease",
  position: "relative",

  "&.Mui-focused": {
    outline: "none",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#EAE8F4",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#01783B",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#01783B",
  },
  "& .MuiInputBase-input": {
    fontWeight: 500,
  },
  "& .MuiInputBase-input:focus": {
    fontWeight: 500,
  },
}));
