"use client";
import React, { useState } from "react";
import { Box, Container, Grid, useMediaQuery } from "@mui/material";
import Header from "@/app/(dashboard)/dashboard/_components/Header";

import Sidebar from "./Sidebar";
import { useTheme } from "@mui/material/styles";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();

  const [isOpen, setIsOpen] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const expandedWidth = 165;
  const collapsedWidth = isMobile ? 30 : 74;

  return (
    <Box>
      <Header setIsOpen={setIsOpen} />
      <Box
        sx={{
          display: "flex",
          gap: "15px",
        }}
      >
        <Box>
          <Sidebar isOpen={isOpen} />
        </Box>
        <Box
          sx={{
            width: isOpen
              ? `calc(100% - ${expandedWidth}px)`
              : `calc(100% - ${collapsedWidth}px)`,
            minHeight: "100vh",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12}>
              <main className="content">{children}</main>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
