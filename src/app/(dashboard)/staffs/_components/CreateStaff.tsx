"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import { SuccessAlert } from "@/components/alerts/SuccessAlert";
import {
  GridLegacy as Grid,
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Autocomplete,
  Checkbox,
  Tooltip,
} from "@mui/material";
import { CustomInput } from "@/components/custom/CustomInput";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { useParams, useRouter } from "next/navigation";
import {
  createStaff,
  getStaff,
  updateStaff,
} from "@/features/agent/staff/apis/service";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { CustomMenuItem } from "@/components/custom/CustomMenuItem";
import { CustomAutocomplete } from "@/components/custom/CustomAutoComplete";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Loader from "@/components/Loader";
import { countries } from "@/utils/common/array/countries";
import { getRoles } from "@/features/iam/role/service";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CustomTextField from "@/components/custom/CustomTextField";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Link from "next/link";

const CreateStaff: React.FC = () => {
  const router: any = useRouter();
  const params: any = useParams();

  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrMsg, setFormErrorMsg] = useState<any>({
    email: "",
  });

  useEffect(() => {
    (async () => {
      const {
        data: { payload: roles },
      } = await getRoles();

      setRoles(roles);

      if (params.id === "new") {
        setFormData({ isActive: true });
        return;
      }

      setIsLoading(true);
      const {
        data: { payload: newData },
      } = await getStaff(params.id);

      setFormData({
        ...newData.user,
        roleIds: newData.user?.roles?.length
          ? newData.user.roles.map((item: any) => Number(item.id))
          : [],
        backupEmail: newData.user?.email,
        backupPhoneNo: newData.user?.phoneNo,
      });
      setIsLoading(false);
    })();
  }, [params]);

  const handleChange = ({ target }: any) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newData = { ...formData };

    if (newData.backupEmail === formData.email) delete newData.email;
    if (newData.backupPhoneNo === formData.phoneNo) delete newData.phoneNo;

    try {
      const result = formData.id
        ? await updateStaff(newData)
        : await createStaff(newData);

      if (result.data) {
        SuccessAlert(
          `Staff ${formData.id ? "Updated" : "Created"} Successfully`
        );
        router.push("/staffs");
      }
    } catch (error) {
      const errorMessage = handleApiErrors(error);
      ErrorAlert(errorMessage);
    }
  };

  if (isLoading) return <Loader />;

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
          Add Staff
          <Typography className="form-subtitle">Create your staffs</Typography>
        </Typography>

        <Box>
          <button className="add-button" onClick={() => router.push("/staffs")}>
            Manage Staffs
          </button>
        </Box>
      </Grid>

      <Box className="form-container">
        <Box className="form-wrapper">
          <Grid item xs={12} sm={12} md={12} mb={3}>
            <Typography className="form-title" mb={2}>
              {formData.id ? "Update Staff" : "Create Staff"}
            </Typography>

            <hr className="tab-divider" />
          </Grid>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} rowSpacing={3}>
              <Grid item xs={12} md={3}>
                <label className="form-label">
                  <span className="form-required">*</span> Title
                </label>
                <CustomSelect
                  required
                  displayEmpty
                  name="title"
                  onChange={handleChange}
                  value={formData.title || ""}
                  renderValue={(selected: any) => selected || "Select Title"}
                >
                  <CustomMenuItem value="">Select Title</CustomMenuItem>
                  <CustomMenuItem value="MR">MR</CustomMenuItem>
                  <CustomMenuItem value="MS">MS</CustomMenuItem>
                  <CustomMenuItem value="MRS">MRS</CustomMenuItem>
                </CustomSelect>
              </Grid>

              <Grid item xs={12} md={3}>
                <label className="form-label">
                  <span className="form-required">*</span> First Name
                </label>
                <CustomInput
                  required
                  name="firstname"
                  onChange={handleChange}
                  placeholder="Enter First Name"
                  value={formData.firstname || ""}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <label className="form-label">
                  <span className="form-required">*</span> Last Name
                </label>
                <CustomInput
                  required
                  name="lastname"
                  onChange={handleChange}
                  placeholder="Enter Last Name"
                  value={formData.lastname || ""}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <label className="form-label">
                  <span className="form-required">*</span> Phone No
                </label>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Grid item xs={6} md={5}>
                    <CustomAutocomplete
                      options={countries}
                      disableClearable
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
                          />
                          {`${option.phoneCode}`}
                        </CustomMenuItem>
                      )}
                      renderInput={(params) => (
                        <TextField
                          sx={{
                            padding: "0px !important",
                            margin: "0px !important",
                          }}
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
                                  countries.find(
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
                        countries.find(
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
                  <Grid item xs={6} md={7}>
                    <CustomInput
                      required
                      name="phoneNo"
                      onChange={handleChange}
                      placeholder="Phone Number"
                      value={formData.phoneNo || ""}
                    />
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12} md={3}>
                <label className="form-label">Address</label>
                <CustomInput
                  name="address"
                  onChange={handleChange}
                  placeholder="Enter Address"
                  value={formData.address || ""}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <label className="form-label">City</label>
                <CustomInput
                  name="city"
                  onChange={handleChange}
                  placeholder="Enter City"
                  value={formData.city || ""}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <label className="form-label">Postal code</label>
                <CustomInput
                  name="postalCode"
                  onChange={handleChange}
                  placeholder="Enter Postal code"
                  value={formData.postalCode || ""}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <label className="form-label">Country code</label>
                <CustomAutocomplete
                  options={countries}
                  getOptionLabel={(option: any) =>
                    `${option.countryCode} - ${option.countryName}`
                  }
                  renderOption={(props, option: any, { selected }) => (
                    <CustomMenuItem
                      {...props}
                      selected={selected}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <img
                        src={option.flag}
                        alt={`${option.countryName} flag`}
                        style={{ width: "20px", height: "15px" }}
                      />
                      {`${option.countryCode} - ${option.countryName}`}
                    </CustomMenuItem>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      placeholder="Select code"
                      variant="outlined"
                      size="small"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: formData.countryCode && (
                          <img
                            src={
                              countries.find(
                                (item) =>
                                  item.countryCode === formData.countryCode
                              )?.flag
                            }
                            alt="Selected flag"
                            style={{
                              width: "20px",
                              height: "15px",
                              marginLeft: "10px",
                            }}
                          />
                        ),
                      }}
                    />
                  )}
                  value={
                    countries.find(
                      (item) => item.countryCode === formData.countryCode
                    ) || null
                  }
                  onChange={(event: any, newValue: any) => {
                    const countryCode = newValue ? newValue.countryCode : "";
                    handleChange({
                      target: {
                        name: "countryCode",
                        value: countryCode,
                      },
                    });
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <label className="form-label">
                  <span className="form-required">*</span> E-mail address{" "}
                  {formErrMsg.email ? (
                    <span className="form-alert">{`(${formErrMsg.email})`}</span>
                  ) : (
                    <span className="form-text">(provide a valid email)</span>
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

              {!formData.id && (
                <Grid item xs={12} md={3}>
                  <label
                    className="form-label"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span className="form-required">*</span> Create Password
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
              )}

              <Grid item xs={12} md={6}>
                <label
                  className="form-label"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontFamily: "Outfit",
                  }}
                >
                  <span>
                    <span className="form-required">*</span> Roles
                  </span>
                  <Link
                    href="/settings/roles"
                    style={{
                      padding: "0px",
                      fontSize: "12px",
                      textDecoration: "underline",
                    }}
                  >
                    + Create new role
                  </Link>
                </label>

                <Autocomplete
                  multiple
                  options={roles}
                  disableCloseOnSelect
                  onChange={(event, newValue) => {
                    setFormData({
                      ...formData,
                      roleIds: newValue.map((option: any) => option.id),
                    });
                  }}
                  value={roles.filter((option: any) =>
                    (formData.roleIds || []).includes(option.id)
                  )}
                  noOptionsText={
                    <Typography
                      sx={{
                        fontFamily: "Outfit",
                        fontSize: "12px",
                        color: "#9493bd",
                      }}
                    >
                      No Options
                    </Typography>
                  }
                  getOptionLabel={(option: any) => option.name}
                  renderOption={(props, option: any, { selected }) => (
                    <CustomMenuItem
                      {...props}
                      selected={selected}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Checkbox
                        disableRipple
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        checked={(formData.roleIds || []).includes(option.id)}
                        sx={{
                          color: "#D9D5EC",
                          "&.Mui-checked": {
                            color: "#01783B",
                          },
                        }}
                      />

                      {option.name}
                    </CustomMenuItem>
                  )}
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      placeholder="Select Roles"
                      inputProps={{
                        ...params.inputProps,
                        style: {
                          fontSize: "15px",
                          color: "#9493bd",
                          fontFamily: "Outfit",
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <label className="form-label">Status</label>
                <CustomSelect
                  name="isActive"
                  displayEmpty
                  onChange={handleChange}
                  value={
                    formData.isActive !== undefined ? formData.isActive : true
                  }
                >
                  <CustomMenuItem value={"true"}>Active</CustomMenuItem>
                  <CustomMenuItem value={"false"}>Inactive</CustomMenuItem>
                </CustomSelect>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <button
                  type="submit"
                  className="submit-button"
                  disabled={Object.values(formErrMsg).some((error) => error)}
                >
                  Submit
                </button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateStaff;
