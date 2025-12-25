"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Grid,
  Switch,
  CircularProgress,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Divider,
} from "@mui/material";
import Loader from "@/components/Loader";
import {
  getOtpServices,
  sendOtp,
  updateOtpService,
  verifyOtp,
} from "@/features/common/otp-service/service";
import { SuccessAlert } from "@/components/alerts/SuccessAlert";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import { getMe } from "@/features/user/service";
import { CustomOtpInput } from "@/components/custom/CustomOtpInput";
import {
  generateGoogleAuthQR,
  turnOnGoogleAuth,
  verifyGoogleAuth,
} from "@/features/common/google-auth/service";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import SmsIcon from "@mui/icons-material/Sms";
import GoogleIcon from "@mui/icons-material/Google"; // from MUI Icons

const OtpService: React.FC = () => {
  const [user, setUser] = useState<any>({});
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<any>({});
  const [otpServices, setOtpServices] = useState<any>([]);

  // For send OTP
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120);
  const [errorMsg, setErrorMsg] = useState("");
  const [otpMethod, setOtpMethod] = useState("");
  const [otpModal, setOtpModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [googleAuthQR, setGoogleAuthQR] = useState("");
  const [otpMethodModal, setOtpMethodModal] = useState(false);
  const [googleOtpModal, setGoogleOtpModal] = useState(false);

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (isDisabled && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsDisabled(false);
    }
    return () => clearInterval(countdown);
  }, [isDisabled, timer]);

  useEffect(() => {
    (async () => {
      setLoading({ data: true });

      const {
        data: { payload: service },
      } = await getOtpServices();

      const {
        data: { payload: user },
      } = await getMe();

      setUser(user);
      setOtpServices(service);
      setLoading({ data: false });
    })();
  }, []);

  const handleOtpMethodChange = (event: any) => {
    setOtpMethod(event.target.value);
  };

  const handleOtpChange = (e: any) => {
    setErrorMsg("");
    setOtp(e.target.value);
  };

  const handleToggleEnable = (id: any, newValue: any) => {
    const newServices = otpServices.map((service: any) => {
      if (service.id === id) {
        return { ...service, isEnabled: newValue };
      }
      return service;
    });

    setOtpServices(newServices);
    setData({ id, isEnabled: newValue });
  };

  const handleClose = () => {
    setOtpMethod("");
    setGoogleAuthQR("");
    setOtpMethodModal(false);
    setGoogleOtpModal(false);
  };

  const handleOtpClose = () => {
    setOtp("");
    setErrorMsg("");
    setOtpMethod("");
    setOtpModal(false);
  };

  // Submit changes for OTP service enable/disable
  const handleSubmit = async () => {
    if (data.id) {
      setLoading({ submit: true });
      setTimeout(async () => {
        try {
          if (data.isEnabled) {
            const newData = {
              id: data.id,
              isEnabled: data.isEnabled,
            };

            const result = await updateOtpService(newData);

            if (result.data) {
              const newServices = otpServices.map((service: any) => {
                if (service.id === newData.id) {
                  return { ...service, isEnabled: newData.isEnabled };
                }
                return service;
              });

              setData({});
              setOtpServices(newServices);
              SuccessAlert("Successfully updated otp service");
            }
          } else {
            setOtpMethodModal(true);
            setLoading({ submit: false });
          }
        } catch (error) {
          const errorMessage = handleApiErrors(error);
          ErrorAlert(errorMessage);
        } finally {
          setLoading({ submit: false });
        }
      }, 500);
    }
  };

  // Send OTP via selected method (SMS/Email)
  const handleSendOtp = async (type?: any) => {
    setLoading({ resend: true });

    setTimeout(async () => {
      try {
        if (otpMethod === "Google") {
          setErrorMsg("");
          setOtpMethodModal(false);
          setOtpModal(true);
          setOtp("");
        } else {
          const result = await sendOtp({ type: otpMethod || type });
          if (result.data) {
            setTimer(120);
            setErrorMsg("");
            setIsDisabled(true);
            setOtpMethodModal(false);
            setOtpModal(true);
            setOtp("");
            setOtpMethod(otpMethod ? otpMethod : type);
          }
        }
      } catch (error) {
        const errorMessage = handleApiErrors(error);
        setErrorMsg(errorMessage);
      } finally {
        setLoading({ resend: false });
      }
    }, 500);
  };

  // Verify OTP via selected method (SMS/Email)
  const handleVerifyOtp = async () => {
    const newData = {
      type: otpMethod,
      otp,
    };

    setLoading({ verify: true });

    setTimeout(async () => {
      try {
        let result;
        if (otpMethod === "Google") {
          result = await verifyGoogleAuth({ code: otp });
        } else {
          result = await verifyOtp(newData);
        }

        if (result.data && data.id) {
          try {
            const updatedService = {
              id: data.id,
              isEnabled: data.isEnabled,
            };

            const result = await updateOtpService(updatedService);

            if (result.data) {
              const newServices = otpServices.map((service: any) => {
                if (service.id === updatedService.id) {
                  return { ...service, isEnabled: updatedService.isEnabled };
                }
                return service;
              });

              setData({});
              setOtpMethod("");
              setOtpModal(false);
              setOtpServices(newServices);
              SuccessAlert("Successfully updated otp service");
            }
          } catch (error) {
            const errorMessage = handleApiErrors(error);
            ErrorAlert(errorMessage);
          }
        } else {
          setOtpMethod("");
          setOtpModal(false);
          setUser({
            ...user,
            [otpMethod === "Email" ? "isEmailVerified" : "isPhoneVerified"]:
              true,
          });
          SuccessAlert("Successfully Verified");
        }
      } catch (error) {
        const errorMessage = handleApiErrors(error);
        setErrorMsg(errorMessage);
      } finally {
        setLoading({ verify: false });
      }
    }, 500);
  };

  // Handle Google Auth QR generation
  const handleGenerateGoogleAuthQR = async () => {
    setLoading({ resend: true });

    setTimeout(async () => {
      try {
        const result = await generateGoogleAuthQR();

        if (result.data) {
          const imageUrl = URL.createObjectURL(result.data);
          setGoogleAuthQR(imageUrl);
          setGoogleOtpModal(true);
        }
      } catch (error) {
        const errorMessage = handleApiErrors(error);
        setErrorMsg(errorMessage);
      } finally {
        setLoading({ resend: false });
      }
    }, 500);
  };

  // Handle Verify and Turn on Google auth
  const handleTurnOnGoogleAuth = async () => {
    setLoading({ verify: true });

    setTimeout(async () => {
      try {
        const result = await turnOnGoogleAuth({ code: otp });

        if (result.data) {
          setGoogleAuthQR("");
          setGoogleOtpModal(false);
          setUser({
            ...user,
            isTwoFactorAuthenticationEnabled: true,
          });
          SuccessAlert("Successfully Verified");
        }
      } catch (error) {
        const errorMessage = handleApiErrors(error);
        setErrorMsg(errorMessage);
      } finally {
        setLoading({ verify: false });
      }
    }, 500);
  };

  if (loading.data) return <Loader />;

  return (
    <Box>
      <Box className="main-box" mb={3}>
        <Grid container spacing={2} mb={5}>
          <Grid item xs={12} sm={12} md={12} mb={2}>
            <Typography className="form-title" mb={2}>
              OTP Verification Methods
            </Typography>

            <hr className="tab-divider" />
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <Box className="verification-methods">
              <Grid container spacing={2} mb={3}>
                <Grid item xs={6} sm={6} md={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <MailOutlineIcon sx={{ color: "#555" }} />
                    <Box>
                      <Typography className="normal-text">Email</Typography>
                      <Typography className="normal-text-2">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={6}
                  sm={6}
                  md={6}
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="center"
                  gap={1}
                >
                  {user.isEmailVerified ? (
                    <span className="status verified">Verified</span>
                  ) : (
                    <>
                      <span className="status not-verified">Not Verified</span>
                      <span
                        className={`status verify`}
                        onClick={() => {
                          handleSendOtp("Email");
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        Verify
                      </span>
                    </>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={2} mb={3}>
                <Grid item xs={6} sm={6} md={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <SmsIcon sx={{ color: "#555" }} />
                    <Box>
                      <Typography className="normal-text">Sms</Typography>
                      <Typography className="normal-text-2">
                        {user.phoneCode} {user.phoneNo}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={6}
                  sm={6}
                  md={6}
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="center"
                  gap={1}
                >
                  {user.isPhoneVerified ? (
                    <span className="status verified">Verified</span>
                  ) : (
                    <>
                      <span className="status not-verified">Not Verified</span>
                      <span
                        className={`status verify`}
                        onClick={() => {
                          handleSendOtp("Sms");
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        Verify
                      </span>
                    </>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={6} md={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <GoogleIcon sx={{ color: "#555" }} />
                    <Box>
                      <Typography className="normal-text">
                        Google Authenticator
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={6}
                  sm={6}
                  md={6}
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="center"
                  gap={1}
                >
                  {user.isTwoFactorAuthenticationEnabled ? (
                    <span className="status verified">Verified</span>
                  ) : (
                    <>
                      <span className="status not-verified">Not Verified</span>
                      <span
                        className={`status verify`}
                        onClick={handleGenerateGoogleAuthQR}
                        style={{ cursor: "pointer" }}
                      >
                        Verify
                      </span>
                    </>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box className="main-box" mb={5}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} mb={2}>
            <Typography className="form-title" mb={2}>
              OTP Enabled Service
            </Typography>

            <hr className="tab-divider" />
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            {otpServices.map((otpService: any) => (
              <Box
                key={otpService.id}
                sx={{
                  mb: 2,
                  display: "flex",
                  padding: "3px 10px",
                  borderRadius: "8px",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  border: "1px solid #E0E0E0",
                  justifyContent: "space-between",
                }}
              >
                <Typography className="normal-text-2">
                  {otpService.serviceType}
                </Typography>

                <Box>
                  <Switch
                    checked={otpService.isEnabled}
                    onChange={() =>
                      handleToggleEnable(otpService.id, !otpService.isEnabled)
                    }
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#01783B",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          backgroundColor: "#01783B",
                        },
                    }}
                  />

                  {data.id === otpService.id && (
                    <button
                      onClick={handleSubmit}
                      className={`action-submit-button ${
                        loading.submit ? "disabled" : ""
                      }`}
                      disabled={
                        loading.submit || !data.id || data.id !== otpService.id
                      }
                    >
                      Save
                    </button>
                  )}
                </Box>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Dialog
          open={otpMethodModal}
          sx={{
            "& .MuiDialog-paper": {
              width: "450px",
              maxwidth: "500px",
              margin: "auto",
            },
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <DialogTitle className="normal-label">
              Select OTP Method
            </DialogTitle>
          </Box>

          <DialogContent>
            <RadioGroup value={otpMethod} onChange={handleOtpMethodChange}>
              <FormControlLabel
                disabled={!user.isPhoneVerified}
                value="Sms"
                control={
                  <Radio
                    sx={{
                      color: "#01783B",
                      "&.Mui-checked": {
                        color: "#01783B",
                      },
                      padding: "5px 10px",
                    }}
                  />
                }
                label={
                  <span className="normal-text">
                    Sms{" "}
                    {!user.isPhoneVerified ? (
                      <span className="alert-msg">Not Verified</span>
                    ) : (
                      ""
                    )}
                  </span>
                }
              />
              <FormControlLabel
                disabled={!user.isEmailVerified}
                value="Email"
                control={
                  <Radio
                    sx={{
                      color: "#01783B",
                      "&.Mui-checked": {
                        color: "#01783B",
                      },
                      padding: "5px 10px",
                    }}
                  />
                }
                label={
                  <span className="normal-text">
                    Email{" "}
                    {!user.isEmailVerified ? (
                      <span className="alert-msg">Not Verified</span>
                    ) : (
                      ""
                    )}
                  </span>
                }
              />
              <FormControlLabel
                disabled={!user.isTwoFactorAuthenticationEnabled}
                value="Google"
                control={
                  <Radio
                    sx={{
                      color: "#01783B",
                      "&.Mui-checked": {
                        color: "#01783B",
                      },
                      padding: "5px 10px",
                    }}
                  />
                }
                label={
                  <span className="normal-text">
                    Google Authenticator{" "}
                    {!user.isTwoFactorAuthenticationEnabled ? (
                      <span className="alert-msg">Not Verified</span>
                    ) : (
                      ""
                    )}
                  </span>
                }
              />
            </RadioGroup>
          </DialogContent>

          <DialogActions sx={{ marginBottom: "10px", marginRight: "15px" }}>
            <button onClick={handleClose} className="otp-cancel-button long">
              Cancel
            </button>

            <button
              onClick={handleSendOtp}
              className={`add-button long ${loading.resend ? "disabled" : ""}`}
              disabled={loading.resend || !otpMethod}
            >
              {loading.resend && (
                <CircularProgress size={15} className="loading-icon" />
              )}
              Send OTP
            </button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={otpModal}
          sx={{
            "& .MuiDialog-paper": {
              width: "450px",
              maxwidth: "450px",
              margin: "auto",
            },
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <DialogTitle className="normal-label">
              Verify the OTP
              <br />
              <span className="normal-text-2">
                Sent to your {otpMethod}{" "}
                {otpMethod === "Email"
                  ? user.email
                  : otpMethod === "Sms"
                  ? `${user.phoneCode} ${user.phoneNo}`
                  : "Authenticator APP"}
              </span>
            </DialogTitle>
          </Box>

          <DialogContent>
            <Box>
              <span className="form-label">OTP</span>

              <CustomOtpInput
                value={otp || ""}
                onChange={handleOtpChange}
                placeholder="Enter OTP"
              />
            </Box>
            {<span className="error-msg">{errorMsg || ""}</span>}
            {otpMethod !== "Google" ? (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={1}
              >
                <Typography className="normal-text-2">
                  Time remaining: {timer}s
                </Typography>

                <Typography
                  onClick={isDisabled ? undefined : handleSendOtp}
                  sx={{
                    fontSize: "12px",
                    fontFamily: "Outfit",
                    textDecoration: "underline",
                    color: isDisabled ? "#999" : "#01783B",
                    cursor: isDisabled ? "not-allowed" : "pointer",
                  }}
                >
                  Resend OTP
                </Typography>
              </Box>
            ) : null}
          </DialogContent>

          <DialogActions sx={{ marginBottom: "20px", marginRight: "10px" }}>
            <button onClick={handleOtpClose} className="otp-cancel-button long">
              Cancel
            </button>

            <button
              onClick={handleVerifyOtp}
              className={`add-button long ${
                loading.verify || !otp ? "disabled" : ""
              }`}
              disabled={loading.verify || !otp}
            >
              {loading.verify && (
                <CircularProgress size={15} className="loading-icon" />
              )}
              Verify OTP
            </button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={googleOtpModal}
          sx={{
            "& .MuiDialog-paper": {
              width: "450px",
              maxwidth: "500px",
              margin: "auto",
            },
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <DialogTitle className="normal-label">
              Scan QR code to verify
            </DialogTitle>
          </Box>

          <DialogContent>
            <span className="normal-text">
              Step 1: Scan the QR code in Google Authenticator APP
            </span>
            <Box sx={{ textAlign: "center" }}>
              <img src={googleAuthQR} alt="Image" width={150} height={150} />
            </Box>

            <Box>
              <Box mb={1}>
                <span className="normal-text">Step 2: Verify The OTP</span>
              </Box>
              <CustomOtpInput
                value={otp || ""}
                placeholder="Enter OTP"
                onChange={handleOtpChange}
              />
            </Box>
            {<span className="error-msg">{errorMsg || ""}</span>}
          </DialogContent>

          <DialogActions sx={{ marginBottom: "10px", marginRight: "15px" }}>
            <button onClick={handleClose} className="otp-cancel-button long">
              Cancel
            </button>

            <button
              onClick={handleTurnOnGoogleAuth}
              className={`add-button long ${
                loading.verify || !otp ? "disabled" : ""
              }`}
              disabled={loading.verify || !otp}
            >
              {loading.verify && (
                <CircularProgress size={15} className="loading-icon" />
              )}
              Verify OTP
            </button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default OtpService;
