"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import { SuccessAlert } from "@/components/alerts/SuccessAlert";
import {
  Box,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Typography,
  GridLegacy as Grid,
} from "@mui/material";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  resetPassword,
  verifyOtpEmail,
  forgotPassword,
} from "@/features/auth/service";
import { getMe } from "@/features/user/service";
import "../../../../../scss/auth/forgot-password.scss";
import { CustomOtpInput } from "@/components/custom/CustomOtpInput";
import { CustomInputRegister } from "@/components/custom/CustomInputRegister";

const ChangePassword: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120);
  const [errorMsg, setErrorMsg] = useState("");

  const [isDisabled, setIsDisabled] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showPasswords, setShowPasswords] = useState<any>({});

  const [loading, setLoading] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [formErrMsg, setFormErrorMsg] = useState<any>({
    email: "",
  });

  useEffect(() => {
    (async () => {
      const { data } = await getMe();
      setFormData({ email: data?.payload?.email || "" });
    })();
  }, []);

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

  const handleChange = ({ target }: any) => {
    setErrorMsg("");
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleOtpChange = (e: any) => {
    setErrorMsg("");
    setOtp(e.target.value);
  };

  const handleOtpClose = () => {
    setOtp("");
    setErrorMsg("");
    setOtpModalOpen(false);
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();

    setLoading({ forgot: true });

    setTimeout(async () => {
      try {
        const result = await forgotPassword({ email: formData.email });
        if (result.data) {
          setTimer(45);
          setIsDisabled(true);
          setOtpModalOpen(true);
        }
      } catch (error) {
        const errorMessage = handleApiErrors(error);
        ErrorAlert(errorMessage);
      } finally {
        setLoading({ forgot: false });
      }
    }, 500);
  };

  const handleOtpSubmit = async () => {
    const newData = {
      otp: otp,
      type: "Forgot Password",
      email: formData.email,
    };

    setLoading({ verify: true });

    setTimeout(async () => {
      try {
        const result = await verifyOtpEmail(newData);

        if (result.data) {
          setTimer(0);
          setIsDisabled(false);
          setOtpModalOpen(false);
          setIsOtpVerified(true);
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
        const result = await forgotPassword({ email: formData.email });
        if (result.data) {
          setTimer(45);
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

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      return setErrorMsg("Password's does not match");
    }

    const newData = {
      otp,
      email: formData.email,
      newPassword: formData.newPassword,
    };

    setLoading({ reset: true });

    setTimeout(async () => {
      try {
        const result = await resetPassword(newData);
        if (result.data) {
          setOtp("");
          setTimer(45);
          setErrorMsg("");
          setIsDisabled(false);
          setOtpModalOpen(false);
          setIsOtpVerified(false);
          SuccessAlert("Password change successful");
        }
      } catch (error) {
        const errorMessage = handleApiErrors(error);
        ErrorAlert(errorMessage);
      } finally {
        setLoading({ reset: false });
      }
    }, 500);
  };

  return (
    <Box className="form-container">
      <Box className="form-wrapper">
        {isOtpVerified ? (
          <Box>
            <Grid item xs={12} sm={12} md={12} mb={3}>
              <Typography className="form-title" mb={2}>
                Change Your Password
              </Typography>

              <hr className="tab-divider" />
            </Grid>

            <Box>
              <form onSubmit={handleResetPassword}>
                <div>
                  <label className="form-label">
                    <span className="form-required">*</span> New Password
                  </label>
                  <CustomInputRegister
                    required
                    type={showPasswords.newPassword ? "text" : "password"}
                    name="newPassword"
                    onChange={(e) => {
                      const value = e.target.value;

                      const passwordRequirements = {
                        minLength: value.length >= 8,
                        hasLetter: /[A-Za-z]/.test(value),
                        hasNumber: /\d/.test(value),
                        hasSymbol: /[@$!%*?&]/.test(value),
                      };

                      const isValidPassword = Object.values(
                        passwordRequirements
                      ).every((requirement) => requirement);

                      handleChange({
                        target: { name: e.target.name, value },
                      });

                      setFormErrorMsg((prev: any) => ({
                        ...prev,
                        newPassword: isValidPassword
                          ? null
                          : passwordRequirements,
                      }));
                    }}
                    placeholder="Create New Password"
                    value={formData.newPassword || ""}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowPasswords((prev: any) => ({
                                ...prev,
                                newPassword: !prev.newPassword,
                              }))
                            }
                          >
                            {showPasswords.newPassword ? (
                              <Visibility sx={{ fontSize: "17px" }} />
                            ) : (
                              <VisibilityOff sx={{ fontSize: "17px" }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={
                      !!formErrMsg.newPassword &&
                      (!formErrMsg.newPassword.minLength ||
                        !formErrMsg.newPassword.hasLetter ||
                        !formErrMsg.newPassword.hasNumber ||
                        !formErrMsg.newPassword.hasSymbol)
                    }
                  />
                  <ul className="password-requirements">
                    <li
                      className={
                        formErrMsg.newPassword === null ||
                        formErrMsg.newPassword?.minLength
                          ? "valid"
                          : ""
                      }
                    >
                      Minimum 8 characters
                    </li>
                    <li
                      className={
                        formErrMsg.newPassword === null ||
                        formErrMsg.newPassword?.hasLetter
                          ? "valid"
                          : ""
                      }
                    >
                      At least one letter (A-Z or a-z)
                    </li>
                    <li
                      className={
                        formErrMsg.newPassword === null ||
                        formErrMsg.newPassword?.hasNumber
                          ? "valid"
                          : ""
                      }
                    >
                      At least one number (0-9)
                    </li>
                    <li
                      className={
                        formErrMsg.newPassword === null ||
                        formErrMsg.newPassword?.hasSymbol
                          ? "valid"
                          : ""
                      }
                    >
                      At least one symbol (@, $, !, %, *, ?, &)
                    </li>
                  </ul>
                  <label className="form-label" style={{ marginTop: "20px" }}>
                    <span className="form-required">*</span> Confirm Password{" "}
                    {formErrMsg.confirmPassword && (
                      <span className="form-alert">{`(${formErrMsg.confirmPassword})`}</span>
                    )}
                  </label>
                  <CustomInputRegister
                    required
                    type={showPasswords.confirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    onChange={(e) => {
                      const value = e.target.value;

                      handleChange({
                        target: { name: e.target.name, value },
                      });

                      setFormErrorMsg((prev: any) => ({
                        ...prev,
                        confirmPassword:
                          value === formData.newPassword
                            ? null
                            : "Passwords do not match.",
                      }));
                    }}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword || ""}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowPasswords((prev: any) => ({
                                ...prev,
                                confirmPassword: !prev.confirmPassword,
                              }))
                            }
                          >
                            {showPasswords.confirmPassword ? (
                              <Visibility sx={{ fontSize: "17px" }} />
                            ) : (
                              <VisibilityOff sx={{ fontSize: "17px" }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={!!formErrMsg.confirmPassword}
                  />
                </div>

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="submit"
                    disabled={
                      loading.reset ||
                      Object.values(formErrMsg).some((err) => err) ||
                      formData.newPassword !== formData.confirmPassword
                    }
                    style={{ marginTop: "15px" }}
                    className={`add-button ${loading.reset ? "disabled" : ""}`}
                  >
                    {loading.reset && (
                      <CircularProgress size={20} className="loading-icon" />
                    )}
                    Submit
                  </button>
                </Box>
              </form>
            </Box>
          </Box>
        ) : (
          <Box>
            <Grid item xs={12} sm={12} md={12} mb={3}>
              <Typography className="form-title" mb={2}>
                Verify Your Identity
              </Typography>

              <hr className="tab-divider" />
            </Grid>

            <Box>
              <form onSubmit={handleChangePassword}>
                <label className="form-label">
                  <span className="form-required">*</span> Email Address{" "}
                  <span className="form-text">(OTP will be sent here)</span>
                </label>

                <CustomInputRegister
                  required
                  disabled
                  name="email"
                  autoComplete="off"
                  value={formData.email || ""}
                />

                <Box
                  mt={3}
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <button
                    type="submit"
                    disabled={loading.forgot}
                    style={{ marginTop: "15px" }}
                    className={`add-button ${loading.forgot ? "disabled" : ""}`}
                  >
                    {loading.forgot && (
                      <CircularProgress size={15} className="loading-icon" />
                    )}
                    Send Verification Code
                  </button>
                </Box>
              </form>
            </Box>
          </Box>
        )}
      </Box>

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
            onClick={handleOtpSubmit}
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
  );
};

export default ChangePassword;
