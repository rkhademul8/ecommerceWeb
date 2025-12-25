import { Box, Grid } from "@mui/material";
import SettingsClient from "./_components/SettingsClient";

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box>
      <SettingsClient />
      <Box>{children}</Box>
    </Box>
  );
};

export default SettingsLayout;
