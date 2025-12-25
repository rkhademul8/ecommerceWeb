"use client";

import React, { useState, FormEvent, useEffect } from "react";
import {
  createDepositRequest,
  uploadPayslipDeposit,
} from "@/features/agent/deposit-request/apis/service";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import { SuccessAlert } from "@/components/alerts/SuccessAlert";
import {
  Grid,
  Box,
  Tabs,
  Tab,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  CircularProgress,
  Modal,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Tooltip,
  ClickAwayListener,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { CustomInput } from "@/components/custom/CustomInput";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { useRouter, useSearchParams } from "next/navigation";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { CustomMenuItem } from "@/components/custom/CustomMenuItem";
import { useGetBankAccountsQuery } from "@/features/company/bank-account/apis/queries";
import "../../../../scss/deposit-request.scss";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { toWords } from "number-to-words";
import { CustomTextArea } from "@/components/custom/CustomTextArea";
import {
  createBkashPayment,
  executeBkashPayment,
  searchBkashTransaction,
} from "@/features/payment-gateway/bkash/service";
import { updateTransaction } from "@/features/payment-gateway/transaction/service";
import { Calendar } from "react-date-range";
import moment from "moment";
import Marquee from "react-fast-marquee";
import { getNotices } from "@/features/company/notice/apis/service";
import DepositPopup from "./DepositPopup";
import InfoIcon from "@mui/icons-material/Info";
import { getMeAgent } from "@/features/agent/apis/service";
import { getGatewayFeeSlot } from "@/features/company/deposit-gateway-fee/service";
import Image from "next/image";
import Swal from "sweetalert2";

const CreateDepositRequest: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toBankAccounts = useGetBankAccountsQuery();

  const [bank, setBank] = useState<any>({});
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [payslipFile, setPayslipFile] = useState(null);
  const [playMarquee, setPlayMarquee] = useState(true);
  const [selectedTab, setSelectedTab] = useState<any>("Bank Account");

  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any>({});
  const [currency, setCurrency] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedBankId, setCopiedBankId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [onlinePaymentType, setOnlinePaymentType] = useState<any>("New");

  const [feeModalOpen, setFeeModalOpen] = useState<any>(false);
  const [matchedFeeSlot, setMatchedFeeSlot] = useState<any>({});
  const [totalDepositsToday, setTotalDepositsToday] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const paymentId = searchParams.get("paymentID");
      const status = searchParams.get("status");

      if (!paymentId || !status) {
        return;
      }

      if (status === "success") {
        await handleExecutePayment(paymentId);
      } else {
        await handleUpdateTransaction(paymentId, status);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const response = await getNotices({ location: "Deposit Request" });
      setNotices(response.data?.payload?.data);
    })();
  }, []);

  const handleChange = async ({ target }: any) => {
    if (target.files) {
      const MAX_FILE_SIZE = 1 * 1024 * 1024;

      const file = target.files[0];

      if (file.size > MAX_FILE_SIZE) {
        Swal.fire({
          icon: "error",
          title:
            '<span style="color: #FF7D95;">Attachments Upload Failed</span>',
          html: '<span style="color: #6E6996;">File size exceeds 1MB. Please upload a smaller file.</span>',
        });
        target.value = "";
        return;
      }

      return setPayslipFile(file);
    }


    const newData = { ...formData, [target.name]: target.value };

    if (target.name === "amount" || target.name === "depositAmount") {
      const amount = +target.value || 0;

      if (bank?.id && amount > 0) {
        try {
          const result = await getGatewayFeeSlot({
            companyAccountId: bank.id,
            amount,
          });

          const { totalDepositsToday, matchedFeeSlot } =
            result.data?.payload || {};

          setMatchedFeeSlot(matchedFeeSlot);
          setTotalDepositsToday(totalDepositsToday);

          const chargeAmount =
            matchedFeeSlot?.amountType === "Percentage"
              ? Math.floor((amount * +matchedFeeSlot.amount) / 100)
              : +matchedFeeSlot?.amount || 0;

          const total = amount - +chargeAmount;
          newData.totalAmount = total.toFixed(2);
        } catch (error) {
          setMatchedFeeSlot({});
          setTotalDepositsToday(null);
          newData.totalAmount = amount.toFixed(2);
        }
      } else {
        setMatchedFeeSlot({});
        setTotalDepositsToday(null);
        newData.totalAmount = amount.toFixed(2);
      }
    }

    setFormData(newData);
  };

  const handlePayslipUpload = async (id: number) => {
    try {
      if (payslipFile) {
        const payslipFormData = new FormData();
        payslipFormData.append("file", payslipFile);
        await uploadPayslipDeposit(id, payslipFormData);
      }
    } catch (error) {
      const errorMessage = handleApiErrors(error);
      ErrorAlert(errorMessage);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newData = { ...formData };

    if (selectedTab === "Cash Deposit") newData.paymentType = "CASH";
    if (selectedTab === "Mobile Banking") newData.paymentType = "MFS";

    try {
      if (selectedTab === "Online Payment") {
        try {
          if (onlinePaymentType === "New") {
            const result = await createBkashPayment({
              amount: formData.amount,
              userNotes: formData.userNotes || null,
              depositCharge: matchedFeeSlot?.amount || 0,
              depositChargeType: matchedFeeSlot?.amountType || null,
            });
            if (result.data) {
              window.open(result.data.payload?.paymentUrl, "_blank");
            }
          } else if (onlinePaymentType === "Link") {
            const result = await createBkashPayment({
              amount: formData.amount,
              userNotes: formData.userNotes || null,
            });
            if (result.data) {
              setPaymentUrl(result.data.payload?.paymentUrl);
            }
          } else {
            const result = await searchBkashTransaction({
              trxId: formData.trxId,
              amount: formData.amount,
              userNotes: formData.userNotes || null,
              depositCharge: matchedFeeSlot?.amount || 0,
              depositChargeType: matchedFeeSlot?.amountType || null,
            });
            if (result.data) {
              SuccessAlert(
                `Amount ${result.data?.payload?.amount} BDT has been successfully added to your balance. Transaction ID: ${result.data?.payload?.trxId}.`
              );
            }
          }
        } catch (error) {
          const errorMessage = handleApiErrors(error);
          ErrorAlert(errorMessage);
        } finally {
          setIsLoading(false);
        }

        return;
      }

      newData.depositCharge = matchedFeeSlot?.amount || 0;
      newData.depositChargeType = matchedFeeSlot?.amountType || null;

      const result = await createDepositRequest(newData);
      if (result.data) {
        await handlePayslipUpload(result.data.payload?.id);
        SuccessAlert(`Request Submitted successfully`);
        router.push("/deposit-requests");
      }
    } catch (error) {
      const errorMessage = handleApiErrors(error);
      ErrorAlert(errorMessage);
    }
  };

  const handleExecutePayment = async (paymentId: string) => {
    setIsLoading(true);
    try {
      const response = await executeBkashPayment({ paymentId });

      if (response.data?.payload?.transactionStatus === "Completed") {
        setData(response.data.payload);
      }
    } catch (error) {
      const errorMessage = handleApiErrors(error);
      ErrorAlert(errorMessage);
    } finally {
      setIsLoading(false);
      setModalOpen(true);
    }
  };

  const handleUpdateTransaction = async (paymentId: string, status: string) => {
    setIsLoading(true);
    try {
      const updateData = {
        transactionStatus: status === "failure" ? "Failed" : "Cancelled",
      };
      const result = await updateTransaction(paymentId, updateData);
      if (result.data) {
        setData(result.data.payload);
      }
    } catch (error) {
      const errorMessage = handleApiErrors(error);
      ErrorAlert(errorMessage);
    } finally {
      setIsLoading(false);
      setModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setData({});
    window.close();
    setFormData({});
    setModalOpen(false);
  };

  const handlePaymentTypeChange = (event: any) => {
    setBank({});
    setFormData({});
    setPaymentUrl("");
    setMatchedFeeSlot({});
    setTotalDepositsToday(null);
    setOnlinePaymentType(event.target.value);
  };

  const handleTabChange = (event: any, value: any) => {
    setBank({});
    setFormData({});
    setSelectedTab(value);
    setMatchedFeeSlot({});
    setOnlinePaymentType("New");
    setTotalDepositsToday(null);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  useEffect(() => {
    (async () => {
      const {
        data: { payload: agent },
      } = await getMeAgent();
      setCurrency(agent?.b2bUserWallet?.wallet?.walletCurrency);
    })();
  }, []);

  return (
    <Box>
      <Box>
        <DepositPopup />
      </Box>

      {notices.length > 0 ? (
        <Box mb={1.5}>
          <Typography
            style={{
              color: "#fff",
              display: "flex",
              fontSize: "14px",
              padding: "3px 8px",
              borderRadius: "2px",
              fontFamily: "Public Sans",
              backgroundColor: "#4b5563",
            }}
            onMouseEnter={() => setPlayMarquee(false)}
            onMouseLeave={() => setPlayMarquee(true)}
          >
            <Marquee play={playMarquee}>
              {notices?.map((data: any) => (
                <span
                  style={{
                    color: "#fff",
                    marginRight: "20px",
                    fontFamily: "Public Sans",
                  }}
                  key={data.id}
                >
                  {data.description}
                </span>
              ))}
            </Marquee>
          </Typography>
        </Box>
      ) : null}

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
          Deposit Request
          <Typography className="form-subtitle">
            Create your deposit requests
          </Typography>
        </Typography>

        <Box>
          <button
            className="add-button"
            onClick={() => router.push("/deposit-requests")}
          >
            Deposit List
          </button>
        </Box>
      </Grid>

      <Grid item xs={12} sm={12} md={12} mb={3}>
        <Tabs
          value={selectedTab}
          variant="fullWidth"
          className="primary-tab"
          onChange={handleTabChange}
        >
          <Tab label="Bank Account" value="Bank Account" />
          <Tab label="Online Payment" value="Online Payment" />
          <Tab label="Mobile Banking" value="Mobile Banking" />
          <Tab label="Cash Deposit" value="Cash Deposit" />
        </Tabs>
      </Grid>

      <Box className="form-container">
        <Box className="form-wrapper">
          <Grid item xs={12} sm={12} md={12} mb={3}>
            <Typography className="form-title" mb={2}>
              {selectedTab}
              {selectedTab === "Bank Account" ||
                selectedTab === "Mobile Banking"
                ? " Deposit"
                : selectedTab === "Online Payment"
                  ? " (Instant)"
                  : ""}
            </Typography>

            <hr className="tab-divider" />
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2} rowSpacing={3}>
                  <Grid item xs={12} md={9}>
                    {selectedTab === "Online Payment" ? (
                      <Grid container spacing={1} rowSpacing={2}>
                        <Grid item xs={12} md={12}>
                          <RadioGroup
                            row
                            value={onlinePaymentType}
                            onChange={handlePaymentTypeChange}
                          >
                            <FormControlLabel
                              value="New"
                              control={
                                <Radio
                                  sx={{
                                    color: "#01783B",
                                    "&.Mui-checked": {
                                      color: "#01783B",
                                    },
                                  }}
                                />
                              }
                              label={
                                <span className="normal-text">New Pay</span>
                              }
                            />
                            <FormControlLabel
                              value="Verify"
                              control={
                                <Radio
                                  sx={{
                                    color: "#01783B",
                                    "&.Mui-checked": {
                                      color: "#01783B",
                                    },
                                  }}
                                />
                              }
                              label={
                                <span className="normal-text">
                                  Pay with Trx Id
                                </span>
                              }
                            />
                            <FormControlLabel
                              disabled
                              value="Link"
                              control={
                                <Radio
                                  sx={{
                                    color: "#01783B",
                                    "&.Mui-checked": {
                                      color: "#01783B",
                                    },
                                  }}
                                />
                              }
                              label={
                                <Tooltip arrow title="Coming Soon">
                                  <span className="normal-text">Pay Link</span>
                                </Tooltip>
                              }
                            />
                          </RadioGroup>
                        </Grid>

                        <Grid item xs={12} md={12}>
                          <label className="form-label">
                            <span className="form-required">*</span> Select
                            Account
                          </label>
                          <CustomSelect
                            required
                            displayEmpty
                            name="toBankAccountId"
                            value={formData.toBankAccountId || ""}
                            onChange={({ target }) => {
                              if (target.value) {
                                const account =
                                  toBankAccounts.data?.payload?.data?.find(
                                    (item: any) => item.id == target.value
                                  );

                                setFormData({
                                  ...formData,
                                  amount: null,
                                  totalAmount: null,
                                  depositAmount: null,
                                  toBankAccountId: account.id,
                                });
                                setBank(account);
                                setMatchedFeeSlot({});
                                setTotalDepositsToday(null);
                              } else {
                                setFormData({
                                  ...formData,
                                  amount: null,
                                  totalAmount: null,
                                  depositAmount: null,
                                  toBankAccountId: null,
                                });
                                setBank({});
                                setMatchedFeeSlot({});
                                setTotalDepositsToday(null);
                              }
                            }}
                            renderValue={(selected: any) => {
                              if (!selected) return "Select Account";

                              const account =
                                toBankAccounts.data?.payload?.data?.find(
                                  (item: any) => item.id === selected
                                );

                              return account
                                ? selectedTab !== "Cash Deposit"
                                  ? `${account.bankName} - ${account.accountNumber || ""
                                  }`
                                  : `${account.bankName}`
                                : selected;
                            }}
                          >
                            <CustomMenuItem value="">
                              Select Account
                            </CustomMenuItem>
                            {toBankAccounts.data?.payload?.data
                              ?.filter((item: any) => {
                                if (selectedTab === "Online Payment") {
                                  return (
                                    item.bankType === "MFS" &&
                                    ["bkash", "nagad", "rocket"].includes(
                                      item.bankName?.toLowerCase()
                                    )
                                  );
                                } else if (selectedTab === "Bank Account") {
                                  return item.bankType === "BANK";
                                } else if (selectedTab === "Mobile Banking") {
                                  return item.bankType === "MFS";
                                } else if (selectedTab === "Cash Deposit") {
                                  return item.bankType === "CASH";
                                }
                                return false;
                              })
                              .map((account: any) => (
                                <CustomMenuItem
                                  disabled={["nagad", "rocket"].includes(
                                    account.bankName?.toLowerCase()
                                  )}
                                  key={account.id}
                                  value={account.id}
                                >
                                  {selectedTab !== "Cash Deposit"
                                    ? `${account.bankName} - ${account.accountNumber}`
                                    : `${account.bankName}`}
                                </CustomMenuItem>
                              ))}
                          </CustomSelect>
                        </Grid>

                        {onlinePaymentType === "New" ||
                          onlinePaymentType === "Link" ? (
                          <>
                            <Grid item xs={12} md={6}>
                              <label className="form-label">
                                <span className="form-required">*</span> Deposit
                                Amount
                              </label>
                              <CustomInput
                                required
                                type="number"
                                name="amount"
                                onChange={handleChange}
                                placeholder="Enter Amount"
                                value={formData.amount || ""}
                              />

                              {formData.amount ? (
                                <span
                                  className="form-label"
                                  style={{
                                    textTransform: "capitalize",
                                    marginTop: "5px",
                                  }}
                                >
                                  {toWords(formData.amount)} {currency} Only
                                </span>
                              ) : (
                                ""
                              )}
                            </Grid>

                            <Grid item xs={12} md={12}>
                              <label className="form-label">Notes</label>
                              <CustomTextArea
                                multiline
                                rows={1}
                                name="userNotes"
                                onChange={handleChange}
                                placeholder="Enter Notes"
                                value={formData.userNotes || ""}
                              />
                            </Grid>
                          </>
                        ) : (
                          <>
                            <Grid item xs={12} md={6}>
                              <label className="form-label">
                                <span className="form-required">*</span> Deposit
                                Amount
                              </label>
                              <CustomInput
                                required
                                type="number"
                                name="amount"
                                onChange={handleChange}
                                placeholder="Enter Amount"
                                value={formData.amount || ""}
                              />

                              {formData.amount ? (
                                <span
                                  className="form-label"
                                  style={{
                                    textTransform: "capitalize",
                                    marginTop: "5px",
                                  }}
                                >
                                  {toWords(formData.amount)} {currency} Only
                                </span>
                              ) : (
                                ""
                              )}
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <label className="form-label">
                                <span className="form-required">*</span>{" "}
                                Transaction ID
                              </label>
                              <CustomInput
                                required
                                name="trxId"
                                onChange={handleChange}
                                placeholder="Enter Transaction ID"
                                value={formData.trxId || ""}
                              />
                            </Grid>

                            <Grid item xs={12} md={12}>
                              <label className="form-label">Notes</label>
                              <CustomTextArea
                                multiline
                                rows={1}
                                name="userNotes"
                                onChange={handleChange}
                                placeholder="Enter Notes"
                                value={formData.userNotes || ""}
                              />
                            </Grid>
                          </>
                        )}
                      </Grid>
                    ) : (
                      <Grid container spacing={1} rowSpacing={2}>
                        <Grid item xs={12} md={12}>
                          <label className="form-label">
                            <span className="form-required">*</span> Select
                            Account
                          </label>
                          <CustomSelect
                            required
                            displayEmpty
                            name="toBankAccountId"
                            value={formData.toBankAccountId || ""}
                            onChange={({ target }) => {
                              if (target.value) {
                                const account =
                                  toBankAccounts.data?.payload?.data?.find(
                                    (item: any) => item.id == target.value
                                  );

                                setFormData({
                                  ...formData,
                                  amount: null,
                                  totalAmount: null,
                                  depositAmount: null,
                                  toBankAccountId: account.id,
                                });
                                setBank(account);
                                setMatchedFeeSlot({});
                                setTotalDepositsToday(null);
                              } else {
                                setFormData({
                                  ...formData,
                                  amount: null,
                                  totalAmount: null,
                                  depositAmount: null,
                                  toBankAccountId: null,
                                });
                                setBank({});
                                setMatchedFeeSlot({});
                                setTotalDepositsToday(null);
                              }
                            }}
                            renderValue={(selected: any) => {
                              if (!selected) return "Select Account";

                              const account =
                                toBankAccounts.data?.payload?.data?.find(
                                  (item: any) => item.id === selected
                                );

                              return account
                                ? selectedTab !== "Cash Deposit"
                                  ? `${account.bankName} - ${account.accountNumber || ""
                                  }`
                                  : `${account.bankName}`
                                : selected;
                            }}
                          >
                            <CustomMenuItem value="">
                              Select Account
                            </CustomMenuItem>
                            {toBankAccounts.data?.payload?.data
                              ?.filter((item: any) => {
                                if (selectedTab === "Bank Account") {
                                  return item.bankType === "BANK";
                                } else if (selectedTab === "Mobile Banking") {
                                  return item.bankType === "MFS";
                                } else if (selectedTab === "Cash Deposit") {
                                  return item.bankType === "CASH";
                                }
                                return false;
                              })
                              .map((account: any) => (
                                <CustomMenuItem
                                  key={account.id}
                                  value={account.id}
                                  disabled={selectedTab === "Mobile Banking" && account.bankName?.toLowerCase() === "bkash"}
                                >
                                  {selectedTab !== "Cash Deposit"
                                    ? `${account.bankName} - ${account.accountNumber}`
                                    : `${account.bankName}`}
                                </CustomMenuItem>
                              ))}
                          </CustomSelect>
                        </Grid>

                        {selectedTab === "Bank Account" ? (
                          <Grid item xs={12} md={6}>
                            <label className="form-label">
                              <span className="form-required">*</span> Deposit
                              Type
                            </label>
                            <CustomSelect
                              name="paymentType"
                              value={formData.paymentType || ""}
                              onChange={handleChange}
                              displayEmpty
                              required
                              renderValue={(selected: any) =>
                                selected || "Deposit Type"
                              }
                            >
                              <CustomMenuItem value="">
                                Select Deposit Type
                              </CustomMenuItem>
                              <CustomMenuItem value="BANK TRANSFER">
                                BANK TRANSFER
                              </CustomMenuItem>
                              <CustomMenuItem value="BANK DEPOSIT">
                                BANK DEPOSIT
                              </CustomMenuItem>
                              <CustomMenuItem value="CHEQUE">
                                CHEQUE
                              </CustomMenuItem>
                            </CustomSelect>
                          </Grid>
                        ) : selectedTab === "Mobile Banking" ? (
                          <Grid item xs={12} md={6}>
                            <label className="form-label">
                              <span className="form-required">*</span> From
                              Account
                            </label>
                            <CustomInput
                              required
                              onChange={handleChange}
                              name="fromBankAccountNumber"
                              placeholder="Account Number"
                              value={formData.fromBankAccountNumber || ""}
                            />
                          </Grid>
                        ) : null}

                        <Grid
                          item
                          xs={12}
                          md={6}
                          sx={{
                            position: "relative",
                          }}
                        >
                          <label className="form-label">
                            <span className="form-required">*</span> Deposit
                            Date
                          </label>

                          <CustomInput
                            required
                            type="text"
                            name="depositDate"
                            placeholder="DD-MMM-YYYY"
                            onClick={() => {
                              setOpen((prev) => !prev);
                            }}
                            value={
                              formData.depositDate
                                ? moment(formData.depositDate).format(
                                  "DD-MMM-YYYY"
                                )
                                : ""
                            }
                            autoComplete="off"
                          />

                          {open ? (
                            <ClickAwayListener onClickAway={handleClickAway}>
                              <Box>
                                <Calendar
                                  color="#01783B"
                                  direction="horizontal"
                                  className="dashboard-calendar"
                                  date={
                                    formData.depositDate
                                      ? new Date(formData.depositDate)
                                      : new Date()
                                  }
                                  onChange={(date) => {
                                    setFormData({
                                      ...formData,
                                      depositDate: date
                                        ? moment(date).format("YYYY-MM-DD")
                                        : null,
                                    });
                                    setOpen(false);
                                  }}
                                />
                              </Box>
                            </ClickAwayListener>
                          ) : null}
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <label className="form-label">
                            <span className="form-required">*</span> Deposit
                            Amount
                          </label>
                          <CustomInput
                            required
                            type="number"
                            name="depositAmount"
                            onChange={handleChange}
                            placeholder="Enter Amount"
                            value={formData.depositAmount || ""}
                          />
                          {formData.depositAmount ? (
                            <span
                              className="form-label"
                              style={{
                                textTransform: "capitalize",
                                marginTop: "5px",
                              }}
                            >
                              {toWords(formData.depositAmount)} {currency} Only
                            </span>
                          ) : (
                            ""
                          )}
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <label className="form-label">
                            <span className="form-required">*</span> Reference
                            ID
                          </label>
                          <CustomInput
                            required
                            onChange={handleChange}
                            name="transactionReference"
                            placeholder="Enter Reference ID"
                            value={formData.transactionReference || ""}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <label className="form-label">
                            <span className="form-required">*</span> Attachment
                          </label>
                          <Box className="upload-section">
                            <input
                              required
                              type="file"
                              accept="image/*"
                              name="photoFile"
                              onChange={handleChange}
                              style={{ width: "100%" }}
                            />
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={12}>
                          <label className="form-label">Notes</label>
                          <CustomTextArea
                            multiline
                            rows={1}
                            name="userNotes"
                            onChange={handleChange}
                            placeholder="Enter Notes"
                            value={formData.userNotes || ""}
                          />
                        </Grid>
                      </Grid>
                    )}
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={12}>
                        <Box
                          sx={{
                            padding: "12px",
                            background: "#EDEDFD",
                            borderRadius: "12px",
                            height: "200px",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: "10px",
                            }}
                          >
                            <h4
                              style={{
                                fontFamily: "Public Sans, sans-serif",
                                fontWeight: 600,
                                fontSize: "16px",
                                color: "#2C2377",
                                margin: 0,
                              }}
                            >
                              Deposit to
                            </h4>

                            {bank.id ? (
                              <span
                                onClick={() => {
                                  if (bank.id) {
                                    navigator.clipboard.writeText(
                                      `${bank.bankName}\r\n${bank.bankAccountName
                                      }\r\n${bank.accountNumber}\r\n${bank.bankBranch || ""
                                      }\r\n${bank.routingNumber || ""}`
                                    );
                                    setSnackbarOpen(true);
                                    setCopiedBankId(bank.id);
                                    setTimeout(() => {
                                      setCopiedBankId(null);
                                      setSnackbarOpen(false);
                                    }, 500);
                                  }
                                }}
                                style={{
                                  gap: "6px",
                                  alignItems: "center",
                                  display: "inline-flex",
                                  padding: "5px 10px",
                                  backgroundColor: "#01783B",
                                  color: "#fff",
                                  borderRadius: "8px",
                                  fontWeight: 500,
                                  cursor: "pointer",
                                  userSelect: "none",
                                  transition: "all 0.2s ease",
                                  fontSize: "12px",
                                }}
                              >
                                {snackbarOpen && copiedBankId === bank.id
                                  ? "Copied"
                                  : "Copy"}
                              </span>
                            ) : null}
                          </Box>

                          <Box
                            sx={{
                              borderRadius: "8px",
                              marginBottom: "13px",
                              background: "#fff",
                            }}
                          >
                            {bank.id ? (
                              <Box
                                sx={{
                                  height: "140px",
                                  padding: "10px",
                                  display: "flex",
                                  alignItems: "center",
                                  flexDirection: "column",
                                }}
                              >
                                <Box
                                  sx={{
                                    padding: "10px",
                                    backgroundColor: "#fff",
                                    textAlign: "center",
                                    width: "100%",
                                  }}
                                >
                                  {selectedTab === "Cash Deposit" ? (
                                    <>
                                      <Image
                                        src={bank.bankLogo || ""}
                                        alt="Bank Logo"
                                        width={30}
                                        height={30}
                                      />

                                      <span className="span-2">
                                        {bank.bankBranch}
                                      </span>
                                      <span className="span-2">
                                        {bank.bankAccountName}
                                      </span>
                                      <span className="span-2">
                                        {bank.bankName}
                                      </span>
                                    </>
                                  ) : selectedTab === "Bank Account" ? (
                                    <>
                                      {bank.id ? (
                                        <Image
                                          src={bank.bankLogo || ""}
                                          alt="Bank Logo"
                                          width={30}
                                          height={30}
                                        />
                                      ) : (
                                        ""
                                      )}
                                      <span className="span-2">
                                        {bank.bankName}
                                      </span>
                                      <span className="span-2">
                                        A/c Title - {bank.bankAccountName}
                                      </span>
                                      <span className="span-2">
                                        A/c No - {bank.accountNumber}
                                      </span>
                                      <span className="span-2">
                                        {bank.bankBranch}
                                      </span>
                                      <span className="span-2">
                                        Routing No - {bank.routingNumber}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Image
                                        src={bank.bankLogo || ""}
                                        alt="Bank Logo"
                                        width={30}
                                        height={30}
                                      />

                                      <span className="span-2">
                                        {bank.bankName}
                                      </span>
                                      <span className="span-2">
                                        {bank.accountNumber}
                                      </span>
                                      <span className="span-2">
                                        {bank.bankAccountName}
                                      </span>
                                    </>
                                  )}
                                </Box>
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  padding: "12px",
                                  background: "#EDEDFD",
                                  borderRadius: "12px",
                                  height: "150px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  textAlign: "center",
                                  color: "#ff7d95",
                                  fontFamily: "Public Sans, sans-serif",
                                  fontSize: "16px",
                                  cursor: "pointer",
                                  border: "2px dashed #4b5563",
                                }}
                              >
                                <Box>
                                  <div>Choose your account</div>
                                </Box>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={12}>
                        <Box
                          sx={{
                            padding: "12px",
                            background: "#EDEDFD",
                            borderRadius: "12px",
                          }}
                        >
                          <h4
                            style={{
                              fontFamily: "Public Sans, sans-serif",
                              fontWeight: 600,
                              fontSize: "16px",
                              marginBottom: "10px",
                              color: "#2C2377",
                            }}
                          >
                            Summary
                          </h4>

                          <Box
                            sx={{
                              padding: "12px",
                              borderRadius: "8px",
                              marginBottom: "12px",
                              background: "#fff",
                            }}
                          >
                            <Box gap={0.5} display="flex" mb={1}>
                              <span
                                style={{
                                  fontSize: "14px",
                                  color: "#55507D",
                                  fontWeight: 500,
                                }}
                              >
                                Gateway Fee
                              </span>
                              <Tooltip title="View Fee Details">
                                <IconButton
                                  size="small"
                                  sx={{ padding: 0 }}
                                  onClick={() => setFeeModalOpen(true)}
                                >
                                  <InfoIcon
                                    sx={{ fontSize: 15, color: "#FF5A7D" }}
                                  />
                                </IconButton>
                              </Tooltip>
                            </Box>

                            <h3
                              style={{
                                fontSize: "18px",
                                fontWeight: 700,
                                color: "#5A3DF5",
                              }}
                            >
                              {matchedFeeSlot?.amountType === "Fixed"
                                ? `${(+matchedFeeSlot?.amount || 0).toFixed(
                                  0
                                )} ${matchedFeeSlot?.currency || ""}`
                                : `${(+matchedFeeSlot?.amount || 0).toFixed(
                                  0
                                )}%`}
                            </h3>
                          </Box>

                          <Box
                            sx={{
                              background: "#fff",
                              borderRadius: "8px",
                              padding: "12px",
                            }}
                          >
                            <span
                              style={{
                                display: "block",
                                fontSize: "14px",
                                color: "#55507D",
                                fontWeight: 500,
                                marginBottom: "8px",
                              }}
                            >
                              Amount to be Deposited
                            </span>

                            <h2
                              style={{
                                fontSize: "20px",
                                fontWeight: 700,
                                color: "#000",
                              }}
                            >
                              {formData.totalAmount
                                ? `${formData.totalAmount}`
                                : "0.00"}
                            </h2>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={12}
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <button
                      type="submit"
                      className={`submit-button ${isLoading ? "disabled" : ""}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isLoading && (
                        <CircularProgress size={15} className="loading-icon" />
                      )}
                      Submit
                    </button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>

          <Modal open={modalOpen}>
            <Card
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: {
                  xs: "90%",
                  sm: "400px",
                  md: "500px",
                },
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <CardHeader
                title={
                  <h4 className="normal-header">
                    {data.transactionStatus === "Completed"
                      ? "Transaction Details"
                      : "Payment Status"}
                  </h4>
                }
                sx={{
                  backgroundColor: "#F5F5F5",
                  padding: "16px",
                }}
              />

              <CardContent>
                <Box textAlign="center" sx={{ padding: "16px" }}>
                  {data.transactionStatus === "Completed" ? (
                    <Box>
                      <span
                        style={{
                          fontWeight: "500",
                          margin: "8px 0",
                        }}
                      >
                        Amount: <strong>{data.amount} BDT</strong>
                      </span>
                      <br />
                      <span
                        style={{
                          fontWeight: "500",
                          margin: "8px 0",
                        }}
                      >
                        Transaction ID: <strong>{data.trxId}</strong>
                      </span>
                    </Box>
                  ) : (
                    <Box>
                      <span
                        style={{
                          fontWeight: "500",
                          margin: "8px 0",
                          display: "block",
                        }}
                      >
                        Amount: <strong>{data.amount || "0.00"} BDT</strong>
                      </span>
                      <br />
                      <span
                        style={{
                          fontWeight: "500",
                          margin: "8px 0",
                          display: "block",
                        }}
                      >
                        Status:{" "}
                        <span
                          className={`transaction-status ${data.transactionStatus
                            ?.toLowerCase()
                            .replace(/_/g, "-") || "default"
                            }`}
                        >
                          {data.transactionStatus}
                        </span>
                      </span>
                    </Box>
                  )}
                </Box>
              </CardContent>

              <CardActions
                sx={{
                  justifyContent: "center",
                  padding: "16px",
                }}
              >
                <Button variant="outlined" onClick={handleModalClose}>
                  Close
                </Button>
              </CardActions>
            </Card>
          </Modal>

          <Dialog
            fullWidth
            maxWidth="xs"
            open={feeModalOpen}
            onClose={() => setFeeModalOpen(false)}
          >
            <DialogTitle>
              <Typography
                sx={{
                  fontFamily: "Public Sans",
                  fontSize: "16px",
                }}
              >
                Gateway Fee Details
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              {!matchedFeeSlot || Object.keys(matchedFeeSlot).length === 0 ? (
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Typography
                    sx={{
                      fontFamily: "Public Sans",
                      fontSize: "14px",
                      color: "#ff5a7d",
                    }}
                  >
                    No gateway fee applies to your current deposit.
                  </Typography>
                </Box>
              ) : (
                <>
                  <Typography
                    sx={{
                      fontFamily: "Public Sans",
                      fontSize: "14px",
                      mb: 1,
                    }}
                  >
                    <strong>Effective Amount:</strong>{" "}
                    {(
                      (+formData.depositAmount || +formData.amount || 0) +
                      (+totalDepositsToday || 0)
                    ).toFixed(2)}
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: "Public Sans",
                      fontSize: "14px",
                      mb: 1,
                    }}
                  >
                    <strong>Total Deposits Today:</strong>{" "}
                    {(+totalDepositsToday || 0).toFixed(2)}
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: "Public Sans",
                      fontSize: "14px",
                      mb: 1,
                    }}
                  >
                    <strong>Charge:</strong>{" "}
                    {matchedFeeSlot?.amountType === "Fixed"
                      ? `${matchedFeeSlot?.amount} ${matchedFeeSlot?.currency}`
                      : `${matchedFeeSlot?.amount}%`}{" "}
                    for {+matchedFeeSlot?.lowerLimit || 0} –{" "}
                    {matchedFeeSlot?.upperLimit === null
                      ? "or more"
                      : +matchedFeeSlot?.upperLimit}{" "}
                  </Typography>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <button
                onClick={() => setFeeModalOpen(false)}
                className="cancel-button"
              >
                Close
              </button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateDepositRequest;
