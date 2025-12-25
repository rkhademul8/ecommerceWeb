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
} from "@mui/material";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  forgotPassword,
  resetPassword,
  verifyOtpEmail,
} from "@/features/auth/service";
import { CustomOtpInput } from "@/components/custom/CustomOtpInput";
import Link from "next/link";
import { useRouter } from "next/navigation";

import "../../../../scss/auth/forgot-password.scss";
import { CustomInputRegister } from "@/components/custom/CustomInputRegister";

const ForgotPasswordForm: React.FC = () => {
  const router = useRouter();

  const [timer, setTimer] = useState(120);
  const [errorMsg, setErrorMsg] = useState("");
  const [otp, setOtp] = useState("");
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

  const handleForgotPassword = async (e: FormEvent) => {
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
          SuccessAlert("Password reset successful");
          router.push("/");
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
    <Box className="forgot-main-box">
      <Box className="forgot-form-wrapper">
        <Box className="forgot-form-container">
          {isOtpVerified ? (
            <Box>
              <h3>Reset Your Password</h3>

              <Box mt={3}>
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

                  <button
                    type="submit"
                    disabled={
                      loading.reset ||
                      Object.values(formErrMsg).some((err) => err) ||
                      formData.newPassword !== formData.confirmPassword
                    }
                    style={{ marginTop: "15px" }}
                    className={`forgot-button ${
                      loading.reset ? "disabled" : ""
                    }`}
                  >
                    {loading.reset && (
                      <CircularProgress size={20} className="loading-icon" />
                    )}
                    Submit
                  </button>

                  <Box mt={0.5}>
                    <span className="normal-text">
                      Already have an account?{" "}
                      <Link href="/login" className="link">
                        Login now
                      </Link>
                    </span>
                  </Box>
                </form>
              </Box>
            </Box>
          ) : (
            <Box>
              <h3>Forgot Password?</h3>

              <Box mt={4}>
                <form onSubmit={handleForgotPassword}>
                  <label className="form-label">
                    <span className="form-required">*</span> E-mail address{" "}
                    {formErrMsg.email ? (
                      <span className="form-alert">{`(${formErrMsg.email})`}</span>
                    ) : (
                      <span className="form-text">
                        (Please provide a valid email)
                      </span>
                    )}
                  </label>

                  <CustomInputRegister
                    required
                    name="email"
                    autoComplete="off"
                    onChange={(e) => {
                      const value = e.target.value;

                      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                        value
                      );

                      handleChange({
                        target: { name: e.target.name, value },
                      });

                      if (isValidEmail || value === "") {
                        setFormErrorMsg({
                          ...formErrMsg,
                          email: "",
                        });
                      } else {
                        setFormErrorMsg({
                          ...formErrMsg,
                          email: "Invalid email address format",
                        });
                      }
                    }}
                    placeholder="Enter E-mail address"
                    value={formData.email || ""}
                    error={!!formErrMsg.email}
                  />

                  <button
                    type="submit"
                    disabled={loading.forgot || formErrMsg.email}
                    style={{ marginTop: "15px" }}
                    className={`forgot-button ${
                      loading.forgot ? "disabled" : ""
                    }`}
                  >
                    {loading.forgot && (
                      <CircularProgress size={20} className="loading-icon" />
                    )}
                    Submit
                  </button>

                  <Box mt={0.5}>
                    <span className="normal-text">
                      Already have an account?{" "}
                      <Link href="/login" className="link">
                        Login now
                      </Link>
                    </span>
                  </Box>
                </form>
              </Box>
            </Box>
          )}
        </Box>
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

export default ForgotPasswordForm;
