"use client";

import React, { FormEvent, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Typography,
  Collapse,
  ThemeProvider,
  Pagination,
  GridLegacy as Grid,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Modal,
  FormControl,
  RadioGroup,
  Radio,
  Dialog,
  Checkbox,
} from "@mui/material";
import { ExpandMore, ExpandLess, Search } from "@mui/icons-material";
import { CustomPaginationSelect } from "@/components/custom/CustomPaginationSelect";
import { CustomSearchInput } from "@/components/custom/CustomSearchInput";
import { PaginationTheme } from "@/components/custom/PaginationTheme";
import moment from "moment";
import commaNumber from "comma-number";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Image from "next/image";
import Loader from "@/components/Loader";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import { InfoAlert } from "@/components/alerts/InfoAlert";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { CustomMenuItem } from "@/components/custom/CustomMenuItem";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import {
  getOrders,
  getOrderSearch,
  payOrder,
  payOrderDue,
  payOrders,
} from "@/features/order/order";
import { SuccessAlert } from "@/components/alerts/SuccessAlert";
import { verifyGoogleAuth } from "@/features/common/google-auth/service";
import {
  getOtpServiceByType,
  sendOtp,
  verifyOtp,
} from "@/features/common/otp-service/service";
import { CustomOtpInput } from "@/components/custom/CustomOtpInput";
import { CustomInput } from "@/components/custom/CustomInput";
import { getMeWallet } from "@/features/agent/apis/service";
import { getMe } from "@/features/user/service";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import PaymentFlow from "@/components/PaymentFlow";
import { useSearchParams } from "next/navigation";

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

const OrderList: React.FC = () => {
  const searchParams = useSearchParams();

  const [user, setUser] = useState<any>({});
  const [wallet, setWallet] = useState<any>({});

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("ALL");

  const [expanded, setExpanded] = useState(null);
  const [limit, setLimit] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [searchData, setSearchData] = useState([]);
  const [totalEntries, setTotalEntries] = useState(0);

  const [order, setOrder] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [isDueSettle, setIsDueSettle] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [multiplePaymentOpen, setMultiplePaymentOpen] = useState(false);

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120);
  const [errorMsg, setErrorMsg] = useState("");
  const [otpMethod, setOtpMethod] = useState("");
  const [otpModal, setOtpModal] = useState(false);
  const [loading, setLoading] = useState<any>({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [otpService, setOtpService] = useState<any>({});
  const [otpMethodModal, setOtpMethodModal] = useState(false);

  const [open, setOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<any[]>([]);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        const {
          data: { payload: wallet },
        } = await getMeWallet();

        setWallet(wallet?.wallet || {});

        const {
          data: { payload: user },
        } = await getMe();

        setUser(user);

        const {
          data: { payload: otpService },
        } = await getOtpServiceByType("Order Payment");

        setOtpService(otpService);

        const query = {
          page: pageNo,
          limit: limit,
          orderType: "Remote Sale",
          status: selectedTab,
        };

        const {
          data: { payload },
        } = await getOrders(query);

        setOrders(payload.data);
        setSearchData(payload.data);
        setPageCount(payload?.meta?.totalPages);
        setTotalEntries(payload?.meta?.totalRecords || 0);

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
  }, [limit, pageNo, selectedTab]);

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

  const handleOpen = (row: any) => {
    setOrder(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOrder({});
    setOpen(false);
  };

  const handlePaymentOpen = (row: any) => {
    setOrder(row);
    setPaymentOpen(true);
  };

  const handlePaymentClose = () => {
    setOrder({});
    setSelectedValue("");
    setPaymentOpen(false);
  };

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
          if (paymentOpen) {
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
          } else if (result.data && multiplePaymentOpen) {
            const payload = selectedOrders.map((order) => ({
              orderCode: order.code,
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
            }));

            const result = await payOrders(payload);

            if (result.data) {
              SuccessAlert(`Order payment successfully`);
              setOtp("");
              setMultiplePaymentOpen(false);
              setOtpModal(false);
              window?.location?.reload();
            }
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

  const handleMultiplePayments = async (e: FormEvent) => {
    if (selectedOrders.length === 0) return;

    e.preventDefault();
    setLoading({ submit: true });

    try {
      const payload = selectedOrders.map((order) => ({
        orderCode: order.code,
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
      }));

      // console.log({ orders: payload });

      if (otpService.isEnabled) {
        setOtpMethodModal(true);
        setLoading({ submit: false });
        return;
      }

      const result = await payOrders({ orders: payload });

      if (result.data) {
        SuccessAlert(`Orders payment successfully`);
        window?.location?.reload();
      }

      setMultiplePaymentOpen(false);
      setLoading({ submit: false });
    } catch (error) {
      setMultiplePaymentOpen(false);
      setLoading({ submit: false });
      // window.location.reload();
      const errorMessage = handleApiErrors(error);
      ErrorAlert(errorMessage);
    }
  };

  const handleDueSettleOpen = (row: any) => {
    setOrder(row);
    setFormData({
      code: row.code,
      currency: row.currency,
      amount: (+row?.state?.totalAmount || 0) - (+row.paidAmount || 0),
    });
    setIsDueSettle(true);
  };

  const handleDueSettleClose = () => {
    setOrder({});
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

  const handleQuickSearch = async (e: any) => {
    const searchInput = e.target.value.toLowerCase();

    if (searchInput.trim() === "") {
      setSearchData(orders);
      return;
    }

    try {
      const result = await getOrderSearch({
        searchInput,
        orderType: "Remote Sale",
      });
      setSearchData(result.data.payload || []);
    } catch (error) {
      const errorMessage = handleApiErrors(error);
      ErrorAlert(errorMessage);
    } finally {
      console.log("resulr");
    }
  };

  const handleExpandClick = (id: any) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const handlePageChange = (event: any, value: any) => {
    setPageNo(value);
  };

  const handlePage = (value: any) => {
    if (pageNo !== 1) setPageNo(1);
    setLimit(value);
  };

  const handleSelectOrder = (
    e: React.ChangeEvent<HTMLInputElement>,
    order: any
  ) => {
    if (e.target.checked) {
      setSelectedOrders((prev) => [...prev, order]);
    } else {
      setSelectedOrders((prev) => prev.filter((o) => o.id !== order.id));
    }
  };

  const totalPayableAmount = selectedOrders?.reduce((sum, order) => {
    const due = (+order?.state?.totalAmount || 0) - (+order?.paidAmount || 0);
    return sum + due;
  }, 0);

  const totalPartialAmount = selectedOrders?.reduce(
    (sum, order) => sum + (+order?.partialAmount || 0),
    0
  );

  const currency = selectedOrders[0]?.currency || "BDT";

  const isCashInsufficient = (+wallet?.cashBalance || 0) < totalPayableAmount;
  const isCreditInsufficient =
    (+wallet?.creditBalance || 0) < totalPayableAmount;
  const isPartialInsufficient =
    totalPartialAmount === 0 ||
    totalPartialAmount > (+wallet?.cashBalance || 0);

  if (isLoading) return <Loader />;

  return (
    <Box mb={5}>
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
          Order List
          <Typography className="form-subtitle">Manage your orders</Typography>
        </Typography>
      </Grid>

      <Box className="main-box" mb={5}>
        <Box mb={2}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: { xs: "flex-start", sm: "space-between" },
            }}
            mb={2}
          >
            <Box
              mb={0.5}
              sx={{
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Box>
                <Search
                  sx={{
                    top: "10px",
                    left: "5px",
                    zIndex: 999,
                    fontSize: 22,
                    position: "absolute",
                    color: "#413755",
                  }}
                  className="search-icon"
                />

                <CustomSearchInput
                  type="text"
                  placeholder="Quick Search"
                  onChange={handleQuickSearch}
                  className="custom-search-input"
                />
              </Box>
              <Box
                sx={{
                  gap: "10px",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "5px",
                }}
              >
                <Box
                  sx={{
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                  onClick={() => setSelectedOrders([])}
                >
                  <img src="/reset.svg" alt="reset" width={15} height={15} />
                </Box>

                <Box
                  sx={{
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <img src="/filter.svg" alt="filter" width={18} height={18} />
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>

              {selectedOrders.length > 0 && (
                <button
                  className="view-selected-btn"
                  onClick={() => setPaymentModalOpen(true)}
                >
                  Payment instant ({selectedOrders.length})
                </button>
              )}

              {selectedOrders.length > 0 && (
                <button
                  className="view-all-btn"
                  onClick={() => setBulkModalOpen(true)}
                >
                  Payment wallet ({selectedOrders.length})
                </button>
              )}
            </Box>
          </Box>

          <TableContainer className="table-container">
            <Table className="table">
              <TableHead>
                <TableRow>
                  <TableCell className="table-header-cell" />
                  <TableCell className="table-header-cell">Order ID</TableCell>
                  <TableCell className="table-header-cell">Date</TableCell>
                  <TableCell className="table-header-cell">Product</TableCell>
                  <TableCell className="table-header-cell">
                    Total Items
                  </TableCell>
                  <TableCell className="table-header-cell">
                    Total Amount
                  </TableCell>
                  <TableCell className="table-header-cell">
                    Advance Amount
                  </TableCell>
                  <TableCell className="table-header-cell">
                    Paid Amount
                  </TableCell>
                  <TableCell className="table-header-cell">
                    Due Amount
                  </TableCell>
                  <TableCell className="table-header-cell">
                    Order Status
                  </TableCell>
                  <TableCell className="table-header-cell">
                    Payment Status
                  </TableCell>
                  <TableCell className="table-header-cell">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(searchData || []).map((row: any) => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      className={
                        expanded === row.id ? "expand-row" : "collapsed-row"
                      }
                    >
                      <TableCell
                        className="table-body-cell"
                        style={{ textAlign: "left" }}
                      >
                        <IconButton
                          size="small"
                          className="collapsed-icon-button"
                          onClick={() => handleExpandClick(row.id)}
                        >
                          {expanded === row.id ? (
                            <ExpandLess fontSize="small" />
                          ) : (
                            <ExpandMore fontSize="small" />
                          )}
                        </IconButton>
                        {(row.paymentStatus === "UNPAID" && row.status !== "Cancelled") ? (
                          <Checkbox
                            disableRipple
                            onChange={(e) => handleSelectOrder(e, row)}
                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                            checked={selectedOrders.some(
                              (o) => o.id === row.id
                            )}
                            sx={{
                              color: "#D9D5EC",
                              "&.Mui-checked": {
                                color: "#01783B",
                              },
                            }}
                          />
                        ) : null}
                      </TableCell>

                      <TableCell className="table-body-cell">
                        <Link
                          href={`/order-details/${row.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                          }}
                        >
                          <Box
                            sx={{
                              textAlign: "center",
                              cursor: "pointer",
                            }}
                          >
                            <Typography className="order-id">
                              {row.code}
                            </Typography>
                          </Box>
                        </Link>
                      </TableCell>

                      <TableCell className="table-body-cell">
                        {moment(row.orderDate).format("DD-MMM-YYYY")}
                      </TableCell>
                      <TableCell className="table-body-cell">
                        <div
                          style={{ cursor: "pointer", display: "inline-block" }}
                          onClick={() => handleOpen(row)}
                        >
                          <Image
                            alt="Product"
                            unoptimized
                            width={40}
                            height={40}
                            src={row.productImage}
                          />
                        </div>

                        <Modal
                          open={open}
                          onClose={handleClose}
                          closeAfterTransition
                          BackdropProps={{
                            style: { backgroundColor: "rgba(0,0,0,0.6)" }, // semi-transparent
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              outline: "none",
                            }}
                          >
                            <Image
                              alt="Product Preview"
                              unoptimized
                              width={350}
                              height={350}
                              style={{ borderRadius: "8px" }}
                              src={order.productImage}
                            />
                          </Box>
                        </Modal>
                      </TableCell>

                      <TableCell className="table-body-cell">
                        {+row.state?.totalItem || 0}
                      </TableCell>

                      <TableCell className="table-body-cell">
                        {commaNumber((+row.state?.totalAmount || 0).toFixed(2))}
                      </TableCell>

                      <TableCell className="table-body-cell">
                        {`${commaNumber((+row.partialAmount || 0).toFixed(2))}  
                                      (${row.state?.totalAmount
                            ? (
                              ((+row.partialAmount || 0) /
                                (+row.state.totalAmount || 0)) *
                              100
                            ).toFixed(0)
                            : 0
                          }%)`}
                      </TableCell>

                      <TableCell className="table-body-cell">
                        {commaNumber((+row.paidAmount || 0).toFixed(2))}
                      </TableCell>

                      <TableCell className="table-body-cell">
                        {commaNumber(
                          (
                            (+row.state?.totalAmount || 0) -
                            (+row.paidAmount || 0)
                          ).toFixed(2)
                        )}
                      </TableCell>

                      <TableCell className="table-body-cell">
                        <Link
                          href={`/order-details/${row.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                          }}
                        >
                          <Typography
                            className={`order-status-label ${row.status
                              ?.toLowerCase()
                              .replace(/\s+/g, "-")
                              .replace(/_/g, "-") || "default"
                              }`}
                          >
                            {row.status}
                          </Typography>
                        </Link>
                      </TableCell>

                      <TableCell className="table-body-cell">
                        <Typography
                          className={`payment-status-label ${row.paymentStatus
                            ?.toLowerCase()
                            .replace(/_/g, "-") || "default"
                            }`}
                        >
                          {row.paymentStatus
                            ?.toLowerCase()
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (c: any) => c.toUpperCase())}
                        </Typography>
                      </TableCell>

                      <TableCell className="table-body-cell">
                        {row.status !== "Cancelled" ? (
                          <>
                            {row.status === "Pending Payment" ? (
                              <Box>
                                <button
                                  className="order-initiate-btn"
                                  onClick={() => handlePaymentOpen(row)}
                                >
                                  Initial Payment
                                </button>
                              </Box>
                            ) : row.paymentStatus !== "PAID" ? (
                              <Box>
                                <button
                                  className="order-due-btn"
                                  onClick={() => handleDueSettleOpen(row)}
                                >
                                  Due Payment
                                </button>
                              </Box>
                            ) : null}
                          </>
                        ) : null}
                      </TableCell>
                    </TableRow>

                    {/* Expandable Row */}
                    <TableRow className="expand-row">
                      <TableCell colSpan={12} className="expand-cell">
                        <Collapse
                          in={expanded === row.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box className="expand-content">
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <Box className="expend-box">
                                  <Typography className="customer-name">
                                    <span className="customer-name-label">
                                      Customer Name{" "}
                                    </span>
                                    {row.customerName}
                                  </Typography>

                                  <Typography className="customer-name">
                                    <span className="customer-name-label">
                                      Customer Phone{" "}
                                    </span>
                                    {row.customerPhone}
                                  </Typography>
                                </Box>
                              </Grid>

                              <Grid item xs={12} md={6}>
                                <Box
                                  className="expend-box"
                                  sx={{ justifyContent: "flex-end" }}
                                >
                                  <Typography className="created-updated-by">
                                    Created By:
                                    {row.createdByUser ? (
                                      <span className="highlighted">
                                        {" "}
                                        {
                                          row.createdByUser
                                            .identificationShortCode
                                        }
                                      </span>
                                    ) : (
                                      <span className="highlighted">N/A</span>
                                    )}
                                  </Typography>

                                  <Typography className="payment-type">
                                    <FiberManualRecordIcon className="payment-type-icon" />

                                    {row.paymentType || "N/A"}
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {searchData.length ? (
            <Box
              sx={{
                mt: 2,
                gap: 2,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  gap: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: "13px",
                    color: "#6E6E8C",
                    fontFamily: "Public Sans",
                  }}
                >
                  {`Showing ${(pageNo - 1) * limit + 1} to ${Math.min(
                    pageNo * limit,
                    totalEntries
                  )} of ${totalEntries} entries`}
                </Typography>

                <CustomPaginationSelect
                  value={limit}
                  sx={{
                    backgroundColor: "#FFFFFF",
                    height: "25px",
                    border: "none",
                    color: "#B4B4CD",
                  }}
                  onChange={(e) => handlePage(e.target.value)}
                >
                  <CustomMenuItem value={10}>10</CustomMenuItem>
                  <CustomMenuItem value={20}>20</CustomMenuItem>
                  <CustomMenuItem value={50}>50</CustomMenuItem>
                  <CustomMenuItem value={100}>100</CustomMenuItem>
                  <CustomMenuItem value={200}>200</CustomMenuItem>
                </CustomPaginationSelect>
              </Box>

              {/* Pagination */}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <ThemeProvider theme={PaginationTheme}>
                  <Pagination
                    page={pageNo}
                    count={pageCount}
                    onChange={handlePageChange}
                  />
                </ThemeProvider>
              </Box>
            </Box>
          ) : null}
        </Box>
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
            <Typography
              mb={1.5}
              style={{ fontFamily: "Outfit", color: "#000" }}
            >
              Payment your Order
            </Typography>

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
                                          ((+order.partialAmount || 0) /
                                            (+order.state.totalAmount || 0)) *
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
                                {commaNumber(+order?.partialAmount || 0)}
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
                      <button className="view-all-btn disabled">
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

      <Modal open={bulkModalOpen} onClose={() => setBulkModalOpen(false)}>
        <Box sx={style}>
          <Typography
            mb={3}
            variant="h6"
            sx={{ fontWeight: 600, color: "#333" }}
          >
            Selected Orders Summary
          </Typography>

          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}
          >
            <Typography
              sx={{ fontWeight: 500, fontFamily: "Outfit", color: "#555" }}
            >
              Total Amount
            </Typography>
            <Typography
              sx={{ fontWeight: 600, fontFamily: "Outfit", color: "#000" }}
            >
              {commaNumber(
                selectedOrders
                  .reduce((acc, o) => acc + (+o.state?.totalAmount || 0), 0)
                  .toFixed(2)
              )}
            </Typography>
          </Box>

          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}
          >
            <Typography
              sx={{ fontWeight: 500, fontFamily: "Outfit", color: "#555" }}
            >
              Total Advance Amount
            </Typography>
            <Typography
              sx={{ fontWeight: 600, fontFamily: "Outfit", color: "#000" }}
            >
              {(() => {
                const totalAmount = Math.round(selectedOrders.reduce(
                  (acc, o) => acc + (+o.state?.totalAmount || 0),
                  0
                ));

                const totalAdvance = Math.round(
                  selectedOrders.reduce(
                    (acc, o) => acc + (+o.partialAmount || 0),
                    0
                  )
                );

                const percentage = totalAmount
                  ? Math.round((totalAdvance / totalAmount) * 100)
                  : 0;


                return `${commaNumber(
                  totalAdvance.toFixed(2)
                )} (${percentage}%)`;
              })()}
            </Typography>
          </Box>

          <Box mt={3} display="flex" justifyContent="flex-end">
            <button
              className="cancel-button"
              onClick={() => {
                setSelectedOrders([]);
                setBulkModalOpen(false);
              }}
            >
              Close
            </button>

            <button
              className="order-initiate-btn"
              onClick={() => {
                setBulkModalOpen(false);
                setMultiplePaymentOpen(true);
              }}
            >
              Payment
            </button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={multiplePaymentOpen}
        onClose={() => {
          setSelectedValue("");
          setMultiplePaymentOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography style={{ fontFamily: "Outfit", color: "#000" }} mb={1}>
            Pay Your Selected Orders
          </Typography>

          <Grid container spacing={2} mb={1}>
            <Grid item xs={12} sm={6}>
              <Typography className="cash-credit-balance">
                Cash Balance{" "}
                <span className="balance-highlight-color">
                  {wallet?.walletCurrency} {commaNumber(wallet?.cashBalance)}
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
            ) : null}
          </Grid>

          <FormControl fullWidth>
            <RadioGroup value={selectedValue} onChange={handleRadioChange}>
              <Box>
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
                        disabled={isCashInsufficient}
                      />
                    </Box>

                    {isCashInsufficient && (
                      <Typography className="satement-time-title" mt={0.5}>
                        Your cash balance is insufficient to complete these
                        orders.
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography className="cash-credit-balance">
                      Pay{" "}
                      <span className="balance-highlight-color">
                        {currency} {commaNumber(totalPayableAmount)}
                      </span>{" "}
                      By Cash
                    </Typography>
                  </Grid>

                  {wallet.isActiveCreditBalance && (
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
                            disabled={isCreditInsufficient}
                          />
                        </Box>

                        {isCreditInsufficient && (
                          <Typography className="satement-time-title" mt={0.5}>
                            Your credit balance is insufficient.
                          </Typography>
                        )}
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography className="cash-credit-balance">
                          Pay{" "}
                          <span className="balance-highlight-color">
                            {currency} {commaNumber(totalPayableAmount)}
                          </span>{" "}
                          By Credit
                        </Typography>
                      </Grid>
                    </>
                  )}

                  {selectedOrders.every(
                    (o) =>
                      o.status === "Pending Payment" && o.isPartialPayEligible
                  ) && (
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
                                    {totalPayableAmount > 0
                                      ? (
                                        ((+totalPartialAmount || 0) /
                                          (+totalPayableAmount || 0)) *
                                        100
                                      ).toFixed(0)
                                      : 0}
                                    %)
                                  </span>
                                </span>
                              }
                              disabled={isPartialInsufficient}
                            />
                          </Box>

                          {isPartialInsufficient && (
                            <Typography className="satement-time-title" mt={0.5}>
                              Your cash balance is insufficient for advance
                              payment.
                            </Typography>
                          )}
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Typography className="cash-credit-balance">
                            Pay{" "}
                            <span className="balance-highlight-color">
                              {currency} {commaNumber(totalPartialAmount)}
                            </span>{" "}
                            By Advance Amount
                          </Typography>
                        </Grid>
                      </>
                    )}
                </Grid>
              </Box>
            </RadioGroup>
          </FormControl>

          <Box mt={2}>
            <Typography style={{ fontFamily: "Outfit", color: "#000" }} mb={1}>
              Order Summary
            </Typography>

            {selectedOrders.map((order, index) => {
              const due =
                (+order?.state?.totalAmount || 0) - (+order?.paidAmount || 0);
              return (
                <Box key={index} className="order-summary-box" mb={1}>
                  {(selectedValue === "CASH" || selectedValue === "CREDIT") && (
                    <Typography className="cash-credit-balance">
                      {order.code}—
                      <span className="balance-highlight-color">
                        {order.currency} {commaNumber(due)}
                      </span>
                    </Typography>
                  )}

                  {selectedValue === "PARTIALLY_PAY" && (
                    <Typography className="cash-credit-balance" mt={0.5}>
                      {order.code}—
                      <span className="balance-highlight-color">
                        {order.currency} {commaNumber(order.partialAmount)}
                      </span>
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>

          <Box mt={2}>
            {selectedValue && (
              <button
                disabled={loading.submit}
                className={
                  loading.submit ? "view-all-btn disabled" : "view-all-btn"
                }
                onClick={handleMultiplePayments}
              >
                {loading.submit && (
                  <CircularProgress size={15} className="loading-icon" />
                )}
                Submit
              </button>
            )}
          </Box>
        </Box>
      </Modal>

      <PaymentFlow
        paymentModalOpen={paymentModalOpen}
        setPaymentModalOpen={setPaymentModalOpen}
        orderIds={selectedOrders.map(item => item.id)}
        payNow={Math.round(
          selectedOrders.reduce(
            (acc, o) => acc + (+o.partialAmount || 0),
            0
          )
        )}
        searchParams={searchParams}
        isOrder={true}
      />

    </Box>
  );
};

export default OrderList;
