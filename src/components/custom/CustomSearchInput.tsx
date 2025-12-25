import { styled } from "@mui/material/styles";
import { InputBase } from "@mui/material";

export const CustomSearchInput = styled(InputBase)(({}) => ({
  width: "250px",
  height: "40px",
  borderRadius: "8px",
  border: "2px solid #C7CACF",
  backgroundColor: "#FFFFFF !important",
  color: "#413755",
  fontFamily: "Outfit",
  fontSize: "14px",
  fontWeight: 400,
  boxSizing: "border-box",
  transition: "all 0.3s ease-in-out",

  "& .MuiInputBase-input": {
    paddingLeft: "35px",
  },
  
  "&:focus": {
    borderColor: "#C3A0CD",
    backgroundColor: "#FFFFFF",
    outline: "none",
  },
}));
