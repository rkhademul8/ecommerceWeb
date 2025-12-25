"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  ClickAwayListener,
  Tooltip,
  ListItem,
  List,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { countries } from "@/utils/common/array/countries";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { getMe } from "@/features/user/service";
import UserImg from "../../../../../public/assests/image/user/userProfile.svg";
import { getMeAgent } from "@/features/agent/apis/service";
import RefreshIcon from "@mui/icons-material/Refresh";
import copyIcone from "../../../../../public/assests/Flightsearch/copyIcon.svg";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import MenuIcon from "@mui/icons-material/Menu";
import exclamationIcon from "../../../../../public/assests/svg/exclamationIcon.svg";

import "../../../../scss/dashboard-layout.scss";
import "../../../../scss/dashboard/header.scss";
import "../../../../scss/header.scss";
import { getOrderBySearch } from "@/features/order/order";
import secureLocalStorage from "react-secure-storage";

const Header = ({ setIsOpen }: any) => {
  const router = useRouter();
  const pathname = usePathname();

  const logoUrl = secureLocalStorage.getItem("site-logo");
  const safeLogoUrl =
    logoUrl && logoUrl !== "null" && logoUrl !== "undefined"
      ? logoUrl
      : "/default-logo.png";

  const [user, setUser] = useState<any>({});
  const [agent, setAgent] = useState<any>({});
  const [wallet, setWallet] = useState<any>({});
  const [viewBalance, setViewBalance] = useState<any>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [balanceRefresh, setBalanceRefresh] = useState(false);
  const [creditRefresh, setCreditRefresh] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const {
        data: { payload: user },
      } = await getMe();

      const {
        data: { payload: agent },
      } = await getMeAgent();

      const currencySign = countries.find(
        (item) => agent?.b2bUserWallet?.wallet?.walletCurrency === item.currency
      );
      setUser(user);
      setAgent(agent);
      setWallet({
        ...agent?.b2bUserWallet?.wallet,
        currencySign: currencySign?.sign || null,
      });

      setBalanceRefresh(false);
      setCreditRefresh(false);
      setLoading(false);
    })();
  }, [pathname, balanceRefresh, creditRefresh]);

  useEffect(() => {
    if (viewBalance?.cash === true && balanceRefresh === true) {
      setBalanceRefresh(true);
    } else {
      setBalanceRefresh(false);
    }

    if (viewBalance?.credit === true && creditRefresh === true) {
      setCreditRefresh(true);
    } else {
      setCreditRefresh(false);
    }
  }, []);

  const handleInputChange = async (event: any) => {
    const value = event.target.value;
    setSearchText(value);

    if (value.trim() === "") {
      setSearchResults([]);
      return;
    }

    setLoading(true);

    try {
      const result = await getOrderBySearch(value);
      setSearchResults(result.data.payload || []);
    } catch (error) {
      const errorMessage = handleApiErrors(error);
      ErrorAlert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (id: any) => {
    setSearchText("");
    setSearchResults([]);
    router.push(`/order-details/${id}`);
  };

  const handleBalanceClick = (type: string) => {
    setViewBalance({ ...viewBalance, [type]: !viewBalance[type] });
  };

  const handleCopy = (data: any) => {
    navigator.clipboard.writeText(data);
    setSnackbarOpen(true);

    setTimeout(() => {
      setSnackbarOpen(false);
    }, 2000);
  };

  return (
    <Box
      sx={{
        boxShadow: "rgba(234, 232, 244, 0.95) 0px 0px 25px 0px",
        backgroundColor: "#FFFFFF",
      }}
      mb={1}
    >
      <Grid container>
        <Grid item xs={6} sm={3} md={1.5} lg={1.5}>
          <Box
            sx={{
              textAlign: "center",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <Box
              sx={{
                gap: "22px",
                display: "flex",
                marginLeft: "5px",
                alignItems: "center",
              }}
            >
              <Box>
                <Link href="/">
                  <img
                    style={{
                      width: "150px",
                      marginTop: "5px",
                    }}
                    src={String(safeLogoUrl)}
                    alt="Theme Logo"
                  />
                </Link>
              </Box>
              <Box mt={0.5}>
                <MenuIcon
                  sx={{
                    color: "#4B5563",
                    fontSize: "25px",
                    display: {
                      xs: "none",
                      sm: "block",
                    },
                  }}
                  onClick={() => setIsOpen((prevState: any) => !prevState)}
                />
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid
          item
          xs={6}
          sx={{
            display: {
              xs: "flex",
              sm: "none",
            },
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              marginRight: "10px",
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "#01783B",
                  fontSize: "11px",
                  fontWeight: 600,
                  fontFamily: "Outfit",
                  textAlign: "right",
                }}
              >
                {agent.identificationShortCode}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "11px",
                  color: "#4B5563",
                  textAlign: "right",
                  fontFamily: "Outfit",
                }}
              >
                {user.firstname} {user.lastname}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={9} md={10.5} lg={10.5}>
          <Box
            mt={0.5}
            sx={{
              paddingRight: "10px",
              paddingLeft: "10px",
            }}
          >
            <Grid container spacing={2} display={"flex"} alignItems={"center"}>
              <Grid
                item
                xs={12}
                sm={6}
                md={2.5}
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                  },
                }}
              >
                <ClickAwayListener
                  onClickAway={() => {
                    setSearchResults([]);
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                    }}
                    className="wl-Placeholder-Color"
                  >
                    <SearchIcon
                      sx={{
                        color: "#292F36",
                        position: "absolute",
                        top: "50%",
                        left: "5px",
                        transform: "translateY(-50%)",
                        fontSize: 20,
                      }}
                    />
                    <input
                      style={{
                        borderRadius: "8px",
                        border: "1px solid #C7CACF",
                        outline: "none",
                        width: "100%",
                        height: "35px",
                        paddingLeft: "25px",
                        boxSizing: "border-box",
                        color: "#4B5563",
                        fontSize: "14px",
                        fontFamily: "Outfit",
                        background: "#fff"
                      }}
                      placeholder="Search by order Id/customer name"
                      type="text"
                      value={searchText}
                      onChange={handleInputChange}
                    />

                    {loading && (
                      <CircularProgress
                        size={15}
                        sx={{
                          position: "absolute",
                          top: "25%",
                          right: "10px",
                          transform: "translateY(-50%)",
                          color: "#2b277f",
                        }}
                      />
                    )}

                    {searchResults.length > 0 && (
                      <List
                        sx={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          width: "100%",
                          background: "#FFFFFF",
                          boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.1)",
                          zIndex: 10,
                          maxHeight: "200px",
                          overflowY: "auto",
                        }}
                      >
                        {searchResults.map((item: any) => (
                          <ListItem
                            button
                            key={item.id}
                            onClick={() => handleResultClick(item.id)}
                          >
                            <ListItemText
                              primary={item.code}
                              primaryTypographyProps={{
                                sx: {
                                  border: "1px solid #6e6996",
                                  textAlign: "center",
                                  fontWeight: 600,
                                  fontSize: "12px",
                                  fontFamily: "Outfit",
                                  padding: "2px 0",
                                  borderRadius: "3px",
                                  color: "#6E6996",
                                },
                              }}
                            />
                            <ListItemText
                              primary={item.customerName}
                              primaryTypographyProps={{
                                sx: {
                                  textAlign: "center",
                                  fontWeight: 600,
                                  fontSize: "12px",
                                  fontFamily: "Outfit",
                                  color: "#6E6996",
                                },
                              }}
                            />
                            <ListItemText
                              primary={item.customerPhone}
                              primaryTypographyProps={{
                                sx: {
                                  textAlign: "center",
                                  fontWeight: 600,
                                  fontSize: "12px",
                                  fontFamily: "Outfit",
                                  color: "#6E6996",
                                },
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Box>
                </ClickAwayListener>
              </Grid>

              <Grid
                item
                xs={6}
                sm={6}
                md={4}
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                  },
                }}
              >
                <Box sx={{ display: "flex", gap: "10px" }}>
                  <ClickAwayListener onClickAway={() => {}}>
                    <Box sx={{ display: "flex", gap: "10px" }}>
                      <Box className="reservation-container">
                        <button className="reservation-button">
                          <Image
                            width={15}
                            height={15}
                            src={exclamationIcon}
                            alt="exclamationIcon"
                            style={{
                              marginRight: "4px",
                            }}
                          />
                          CRO
                        </button>
                        <Box className="reservation-tooltip">
                          <Grid
                            sx={{
                              fontSize: "12px",
                              rowGap: "10px",
                            }}
                          >
                            {agent.zone?.reservationName ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                                mb={0.5}
                              >
                                <span className="normal-text">Name:</span>
                                <span className="normal-text">
                                  {agent.zone?.reservationName}
                                </span>
                              </Box>
                            ) : null}

                            {agent.zone?.reservationPhone ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                                mb={0.5}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <span className="normal-text">Phone:</span>
                                  <span className="normal-text">
                                    {agent.zone?.reservationPhone}
                                  </span>
                                  <Tooltip
                                    title={
                                      snackbarOpen === true
                                        ? "Copied Phone!"
                                        : ""
                                    }
                                    arrow
                                  >
                                    <span
                                      onClick={() =>
                                        handleCopy(
                                          `${agent.zone?.reservationPhone}`
                                        )
                                      }
                                      style={{
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Image
                                        width={18}
                                        height={18}
                                        alt="Copy Phone"
                                        src={copyIcone}
                                      />
                                    </span>
                                  </Tooltip>
                                </Box>
                              </Box>
                            ) : null}

                            {agent.zone?.reservationEmail ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <span className="normal-text">Email:</span>
                                  <span className="normal-text">
                                    {agent.zone?.reservationEmail}
                                  </span>
                                  <Tooltip
                                    title={
                                      snackbarOpen === true
                                        ? "Copied Email!"
                                        : ""
                                    }
                                    arrow
                                  >
                                    <span
                                      onClick={() =>
                                        handleCopy(agent.zone?.reservationEmail)
                                      }
                                      style={{
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Image
                                        width={18}
                                        height={18}
                                        alt="Copy Email"
                                        src={copyIcone}
                                      />
                                    </span>
                                  </Tooltip>
                                </Box>
                              </Box>
                            ) : null}
                          </Grid>
                        </Box>
                      </Box>
                      <Box className="reservation-container">
                        <button className="reservation-button">
                          <Image
                            width={15}
                            height={15}
                            src={exclamationIcon}
                            alt="exclamationIcon"
                            style={{
                              marginRight: "4px",
                            }}
                          />
                          Accounts
                        </button>
                        <Box className="reservation-tooltip">
                          <Grid
                            sx={{
                              fontSize: "12px",
                              rowGap: "10px",
                            }}
                          >
                            {agent.zone?.accountName ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                                mb={0.5}
                              >
                                <span className="normal-text">Name:</span>
                                <span className="normal-text">
                                  {agent.zone?.accountName}
                                </span>
                              </Box>
                            ) : null}

                            {agent.zone?.accountPhone ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                                mb={0.5}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <span className="normal-text">Phone:</span>
                                  <span className="normal-text">
                                    {agent.zone?.accountPhone}
                                  </span>
                                  <Tooltip
                                    title={
                                      snackbarOpen === true
                                        ? "Copied Phone!"
                                        : ""
                                    }
                                    arrow
                                  >
                                    <span
                                      onClick={() =>
                                        handleCopy(
                                          `${agent.zone?.accountPhone}`
                                        )
                                      }
                                      style={{
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Image
                                        width={18}
                                        height={18}
                                        alt="Copy Phone"
                                        src={copyIcone}
                                      />
                                    </span>
                                  </Tooltip>
                                </Box>
                              </Box>
                            ) : null}

                            {agent.zone?.accountEmail ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <span className="normal-text">Email:</span>
                                  <span className="normal-text">
                                    {agent.zone?.accountEmail}
                                  </span>
                                  <Tooltip
                                    title={
                                      snackbarOpen === true
                                        ? "Copied Email!"
                                        : ""
                                    }
                                    arrow
                                  >
                                    <span
                                      onClick={() =>
                                        handleCopy(agent.zone?.accountEmail)
                                      }
                                      style={{
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Image
                                        width={18}
                                        height={18}
                                        alt="Copy Email"
                                        src={copyIcone}
                                      />
                                    </span>
                                  </Tooltip>
                                </Box>
                              </Box>
                            ) : null}
                          </Grid>
                        </Box>
                      </Box>

                      <Box className="reservation-container">
                        <button className="reservation-button">
                          <Image
                            width={15}
                            height={15}
                            src={exclamationIcon}
                            alt="exclamationIcon"
                            style={{
                              marginRight: "4px",
                            }}
                          />
                          OM
                        </button>
                        <Box className="reservation-tooltip">
                          <Grid
                            sx={{
                              fontSize: "12px",
                              rowGap: "10px",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                              mb={0.5}
                            >
                              <span className="normal-text">Name:</span>
                              <span className="normal-text">
                                {agent.zone?.KAMUser?.firstname}{" "}
                                {agent.zone?.KAMUser?.lastname}
                              </span>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                              mb={0.5}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <span className="normal-text">Phone:</span>
                                <span className="normal-text">
                                  {agent.zone?.KAMUser?.phoneCode}{" "}
                                  {agent.zone?.KAMUser?.phoneNo}
                                </span>
                                <Tooltip
                                  title={
                                    snackbarOpen === true ? "Copied Phone!" : ""
                                  }
                                  arrow
                                >
                                  <span
                                    onClick={() =>
                                      handleCopy(
                                        `${agent.zone?.KAMUser?.phoneCode} ${agent.zone?.KAMUser?.phoneNo}`
                                      )
                                    }
                                    style={{
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Image
                                      width={18}
                                      height={18}
                                      alt="Copy Phone"
                                      src={copyIcone}
                                    />
                                  </span>
                                </Tooltip>
                              </Box>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <span className="normal-text">Email:</span>
                                <span className="normal-text">
                                  {agent.zone?.KAMUser?.email}
                                </span>
                                <Tooltip
                                  title={
                                    snackbarOpen === true ? "Copied Email!" : ""
                                  }
                                  arrow
                                >
                                  <span
                                    onClick={() =>
                                      handleCopy(agent.zone?.KAMUser?.email)
                                    }
                                    style={{
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Image
                                      width={18}
                                      height={18}
                                      alt="Copy Email"
                                      src={copyIcone}
                                    />
                                  </span>
                                </Tooltip>
                              </Box>
                            </Box>
                          </Grid>
                        </Box>
                      </Box>
                    </Box>
                  </ClickAwayListener>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={1.6}>
                <Box
                  className="view-balance"
                  onClick={() => handleBalanceClick("cash")}
                >
                  {viewBalance.cash ? (
                    <Typography
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontFamily: "Outfit",
                        fontSize: "12px",
                        order: 2,
                        width: "100%",
                        fontWeight: 600,
                      }}
                    >
                      <span>{wallet.currencySign}</span>
                      <span>{(+wallet.cashBalance || 0).toFixed(2)}</span>
                      <span>
                        {balanceRefresh ? (
                          <CircularProgress
                            size={15}
                            sx={{
                              display: "flex",
                              color: "#01783B",
                            }}
                          />
                        ) : (
                          <RefreshIcon
                            onClick={(e) => {
                              e.stopPropagation();
                              setBalanceRefresh((prev) => !prev);
                            }}
                            sx={{ fontSize: "18px", display: "flex" }}
                          />
                        )}
                      </span>
                    </Typography>
                  ) : (
                    <Typography
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontFamily: "Outfit",
                        fontSize: "12px",
                        order: 1,
                        width: "100%",
                        fontWeight: 600,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <span>{wallet.currencySign}</span>
                      </Box>
                      <span>View Cash </span>
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={1.7}>
                {wallet.isActiveCreditBalance ? (
                  <Box
                    className="view-balance"
                    onClick={() => handleBalanceClick("credit")}
                  >
                    {viewBalance.credit ? (
                      <Typography
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontFamily: "Outfit",
                          fontSize: "12px",
                          order: 2,
                          width: "100%",
                          fontWeight: 600,
                        }}
                      >
                        <span>{wallet.currencySign}</span>
                        <span>{(+wallet.creditBalance || 0).toFixed(2)}</span>

                        {creditRefresh ? (
                          <CircularProgress
                            size={15}
                            sx={{ display: "flex", color: "#01783B" }}
                          />
                        ) : (
                          <span>
                            {" "}
                            <RefreshIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                setCreditRefresh((prev) => !prev);
                              }}
                              sx={{ fontSize: "18px", display: "flex" }}
                            />
                          </span>
                        )}
                      </Typography>
                    ) : (
                      <Typography
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontFamily: "Outfit",
                          fontSize: "12px",
                          order: 1,
                          width: "100%",
                          fontWeight: 600,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <span>{wallet.currencySign}</span>
                        </Box>
                        <span>View Credit</span>
                      </Typography>
                    )}
                  </Box>
                ) : null}
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={1.7}
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: { xs: "flex-start", md: "flex-end" },
                    gap: "5px",
                  }}
                >
                  <Box>
                    <Image width={50} height={45} src={UserImg} alt="user" />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        color: "#01783B",
                        fontSize: { xs: "10px", sm: "11px" },
                        fontWeight: 600,
                        fontFamily: "Outfit",
                      }}
                    >
                      {agent.identificationShortCode}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#4B5563",
                        fontSize: { xs: "9px", sm: "11px" },
                        fontFamily: "Outfit",
                        fontWeight: 600,
                      }}
                    >
                      {user.firstname} {user.lastname}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Header;
