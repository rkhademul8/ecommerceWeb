"use client";

import DashboardLayoutGroup from "./dashboard/_components/DashboardLayout";
import { getJWT, isTokenValid } from "@/features/auth/service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Button, Fab, Typography } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import logo from "../../../public/favicon.png";
import Image from "next/image";
import { getMeAgent } from "@/features/agent/apis/service";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [kam, setKam] = useState<any>({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      const token = getJWT();
      if (!token || !isTokenValid()) {
        router.replace("/");
      } else {
        const {
          data: { payload },
        } = await getMeAgent();
        setKam(payload?.zone?.KAMUser || {});
        setIsAuthenticated(true);
      }
    })();
  }, [router]);

  const toggleChatPopup = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleStartChat = () => {
    window.open(`https://wa.me/${kam.phoneCode}${kam.phoneNo}`, "_blank");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="background-container">
      <DashboardLayoutGroup>{children}</DashboardLayoutGroup>
      {kam.phoneNo ? (
        <>
          <Fab
            color="primary"
            aria-label="whatsapp"
            sx={{
              position: "fixed",
              bottom: {
                xs: 65,
                sm: 16,
              },
              right: {
                xs: 10,
                sm: 16,
              },
              backgroundColor: "#25D366",
              "&:hover": { backgroundColor: "#1DAF53" },
            }}
            onClick={toggleChatPopup}
          >
            <WhatsAppIcon />
          </Fab>

          {isChatOpen && (
            <Box className="chat-popup">
              <Box className="header-container">
                <Image
                  className="header-logo"
                  src={logo}
                  alt="Logo"
                  width={20}
                  height={18}
                />
                <Typography className="header-title" variant="subtitle1">
                  {kam.firstname} {kam.lastname}
                </Typography>
                <Box
                  sx={{
                    marginLeft: "auto",
                    cursor: "pointer",
                    color: "#d32f2f",
                  }}
                  onClick={toggleChatPopup}
                >
                  ✖
                </Box>
              </Box>

              <Box className="body-container">
                <Typography className="message">
                  Hi, how can I help you?
                </Typography>

                <Button
                  className="start-chat-button"
                  variant="contained"
                  onClick={handleStartChat}
                >
                  Start Chat
                </Button>
              </Box>
            </Box>
          )}
        </>
      ) : null}
    </div>
  );
}
