"use client";

import { Tabs, Tab, Box, Typography, GridLegacy as Grid } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { SyntheticEvent } from "react";

const ReportsClient = () => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { label: "Login Activity", path: "/reports/login-activity" },
    // { label: "Login Activity", path: "/reports/login-activity" },
  ];

  const activeTab = tabs.findIndex((tab) => tab.path === pathname);

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    router.push(tabs[newValue].path);
  };

  return (
    <Box>
      <Grid
        item
        mb={4}
        xs={12}
        sm={12}
        md={12}
        display="flex"
        justifyContent="space-between"
      >
        <Typography className="form-title">
          Report
          <Typography className="form-subtitle">Manage your reports</Typography>
        </Typography>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          variant="fullWidth"
          className="primary-tab"
          onChange={handleTabChange}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Box>
    </Box>
  );
};

export default ReportsClient;
