"use client";

import React, { useEffect, useState } from "react";
import {
  generateDeviceId,
  login,
  sendOtpEmail,
  sendPublicOtp,
  verifyOtpEmail,
} from "@/features/auth/service";
import {
  Box,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Typography,
} from "@mui/material";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { CustomOtpInput } from "@/components/custom/CustomOtpInput";

import "../../../../../scss/auth/login.scss";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { publicVerifyOtp } from "@/features/common/otp-service/service";
import { publicVerifyGoogleAuth } from "@/features/common/google-auth/service";
import RegisterModal from "./RegisterModal";

const LoginModal = ({ setLoggedIn, setOpenLoginModal }: any) => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120);
  const [errorMsg, setErrorMsg] = useState("");
  const [otpMethod, setOtpMethod] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpMethodModal, setOtpMethodModal] = useState(false);
  const [deviceOtpModalOpen, setDeviceOtpModalOpen] = useState(false);

  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState<any>({});
  const [formData, setFormData] = useState<any>({});

  const [openRegisterModal, setOpenRegisterModal] = useState(false);

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

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpMethodChange = (event: any) => {
    setOtpMethod(event.target.value);
  };

  const handleOtpChange = (e: any) => {
    setErrorMsg("");
    setOtp(e.target.value);
  };

  const handleClose = () => {
    setOtpMethod("");
    setUser({});
    setOtpMethodModal(false);
  };

  const handleOtpClose = () => {
    setOtp("");
    setErrorMsg("");
    setOtpMethod("");
    setOtpModalOpen(false);
    setDeviceOtpModalOpen(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading({ login: true });
    setTimeout(async () => {
      try {
        const result = await login(formData);
        if (result.status === 201) {
          setLoggedIn(true);
          setOpenLoginModal(false);
          window.dispatchEvent(new Event("user-logged-in"));
        }

        if (result.status === 203 && result?.data?.isNewDevice) {
          setUser({
            isEmailVerified: result?.data?.isEmailVerified,
            isPhoneVerified: result?.data?.isPhoneVerified,
            isTwoFactorAuthenticationEnabled:
              result?.data?.isTwoFactorAuthenticationEnabled,
          });

          setOtpMethodModal(true);
        } else if (result.status === 203) {
          setTimer(120);
          setIsDisabled(true);
          setOtpModalOpen(true);
        }
      } catch (error) {
        const errorMessage = handleApiErrors(error);
        ErrorAlert(errorMessage);
      } finally {
        setLoading({ login: false });
      }
    }, 1000);
  };

  const handleVerifyEmailOtp = async () => {
    const newData = {
      otp,
      type: "Email",
      email: formData.email,
    };
    
    setLoading({ verify: true });
    setTimeout(async () => {
      try {
        const result = await verifyOtpEmail(newData);
        if (result.data) {
          const loginResult = await login(formData);
          if (loginResult.status === 201) {
            setLoggedIn(true);
            setOpenLoginModal(false);
            window.dispatchEvent(new Event("user-logged-in"));
          }
        }
      } catch (error) {
        const errorMessage = handleApiErrors(error);
        setErrorMsg(errorMessage);
      } finally {
        setLoading({ verify: false });
      }
    }, 500);
  };

  const handleSendEmailOtp = async () => {
    setLoading({ resend: true });
    setTimeout(async () => {
      try {
        const result = await sendOtpEmail({ email: formData.email });
        if (result.data) {
          setTimer(120);
          setErrorMsg("");
          setIsDisabled(true);
          setOtp("");
        }
      } catch (error) {
        const errorMessage = handleApiErrors(error);
        setErrorMsg(errorMessage);
      } finally {
        setLoading({ resend: false });
      }
    }, 500);
  };

  const handleSendOtp = async () => {
    setLoading({ resend: true });

    setTimeout(async () => {
      try {
        if (otpMethod === "Google") {
          setErrorMsg("");
          setOtpMethodModal(false);
          setDeviceOtpModalOpen(true);
          setOtp("");
        } else {
          const result = await sendPublicOtp({
            type: otpMethod,
            otpSendTo: formData.email,
          });
          if (result.data) {
            setTimer(120);
            setErrorMsg("");
            setIsDisabled(true);
            setOtpMethodModal(false);
            setDeviceOtpModalOpen(true);
            setOtp("");
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

  const handleVerifyOtp = async () => {
    const newData = {
      otp,
      type: otpMethod,
      email: formData.email,
    };

    setLoading({ verify: true });
    setTimeout(async () => {
      try {
        let result;
        if (otpMethod === "Google") {
          result = await publicVerifyGoogleAuth({
            email: formData.email,
            code: otp,
          });
        } else {
          result = await publicVerifyOtp(newData);
        }

        if (result.data) {
          await generateDeviceId({ email: formData.email });
          const loginResult = await login(formData);
          if (loginResult.status === 201) {
            setLoggedIn(true);
            setOpenLoginModal(false);
            window.dispatchEvent(new Event("user-logged-in"));
          }
        }
      } catch (error) {
        const errorMessage = handleApiErrors(error);
        setErrorMsg(errorMessage);
      } finally {
        setLoading({ verify: false });
      }
    }, 500);
  };

  if (loading.data) return <div>loading..........</div>;

  return (
    <Box className="login-main-box" mb={1}>
      <Grid container className="login-container">
        <Grid item xs={12} md={12}>
          <Box className="form">
            <h2 className="title">Log in to your account</h2>
            <p className="subtitle">Sign in to continue</p>

            <form onSubmit={handleSubmit}>
              <span className="login-form-label">
                <span className="login-form-required">*</span> Email/Phone No
              </span>
              <input
                required
                id="email"
                name="email"
                className="input-field"
                onChange={handleChange}
                value={formData.email || ""}
                placeholder="Enter Email / Phone No"
                style={{
                  background: "#fff",
                }}
              />

              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: "100%",
                }}
              >
                <span className="login-form-label">
                  <span className="login-form-required">*</span> Password
                </span>
                <input
                  required
                  name="password"
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter Password"
                  value={formData.password || ""}
                  type={showPassword ? "text" : "password"}
                  style={{
                    background: "#fff",
                  }}
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "53%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#292F36",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "24px",
                    fontSize: "20px",
                  }}
                >
                  {showPassword ? (
                    <Visibility sx={{ fontSize: "17px" }} />
                  ) : (
                    <VisibilityOff sx={{ fontSize: "17px" }} />
                  )}
                </span>
              </div>

              <Box
                sx={{
                  display: "flex",
                  marginBottom: "5px",
                  justifyContent: "space-between",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox disableRipple className="remember-me-checkbox" />
                  }
                  label="Remember me"
                />
              </Box>

              <button
                type="submit"
                disabled={loading.login}
                className={`login-button ${loading.login ? "disabled" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                }}
              >
                {loading.login && (
                  <CircularProgress size={15} className="loading-icon" />
                )}
                Sign in
              </button>
            </form>

            <Box>
              <p className="login-footer">
                Don’t have an account?{" "}
                <span
                  className="link"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setOpenRegisterModal(true);
                  }}
                >
                  Sign up{" "}
                </span>
              </p>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Dialog
        open={otpModalOpen}
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
              Sent to your email {formData.email || ""}
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
              onClick={isDisabled ? undefined : handleSendEmailOtp}
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
        </DialogContent>

        <DialogActions sx={{ marginBottom: "20px", marginRight: "10px" }}>
          <button onClick={handleOtpClose} className="otp-cancel-button long">
            Cancel
          </button>

          <button
            onClick={handleVerifyEmailOtp}
            className={`add-button long ${loading.verify || !otp ? "disabled" : ""
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
          <DialogTitle className="normal-label">Select OTP Method</DialogTitle>
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
        open={deviceOtpModalOpen}
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
            Verify the OTP
            <br />
            <span className="normal-text-2">
              Sent to your email {formData.email || ""}
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

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={1}
          >
            <Typography className="normal-text-2">
              Time remaining: {timer}s
            </Typography>


            {otpMethod !== "Google" ? <Typography
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
            </Typography> : null}
          </Box>
        </DialogContent>

        <DialogActions sx={{ marginBottom: "20px", marginRight: "10px" }}>
          <button onClick={handleOtpClose} className="otp-cancel-button long">
            Cancel
          </button>

          <button
            onClick={handleVerifyOtp}
            className={`add-button long ${loading.verify || !otp ? "disabled" : ""
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
        open={openRegisterModal}
        onClose={() => {
          setOpenLoginModal(false);
          setOpenRegisterModal(false);
        }}
        sx={{
          "& .MuiDialog-paper": {
            width: "500px",
            textAlign: "center",
            borderRadius: "12px",
          },
        }}
      >
        <RegisterModal
          setLoggedIn={setLoggedIn}
          setOpenLoginModal={setOpenLoginModal}
          setOpenRegisterModal={setOpenRegisterModal}
        />
      </Dialog>
    </Box>
  );
};

export default LoginModal;
