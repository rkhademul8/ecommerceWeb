"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import { SuccessAlert } from "@/components/alerts/SuccessAlert";
import { GridLegacy as Grid, Box, Typography } from "@mui/material";
import { CustomInput } from "@/components/custom/CustomInput";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { useParams, useRouter } from "next/navigation";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { CustomMenuItem } from "@/components/custom/CustomMenuItem";
import {
  createUserBankAccount,
  getUserBankAccount,
  updateUserBankAccount,
} from "@/features/agent/bank-account/apis/service";
import Loader from "@/components/Loader";

const CreateBankAccount: React.FC = () => {
  const router: any = useRouter();
  const params: any = useParams();

  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (params.id === "new") return;

      setIsLoading(true);
      const {
        data: { payload: newData },
      } = await getUserBankAccount(params.id);

      setFormData(newData);
      setIsLoading(false);
    })();
  }, [params]);

  const handleChange = ({ target }: any) => {
    const newData = { ...formData };
    newData[target.name] = target.value;

    if (target.name === "accountType") {
      newData.bankName = null;
      newData.bankAccountName = null;
      newData.bankAccountNumber = null;
      newData.bankBranch = null;
      newData.routingNumber = null;
      newData.swiftCode = null;
    }

    setFormData(newData);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newData = { ...formData };

    try {
      const result = formData.id
        ? await updateUserBankAccount(newData)
        : await createUserBankAccount(newData);
      if (result.data) {
        SuccessAlert(
          `Bank Account ${formData.id ? "Updated" : "Created"} Successfully`
        );
        router.push("/settings/bank-accounts");
      }
    } catch (error) {
      const errorMessage = handleApiErrors(error);
      ErrorAlert(errorMessage);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <Box className="form-container">
      <Box className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <Grid item xs={12} sm={12} md={12} mb={3}>
            <Typography className="form-title" mb={2}>
              {formData.id ? "Update Bank Account" : "Create Bank Account"}
            </Typography>

            <hr className="tab-divider" />
          </Grid>
          <Grid container spacing={2} rowSpacing={3}>
            <Grid item xs={12} md={6}>
              <label className="form-label">
                <span className="form-required">*</span> Account Type
              </label>
              <CustomSelect
                required
                displayEmpty
                name="accountType"
                onChange={handleChange}
                value={formData.accountType || ""}
                renderValue={(selected: any) =>
                  selected || "Select Account Type"
                }
              >
                <CustomMenuItem value="">Select Account Type</CustomMenuItem>
                <CustomMenuItem value="BANK">BANK</CustomMenuItem>
                <CustomMenuItem value="MFS">MFS</CustomMenuItem>
              </CustomSelect>
            </Grid>

            <Grid item xs={12} md={6}>
              <label className="form-label">
                <span className="form-required">*</span>{" "}
                {formData.accountType === "MFS" ? "MFS" : "Bank"} Name
              </label>
              <CustomInput
                required
                name="bankName"
                onChange={handleChange}
                placeholder="Enter Name"
                value={formData.bankName || ""}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <label className="form-label">
                <span className="form-required">*</span> Account Name
              </label>
              <CustomInput
                required
                name="bankAccountName"
                onChange={handleChange}
                placeholder="Enter Account Name"
                value={formData.bankAccountName || ""}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <label className="form-label">
                <span className="form-required">*</span> Account No.
              </label>
              <CustomInput
                required
                name="bankAccountNumber"
                onChange={handleChange}
                placeholder="Enter Account No."
                value={formData.bankAccountNumber || ""}
              />
            </Grid>

            {formData.accountType === "BANK" ? (
              <>
                <Grid item xs={12} md={6}>
                  <label className="form-label">Branch Name</label>
                  <CustomInput
                    name="bankBranch"
                    onChange={handleChange}
                    placeholder="Enter Branch Name"
                    value={formData.bankBranch || ""}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <label className="form-label">Routing No</label>
                  <CustomInput
                    name="routingNumber"
                    onChange={handleChange}
                    placeholder="Enter Routing No"
                    value={formData.routingNumber || ""}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <label className="form-label">Swift Code</label>
                  <CustomInput
                    name="swiftCode"
                    onChange={handleChange}
                    placeholder="Enter Swift Code"
                    value={formData.swiftCode || ""}
                  />
                </Grid>
              </>
            ) : null}

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

export default CreateBankAccount;
