import { Select } from "@mui/material";
import { styled } from "@mui/material/styles";

export const CustomPaginationSelect = styled(Select)(({}) => ({
  width: "80px",
  height: "30px !important",
  fontSize: "14px",
  borderRadius: "8px",
  fontFamily: "Outfit",
  color: "#413755",
  backgroundColor: "#FFFFFF",
  "&.Mui-focused": {
    outline: "none",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#C7CACF",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#C7CACF",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#C7CACF",
  },
  "& .MuiInputBase-input": {
    fontWeight: 500,
  },
  "& .MuiInputBase-input:focus": {
    fontWeight: 500,
  },
}));
