"use client";

import { Box, Button, Fab, Typography } from "@mui/material";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
import { useEffect, useState } from "react";
import {
  getEnvironmentMode,
  getEnvironmentMsg,
  getSiteLogo,
} from "@/features/common/setting/service";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import PageLoader from "../../components/PageLoader";
import AOS from "aos";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Image from "next/image";
import "../../scss/dashboard-layout.scss";
import logo from "../../../public/favicon.png";
import secureLocalStorage from "react-secure-storage";
import SubHeader from "./_components/landing/SubHeader";

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [envMsg, setEnvMsg] = useState<any>({});
  const [envMode, setEnvMode] = useState<any>({});
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 700,
      easing: "ease-in-out",
    });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const resultMode: any = await getEnvironmentMode();
        const resultMsg: any = await getEnvironmentMsg();
        const resultSiteLogo: any = await getSiteLogo();

        setEnvMsg(resultMsg.data?.payload);
        setEnvMode(resultMode.data?.payload);

        const logo = resultSiteLogo.data?.payload?.metavalue || "";
        secureLocalStorage.setItem("site-logo", logo);
      } catch (error) {
        const errorMessage = handleApiErrors(error);
        ErrorAlert(errorMessage);
      }
    })();
  }, []);

  const toggleChatPopup = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleStartChat = () => {
    window.open(`https://wa.me/+8801309977797`, "_blank");
  };

  return (
    <Box className="site-layout-wrapper">
      {loading ? (
        <PageLoader />
      ) : (
        <>
          {envMode.metavalue === "Yes" ? (
            <Typography
              sx={{
                textAlign: "center",
                display: "block",
                margin: "auto",
                fontFamily: "Outfit, sans-serif",
                fontSize: "35px",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              {envMsg.metavalue || "We are currently Maintenance Mode"}
            </Typography>
          ) : (
            <>
              <Header />
              <SubHeader />
              <Box component="main" className="site-main-content">
                {children}
              </Box>
              <Footer />
            </>
          )}
        </>
      )}

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
              height={25}
            />
            <Typography className="header-title" variant="subtitle1">
              Desh Mart
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
            <Typography className="message">Hi, how can I help you?</Typography>

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
    </Box>
  );
};

export default SiteLayout;
