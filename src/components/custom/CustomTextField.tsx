import React from "react";
import { TextField } from "@mui/material";
import "../../scss/custom/custom.scss";

const CustomTextField = (props: any) => {
  return (
    <TextField
      {...props}
      sx={{
        width: "100%",
        "& .MuiInputBase-root": {
          height: "40px",
          borderRadius: "8px",
          color: "#4B5563",
          boxSizing: "border-box",
          transition: "all 0.3s ease-in-out",
          fontFamily: "Outfit",
          padding: "0 10px",
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
            backgroundColor: "#F2F0F9",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#01783B",
          },
        },
        "& .MuiInputBase-input": {
          fontWeight: 500,
        },
        "& .MuiInputBase-input:focus": {
          fontWeight: 500,
        },
      }}
    />
  );
};

export default CustomTextField;
