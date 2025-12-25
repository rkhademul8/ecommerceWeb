"use client";

import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useRouter } from "next/navigation";
import { InfoAlert } from "@/components/alerts/InfoAlert";
import { getDepositRequests } from "@/features/agent/deposit-request/apis/service";
import { getTransactions } from "@/features/payment-gateway/transaction/service";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import Loader from "@/components/Loader";
import moment from "moment";
import Link from "next/link";

const DashboardClient = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<any>([]);
  const [depositRequests, setDepositRequests] = useState<any>([]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        const trxQuery = {
          page: 1,
          limit: 5,
          transactionStatus: "Completed",
        };

        const trxRes = await getTransactions(trxQuery);
        setTransactions(trxRes.data.payload?.data);

        const depQuery = {
          page: 1,
          limit: 5,
          requestStatus: "ACC_APPROVED",
        };

        const depRes = await getDepositRequests(depQuery);
        setDepositRequests(depRes.data.payload?.data);

        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        if (error.statusCode == "403") {
          InfoAlert(
            "You do not have permission to access this resource. Please contact the administrator for assistance."
          );
        } else {
          ErrorAlert(error.message);
        }
      }
    })();
  }, []);

  if (isLoading) return <Loader />; 

  return (
    <Box>
      {/* <Grid
        item
        mb={2}
        xs={12}
        sm={12}
        md={12}
        display="flex"
        justifyContent="space-between"
      >
        <Typography className="form-title">Admin Dashboard</Typography>
      </Grid>

      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Box
              sx={{
                backgroundColor: "#FFB554",
                borderRadius: "8px",
                padding: "20px 30px",
              }}
            >
              <Typography
                style={{
                  color: "#FFFFFF",
                  fontSize: "15px",
                  fontFamily: "Public Sans",
                }}
              >
                Pending
              </Typography>

              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontSize: "22px",
                  fontWeight: 500,
                  fontFamily: "Public Sans",
                }}
              >
                BDT 2000
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Box
              sx={{
                backgroundColor: "#7676FF",
                borderRadius: "8px",
                padding: "20px 30px",
              }}
            >
              <Typography
                style={{
                  color: "#FFFFFF",
                  fontSize: "15px",
                  fontFamily: "Public Sans",
                }}
              >
                Processing
              </Typography>

              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontSize: "22px",
                  fontWeight: 500,
                  fontFamily: "Public Sans",
                }}
              >
                BDT 2000
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Box
              sx={{
                backgroundColor: "#01783B",
                borderRadius: "8px",
                padding: "20px 30px",
              }}
            >
              <Typography
                style={{
                  color: "#FFFFFF",
                  fontSize: "15px",
                  fontFamily: "Public Sans",
                }}
              >
                Completed
              </Typography>

              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontSize: "22px",
                  fontWeight: 500,
                  fontFamily: "Public Sans",
                }}
              >
                BDT 2000
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Box
              sx={{
                backgroundColor: "#FF7D76",
                borderRadius: "8px",
                padding: "20px 30px",
              }}
            >
              <Typography
                style={{
                  color: "#FFFFFF",
                  fontSize: "15px",
                  fontFamily: "Public Sans",
                }}
              >
                Cancelled
              </Typography>

              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontSize: "22px",
                  fontWeight: 500,
                  fontFamily: "Public Sans",
                }}
              >
                BDT 2000
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box> */}

      <Box mb={5}>
        <Grid
          item
          mb={1}
          xs={12}
          sm={12}
          md={12}
          display="flex"
          justifyContent="space-between"
        >
          <Typography className="form-title">Deposit Reuqest List</Typography>

          <Box>
            <button
              className="add-button"
              onClick={() => router.push("/deposit-requests")}
            >
              See All
            </button>
          </Box>
        </Grid>

        <TableContainer className="table-container">
          <Table className="table">
            <TableHead>
              <TableRow>
                <TableCell className="table-header-cell">Deposit ID</TableCell>
                <TableCell className="table-header-cell">
                  Deposit Date
                </TableCell>
                <TableCell className="table-header-cell">Amount</TableCell>

                <TableCell className="table-header-cell">Gateway Fee</TableCell>

                <TableCell className="table-header-cell">
                  Deposit Amount
                </TableCell>

                <TableCell className="table-header-cell">
                  Deposit Type
                </TableCell>
                <TableCell className="table-header-cell">
                  From A/c No.
                </TableCell>
                <TableCell className="table-header-cell">
                  Deposited A/c
                </TableCell>
                <TableCell className="table-header-cell">Ref. ID</TableCell>
                <TableCell className="table-header-cell">Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(depositRequests || []).map((depositReq: any) => (
                <React.Fragment key={depositReq.id}>
                  <TableRow className="collapsed-row">
                    <TableCell className="table-body-cell">
                      {depositReq.depositReference}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {depositReq.depositDate
                        ? moment(depositReq.depositDate).format("DD-MMM-YYYY")
                        : null}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {(+depositReq.depositAmount).toFixed(0)}
                    </TableCell>

                    <TableCell className="table-body-cell">
                      {+depositReq.depositCharge || 0}{" "}
                      {depositReq.depositChargeType === "Fixed"
                        ? `${depositReq.currency || "BDT"}`
                        : "%"}
                    </TableCell>

                    <TableCell className="table-body-cell">
                      {(
                        (+depositReq.depositAmount || 0) -
                        (depositReq?.depositChargeType === "Percentage"
                          ? Math.floor(
                              (+depositReq.depositAmount *
                                +depositReq.depositCharge) /
                                100
                            )
                          : +depositReq?.depositCharge || 0)
                      ).toFixed(0)}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {depositReq.paymentType}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {depositReq.fromBankAccountNumber}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {depositReq.toBankName}
                      <br />
                      {depositReq.toBankAccountNumber}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {depositReq.transactionReference}
                      <br />
                      <Typography className="link">
                        {depositReq.depositPaySlipUrl ? (
                          <Tooltip title="Click to view">
                            <Link
                              href={depositReq.depositPaySlipUrl}
                              target="_blank"
                            >
                              Payslip
                            </Link>
                          </Tooltip>
                        ) : null}
                      </Typography>
                    </TableCell>
                    <TableCell className="table-body-cell">
                      <Typography
                        className={`deposit-status ${
                          depositReq.requestStatus
                            ?.toLowerCase()
                            .replace(/_/g, "-") || "default"
                        }`}
                      >
                        {depositReq.requestStatus === "ACC_APPROVED" ||
                        depositReq.requestStatus === "KAM_APPROVED"
                          ? "Approved"
                          : depositReq.requestStatus
                              ?.replace(/_/g, " ")
                              .toLowerCase()
                              .split(" ")
                              .map(
                                (word: any) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      
      <Box mb={5}>
        <Grid
          item
          mb={1}
          xs={12}
          sm={12}
          md={12}
          display="flex"
          justifyContent="space-between"
        >
          <Typography className="form-title">
            Online Transaction List
          </Typography>

          <Box>
            <button
              className="add-button"
              onClick={() => router.push("/deposit-requests")}
            >
              See All
            </button>
          </Box>
        </Grid>

        <TableContainer className="table-container">
          <Table className="table">
            <TableHead>
              <TableRow>
                <TableCell className="table-header-cell">Gateway</TableCell>
                <TableCell className="table-header-cell">
                  Transaction Id
                </TableCell>
                <TableCell className="table-header-cell">
                  Initiation Date
                </TableCell>
                <TableCell className="table-header-cell">
                  Transaction Date
                </TableCell>
                <TableCell className="table-header-cell">Amount</TableCell>
                <TableCell className="table-header-cell">Gateway Fee</TableCell>
                <TableCell className="table-header-cell">
                  Deposit Amount
                </TableCell>
                <TableCell className="table-header-cell">
                  Company Name
                </TableCell>
                <TableCell className="table-header-cell">Staff ID</TableCell>
                <TableCell className="table-header-cell">Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(transactions || []).map((transaction: any) => (
                <React.Fragment key={transaction.id}>
                  <TableRow className="collapsed-row">
                    <TableCell className="table-body-cell">
                      {transaction.provider}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {transaction.trxId}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {transaction.paymentCreateTime
                        ? moment(transaction.paymentCreateTime).format(
                            "DD-MMM-YYYY"
                          )
                        : null}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {transaction.createdDateTime
                        ? moment(transaction.createdDateTime).format(
                            "DD-MMM-YYYY"
                          )
                        : null}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {(+transaction.amount).toFixed(0)}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {+transaction.charge || 0}{" "}
                      {transaction.chargeType === "Fixed"
                        ? `${transaction.currency}`
                        : "%"}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {(
                        (+transaction.amount || 0) -
                        (transaction?.chargeType === "Percentage"
                          ? Math.floor(
                              (+transaction.amount * +transaction.charge) / 100
                            )
                          : +transaction?.charge || 0)
                      ).toFixed(0)}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {`${transaction.b2bUser?.companyName}`}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {transaction.user?.identificationShortCode}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      <Typography
                        className={`transaction-status ${
                          transaction.transactionStatus
                            ?.toLowerCase()
                            .replace(/_/g, "-") || "default"
                        }`}
                      >
                        {transaction.transactionStatus?.replace(/_/g, "-")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
export default DashboardClient;
