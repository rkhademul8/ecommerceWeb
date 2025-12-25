import { styled, Tab } from "@mui/material";

export const CustomTab = styled(Tab)(({ theme, selected }: any) => ({
  flexBasis: "16.1%",
  backgroundColor: selected ? "#6E6996" : "#B4B4CD",
  color: selected ? "#FFFFFF !important" : "#FFFFFF",
  minHeight: "30px",
  borderRadius: "2px",
  fontFamily: "Outfit",
  fontSize: "12px",
  textTransform: "none",
  fontWeight: 400,
  margin: "0 4px",
  [theme.breakpoints.down("sm")]: {
    fontSize: "10px !important",
  },
}));
