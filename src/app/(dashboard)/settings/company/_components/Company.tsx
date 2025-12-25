"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { SuccessAlert } from "@/components/alerts/SuccessAlert";
import { CustomAutocomplete } from "@/components/custom/CustomAutoComplete";
import { CustomInput } from "@/components/custom/CustomInput";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import { Box, Grid, TextField, Tooltip, Typography } from "@mui/material";
import {
  getMeAgent,
  updateMeAgent,
  uploadAdditionaldocs,
  uploadAddressProof,
  uploadLogo,
  uploadNid,
  uploadTradeLicense,
  uploalCivilAviationCertificate,
} from "@/features/agent/apis/service";
import Link from "next/link";
import Loader from "@/components/Loader";
import { CustomMenuItem } from "@/components/custom/CustomMenuItem";
import Swal from "sweetalert2";
import { formattedRegistrationCountries } from "@/utils/common/array/registration-countries";

const Company = () => {
  const [files, setFiles] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const { data } = await getMeAgent();
      setFormData(data.payload);

      setIsLoading(false);
    })();
  }, []);

  const handleChange = ({ target }: any) => {
    if (target.files) {
      const file = target.files[0];
      const maxFileSize = 1048576;
      if (file.size <= maxFileSize) {
        setFiles({ ...files, [target.name]: file });
      } else {
        Swal.fire({
          icon: "info",
          title: "Oops...",
          text: `File size should not exceed 1 mb!`,
        });
        target.value = "";
      }
    } else {
      const newFormData = { ...formData, [target.name]: target.value };

      if (target.name === "companyCountryCode") {
        newFormData.city = null;
        newFormData.state = null;
      }

      if (target.name === "companyState") {
        newFormData.city = null;
      }

      setFormData(newFormData);
    }
  };

  const handleUpload = async () => {
    const uploadMappings = {
      nidFile: uploadNid,
      logoFile: uploadLogo,
      addressFile: uploadAddressProof,
      licenseFile: uploadTradeLicense,
      additionalFile: uploadAdditionaldocs,
      aviationFile: uploalCivilAviationCertificate,
    };

    try {
      await Promise.all(
        Object.entries(uploadMappings).map(async ([key, uploadFunc]: any) => {
          if (files[key]) {
            const formData = new FormData();
            formData.append("file", files[key]);
            await uploadFunc(formData);
          }
        })
      );
    } catch (error) {
      ErrorAlert(handleApiErrors(error));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newData = { ...formData };

    try {
      const result = await updateMeAgent(newData);
      if (result.data) {
        await handleUpload();
        const { data } = await getMeAgent();
        setFormData(data.payload);
        SuccessAlert(`Company Updated Successfully`);
      }
    } catch (error) {
      const errorMessage = handleApiErrors(error);
      ErrorAlert(errorMessage);
    }
  };

  const stateDataFilter = formattedRegistrationCountries.filter(
    (country) => country.countryCode === formData.companyCountryCode
  );

  const districtName =
    stateDataFilter.length > 0
      ? stateDataFilter[0].states.filter(
          (state) => state.name === formData.companyState
        )
      : [];

  if (isLoading) return <Loader />;

  return (
    <Box className="form-container">
      <Box className="form-wrapper">
        <Grid item xs={12} sm={12} md={12} mb={3}>
          <Typography className="form-title" mb={2}>
            Company
          </Typography>

          <hr className="tab-divider" />
        </Grid>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} rowSpacing={3}>
            <Grid item xs={12} md={3}>
              <label className="form-label">
                <span className="form-required">*</span> Company Name
              </label>
              <CustomInput
                required
                name="companyName"
                onChange={handleChange}
                placeholder="Enter Company Name"
                value={formData.companyName || ""}
                // disabled={formData.approvalStatus !== "REQUESTED"}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <label className="form-label">
                <span className="form-required">*</span> Company Email
              </label>
              <CustomInput
                required
                name="companyEmail"
                onChange={handleChange}
                placeholder="Enter Company Email"
                value={formData.companyEmail || ""}
                // disabled={formData.approvalStatus !== "REQUESTED"}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <label className="form-label">
                <span className="form-required">*</span> Company Phone No
              </label>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Grid item xs={6} md={5}>
                  <CustomAutocomplete
                    disableClearable
                    options={formattedRegistrationCountries}
                    // disabled={formData.approvalStatus !== "REQUESTED"}
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
                          startAdornment: formData.companyPhoneCode && (
                            <img
                              src={
                                formattedRegistrationCountries?.find(
                                  (item) =>
                                    item.phoneCode === formData.companyPhoneCode
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
                        (item) => item.phoneCode === formData.companyPhoneCode
                      ) || null
                    }
                    onChange={(event: any, newValue: any) => {
                      const companyPhoneCode = newValue
                        ? newValue.phoneCode
                        : "";
                      handleChange({
                        target: {
                          name: "companyPhoneCode",
                          value: companyPhoneCode,
                        },
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={6} md={7}>
                  <CustomInput
                    required
                    name="companyPhoneNo"
                    onChange={handleChange}
                    placeholder="Phone Number"
                    value={formData.companyPhoneNo || ""}
                    // disabled={formData.approvalStatus !== "REQUESTED"}
                  />
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <label className="form-label">
                <span className="form-required">*</span> Address
              </label>
              <CustomInput
                name="companyAddress"
                onChange={handleChange}
                placeholder="Enter Address"
                value={formData.companyAddress || ""}
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
                <span className="form-required">*</span> Country code
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
                    placeholder="Select code"
                    variant="outlined"
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: formData.companyCountryCode && (
                        <img
                          src={
                            formattedRegistrationCountries.find(
                              (item) =>
                                item.countryCode === formData.companyCountryCode
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
                    (item) => item.countryCode === formData.companyCountryCode
                  ) || null
                }
                onChange={(event: any, newValue: any) => {
                  const companyCountryCode = newValue
                    ? newValue.countryCode
                    : "";
                  handleChange({
                    target: {
                      name: "companyCountryCode",
                      value: companyCountryCode,
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
                        (state) => state.name === formData.companyState
                      ) || null
                    : null
                }
                onChange={(event: any, newValue: any) => {
                  handleChange({
                    target: {
                      name: "companyState",
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
                        (district) => district === formData.companyCity
                      ) || null
                    : null
                }
                onChange={(event, newValue) => {
                  handleChange({
                    target: { name: "companyCity", value: newValue || "" },
                  });
                }}
                disabled={districtName.length === 0}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <label className="form-label">Contact Person Name</label>
              <CustomInput
                name="contactPersonName"
                onChange={handleChange}
                placeholder="Enter Contact Person Name"
                value={formData.contactPersonName || ""}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <label className="form-label">Contact Person Phone No.</label>
              <CustomInput
                name="contactPersonPhoneNo"
                onChange={handleChange}
                placeholder="Enter Contact Person Phone No."
                value={formData.contactPersonPhoneNo || ""}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <label className="form-label">Contact Person Email</label>
              <CustomInput
                name="contactPersonEmail"
                onChange={handleChange}
                placeholder="Enter Contact Person Email"
                value={formData.contactPersonEmail || ""}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <label className="form-label">Contact Person Department</label>
              <CustomInput
                name="contactPersonDepartment"
                onChange={handleChange}
                placeholder="Enter Contact Person Department"
                value={formData.contactPersonDepartment || ""}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <label className="form-label">Contact Person Designation</label>
              <CustomInput
                name="contactPersonDesignation"
                onChange={handleChange}
                placeholder="Enter Contact Person Designation"
                value={formData.contactPersonDesignation || ""}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <label className="form-label">Employee Size</label>
              <CustomInput
                name="employeeSize"
                onChange={handleChange}
                placeholder="Enter Employee Size"
                value={formData.employeeSize || ""}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <label className="form-label">Trade License No</label>
              <CustomInput
                name="tradeLicenseNo"
                onChange={handleChange}
                placeholder="Enter Trade License No"
                value={formData.tradeLicenseNo || ""}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <label className="form-label">HL No</label>
              <CustomInput
                name="HLNo"
                onChange={handleChange}
                placeholder="Enter HL No"
                value={formData.HLNo || ""}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <label className="form-label">Brand Color</label>
              <CustomInput
                type="color"
                name="brandColor"
                onChange={handleChange}
                value={formData.brandColor || "#ffffff"}
              />
            </Grid>

            <Grid item xs={12} md={6}></Grid>

            <Grid item xs={12} sm={12} style={{ paddingTop: "20px" }}>
              <span className="error-msg">{`***File size "1 mb" max and file type jpg/png/jpeg/pdf allowed`}</span>
            </Grid>

            <Grid item xs={12} sm={4} style={{ paddingTop: "10px" }}>
              <label className="form-label">Trade License</label>
              <Box className="upload-section">
                <input
                  type="file"
                  accept="image/*"
                  name="licenseFile"
                  onChange={handleChange}
                  style={{ width: "100%" }}
                  // disabled={formData.approvalStatus !== "REQUESTED" && formData.tradeLicenseScanUrl}
                />
              </Box>
              <Box>
                {formData.tradeLicenseScanUrl ? (
                  <Tooltip title="Click to view">
                    <Link
                      className="link-green"
                      href={formData.tradeLicenseScanUrl}
                      target="_blank"
                    >
                      Uploaded
                    </Link>
                  </Tooltip>
                ) : (
                  <span className="not-uploaded">Not Uploaded</span>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={4} style={{ paddingTop: "10px" }}>
              <label className="form-label">Upload Nid</label>
              <Box className="upload-section">
                <input
                  type="file"
                  accept="image/*"
                  name="nidFile"
                  onChange={handleChange}
                  style={{ width: "100%" }}
                  // disabled={formData.approvalStatus !== "REQUESTED" && formData.nidScanCopyUrl}
                />
              </Box>
              <Box>
                {formData.nidScanCopyUrl ? (
                  <Tooltip title="Click to view">
                    <Link
                      className="link-green"
                      href={formData.nidScanCopyUrl}
                      target="_blank"
                    >
                      Uploaded
                    </Link>
                  </Tooltip>
                ) : (
                  <span className="not-uploaded">Not Uploaded</span>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={4} style={{ paddingTop: "10px" }}>
              <label className="form-label">Company Logo</label>
              <Box className="upload-section">
                <input
                  type="file"
                  accept="image/*"
                  name="logoFile"
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </Box>
              <Box>
                {formData.companyLogoUrl ? (
                  <Tooltip title="Click to view">
                    <Link
                      className="link-green"
                      target="_blank"
                      href={formData.companyLogoUrl}
                    >
                      Uploaded
                    </Link>
                  </Tooltip>
                ) : (
                  <span className="not-uploaded">Not Uploaded</span>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={4} style={{ paddingTop: "10px" }}>
              <label className="form-label">Upload Address Proof</label>
              <Box className="upload-section">
                <input
                  type="file"
                  accept="image/*"
                  name="addressFile"
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </Box>
              <Box>
                {formData.addressProofScanCopyUrl ? (
                  <Tooltip title="Click to view">
                    <Link
                      className="link-green"
                      href={formData.addressProofScanCopyUrl}
                      target="_blank"
                    >
                      Uploaded
                    </Link>
                  </Tooltip>
                ) : (
                  <span className="not-uploaded">Not Uploaded</span>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={4} style={{ paddingTop: "10px" }}>
              <label className="form-label">Additional Docs</label>
              <Box className="upload-section">
                <input
                  type="file"
                  accept="image/*"
                  name="additionalFile"
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </Box>
              <Box>
                {formData.additionalDocsScanCopyUrl ? (
                  <Tooltip title="Click to view">
                    <Link
                      className="link"
                      href={formData.additionalDocsScanCopyUrl}
                      target="_blank"
                    >
                      Uploaded
                    </Link>
                  </Tooltip>
                ) : (
                  <span className="not-uploaded">Not Uploaded</span>
                )}
              </Box>
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

export default Company;
