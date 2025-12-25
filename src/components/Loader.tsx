import { LinearProgress } from "@mui/material";

const Loader = () => {
  return (
    <LinearProgress
      sx={{
        backgroundColor: "#01783b",
        "& .MuiLinearProgress-bar": {
          backgroundColor: "#01783b",
        },
      }}
    />
  );
};

export default Loader;
