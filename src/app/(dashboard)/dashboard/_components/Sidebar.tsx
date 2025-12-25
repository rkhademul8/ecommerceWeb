"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Box,
  CircularProgress,
  Typography,
  SwipeableDrawer,
} from "@mui/material";
import { sidebarMenu as initialSidebarMenu } from "../../../../../public/data-source/sidebar-menu";
import LogOut from "../../../../../public/assests/menuicon/Logoutiutton.svg";
import { logout } from "@/features/auth/service";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { getMeWallet } from "@/features/agent/apis/service";

import "../../../../scss/dashboard/sidebar.scss";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const Sidebar = ({ isOpen }: any) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoading, setIsLoadong] = useState(false);
  const [sidebarMenu, setSidebarMenu] = useState<any>([]);

  const [state, setState] = useState({
    right: false,
  });

  const toggleDrawer =
    (anchor: keyof typeof state, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  useEffect(() => {
    (async () => {
      const {
        data: { payload: agentWallet },
      } = await getMeWallet();
      const updatedMenu = initialSidebarMenu.filter(
        (item) =>
          agentWallet.wallet.isActiveCreditBalance || item.tag !== "credit"
      );
      setSidebarMenu(updatedMenu);
    })();
  }, []);

  useEffect(() => {
    setState({ right: false });
  }, [pathname]);

  const handleLogOut = async () => {
    localStorage.removeItem("popupSlider");
    localStorage.removeItem("depositPopup");
    setIsLoadong(true);
    setTimeout(async () => {
      try {
        const result = await logout();
        if (result.data) {
          router.push("/");
        }
      } catch (error) {
        const errorMessage = handleApiErrors(error);
        ErrorAlert(errorMessage);
      } finally {
        setIsLoadong(false);
      }
    }, 500);
  };

  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box>
      <Box
        sx={{
          display: { xs: "none", sm: "block" },
        }}
      >
        <Box className={`sidebar-layout ${isOpen ? "open" : "collapsed"}`}>
          <Box>
            {sidebarMenu?.map((item: any, i: any) => (
              <Link
                key={i}
                href={item.path}
                className={`sidebar-link ${isOpen ? "open" : "collapsed"} ${
                  pathname === item.path ? "active" : ""
                }`}
              >
                <img
                  src={item.icon.src}
                  alt={item.name}
                  width={15}
                  height={15}
                  style={{
                    filter:
                      pathname === item.path
                        ? "brightness(0) invert(1)"
                        : "none",
                  }}
                />
                {isOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </Box>

          <Box>
            <button
              onClick={handleLogOut}
              disabled={isLoading}
              className={`logout-button ${isLoading ? "disabled" : ""}`}
            >
              {isLoading && <CircularProgress size={15} />}
              <img src={LogOut.src} width={15} alt="logout" />
              {isOpen && "Log Out"}
            </button>
          </Box>
        </Box>
      </Box>

      {/*  mobile */}
      <Box>
        <Box>
          <SwipeableDrawer
            className="mobile-swipeable-drawer"
            anchor="right"
            open={state.right}
            onClose={toggleDrawer("right", false)}
            onOpen={toggleDrawer("right", true)}
          >
            <Box>
              {sidebarMenu.map((item: any, index: any) => (
                <Link key={index} href={item.path} passHref legacyBehavior>
                  <a
                    className={`mobile-sidebar-link ${
                      pathname === item.path ? "active" : ""
                    } ${isOpen ? "open" : ""}`}
                  >
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={17}
                      height={17}
                    />
                    <span>{item.name}</span>
                  </a>
                </Link>
              ))}

              <div className="logout-container-mobile">
                <button
                  className={`logout-button ${isLoading ? "disabled" : ""}`}
                  onClick={handleLogOut}
                  disabled={isLoading}
                >
                  {isLoading && (
                    <CircularProgress size={12} className="loading-icon" />
                  )}
                  <Image width={12} src={LogOut} alt="Log Out" />
                  Log Out
                </button>
              </div>
            </Box>
          </SwipeableDrawer>
        </Box>

        <Box>
          <Box className="menu-bottom-nav-list">
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "40px",
              }}
            >
              <Box onClick={toggleDrawer("right", !state.right)}>
                <MenuIcon className="mobile-menu-icon" />

                <Typography className="mobile-menu-nav-name">Menu</Typography>
              </Box>
              <Box>
                <Link href="/dashboard">
                  <DashboardIcon className="mobile-menu-icon" />
                  <Typography className="mobile-menu-nav-name">
                    Dashboard
                  </Typography>
                </Link>
              </Box>
              <Box>
                <Link href={"/orders"}>
                  <BookOnlineIcon className="mobile-menu-icon" />
                  <Typography className="mobile-menu-nav-name">
                    Order
                  </Typography>
                </Link>
              </Box>

              <Box>
                <Link href={"/account-ledger"}>
                  <AccountBalanceIcon className="mobile-menu-icon" />
                  <Typography className="mobile-menu-nav-name">
                    Account
                  </Typography>
                </Link>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
