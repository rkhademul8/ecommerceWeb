"use client";

import React, { useEffect, useState } from "react";
import { Box, GridLegacy as Grid, Tab, Tabs, Typography } from "@mui/material";
import PartialDueList from "./PartialDueList";
import { InfoAlert } from "@/components/alerts/InfoAlert";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import commaNumber from "comma-number";
import { getPartialDueSummary } from "@/features/order/order";

const PartialDue = () => {
  const [selectedTab, setSelectedTab] = useState("All");
  const [partialDueSummary, setPartialDueSummary] = useState<any>({});

  const handleTabChange = (event: any, value: any) => {
    setSelectedTab(value);
  };

  useEffect(() => {
    (async () => {
      try {
        // const {
        //   data: { payload: partialDueSummary },
        // } = await getPartialDueSummary();

        // setPartialDueSummary(partialDueSummary);
      } catch (error: any) {
        if (error.statusCode == "403") {
          InfoAlert(
            "You do not have permission to access this resource. Please contact the administrator for assistance."
          );
        } else {
          ErrorAlert(error.message);
        }
      }
    })();
  }, []);

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
          Partially Bookings
          <Typography className="form-subtitle">
            Manage your partial bookings
          </Typography>
        </Typography>
      </Grid>
{/* 
      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                backgroundColor: "#FF7D76",
                borderRadius: "8px",
                padding: "20px 30px",
              }}
            >
              <Typography
                style={{
                  color: "#FFFFFF",
                  fontSize: "15px",
                  fontFamily: "Outfit",
                }}
              >
                Due Today
              </Typography>

              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontSize: "22px",
                  fontWeight: 500,
                  fontFamily: "Outfit",
                }}
              >
                {partialDueSummary.currency}{" "}
                {commaNumber(partialDueSummary.todayPartialDue) || 0}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                backgroundColor: "#7676FF",
                borderRadius: "8px",
                padding: "20px 30px",
              }}
            >
              <Typography
                style={{
                  color: "#FFFFFF",
                  fontSize: "15px",
                  fontFamily: "Outfit",
                }}
              >
                Due Tomorrow
              </Typography>

              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontSize: "22px",
                  fontWeight: 500,
                  fontFamily: "Outfit",
                }}
              >
                {partialDueSummary.currency}{" "}
                {commaNumber(partialDueSummary.tomorrowPartialDue) || 0}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                backgroundColor: "#FFB554",
                borderRadius: "8px",
                padding: "20px 30px",
              }}
            >
              <Typography
                style={{
                  color: "#FFFFFF",
                  fontSize: "15px",
                  fontFamily: "Outfit",
                }}
              >
                Total Outstanding
              </Typography>

              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontSize: "22px",
                  fontWeight: 500,
                  fontFamily: "Outfit",
                }}
              >
                {partialDueSummary.currency}{" "}
                {commaNumber(partialDueSummary.totalPartialDue) || 0}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box> */}

      <Box className="main-box">
        <Tabs
          variant="fullWidth"
          className="primary-tab"
          value={selectedTab}
          onChange={handleTabChange}
        >
          {[
            "All",
            "Today",
            "Tomorrow",
            "Expire",
            "Paid",
            "Unpaid",
            "Refund",
          ].map((label: any, index: any) => {
            return <Tab key={index} label={label} value={label} />;
          })}
        </Tabs>

        <Box mt={3}>
          <PartialDueList tab={selectedTab} />
        </Box>
      </Box>
    </Box>
  );
};

export default PartialDue;
