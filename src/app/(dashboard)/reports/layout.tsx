import { Box, Grid } from "@mui/material";
import ReportsClient from "./_components/ReportsClient";

const ReportsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box>
      <ReportsClient />
      <Box>{children}</Box>
    </Box>
  );
};

export default ReportsLayout;
