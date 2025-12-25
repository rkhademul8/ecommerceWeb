import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { SuccessAlert } from "@/components/alerts/SuccessAlert";
import { CustomInput } from "@/components/custom/CustomInput";
import { getMeWallet } from "@/features/agent/apis/service";
import {
  getCreditRequests,
  settleCreditRequest,
} from "@/features/agent/credit-request/apis/service";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import {
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import React, { FormEvent, useEffect, useState } from "react";

const CreditSettle = ({
  loading,
  setLoading,
  formData,
  setFormData,
  handleChange,
  handleCreditClose,
}: any) => {
  const [wallet, setWallet] = useState<any>({});
  const [creditRequests, setCreditRequests] = useState<any>([]);

  useEffect(() => {
    (async () => {
      const query = {
        paymentStatus: "Partial",
        requestStatus: "ACC_APPROVED",
      };

      const {
        data: { payload },
      } = await getCreditRequests(query);

      const {
        data: { payload: agentWallet },
      } = await getMeWallet();

      setWallet(agentWallet.wallet);
      setCreditRequests(payload.data);
    })();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading({ submit: true });

    const newData = { ...formData };

    setTimeout(async () => {
      try {
        const result = await settleCreditRequest(newData);
        if (result.data) {
          window.location.reload();
          SuccessAlert("Credit Settlement Successfully");
        }
      } catch (error) {
        const errorMessage = handleApiErrors(error);
        ErrorAlert(errorMessage);
      } finally {
        setFormData({});
        handleCreditClose();
        setLoading({ submit: false });
      }
    }, 500);
  };

  return (
    <Grid container spacing={2}>
      <Grid item md={5.5}>
        <label className="form-label">
          <span className="form-required">*</span> Settle Amount
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

      <Grid item md={3}>
        <label className="form-label">Current Balance</label>

        <Typography
          sx={{
            color: "#413755",
            fontSize: "18px",
            fontWeight: 600,
            fontFamily: "Public Sans",
          }}
        >
          {wallet.walletCurrency || "BDT"}{" "}
          {(+wallet.cashBalance || 0).toFixed(0)}
        </Typography>
      </Grid>

      <Grid item md={3}>
        <label className="form-label">Current Credit Due</label>
        <Typography
          sx={{
            color: "#FF5A7D",
            fontSize: "18px",
            fontWeight: 600,
            fontFamily: "Public Sans",
          }}
        >
          {wallet.walletCurrency || "BDT"}{" "}
          {(+wallet.creditDueAmount || 0).toFixed(0)}
        </Typography>
      </Grid>

      <Grid item md={12}>
        <TableContainer className="table-container">
          <Table className="table">
            <TableHead>
              <TableRow>
                <TableCell className="table-header-cell">Date</TableCell>
                <TableCell className="table-header-cell">Amount</TableCell>
                <TableCell className="table-header-cell">Due Date</TableCell>
                <TableCell className="table-header-cell">
                  Settle Amount
                </TableCell>
                <TableCell className="table-header-cell">
                  Payment Status
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(creditRequests || []).map((creditReq: any) => (
                <React.Fragment key={creditReq.id}>
                  <TableRow className={"collapsed-row"}>
                    <TableCell className="table-body-cell">
                      {moment(creditReq.createdDateTime).format("DD-MMM-YYYY")}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {(+creditReq.amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {moment(creditReq.dueDateTime).format("DD-MMM-YYYY")}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {(+creditReq.settleAmount).toFixed(2)}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      <Typography
                        className={`deposit-status ${creditReq.paymentStatus}`}
                      >
                        {creditReq.paymentStatus}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid
        item
        md={12}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <button onClick={handleCreditClose} className="cancel-button">
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          className={`submit-button ${loading.submit ? "disabled" : ""}`}
          disabled={
            loading.submit || !formData.amount || !(+creditRequests.length || 0)
          }
        >
          {loading.submit && (
            <CircularProgress size={15} className="loading-icon" />
          )}
          Submit
        </button>
      </Grid>
    </Grid>
  );
};

export default CreditSettle;
