"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import {
  GridLegacy as Grid,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  InputAdornment,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { CustomMenuItem } from "@/components/custom/CustomMenuItem";
import { CustomAutocomplete } from "@/components/custom/CustomAutoComplete";
import {
  register,
  sendOtpEmail,
  verifyOtpEmail,
} from "@/features/auth/service";
import { CustomOtpInput } from "@/components/custom/CustomOtpInput";
import Link from "next/link";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import "../../../../scss/auth/register.scss";
import { useRouter } from "next/navigation";
import { SuccessAlertRegister } from "@/components/alerts/SuccessAlertRegister";
import { formattedRegistrationCountries } from "@/utils/common/array/registration-countries";
import { CustomInput } from "@/components/custom/CustomInput";

const RegisterForm: React.FC = () => {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState<any>({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);

  const [formData, setFormData] = useState<any>({});
  const [formErrMsg, setFormErrorMsg] = useState<any>({ email: "" });

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
    const newFormData = { ...formData, [target.name]: target.value };
    setFormData(newFormData);
  };

  const handleOtpChange = (e: any) => {
    setErrorMsg("");
    setOtp(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading({ register: true });

    setTimeout(async () => {
      try {
        const result = await register(formData);
        if (result.data) {
          setTimer(45);
          setIsDisabled(true);
          setOtpModalOpen(true);
        }
      } catch (error) {
        const errorMessage = handleApiErrors(error);
        ErrorAlert(errorMessage);
      } finally {
        setLoading({ register: false });
      }
    }, 500);
  };

  const handleOtpSubmit = async () => {
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
          setTimer(0);
          setFormData({});
          setIsDisabled(false);
          setOtpModalOpen(false);
          setOtp("");
          setLoading({ verify: false });
          SuccessAlertRegister(
            "OTP successfully verified. Your account has been created. Please log in to continue."
          );
          router.push(`/login`);
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

  const handleOtpClose = () => {
    setOtp("");
    setErrorMsg("");
    setOtpModalOpen(false);
  };

  return (
    <Box className="register-main-box">
      <Grid container className="register-form-container">
        <Grid item xs={12} md={2.5}></Grid>
        <Grid item xs={12} md={7}>
          <Box className="form">
            <h2 className="title">Create your DeshMart account</h2>
            <p className="subtitle">Sign up to continue</p>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <label className="register-form-label">
                    <span className="register-form-required">*</span> First Name
                  </label>
                  <CustomInput
                    required
                    name="firstname"
                    onChange={(e) => {
                      const value = e.target.value;
                      const formattedValue = value
                        ? value
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(" ")
                        : "";
                      handleChange({
                        target: {
                          name: e.target.name,
                          value: formattedValue,
                        },
                      });
                    }}
                    placeholder="First Name"
                    value={formData.firstname || ""}
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <label className="register-form-label">
                    <span className="register-form-required">*</span> Last Name
                  </label>
                  <CustomInput
                    required
                    name="lastname"
                    onChange={(e) => {
                      const value = e.target.value;
                      const formattedValue = value
                        ? value
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(" ")
                        : "";
                      handleChange({
                        target: {
                          name: e.target.name,
                          value: formattedValue,
                        },
                      });
                    }}
                    placeholder="Last Name"
                    value={formData.lastname || ""}
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <label className="register-form-label">
                    <span className="register-form-required">*</span> Phone
                    Number
                  </label>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Grid item xs={4} md={4}>
                      <CustomAutocomplete
                        disableClearable
                        options={formattedRegistrationCountries}
                        getOptionLabel={(option: any) => `${option.phoneCode}`}
                        renderOption={(props, option: any, { selected }) => (
                          <CustomMenuItem
                            {...props}
                            selected={selected}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              padding: "5px 5px",
                              margin: "0px",
                            }}
                          >
                            <img
                              src={option.flag}
                              alt={`${option.countryName} flag`}
                              style={{
                                width: "20px",
                                height: "15px",
                              }}
                            />{" "}
                            {`${option.phoneCode}`}
                          </CustomMenuItem>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            required
                            placeholder="Code"
                            variant="outlined"
                            size="small"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: formData.phoneCode && (
                                <img
                                  src={
                                    formattedRegistrationCountries.find(
                                      (item) =>
                                        item.phoneCode === formData.phoneCode
                                    )?.flag
                                  }
                                  alt="Selected flag"
                                  style={{
                                    width: "20px",
                                    height: "15px",
                                  }}
                                />
                              ),
                            }}
                          />
                        )}
                        value={
                          formattedRegistrationCountries.find(
                            (item) => item.phoneCode === formData.phoneCode
                          ) || null
                        }
                        onChange={(event: any, newValue: any) => {
                          const phoneCode = newValue ? newValue.phoneCode : "";
                          handleChange({
                            target: { name: "phoneCode", value: phoneCode },
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={8} md={8}>
                      <CustomInput
                        required
                        name="phoneNo"
                        placeholder="Phone Number"
                        value={formData.phoneNo || ""}
                        disabled={!formData.phoneCode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          const isBangladesh = formData.phoneCode === "+880";

                          if (isBangladesh && value.length > 10) return;

                          handleChange({
                            target: { name: e.target.name, value },
                          });

                          setFormErrorMsg((prev: any) => ({
                            ...prev,
                            phoneNo:
                              isBangladesh && value.length !== 10
                                ? "Phone number must be exactly 10 digits"
                                : "",
                          }));
                        }}
                        error={!!formErrMsg.phoneNo}
                      />
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={12} md={12}>
                  <label className="register-form-label">
                    <span className="register-form-required">*</span> E-mail
                    address{" "}
                    {formErrMsg.email ? (
                      <span className="form-alert">{`(${formErrMsg.email})`}</span>
                    ) : (
                      <span className="form-text">
                        (Please provide a valid email)
                      </span>
                    )}
                  </label>
                  <CustomInput
                    required
                    name="email"
                    type="email"
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
                </Grid>

                <Grid item xs={12} md={12}>
                  <label
                    className="register-form-label"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span className="register-form-required">*</span> Create
                    Password
                    <Tooltip
                      title={
                        <ul className="password-requirements">
                          <li
                            className={
                              formErrMsg.password === null ||
                              formErrMsg.password?.minLength
                                ? "valid"
                                : ""
                            }
                          >
                            Minimum 8 characters
                          </li>
                          <li
                            className={
                              formErrMsg.password === null ||
                              formErrMsg.password?.hasLetter
                                ? "valid"
                                : ""
                            }
                          >
                            At least one letter (A-Z or a-z)
                          </li>
                          <li
                            className={
                              formErrMsg.password === null ||
                              formErrMsg.password?.hasNumber
                                ? "valid"
                                : ""
                            }
                          >
                            At least one number (0-9)
                          </li>
                          <li
                            className={
                              formErrMsg.password === null ||
                              formErrMsg.password?.hasSymbol
                                ? "valid"
                                : ""
                            }
                          >
                            At least one symbol (@, $, !, %, *, ?, &)
                          </li>
                        </ul>
                      }
                      placement="right"
                      arrow
                    >
                      <ErrorOutlineIcon
                        sx={{
                          cursor: "pointer",
                          color: "#6e6996",
                          fontSize: "16px",
                        }}
                      />
                    </Tooltip>
                  </label>
                  <CustomInput
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
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
                        password: isValidPassword ? null : passwordRequirements,
                      }));
                    }}
                    placeholder="Create Password"
                    value={formData.password || ""}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <Visibility sx={{ fontSize: "17px" }} />
                            ) : (
                              <VisibilityOff sx={{ fontSize: "17px" }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={
                      !!formErrMsg.password &&
                      (!formErrMsg.password.minLength ||
                        !formErrMsg.password.hasLetter ||
                        !formErrMsg.password.hasNumber ||
                        !formErrMsg.password.hasSymbol)
                    }
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <button
                    type="submit"
                    disabled={
                      loading.register ||
                      Object.values(formErrMsg).some((error) => error)
                    }
                    className={`register-button ${
                      loading.register ? "disabled" : ""
                    }`}
                  >
                    {loading.register && (
                      <CircularProgress size={15} className="loading-icon" />
                    )}
                    Sign Up
                  </button>
                </Grid>

                <Grid item xs={12} md={12}>
                  <span className="register-footer">
                    Already have an account?{" "}
                    <Link href="/login" className="link">
                      Sign in
                    </Link>
                  </span>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Grid>
        <Grid item xs={12} md={2.5}></Grid>
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

export default RegisterForm;
