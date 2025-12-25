"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { createCreditRequest } from "@/features/agent/credit-request/apis/service";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import { SuccessAlert } from "@/components/alerts/SuccessAlert";
import { GridLegacy as Grid, Box, Typography, ClickAwayListener } from "@mui/material";
import { CustomInput } from "@/components/custom/CustomInput";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { useRouter } from "next/navigation";
import moment from "moment";
import { Calendar } from "react-date-range";
import { getMeWallet } from "@/features/agent/apis/service";

const CreateCreditRequest: React.FC = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [wallet, setWallet] = useState<any>({});
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    (async () => {
      const {
        data: { payload: agentWallet },
      } = await getMeWallet();

      if (!agentWallet.wallet.isCreditRequestEligible) {
        router.push("/credit-requests");
        return;
      }

      setWallet(agentWallet.wallet);
    })();
  }, []);

  const handleClickAway = () => {
    setOpen(false);
  };

  const handleChange = ({ target }: any) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newData = { ...formData };

    if (newData.dueDateTime)
      newData.dueDateTime = new Date(newData.dueDateTime).toISOString();

    try {
      const result = await createCreditRequest(formData);
      if (result.data) {
        SuccessAlert("Request submitted successfully");
        router.push("/credit-requests");
      }
    } catch (error) {
      const errorMessage = handleApiErrors(error);
      ErrorAlert(errorMessage);
    }
  };

  return (
    <Box>
      <Grid
        container
        mb={4}
        display="flex"
        justifyContent="space-between"
      >
        <Typography className="form-title">
          Credit Request
          <Typography className="form-subtitle">
            Create your credit requests
          </Typography>
        </Typography>

        <Box>
          <button
            className="add-button"
            onClick={() => router.push("/deposit-requests")}
          >
            View Credit History
          </button>
        </Box>
      </Grid>

      <Box className="form-container">
        <Box className="form-wrapper">
          <Grid container spacing={0} mb={3}>
            <Grid xs={12} sm={12} md={12}>
              <Typography className="form-title" mb={2}>
                {formData.id ? "Update Credit Request" : "Send Credit Request"}
              </Typography>

              <hr className="tab-divider" />
            </Grid>
          </Grid>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} rowSpacing={3}>
              <Grid xs={12} md={4}>
                <label className="form-label">
                  <span className="form-required">*</span> Amount
                </label>
                <CustomInput
                  required
                  type="number"
                  name="amount"
                  onChange={handleChange}
                  placeholder="Enter Amount"
                  value={formData.amount || ""}
                />
              </Grid>

              <Grid
                xs={12}
                md={4}
                sx={{
                  position: "relative",
                }}
              >
                <label className="form-label">
                  <span className="form-required">*</span> Due Date
                </label>

                <CustomInput
                  required
                  type="text"
                  name="dueDateTime"
                  placeholder="DD-MMM-YYYY"
                  autoComplete="off"
                  onClick={() => {
                    setOpen((prev) => !prev);
                  }}
                  value={
                    formData.dueDateTime
                      ? moment(formData.dueDateTime).format("DD-MMM-YYYY")
                      : ""
                  }
                />

                {open ? (
                  <ClickAwayListener onClickAway={handleClickAway}>
                    <Box>
                      <Calendar
                        className={"dashboard-calendar"}
                        color="#01783b"
                        direction="horizontal"
                        date={
                          formData.dueDateTime
                            ? new Date(formData.dueDateTime)
                            : new Date()
                        }
                        onChange={(date) => {
                          setFormData({
                            ...formData,
                            dueDateTime: date
                              ? moment(date).format("YYYY-MM-DD")
                              : null,
                          });
                          setOpen(false);
                        }}
                        minDate={moment().startOf("day").toDate()}
                        maxDate={
                          (+wallet.creditDueTimeLimit || 0) &&
                          (+wallet.creditDueTimeLimit || 0) > 0
                            ? moment()
                                .add(wallet.creditDueTimeLimit, "days")
                                .endOf("day")
                                .toDate()
                            : undefined
                        }
                      />
                    </Box>
                  </ClickAwayListener>
                ) : null}
              </Grid>

              <Grid xs={12} md={4}>
                <label className="form-label">Notes</label>
                <CustomInput
                  name="userNotes"
                  onChange={handleChange}
                  placeholder="Enter Notes"
                  value={formData.userNotes || ""}
                />
              </Grid>
              <Grid
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
    </Box>
  );
};

export default CreateCreditRequest;
