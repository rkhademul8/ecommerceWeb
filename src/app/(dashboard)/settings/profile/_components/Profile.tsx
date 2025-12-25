"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { SuccessAlert } from "@/components/alerts/SuccessAlert";
import { CustomAutocomplete } from "@/components/custom/CustomAutoComplete";
import { CustomInput } from "@/components/custom/CustomInput";
import { CustomMenuItem } from "@/components/custom/CustomMenuItem";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { getMe, updateMe } from "@/features/user/service";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import { getMeAgent, getMeWallet } from "@/features/agent/apis/service";
import { Box, Grid, TextField, Typography } from "@mui/material";
import Loader from "@/components/Loader";
import { currencies } from "@/utils/common/array/currencies";
import { formattedRegistrationCountries } from "@/utils/common/array/registration-countries";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [company, setCompany] = useState<any>({});
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const {
        data: { payload: user },
      } = await getMe();

      const {
        data: { payload: b2bWallet },
      } = await getMeWallet();

      const {
        data: { payload: company },
      } = await getMeAgent();

      setCompany(company);
      setFormData({
        ...user,
        walletCurrency: b2bWallet?.wallet?.walletCurrency || "",
      });
      setIsLoading(false);
    })();
  }, []);

  const handleChange = ({ target }: any) => {
    const newFormData = { ...formData, [target.name]: target.value };

    if (target.name === "countryCode") {
      newFormData.city = null;
      newFormData.state = null;
    }

    if (target.name === "state") {
      newFormData.city = null;
    }

    setFormData(newFormData);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newData = { ...formData };

    try {
      const result = await updateMe(newData);
      if (result.data) SuccessAlert(`Profile Updated Successfully`);
    } catch (error) {
      const errorMessage = handleApiErrors(error);
      ErrorAlert(errorMessage);
    }
  };

  const stateDataFilter = formattedRegistrationCountries.filter(
    (country) => country.countryCode === formData.countryCode
  );

  const districtName =
    stateDataFilter.length > 0
      ? stateDataFilter[0].states.filter(
          (state) => state.name === formData.state
        )
      : [];

  if (isLoading) return <Loader />;

  return (
    <Box className="form-container">
      <Box className="form-wrapper">
        <Grid item xs={12} sm={12} md={12} mb={3}>
          <Typography className="form-title" mb={2}>
            Profile
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
                <span className="form-required">*</span> Address
              </label>
              <CustomInput
                name="address"
                onChange={handleChange}
                placeholder="Enter Address"
                value={formData.address || ""}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <label className="form-label">
                <span className="form-required">*</span> Country Code
              </label>
              <CustomAutocomplete
                options={formattedRegistrationCountries}
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
                    placeholder="Select Country Code"
                    variant="outlined"
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: formData.countryCode && (
                        <img
                          src={
                            formattedRegistrationCountries.find(
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
                  formattedRegistrationCountries.find(
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
                <span className="form-required">*</span> State / Division
              </label>
              <CustomAutocomplete
                options={
                  stateDataFilter.length > 0 ? stateDataFilter[0].states : []
                }
                getOptionLabel={(option: any) => option.name || ""}
                renderOption={(props, option: any, { selected }) => (
                  <CustomMenuItem {...props} selected={selected}>
                    {option.name}
                  </CustomMenuItem>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    placeholder="Select State / Division"
                    variant="outlined"
                    size="small"
                  />
                )}
                value={
                  stateDataFilter.length > 0
                    ? stateDataFilter[0].states.find(
                        (state) => state.name === formData.state
                      ) || null
                    : null
                }
                onChange={(event: any, newValue: any) => {
                  handleChange({
                    target: {
                      name: "state",
                      value: newValue?.name || "",
                    },
                  });
                }}
                disabled={stateDataFilter.length === 0}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <label className="form-label">
                <span className="form-required">*</span> District
              </label>
              <CustomAutocomplete
                options={
                  districtName.length > 0 ? districtName[0].districts : []
                }
                getOptionLabel={(option: any) => option || ""}
                renderOption={(props, option: any, { selected }) => (
                  <CustomMenuItem {...props} selected={selected}>
                    {option}
                  </CustomMenuItem>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    placeholder="Select District"
                    variant="outlined"
                    size="small"
                  />
                )}
                value={
                  districtName.length > 0
                    ? districtName[0].districts.find(
                        (district) => district === formData.city
                      ) || null
                    : null
                }
                onChange={(event, newValue) => {
                  handleChange({
                    target: { name: "city", value: newValue || "" },
                  });
                }}
                disabled={districtName.length === 0}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <label className="form-label">
                <span className="form-required">*</span> Postal code
              </label>
              <CustomInput
                name="postalCode"
                onChange={handleChange}
                placeholder="Enter Postal code"
                value={formData.postalCode || ""}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <label className="form-label">
                <span className="form-required">*</span> Email
              </label>
              <CustomInput
                name="email"
                type="email"
                onChange={handleChange}
                placeholder="Enter Email"
                value={formData.email || ""}
                // disabled={company.approvalStatus !== "REQUESTED"}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <label className="form-label">
                <span className="form-required">*</span> Phone No
              </label>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Grid item xs={6} md={5.5}>
                  <CustomAutocomplete
                    disableClearable
                    options={formattedRegistrationCountries}
                    // disabled={company.approvalStatus !== "REQUESTED"}
                    getOptionLabel={(option: any) => `${option.phoneCode}`}
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
                        {/* {`${option.phoneCode}`} */}
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
                <Grid item xs={6} md={6.5}>
                  <CustomInput
                    required
                    name="phoneNo"
                    onChange={handleChange}
                    placeholder="Phone Number"
                    value={formData.phoneNo || ""}
                    // disabled={company.approvalStatus !== "REQUESTED"}
                  />
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <label className="form-label">
                <span className="form-required">*</span> View currency
              </label>
              <CustomAutocomplete
                options={currencies}
                getOptionLabel={(option: any) =>
                  `${option.currency} (${option.sign})`
                }
                renderOption={(props, option: any, { selected }) => (
                  <CustomMenuItem {...props} selected={selected}>
                    {`${option.currency} (${option.sign})`}
                  </CustomMenuItem>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    placeholder="Select currency"
                    variant="outlined"
                    size="small"
                  />
                )}
                value={
                  currencies.find(
                    (item) => item.currency === formData.defaultCurrency
                  ) || null
                }
                onChange={(event: any, newValue: any) => {
                  const defaultCurrency = newValue ? newValue.currency : "";
                  handleChange({
                    target: {
                      name: "defaultCurrency",
                      value: defaultCurrency,
                    },
                  });
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <label className="form-label">
                Wallet currency{" "}
                <span className="form-alert">(Change not allowed)</span>
              </label>
              <CustomAutocomplete
                disabled
                options={currencies}
                getOptionLabel={(option: any) =>
                  `${option.currency} (${option.sign})`
                }
                renderOption={(props, option: any, { selected }) => (
                  <CustomMenuItem {...props} selected={selected}>
                    {`${option.currency} (${option.sign})`}
                  </CustomMenuItem>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select currency"
                    variant="outlined"
                    size="small"
                  />
                )}
                value={
                  currencies.find(
                    (item) => item.currency === formData.walletCurrency
                  ) || null
                }
                onChange={(event: any, newValue: any) => {
                  const walletCurrency = newValue ? newValue.currency : "";
                  handleChange({
                    target: {
                      name: "walletCurrency",
                      value: walletCurrency,
                    },
                  });
                }}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <button type="submit" className="submit-button">
                Submit
              </button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default Profile;
