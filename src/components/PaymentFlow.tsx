"use client";

import { useEffect, useState, FormEvent, useRef } from "react";
import {
    Box,
    Grid,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    RadioGroup,
    FormControlLabel,
    Radio,
    Tabs,
    Tab,
    Card,
    CardContent,
    CardHeader,
    CardActions,
    Tooltip,
    ClickAwayListener,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import moment from "moment";
import { createOrderDeposit } from "@/features/order/order";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { CustomInput } from "@/components/custom/CustomInput";
import { SuccessAlert } from "@/components/alerts/SuccessAlert";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { CustomTextArea } from "@/components/custom/CustomTextArea";
import { CustomMenuItem } from "@/components/custom/CustomMenuItem";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import {
    createBkashPayment,
    executeBkashPayment,
    searchBkashTransaction,
} from "@/features/payment-gateway/bkash/service";
import { Calendar } from "react-date-range";
import { getMeAgent } from "@/features/agent/apis/service";
import { getBankAccounts } from "@/features/company/bank-account/apis/service";
import { getGatewayFeeSlot } from "@/features/company/deposit-gateway-fee/service";
import { updateTransaction } from "@/features/payment-gateway/transaction/service";
import { createDepositRequest, uploadPayslipDeposit } from "@/features/agent/deposit-request/apis/service";
import Swal from "sweetalert2";

type PaymentFlowProps = {
    paymentModalOpen: boolean;
    setPaymentModalOpen: any;
    orderIds: string[];
    payNow: number;
    searchParams: URLSearchParams;
    isOrder: boolean;
};

export default function PaymentFlow({
    paymentModalOpen,
    setPaymentModalOpen,
    orderIds,
    payNow,
    searchParams,
    isOrder
}: PaymentFlowProps) {
    const router = useRouter();
    const executedRef = useRef(false);
    const searchParamsHook = useSearchParams();

    const [currency, setCurrency] = useState("");
    const [paymentUrl, setPaymentUrl] = useState("");
    const [paymentData, setPaymentData] = useState<any>({});
    const [bankAccounts, setBankAccounts] = useState<any>([]);

    const [feeModalOpen, setFeeModalOpen] = useState(false);
    const [selectedBank, setSelectedBank] = useState<any>({});
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [matchedFeeSlot, setMatchedFeeSlot] = useState<any>({});
    const [paymentFormData, setPaymentFormData] = useState<any>({});
    const [payslipFile, setPayslipFile] = useState<File | null>(null);
    const [onlinePaymentType, setOnlinePaymentType] = useState("New");
    const [totalDepositsToday, setTotalDepositsToday] = useState<any>(null);
    const [paymentResultModalOpen, setPaymentResultModalOpen] = useState(false);
    const [selectedPaymentTab, setSelectedPaymentTab] = useState("Online Payment");

    useEffect(() => {
        (async () => {
            if (executedRef.current) return;

            const paymentID = searchParamsHook.get("paymentID");
            const status = searchParamsHook.get("status");

            if (!paymentID || !status) return;

            executedRef.current = true;

            if (status === "success") {
                await handleExecutePayment(paymentID);
            } else {
                await handleUpdateTransaction(paymentID, status);
            }
        })();
    }, [searchParamsHook, paymentModalOpen]);

    useEffect(() => {
        (async () => {
            const { data: { payload: agent } } = await getMeAgent();
            const { data: { payload } } = await getBankAccounts();

            setCurrency(agent?.b2bUserWallet?.wallet?.walletCurrency || "BDT");
            setBankAccounts(payload?.data);
        })();
    }, []);

    useEffect(() => {
        const baseAmount = Number(payNow) || 0;

        const chargeAmount =
            matchedFeeSlot?.amount
                ? matchedFeeSlot.amountType === "Percentage"
                    ? Math.floor((baseAmount * Number(matchedFeeSlot.amount)) / 100)
                    : Number(matchedFeeSlot.amount)
                : 0;

        const depositAmount = baseAmount + chargeAmount;

        setPaymentFormData((prev: any) => ({
            ...prev,
            amount: Math.round(+baseAmount).toString(),
            depositCharge: chargeAmount,
            depositAmount: Math.round(+depositAmount).toFixed(0),
        }));
    }, [payNow, matchedFeeSlot]);

    const handlePaymentChange = async ({ target }: any) => {
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

        const { name, value } = target;

        const newData = {
            ...paymentFormData,
            [name]: value,
        };

        if (name === "toBankAccountId") {
            const account = bankAccounts?.find(
                (item: any) => item.id === value
            );

            setSelectedBank(account || null);
            setMatchedFeeSlot(null);
            setTotalDepositsToday(null);

            const amount = Number(payNow) || 0;

            if (!account?.id || amount <= 0) {
                setPaymentFormData(newData);
                return;
            }

            try {
                const result = await getGatewayFeeSlot({
                    companyAccountId: account.id,
                    amount,
                });

                const { totalDepositsToday, matchedFeeSlot } =
                    result.data?.payload || {};

                setMatchedFeeSlot(matchedFeeSlot || null);
                setTotalDepositsToday(totalDepositsToday || null);
            } catch {
                setMatchedFeeSlot(null);
                setTotalDepositsToday(null);
            }
        }

        setPaymentFormData(newData);
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

    const handleExecutePayment = async (paymentId: string) => {
        setPaymentLoading(true);
        try {
            const response = await executeBkashPayment({ paymentId, orderIds: orderIds });
            if (response.data?.payload?.transactionStatus === "Completed") {
                setPaymentData(response.data.payload);
            }
        } catch (error) {
            const errorMessage = handleApiErrors(error);
            ErrorAlert(errorMessage);
        } finally {
            setPaymentLoading(false);
            setPaymentResultModalOpen(true);
        }
    };

    const handleUpdateTransaction = async (paymentId: string, status: string) => {
        setPaymentLoading(true);
        try {
            const updateData = { transactionStatus: status === "failure" ? "Failed" : "Cancelled" };
            const result = await updateTransaction(paymentId, updateData);
            if (result.data) setPaymentData(result.data.payload);
        } catch (error) {
            const errorMessage = handleApiErrors(error);
            ErrorAlert(errorMessage);
        } finally {
            setPaymentLoading(false);
            setPaymentResultModalOpen(true);
        }
    };

    const handlePaymentSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setPaymentLoading(true);

        try {
            const baseAmount = Number(payNow) || 0;

            const chargeAmount =
                matchedFeeSlot?.amount
                    ? matchedFeeSlot.amountType === "Percentage"
                        ? Math.floor((baseAmount * Number(matchedFeeSlot.amount)) / 100)
                        : Number(matchedFeeSlot.amount)
                    : 0;

            const depositAmount = baseAmount + chargeAmount;

            const newData = {
                ...paymentFormData,
                amount: depositAmount,
                depositAmount,
                depositCharge: chargeAmount,
                depositChargeType: matchedFeeSlot?.amountType || null,
            };

            if (selectedPaymentTab === "Cash Deposit") newData.paymentType = "CASH";
            if (selectedPaymentTab === "Mobile Banking") newData.paymentType = "MFS";

            if (selectedPaymentTab === "Online Payment") {
                const payload = {
                    amount: depositAmount + "",
                    isOrder: isOrder,
                    userNotes:
                        paymentFormData.userNotes ||
                        `Orders #${orderIds.join(", ")} - Checkout`,
                    depositCharge: chargeAmount,
                    depositChargeType: matchedFeeSlot?.amountType || null,
                };

                if (onlinePaymentType === "New") {
                    const result = await createBkashPayment(payload);
                    if (result.data) {
                        window.open(result.data.payload?.paymentUrl, "_blank");
                    }
                } else if (onlinePaymentType === "Link") {
                    const result = await createBkashPayment(payload);
                    if (result.data) {
                        setPaymentUrl(result.data.payload?.paymentUrl);
                    }
                } else {
                    const result = await searchBkashTransaction({
                        ...payload,
                        orderIds: orderIds,
                        trxId: paymentFormData.trxId,
                    });

                    if (result.data) {
                        SuccessAlert(
                            `Amount ${result.data.payload.amount} BDT added. Transaction ID: ${result.data.payload.trxId}.`
                        );
                        handlePaymentModalClose();
                    }
                }

                return;
            }

            const result = await createDepositRequest(newData);

            if (result.data) {
                await handlePayslipUpload(result.data.payload?.id);
                SuccessAlert(`Payment request submitted for Orders`);

                await createOrderDeposit({
                    orderIds: orderIds,
                    depositId: result.data.payload?.id,
                });

                handlePaymentModalClose();
            }
        } catch (error) {
            ErrorAlert(handleApiErrors(error));
        } finally {
            setPaymentLoading(false);
        }
    };

    const handlePaymentTabChange = (event: any, value: any) => {
        setSelectedBank({});
        setPaymentFormData({});
        setSelectedPaymentTab(value);
        setMatchedFeeSlot({});
        setOnlinePaymentType("New");
        setTotalDepositsToday(null);
    };

    const handlePaymentTypeChange = (event: any) => {
        setSelectedBank({});
        setPaymentFormData({});
        setPaymentUrl("");
        setMatchedFeeSlot({});
        setTotalDepositsToday(null);
        setOnlinePaymentType(event.target.value);
    };

    const handleDateChange = (date: any) => {
        setPaymentFormData({
            ...paymentFormData,
            depositDate: date ? moment(date).format("YYYY-MM-DD") : null,
        });
        setDatePickerOpen(false);
    };

    const handlePaymentModalClose = () => {
        setPaymentModalOpen(false)
        router.push('/orders')
    };

    return (
        <>
            <Dialog open={paymentModalOpen} fullWidth maxWidth="md">
                <DialogTitle sx={{ backgroundColor: "#F5F5F5" }}>
                    <Typography sx={{ fontFamily: "Public Sans", fontWeight: 600, fontSize: "20px" }}>
                        Complete Payment
                    </Typography>
                </DialogTitle>

                <form onSubmit={handlePaymentSubmit}>
                    <DialogContent sx={{ p: 0, height: "100%" }}>
                        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                            <Box sx={{ p: 2, borderColor: "divider" }}>
                                <Tabs value={selectedPaymentTab} onChange={handlePaymentTabChange} variant="fullWidth" className="primary-tab">
                                    <Tab label="Bank Account" value="Bank Account" />
                                    <Tab label="Online Payment" value="Online Payment" />
                                    <Tab label="Mobile Banking" value="Mobile Banking" />
                                    <Tab label="Cash Deposit" value="Cash Deposit" />
                                </Tabs>
                            </Box>

                            <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
                                <Grid container spacing={2}>
                                    {selectedPaymentTab === "Online Payment" && (
                                        <Grid item xs={12}>
                                            <RadioGroup row value={onlinePaymentType} onChange={handlePaymentTypeChange}>
                                                <FormControlLabel
                                                    value="New"
                                                    control={<Radio sx={{ color: "#01783B", "&.Mui-checked": { color: "#01783B" } }} />}
                                                    label={<span className="normal-text">New Pay</span>}
                                                />
                                                <FormControlLabel
                                                    value="Verify"
                                                    control={<Radio sx={{ color: "#01783B", "&.Mui-checked": { color: "#01783B" } }} />}
                                                    label={<span className="normal-text">Pay with Trx Id</span>}
                                                />
                                                <FormControlLabel
                                                    disabled
                                                    value="Link"
                                                    control={<Radio sx={{ color: "#01783B", "&.Mui-checked": { color: "#01783B" } }} />}
                                                    label={
                                                        <Tooltip arrow title="Coming Soon">
                                                            <span className="normal-text">Pay Link</span>
                                                        </Tooltip>
                                                    }
                                                />
                                            </RadioGroup>
                                        </Grid>
                                    )}

                                    <Grid item xs={6}>
                                        <label className="form-label">
                                            <span className="form-required">*</span> Select Account
                                        </label>
                                        <CustomSelect
                                            required
                                            displayEmpty
                                            name="toBankAccountId"
                                            value={paymentFormData.toBankAccountId || ""}
                                            onChange={handlePaymentChange}
                                            renderValue={(selected: any) => {
                                                if (!selected) return "Select Account";

                                                const account = bankAccounts?.find(
                                                    (item: any) => item.id === selected
                                                );

                                                if (!account) return "Select Account";

                                                return selectedPaymentTab !== "Cash Deposit"
                                                    ? `${account.bankName} - ${account.accountNumber || ""}`
                                                    : `${account.bankName}`;
                                            }}
                                        >
                                            <CustomMenuItem value="">Select Account</CustomMenuItem>
                                            {bankAccounts
                                                ?.filter((item: any) => {
                                                    if (selectedPaymentTab === "Online Payment") {
                                                        return item.bankType === "MFS" && ["bkash", "nagad", "rocket"].includes(item.bankName?.toLowerCase());
                                                    } else if (selectedPaymentTab === "Bank Account") {
                                                        return item.bankType === "BANK";
                                                    } else if (selectedPaymentTab === "Mobile Banking") {
                                                        return item.bankType === "MFS";
                                                    } else if (selectedPaymentTab === "Cash Deposit") {
                                                        return item.bankType === "CASH";
                                                    }
                                                    return false;
                                                })
                                                .map((account: any) => (
                                                    <CustomMenuItem
                                                        disabled={
                                                            (selectedPaymentTab === "Online Payment" &&
                                                                ["nagad", "rocket"].includes(account.bankName?.toLowerCase())) ||
                                                            (selectedPaymentTab === "Mobile Banking" &&
                                                                account.bankName?.toLowerCase() === "bkash")
                                                        }
                                                        key={account.id}
                                                        value={account.id}
                                                    >
                                                        {selectedPaymentTab !== "Cash Deposit"
                                                            ? `${account.bankName} - ${account.accountNumber}`
                                                            : `${account.bankName}`}
                                                    </CustomMenuItem>
                                                ))}
                                        </CustomSelect>
                                    </Grid>

                                    {selectedPaymentTab === "Bank Account" && (
                                        <Grid item xs={12} md={6}>
                                            <label className="form-label">
                                                <span className="form-required">*</span> Deposit Type
                                            </label>
                                            <CustomSelect
                                                name="paymentType"
                                                value={paymentFormData.paymentType || ""}
                                                onChange={handlePaymentChange}
                                                displayEmpty
                                                required
                                                renderValue={(selected: any) => selected || "Deposit Type"}
                                            >
                                                <CustomMenuItem value="">Select Deposit Type</CustomMenuItem>
                                                <CustomMenuItem value="BANK TRANSFER">BANK TRANSFER</CustomMenuItem>
                                                <CustomMenuItem value="BANK DEPOSIT">BANK DEPOSIT</CustomMenuItem>
                                                <CustomMenuItem value="CHEQUE">CHEQUE</CustomMenuItem>
                                            </CustomSelect>
                                        </Grid>
                                    )}

                                    {selectedPaymentTab === "Mobile Banking" && (
                                        <Grid item xs={12} md={6}>
                                            <label className="form-label">
                                                <span className="form-required">*</span> From Account
                                            </label>
                                            <CustomInput
                                                required
                                                onChange={handlePaymentChange}
                                                name="fromBankAccountNumber"
                                                placeholder="Account Number"
                                                value={paymentFormData.fromBankAccountNumber || ""}
                                            />
                                        </Grid>
                                    )}

                                    {(selectedPaymentTab !== "Online Payment") && (
                                        <Grid item xs={12} md={6} sx={{ position: "relative" }}>
                                            <label className="form-label">
                                                <span className="form-required">*</span> Deposit Date
                                            </label>
                                            <CustomInput
                                                required
                                                type="text"
                                                name="depositDate"
                                                placeholder="DD-MMM-YYYY"
                                                onClick={() => setDatePickerOpen(!datePickerOpen)}
                                                value={
                                                    paymentFormData.depositDate
                                                        ? moment(paymentFormData.depositDate).format("DD-MMM-YYYY")
                                                        : ""
                                                }
                                                autoComplete="off"
                                            />
                                            {datePickerOpen && (
                                                <ClickAwayListener onClickAway={() => setDatePickerOpen(false)}>
                                                    <Box sx={{ position: "absolute", zIndex: 1300, top: "100%", left: 0 }}>
                                                        <Calendar
                                                            color="#01783B"
                                                            direction="horizontal"
                                                            className="dashboard-calendar"
                                                            date={
                                                                paymentFormData.depositDate
                                                                    ? new Date(paymentFormData.depositDate)
                                                                    : new Date()
                                                            }
                                                            onChange={handleDateChange}
                                                        />
                                                    </Box>
                                                </ClickAwayListener>
                                            )}
                                        </Grid>
                                    )}
                                    <Grid item xs={12} md={2}>
                                        <label className="form-label">
                                            <span className="form-required">*</span> Amount
                                        </label>
                                        <CustomInput
                                            required
                                            aria-readonly
                                            value={(+payNow || 0).toFixed(0)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={2}>
                                        <label className="form-label">
                                            <span className="form-required">*</span> Charge Amount
                                        </label>
                                        <CustomInput
                                            required
                                            aria-readonly
                                            value={(+paymentFormData.depositCharge || 0).toFixed(0) || ""}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={2}>
                                        <label className="form-label">
                                            <span className="form-required">*</span> Deposit Amount
                                        </label>
                                        <CustomInput
                                            required
                                            aria-readonly
                                            value={(+paymentFormData.depositAmount || 0).toFixed(0) || ""}
                                        />
                                    </Grid>

                                    {onlinePaymentType === "Verify" && (
                                        <Grid item xs={12} md={6}>
                                            <label className="form-label">
                                                <span className="form-required">*</span> Transaction ID
                                            </label>
                                            <CustomInput
                                                required
                                                name="trxId"
                                                onChange={handlePaymentChange}
                                                placeholder="Enter Transaction ID"
                                                value={paymentFormData.trxId || ""}
                                            />
                                        </Grid>
                                    )}

                                    {(selectedPaymentTab !== "Online Payment") && (
                                        <Grid item xs={12} md={6}>
                                            <label className="form-label">
                                                <span className="form-required">*</span> Reference ID
                                            </label>
                                            <CustomInput
                                                required
                                                onChange={handlePaymentChange}
                                                name="transactionReference"
                                                placeholder="Enter Reference ID"
                                                value={paymentFormData.transactionReference || ""}
                                            />
                                        </Grid>
                                    )}

                                    {(selectedPaymentTab !== "Online Payment") && (
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
                                                    onChange={handlePaymentChange}
                                                    style={{ width: "100%" }}
                                                />
                                            </Box>
                                        </Grid>
                                    )}

                                    <Grid item xs={12} md={12}>
                                        <label className="form-label">Notes</label>
                                        <CustomTextArea
                                            multiline
                                            rows={0}
                                            name="userNotes"
                                            onChange={handlePaymentChange}
                                            placeholder="Enter Notes"
                                            value={paymentFormData.userNotes || ""}
                                        />
                                    </Grid>

                                    {/* <Grid item xs={12} md={3}>
                    <Box sx={{ padding: "12px", background: "#EDEDFD", borderRadius: "12px", height: "200px" }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "10px" }}>
                        <Typography sx={{ fontFamily: "Public Sans", fontWeight: 600, fontSize: "16px", color: "#2C2377" }}>
                          Deposit to
                        </Typography>
                        {selectedBank.id && (
                          <span
                            onClick={() => handleCopyBankDetails(selectedBank)}
                            style={{
                              padding: "5px 10px",
                              backgroundColor: "#01783B",
                              color: "#fff",
                              borderRadius: "8px",
                              fontWeight: 500,
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            {snackbarOpen && copiedBankId === selectedBank.id ? "Copied!" : "Copy"}
                          </span>
                        )}
                      </Box>
                      {selectedBank.id ? (
                        <Box sx={{ height: "140px", p: "10px", display: "flex", alignItems: "center", flexDirection: "column" }}>
                          {selectedBank.bankLogo ? <img src={selectedBank.bankLogo || null} alt="Bank Logo" width={30} height={30} /> : null}
                          <div style={{ textAlign: "center" }}>
                            <div>{selectedBank.bankName}</div>
                            <div>A/c No - {selectedBank.accountNumber}</div>
                            <div>{selectedBank.bankAccountName}</div>
                          </div>
                        </Box>
                      ) : (
                        <Box sx={{ height: "150px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px dashed #4b5563" }}>
                          Choose your account
                        </Box>
                      )}
                    </Box>
                  </Grid> */}

                                    {/* {matchedFeeSlot?.amount && (
                    <Grid item xs={12}>
                      <Box sx={{ p: "12px", background: "#EDEDFD", borderRadius: "12px" }}>
                        <Typography sx={{ fontWeight: 600, fontSize: "16px", color: "#2C2377", mb: 2 }}>Summary</Typography>
                        <Box sx={{ p: "12px", background: "#fff", borderRadius: "8px", mb: 2 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                            <span>Gateway Fee</span>
                            <Box>
                              <span style={{ fontSize: "18px", fontWeight: 700, color: "#5A3DF5" }}>
                                {matchedFeeSlot.amountType === "Fixed" ? `${matchedFeeSlot.amount} BDT` : `${matchedFeeSlot.amount}%`}
                              </span>
                              <Tooltip title="View Fee Details">
                                <IconButton size="small" onClick={() => setFeeModalOpen(true)}>
                                  <InfoOutlinedIcon sx={{ fontSize: 15, color: "#FF5A7D" }} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ p: "12px", background: "#fff", borderRadius: "8px" }}>
                          <span style={{ display: "block", fontSize: "14px", color: "#55507D", marginBottom: "8px" }}>
                            Amount to be Deposited
                          </span>
                          <Typography sx={{ fontSize: "20px", fontWeight: 700, color: "#000" }}>
                            ৳ {paymentFormData.totalAmount || payNow.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )} */}
                                </Grid>
                            </Box>
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <button type="button" className="cancel-button" onClick={handlePaymentModalClose} disabled={paymentLoading}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={paymentLoading || !paymentFormData.toBankAccountId}
                        >
                            {paymentLoading ? "Processing..." : `Pay ৳ ${(+paymentFormData.depositAmount || 0).toFixed(0)} Now`}
                        </button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog open={paymentResultModalOpen} onClick={() => {
                setPaymentResultModalOpen(false);
                setPaymentModalOpen(false);
                router.push("/orders");
            }}>
                <Card>
                    <CardHeader
                        title={paymentData.transactionStatus === "Completed" ? "✅ Transaction Success order place successfully!" : "Payment Status"}
                        sx={{ backgroundColor: "#F5F5F5" }}
                    />
                    <CardContent sx={{ textAlign: "center" }}>
                        {paymentData.transactionStatus === "Completed" ? (
                            <>
                                <Typography style={{ color: "#000" }}>Amount: <strong>৳ {paymentData.amount}</strong></Typography>
                                <Typography style={{ color: "#000" }}>Transaction ID: <strong>{paymentData.trxId}</strong></Typography>
                            </>
                        ) : (
                            <>
                                <Typography style={{ color: "#000" }}>Amount: <strong>৳ {paymentData.amount || "0.00"}</strong></Typography>
                                <Typography style={{ color: "#000" }}>
                                    Status: <span className={`transaction-status ${paymentData.transactionStatus?.toLowerCase()}`}>
                                        {paymentData.transactionStatus}
                                    </span>
                                </Typography>
                            </>
                        )}
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center" }}>
                        <button className="cancel-button" onClick={() => {
                            setPaymentResultModalOpen(false);
                            setPaymentModalOpen(false);
                            router.push("/orders");
                        }}>
                            Close
                        </button>
                    </CardActions>
                </Card>
            </Dialog>
        </>
    );
}
