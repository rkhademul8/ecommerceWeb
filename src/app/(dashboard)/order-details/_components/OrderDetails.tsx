"use client";

import React, { FormEvent, use, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Grid,
  Typography,
  Divider,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  DialogActions,
  CircularProgress,
  Modal,
  FormControl,
} from "@mui/material";
import Image from "next/image";
import moment from "moment";
import {
  getOrder,
  payOrder,
  payOrderDue,
  updateOrder,
} from "@/features/order/order";
import Loader from "@/components/Loader";

import "../../../../scss/order-details/order-details.scss";
import { approveAlert } from "@/components/alerts/ApprovedAlert";
import { SuccessAlert } from "@/components/alerts/SuccessAlert";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import {
  getOtpServiceByType,
  sendOtp,
  verifyOtp,
} from "@/features/common/otp-service/service";
import { verifyGoogleAuth } from "@/features/common/google-auth/service";
import { CustomOtpInput } from "@/components/custom/CustomOtpInput";
import { getMeWallet } from "@/features/agent/apis/service";
import { getMe } from "@/features/user/service";
import commaNumber from "comma-number";
import { CustomInput } from "@/components/custom/CustomInput";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "75%", md: 500 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { xs: 2, md: 3 },
};

const OrderDetails = () => {
  const params = useParams();

  const [user, setUser] = useState<any>({});
  const [wallet, setWallet] = useState<any>({});
  const [formData, setFormData] = useState<any>({});

  const [order, setOrder] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [isDueSettle, setIsDueSettle] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120);
  const [errorMsg, setErrorMsg] = useState("");
  const [otpMethod, setOtpMethod] = useState("");
  const [otpModal, setOtpModal] = useState(false);
  const [loading, setLoading] = useState<any>({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [otpService, setOtpService] = useState<any>({});
  const [otpMethodModal, setOtpMethodModal] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    (async () => {
      try {
        const {
          data: { payload: orderDetails },
        } = await getOrder(params.id);

        setOrder(orderDetails);

        const {
          data: { payload },
        } = await getMeWallet();

        setWallet(payload?.wallet || {});

        const {
          data: { payload: user },
        } = await getMe();

        setUser(user);

        const {
          data: { payload: otpService },
        } = await getOtpServiceByType("Order Payment");

        setOtpService(otpService);
      } finally {
        setLoadingData(false);
      }
    })();
  }, [params.id]);

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

  const handlePaymentOpen = () => setPaymentOpen(true);
  const handlePaymentClose = () => setPaymentOpen(false);

  const handleRadioChange = (event: any) => {
    setSelectedValue(event.target.value);
  };

  const handleOtpMethodChange = (event: any) => {
    setOtpMethod(event.target.value);
  };

  const handleOtpChange = (e: any) => {
    setErrorMsg("");
    setOtp(e.target.value);
  };

  const handleCancel = () => {
    setOtpMethod("");
    setOtpMethodModal(false);
  };

  const handleOtpCancel = () => {
    setOtp("");
    setOtpMethod("");
    setOtpModal(false);
  };

  const handleSendOtp = async () => {
    setLoading({ resend: true });

    setTimeout(async () => {
      try {
        if (otpMethod === "Google") {
          setErrorMsg("");
          setOtpMethodModal(false);
          setOtpModal(true);
          setOtp("");
        } else {
          const result = await sendOtp({ type: otpMethod });
          if (result.data) {
            setTimer(120);
            setErrorMsg("");
            setIsDisabled(true);
            setOtpMethodModal(false);
            setOtpModal(true);
            setOtp("");
          }
        }
      } catch (error) {
        const errorMessage = handleApiErrors(error);
        setErrorMsg(errorMessage);
      } finally {
        setLoading({ resend: false });
      }
    }, 500);
  };

  const handleVerifyOtp = async () => {
    const newData = {
      type: otpMethod,
      otp,
    };
    setLoading({ verify: true });
    setTimeout(async () => {
      try {
        let result;
        if (otpMethod === "Google") {
          result = await verifyGoogleAuth({ code: otp });
        } else {
          result = await verifyOtp(newData);
        }

        if (result.data) {
          const newData = {
            paymentMode: selectedValue,
            totalAmount: +order?.state?.totalAmount || 0,
            currency: order?.currency,
            ...(selectedValue !== "CASH" &&
              selectedValue !== "CREDIT" && {
              partialPayment: {
                issueWithPartialPayment: order?.isPartialPayEligible,
                partialAmount: order?.partialAmount,
                currency: order?.currency,
              },
            }),
          };

          const result = await payOrder(order?.code, newData);

          if (result.data) {
            SuccessAlert(`Order payment successfully`);
            setOtp("");
            setPaymentOpen(false);
            setOtpModal(false);
            window?.location?.reload();
          }
        }
      } catch (error) {
        const errorMessage = handleApiErrors(error);
        setErrorMsg(errorMessage);
      } finally {
        setLoading({ verify: false });
      }
    }, 500);
  };

  const handlePaymentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading({ submit: true });
    setPaymentOpen(false);

    const newData = {
      paymentMode: selectedValue,
      totalAmount: +order?.state?.totalAmount || 0,
      currency: order?.currency,
      ...(selectedValue !== "CASH" &&
        selectedValue !== "CREDIT" && {
        partialPayment: {
          issueWithPartialPayment: order?.isPartialPayEligible,
          partialAmount: order?.partialAmount,
          currency: order?.currency,
        },
      }),
    };

    setTimeout(async () => {
      try {
        if (otpService.isEnabled) {
          setOtpMethodModal(true);
          setLoading({ submit: false });
          return;
        }

        const result = await payOrder(order?.code, newData);

        if (result.data) {
          SuccessAlert(`Order payment successfully`);
          window?.location?.reload();
        }

        setPaymentOpen(false);
        setLoading({ submit: false });
      } catch (error) {
        setPaymentOpen(false);
        setLoading({ submit: false });
        window.location.reload();
        const errorMessage = handleApiErrors(error);
        ErrorAlert(errorMessage);
      }
    }, 500);
  };

  const handleBookingCancel = async (id: any) => {
    const result = await approveAlert(
      "Are you sure you want to cancel the order ?"
    );

    if (result?.isConfirmed) {
      setIsLoading(true);
      try {
        const response: any = await updateOrder({ id, status: "Cancelled" });

        if (response?.data?.statusCode === 200) {
          SuccessAlert("Order cancelled successfully");
          window?.location?.reload();
        }
      } catch (error) {
        const errorMessage = handleApiErrors(error);
        ErrorAlert(errorMessage);
      }
    }
  };

  const handleDueSettleOpen = () => {
    setFormData({
      code: order.code,
      currency: order.currency,
      amount: (+order.state?.totalAmount || 0) - (+order.paidAmount || 0),
    });
    setIsDueSettle(true);
  };

  const handleDueSettleClose = () => {
    setFormData({});
    setIsDueSettle(false);
  };

  const handleChange = ({ target }: any) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleBookingDuePayment = async () => {
    setLoading({ submit: true });

    const newData = {
      currency: formData.currency,
      payAmount: +formData.amount || 0,
    };

    setTimeout(async () => {
      try {
        const response: any = await payOrderDue(formData.code, newData);

        if (response.data) {
          SuccessAlert(
            `Payment ${newData.currency} ${newData.payAmount} successful`
          );

          window.location.reload();
        }
        setFormData({});
        setIsDueSettle(false);
        setLoading({ submit: false });
      } catch (error) {
        setIsDueSettle(false);
        setLoading({ submit: false });
        const errorMessage = handleApiErrors(error);
        ErrorAlert(errorMessage);
      }
    }, 500);
  };

  if (loadingData) return <Loader />;

  return (
    <Box mb={5}>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={12} md={12}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              overflow: "hidden",
              padding: "10px 2px",
              background: "#01783B",
            }}
          >
            <Grid
              container
              spacing={1}
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid
                item
                display="flex"
                alignItems="center"
                sx={{
                  gap: 1,
                  overflow: "visible",
                  flexWrap: { xs: "wrap", sm: "nowrap" },
                }}
              >
                {order.status === "Pending Payment" ? (
                  <Box>
                    <button
                      className="order-details-btn"
                      onClick={handlePaymentOpen}
                    >
                      Initial Payment
                    </button>
                  </Box>
                ) : (
                  <Box>
                    <button
                      className="order-details-btn"
                      onClick={() => handleDueSettleOpen()}
                    >
                      Due Payment
                    </button>
                  </Box>
                )}
                {order.status === "Pending Payment" ? (
                  <Box>
                    <button
                      className="order-details-btn"
                      onClick={() => handleBookingCancel(order.id)}
                    >
                      Cancel
                    </button>
                  </Box>
                ) : null}
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <Box className="order-details-container">
        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <Box className="order-header">
              <Box className="order-title-wrapper">
                <Typography component="span" className="order-title">
                  Order ID - {order.code || "N/A"}
                </Typography>

                <Typography
                  component="span"
                  className={`order-status ${order.status
                    ?.toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/_/g, "-") || "default"
                    }`}
                >
                  {order.status}
                </Typography>
                <Typography
                  component="span"
                  className={`payment-status ${order.paymentStatus?.toLowerCase().replace(/_/g, "-") ||
                    "default"
                    }`}
                >
                  {order.paymentStatus
                    ?.toLowerCase()
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c: any) => c.toUpperCase())}
                </Typography>
                <Typography
                  component="span"
                  className={`product-link`}
                  onClick={() =>
                    window.open(`/product/${order.productCode}`, "_blank")
                  }
                >
                  Product Link
                </Typography>
              </Box>
            </Box>

            <Box className="details-meta" mt={2}>
              <Typography mb={1}>
                <span>Name:</span> {order.customerName}
              </Typography>
              <Typography mb={1}>
                <span>Contact No:</span> {order.customerPhone}
              </Typography>
              <Typography mb={1}>
                <span>Emg. Contact No:</span> {order.customerEmergencyPhone}
              </Typography>
              <Typography mb={1}>
                <span>Delivery Address:</span> {order.deliveryAddress}
              </Typography>
              <Typography mb={1}>
                <span>Delivery Method:</span> {order.deliveryMethod || "-"}
              </Typography>
              <Typography mb={1}>
                <span>Weight:</span>{" "}
                {order?.shipment?.userWeight
                  ? `${order?.shipment?.userWeight} Kg`
                  : "N/A"}
              </Typography>
              <Typography mb={1}>
                <span>Shipping Charge:</span>{" "}
                {order.shippingCost ? `৳ ${order.shippingCost}` : "N/A"}
              </Typography>
              <Typography mb={1}>
                <span>Other Charge:</span>{" "}
                {order.otherCharge ? `৳ ${order.otherCharge}` : "N/A"}
              </Typography>
              <Typography mb={1}>
                <span>Notes:</span> {order.customerNotes || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box>
              <Typography className="section-title">Product Details</Typography>

              <Card className="product-card">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={2}>
                    <Image
                      unoptimized
                      width={80}
                      height={80}
                      alt={order.productTitle}
                      style={{ borderRadius: "6px" }}
                      src={order.productImage || "/no-img.png"}
                    />
                  </Grid>

                  <Grid item xs={12} md={10}>
                    <Typography className="product-name">
                      {order.productTitle}
                    </Typography>

                    {order.orderItems?.map((item: any, index: number) => (
                      <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Box className="product-item-name">{item.itemName}</Box>
                        <Box textAlign="right">
                          <Typography className="product-price">
                            {item.quantity} x ৳ {item.price} = ৳{" "}
                            {(item.quantity * (+item.price || 0)).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Grid>
                </Grid>

                <Divider sx={{ my: 1 }} />

                <Box className="product-card-footer">
                  <Grid container>
                    <Grid item xs={12} md={2}></Grid>

                    <Grid item xs={6} md={5}>
                      <Typography className="footer-title">
                        Sub Total
                      </Typography>
                      <Typography className="footer-title">Discount</Typography>
                      <Typography className="footer-title">
                        CN Courier Charge
                      </Typography>
                      <Typography className="footer-title">
                        CN to BD Shipping Charge
                      </Typography>
                      <Typography className="footer-title">
                        BD Courier Charge
                      </Typography>
                      <Typography className="footer-title">
                        Other Charge
                      </Typography>
                      <Typography className="footer-title">
                        Grand Total
                      </Typography>
                      <Typography className="footer-title">
                        Paid Amount
                      </Typography>
                      {order.status === "Pending Payment" ? (
                        <Typography className="footer-title">
                          Pay Now
                        </Typography>
                      ) : null}
                    </Grid>
                    <Grid item xs={6} md={5} textAlign="right">
                      <Typography className="footer-price">
                        ৳ {(+order.state?.subTotal).toFixed(2)}
                      </Typography>
                      <Typography className="footer-price red">
                        ৳ {(+order.orderDiscount || 0).toFixed(2)}
                      </Typography>
                      <Typography className="footer-price">
                        ৳{" "}
                        {(
                          +order.shipment?.userForeignEquivalentAmount || 0
                        ).toFixed(2)}
                      </Typography>
                      <Typography className="footer-price">
                        ৳{" "}
                        {(
                          +order.shipment?.userForeignToLocalEquivalentAmount ||
                          0
                        ).toFixed(2)}
                      </Typography>
                      <Typography className="footer-price">
                        ৳ {(+order.shipment?.userLocalAmount || 0).toFixed(2)}
                      </Typography>
                      <Typography className="footer-price">
                        ৳ {(+order.otherCharge || 0).toFixed(2)}
                      </Typography>
                      <Typography className="footer-price">
                        ৳ {(+order.state?.totalAmount).toFixed(2)}
                      </Typography>
                      <Typography className="footer-price">
                        ৳ {(+order.paidAmount || 0).toFixed(2)}
                      </Typography>
                      {order.status === "Pending Payment" ? (
                        <Typography className="footer-price">
                          ৳ {(+order.partialAmount || 0).toFixed(2)} (
                          {order.state?.totalAmount
                            ? (
                              (+order.partialAmount /
                                +order.state.totalAmount) *
                              100
                            ).toFixed(0)
                            : 0}
                          %)
                        </Typography>
                      ) : null}
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 0.5 }} />

                  <Grid container>
                    <Grid item xs={12} md={2}></Grid>
                    <Grid item xs={6} md={5}>
                      <Typography className="footer-title">
                        Due Amount
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={5} textAlign="right">
                      <Typography className="footer-price red">
                        ৳{" "}
                        {(
                          (+order.state?.totalAmount || 0) -
                          (+order.paidAmount || 0)
                        ).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            {(order?.notes?.filter((note: any) => note.privacy === "Public") || []).length > 0 ?
              <Box className="tracking-card" mb={2}>
                <Typography className="section-title">Public Notes</Typography>
                <Box
                  sx={{
                    marginTop: "10px",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      height: "100%",
                      width: "2px",
                      borderLeft: "2px dashed #413755",
                      left: "15px",
                      top: "0px",
                    },
                  }}
                >
                  {(order?.notes?.filter((note: any) => note.privacy === "Public") || []).map((note: any) => (
                    <Box
                      key={note.id}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        marginBottom: "15px",
                        position: "relative",
                        paddingLeft: "30px",
                      }}
                    >
                      {/* Dot */}
                      <Box
                        sx={{
                          width: "12px",
                          height: "12px",
                          border: "2px solid #413755",
                          backgroundColor: "#FFF",
                          borderRadius: "50%",
                          position: "absolute",
                          left: "10px",
                          top: "5px",
                        }}
                      />

                      <Box>
                        <span
                          style={{
                            fontSize: "12px",
                            backgroundColor: "#413755",
                            color: "#FFF",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            display: "inline-block",
                            fontFamily: "Outfit",
                          }}
                        >
                          {note.badge}
                        </span>

                        <Typography
                          sx={{
                            mt: "6px",
                            fontSize: "12px",
                            color: "#413755",
                            fontFamily: "Outfit",
                          }}
                        >
                          {note.description}
                        </Typography>

                        {/* Date */}
                        <Typography
                          sx={{
                            mt: "4px",
                            fontSize: "11px",
                            color: "#777",
                            fontFamily: "Outfit",
                          }}
                        >
                          {moment(note.createdDateTime).format("DD-MMM-YY h:mm A")}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
              : null}

            <Box className="tracking-card">
              <Typography className="section-title">Tracking Log</Typography>
              <Box
                sx={{
                  marginTop: "10px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    height: "100%",
                    width: "2px",
                    borderLeft: "2px dashed #413755",
                    left: "15px",
                    top: "0px",
                  },
                }}
              >
                {order?.dataUpdateLog?.statusUpdate?.map((log: any) => {
                  const statusText =
                    log?.dataObject?.status ||
                    log?.dataObject?.paymentStatus ||
                    "Unknown";

                  const getStatusColor = (statusText: any) => {
                    switch (statusText) {
                      case "pending-payment":
                      case "partially-paid":
                        return "#FFC736";

                      case "purchasing":
                      case "order-initiated":
                      case "purchase-completed":
                        return "#87B0FF";

                      case "unpaid":
                      case "cancelled":
                      case "canceled":
                      case "processing for refund":
                      case "processing-for-refund":
                      case "refunded-order":
                        return "#FF6666";

                      case "refunded":
                      case "paid":
                      case "completed":
                      case "shipped-from-supplier":
                      case "received-in-china-warehouse":
                      case "on-the-way-to-china-airport":
                      case "received-in-china-airport":
                      case "on-the-way-to-bd-airport":
                      case "received-in-bd-airport":
                      case "on-the-way-to-bd-warehouse":
                      case "received-in-bd-warehouse":
                      case "processing-for-delivery":
                      case "on-the-way-to-delivery":
                        return "#01783B";

                      case "not-applicable":
                        return "#b4b4cd";

                      case "default":
                        return "#b4b4cd";

                      default:
                        return "#F44336";
                    }
                  };

                  return (
                    <Box
                      key={log.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "15px",
                        position: "relative",
                        paddingLeft: "30px",
                      }}
                    >
                      <Box
                        sx={{
                          width: "12px",
                          height: "12px",
                          border: "2px solid #413755",
                          backgroundColor: "#FFF",
                          borderRadius: "50%",
                          position: "absolute",
                          left: "10px",
                          top: "1px",
                        }}
                      ></Box>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            backgroundColor: getStatusColor(
                              statusText
                                ?.toLowerCase()
                                .replace(/\s+/g, "-")
                                .replace(/_/g, "-") || "default"
                            ),
                            color: "#FFFFFF",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            display: "inline-block",
                            maxWidth: "100%",
                            fontFamily: "Outfit",
                          }}
                        >
                          {statusText
                            ?.toLowerCase()
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (c: any) => c.toUpperCase())}
                        </Typography>
                        <Typography
                          sx={{
                            mt: "5px",
                            fontSize: "12px",
                            color: "#413755",
                            fontFamily: "Outfit",
                          }}
                        >
                          {moment(log.createdDateTime).format(
                            "DD-MMM-YY h:mm A"
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Modal open={isDueSettle} onClose={handleDueSettleClose}>
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "10px",
            }}
          >
            <h3 className="normal-header" style={{ margin: 0 }}>
              Settle Your Due
            </h3>

            <CloseIcon
              onClick={handleDueSettleClose}
              sx={{
                cursor: "pointer",
                color: "#FF5A7D",
                fontSize: "22px",
              }}
            />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <label className="form-label">
                <span className="form-required">*</span> Pay Amount
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

            <Grid item xs={12} sm={12}>
              <button
                disabled={loading.submit || !formData.amount}
                className="submit-button"
                onClick={handleBookingDuePayment}
              >
                {loading.submit && (
                  <CircularProgress size={15} className="loading-icon" />
                )}
                Submit
              </button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Modal
        open={paymentOpen}
        onClose={handlePaymentClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box>
            <Typography mb={1.5}>Payment your Order</Typography>

            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography className="cash-credit-balance">
                    Cash Balance{" "}
                    <span className="balance-highlight-color">
                      {" "}
                      {wallet?.walletCurrency}{" "}
                      {commaNumber(wallet?.cashBalance)}
                    </span>
                  </Typography>
                </Grid>

                {wallet?.creditBalance ? (
                  <Grid item xs={12} sm={6}>
                    <Typography className="cash-credit-balance">
                      Credit Balance{" "}
                      <span className="balance-highlight-color">
                        {wallet?.walletCurrency}{" "}
                        {commaNumber(wallet?.creditBalance)}
                      </span>
                    </Typography>
                  </Grid>
                ) : (
                  ""
                )}
              </Grid>
            </Box>

            <Box>
              <FormControl fullWidth>
                <RadioGroup
                  aria-labelledby="payment-options-group-label"
                  name="payment-options-group"
                  value={selectedValue}
                  onChange={handleRadioChange}
                >
                  <Box mt={1.5}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box className="custom-radio-group">
                          <FormControlLabel
                            value="CASH"
                            control={<Radio sx={{ padding: "3px" }} />}
                            label={
                              <span
                                style={{
                                  fontFamily: "Outfit",
                                  fontSize: "12px",
                                  color: "#2D233C",
                                }}
                              >
                                Cash payment
                              </span>
                            }
                            disabled={
                              (+wallet?.cashBalance || 0) <
                              (+order?.state?.totalAmount || 0) -
                              (+order?.paidAmount || 0)
                            }
                          />
                        </Box>

                        {(+wallet?.cashBalance || 0) <
                          (+order?.state?.totalAmount || 0) -
                          (+order?.paidAmount || 0) ? (
                          <Typography className="satement-time-title" mt={0.5}>
                            Your cash balance is insufficient to complete this
                            transaction.
                          </Typography>
                        ) : (
                          ""
                        )}
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography className="cash-credit-balance">
                          Pay{" "}
                          <span className="balance-highlight-color">
                            {order?.currency}{" "}
                            {commaNumber(
                              (+order?.state?.totalAmount || 0) -
                              (+order?.paidAmount || 0)
                            )}
                          </span>{" "}
                          By Cash
                        </Typography>
                      </Grid>

                      {wallet.isActiveCreditBalance ? (
                        <>
                          <Grid item xs={12} sm={6}>
                            <Box className="custom-radio-group">
                              <FormControlLabel
                                value="CREDIT"
                                control={<Radio sx={{ padding: "3px" }} />}
                                label={
                                  <span
                                    style={{
                                      fontFamily: "Outfit",
                                      fontSize: "12px",
                                      color: "#2D233C",
                                    }}
                                  >
                                    Credit payment
                                  </span>
                                }
                                disabled={
                                  (+wallet?.creditBalance || 0) <
                                  (+order?.state?.totalAmount || 0) -
                                  (+order?.paidAmount || 0)
                                }
                              />
                            </Box>

                            {(+wallet?.creditBalance || 0) <
                              (+order?.state?.totalAmount || 0) -
                              (+order?.paidAmount || 0) ? (
                              <Typography
                                className="satement-time-title"
                                mt={0.5}
                              >
                                Your credit balance is insufficient
                              </Typography>
                            ) : (
                              ""
                            )}
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography className="cash-credit-balance">
                              Pay{" "}
                              <span className="balance-highlight-color">
                                {order?.currency}{" "}
                                {commaNumber(
                                  (+order?.state?.totalAmount || 0) -
                                  (+order?.paidAmount || 0)
                                )}
                              </span>{" "}
                              By Credit
                            </Typography>
                          </Grid>
                        </>
                      ) : (
                        ""
                      )}

                      {order.status === "Pending Payment" &&
                        order?.isPartialPayEligible ? (
                        <>
                          <Grid item xs={12} sm={6}>
                            <Box className="custom-radio-group">
                              <FormControlLabel
                                value="PARTIALLY_PAY"
                                control={<Radio sx={{ padding: "3px" }} />}
                                label={
                                  <span
                                    style={{
                                      fontFamily: "Outfit",
                                      fontSize: "12px",
                                      color: "#2D233C",
                                    }}
                                  >
                                    Advance Payment{" "}
                                    <span>
                                      (
                                      {order.state?.totalAmount
                                        ? (
                                          (+order.partialAmount /
                                            +order.state.totalAmount) *
                                          100
                                        ).toFixed(0)
                                        : 0}
                                      %)
                                    </span>
                                  </span>
                                }
                                disabled={
                                  (+order?.partialAmount || 0) === 0 ||
                                  (+order?.partialAmount || 0) >
                                  (+wallet?.cashBalance || 0)
                                }
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography className="cash-credit-balance">
                              Pay{" "}
                              <span className="balance-highlight-color">
                                {order?.currency}{" "}
                                {commaNumber(order?.partialAmount)}
                              </span>{" "}
                              By Advance Amount
                            </Typography>
                          </Grid>
                        </>
                      ) : (
                        ""
                      )}
                    </Grid>
                  </Box>
                </RadioGroup>
              </FormControl>

              <Box mt={3}>
                {selectedValue === "" ? null : (
                  <Box>
                    {loading.submit ? (
                      <button className="payment-credit-btn-disabled">
                        Processing...
                      </button>
                    ) : (
                      <button
                        disabled={loading.submit}
                        className="view-all-btn"
                        onClick={(e) => handlePaymentSubmit(e)}
                      >
                        {loading.submit && (
                          <CircularProgress
                            size={15}
                            className="loading-icon"
                          />
                        )}
                        Submit
                      </button>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>

      <Dialog
        open={otpMethodModal}
        sx={{
          "& .MuiDialog-paper": {
            width: "450px",
            maxWidth: "450px",
            margin: "auto",
          },
        }}
      >
        <DialogTitle className="normal-header">Select OTP Method</DialogTitle>

        <DialogContent>
          <RadioGroup
            value={otpMethod}
            sx={{ marginBottom: 1 }}
            onChange={handleOtpMethodChange}
          >
            <FormControlLabel
              disabled={!user.isPhoneVerified}
              value="Sms"
              control={
                <Radio
                  sx={{
                    color: "#01783B",
                    "&.Mui-checked": {
                      color: "#01783B",
                    },
                    padding: "5px 10px",
                  }}
                />
              }
              label={
                <span className="normal-text">
                  Sms{" "}
                  {!user.isPhoneVerified ? (
                    <span className="alert-msg">Not Verified</span>
                  ) : (
                    ""
                  )}
                </span>
              }
            />
            <FormControlLabel
              disabled={!user.isEmailVerified}
              value="Email"
              control={
                <Radio
                  sx={{
                    color: "#01783B",
                    "&.Mui-checked": {
                      color: "#01783B",
                    },
                    padding: "5px 10px",
                  }}
                />
              }
              label={
                <span className="normal-text">
                  Email{" "}
                  {!user.isEmailVerified ? (
                    <span className="alert-msg">Not Verified</span>
                  ) : (
                    ""
                  )}
                </span>
              }
            />
            <FormControlLabel
              disabled={!user.isTwoFactorAuthenticationEnabled}
              value="Google"
              control={
                <Radio
                  sx={{
                    color: "#01783B",
                    "&.Mui-checked": {
                      color: "#01783B",
                    },
                    padding: "5px 10px",
                  }}
                />
              }
              label={
                <span className="normal-text">
                  Google Authenticator{" "}
                  {!user.isTwoFactorAuthenticationEnabled ? (
                    <span className="alert-msg">Not Verified</span>
                  ) : (
                    ""
                  )}
                </span>
              }
            />
          </RadioGroup>
        </DialogContent>

        <DialogActions sx={{ marginBottom: "10px", marginRight: "15px" }}>
          <button onClick={handleCancel} className="cancel-button">
            Cancel
          </button>

          <button
            onClick={handleSendOtp}
            className={`submit-button ${loading.resend ? "disabled" : ""}`}
            disabled={loading.resend || !otpMethod}
          >
            {loading.resend && (
              <CircularProgress size={15} className="loading-icon" />
            )}
            Send OTP
          </button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={otpModal}
        sx={{
          "& .MuiDialog-paper": {
            width: "450px",
            maxWidth: "450px",
            margin: "auto",
          },
        }}
      >
        <DialogTitle className="normal-header">
          Verify the OTP
          <br />
          <span className="normal-text">
            Sent to your {otpMethod}{" "}
            {otpMethod === "Email"
              ? user.email
              : otpMethod === "Sms"
                ? `${user.phoneCode} ${user.phoneNo}`
                : "Authenticator APP"}
          </span>
        </DialogTitle>

        <DialogContent>
          <Box>
            <CustomOtpInput
              value={otp || ""}
              onChange={handleOtpChange}
              placeholder="Enter OTP"
            />
          </Box>
          {<span className="error-msg">{errorMsg || ""}</span>}
        </DialogContent>

        <DialogActions sx={{ marginBottom: "10px", marginRight: "15px" }}>
          <button onClick={handleOtpCancel} className="cancel-button">
            Cancel
          </button>
          {otpMethod !== "Google" ? (
            <button
              disabled={isDisabled}
              onClick={handleSendOtp}
              className={`resend-otp-button ${isDisabled || loading.resend ? "disabled" : ""
                }`}
            >
              {loading.resend && (
                <CircularProgress size={15} className="resend-loading-icon" />
              )}
              {isDisabled ? `Resend in ${timer}s` : "Resend OTP"}
            </button>
          ) : null}

          <button
            onClick={handleVerifyOtp}
            className={`submit-button ${loading.verify || !otp ? "disabled" : ""
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

export default OrderDetails;
