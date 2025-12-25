"use client";

import { getMeAgent } from "@/features/agent/apis/service";
import { Tabs, Tab, Box, Grid, Typography } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { SyntheticEvent, useEffect, useState } from "react";

const SettingsClient = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [agent, setAgent] = useState<any>({});

  useEffect(() => {
    (async () => {
      const agent = await getMeAgent();
      setAgent(agent.data?.payload);
    })();
  }, []);

  const tabs = [
    { label: "Company", path: "/settings/company" },
    { label: "Profile", path: "/settings/profile" },
    { label: "Bank Accounts", path: "/settings/bank-accounts" },
    { label: "Manage Role", path: "/settings/roles" },
    { label: "OTP Services", path: "/settings/otp-service" },
    { label: "Auto Services", path: "/settings/auto-service" },
    { label: "Change Password", path: "/settings/change-password" },
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
          Settings
          <Typography className="form-subtitle">
            Manage your settings
          </Typography>
        </Typography>

        <Box>
          {pathname === "/settings/bank-accounts" && (
            <button
              className="add-button"
              onClick={() => router.push("/settings/bank-accounts/create/new")}
            >
              Add Bank Account
            </button>
          )}
          {pathname === "/settings/roles" && (
            <button
              className="add-button"
              onClick={() => router.push("/settings/roles/create/new")}
            >
              Add Role
            </button>
          )}
        </Box>
      </Grid>

      {agent.approvalStatus === "REQUESTED" ? (
        <Box
          mb={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
            borderRadius: "2px",
            padding: "20px",
            fontSize: "16px",
            fontFamily: "Outfit, sans-serif",
          }}
        >
          <span>
            We are currently reviewing your account. Please wait for approval.
            Additionally, ensure that you upload your{" "}
            <span style={{ fontWeight: "bold" }}>NID and Trade License</span>{" "}
            from the company section for verification. Please contact support
            for any queries.
          </span>
        </Box>
      ) : agent.approvalStatus === "REJECTED" ? (
        <Box
          mb={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
            borderRadius: "2px",
            padding: "20px",
            fontSize: "16px",
            fontFamily: "Outfit, sans-serif",
          }}
        >
          <span>
            Your account has been{" "}
            <span style={{ fontWeight: "bold" }}>Rejected</span>. Your actions
            are currently limited. Please contact support for further
            assistance.
          </span>
        </Box>
      ) : null}

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

export default SettingsClient;
