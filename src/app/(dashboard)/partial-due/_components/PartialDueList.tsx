"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  ThemeProvider,
  Stack,
  Pagination,
  GridLegacy as Grid,
  Modal,
  CircularProgress,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { CustomPaginationSelect } from "@/components/custom/CustomPaginationSelect";
import { CustomSearchInput } from "@/components/custom/CustomSearchInput";
import { PaginationTheme } from "@/components/custom/PaginationTheme";

import moment from "moment";
import Loader from "@/components/Loader";
import { InfoAlert } from "@/components/alerts/InfoAlert";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { CustomMenuItem } from "@/components/custom/CustomMenuItem";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import { CustomInput } from "@/components/custom/CustomInput";
import { getOrders, payOrderDue } from "@/features/order/order";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import { SuccessAlert } from "@/components/alerts/SuccessAlert";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "75%", md: 500 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { xs: 2, md: 2.5 },
  outline: "none",
};
interface PartialDueListProps {
  tab: string;
}

const PartialDueList: React.FC<PartialDueListProps> = ({ tab }) => {
  const router = useRouter();

  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState<any>({});

  const [isDueSettle, setIsDueSettle] = useState(false);
  const [orders, setOrders] = useState<any>([]);

  const [limit, setLimit] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [searchData, setSearchData] = useState<any>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading({ data: true });

        const query: any = {
          page: pageNo,
          limit: limit,
          paymentType: "partial",
        };

        if (tab === "Today") query.isTodayPartial = true;
        if (tab === "Tomorrow") query.isTomorrowPartial = true;
        if (tab === "Expire") query.isPartialExpired = true;
        if (tab === "Paid") query.paymentStatus = "PAID";
        if (tab === "Unpaid") query.paymentStatus = "PARTIALLY_PAID";
        if (tab === "Refund") query.paymentStatus = "REFUNDED";

        const {
          data: { payload },
        } = await getOrders(query);

        setSearchData(payload.data);
        setOrders(payload.data);
        setPageCount(payload?.meta?.totalPages);
        setTotalEntries(payload?.meta?.totalRecords || 0);
        setLoading({ data: false });
      } catch (error: any) {
        setLoading({ data: false });
        if (error.statusCode == "403") {
          InfoAlert(
            "You do not have permission to access this resource. Please contact the administrator for assistance."
          );
        } else {
          ErrorAlert(error.message);
        }
      }
    })();
  }, [limit, pageNo, tab]);

  const handleDueSettleOpen = (order: any) => {
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

          const currentOrders = [...orders];
          const index = currentOrders.findIndex(
            (booking) => booking.code === formData.code
          );

          if (index !== -1) {
            currentOrders[index] = {
              ...currentOrders[index],
              paidAmount:
                response?.data?.payload?.paidAmount ??
                currentOrders[index].paidAmount,
              paymentStatus:
                response?.data?.payload?.paymentStatus ??
                currentOrders[index].paymentStatus,
              partialAmountDueDate:
                response?.data?.payload?.partialAmountDueDate ??
                currentOrders[index].partialAmountDueDate,
            };

            setSearchData(currentOrders);
            setOrders(currentOrders);
          }
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

  const handleQuickSearch = (e: any) => {
    const searchInput = e.target.value.toLowerCase();

    const filteredData = orders.filter((item: any) =>
      Object.values(item).join("").toLowerCase().includes(searchInput)
    );

    setSearchData(filteredData.length ? filteredData : orders);
  };

  const handlePageChange = (event: any, value: any) => {
    setPageNo(value);
  };

  const handlePage = (value: any) => {
    if (pageNo !== 1) setPageNo(1);
    setLimit(value);
  };

  if (loading.data) return <Loader />;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { sm: "row" },
          justifyContent: { sm: "space-between" },
        }}
        mb={2}
      >
        <Box sx={{ position: "relative" }}>
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
            marginLeft: "5px",
            alignItems: "center",
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

      <TableContainer className="table-container">
        <Table className="table">
          <TableHead>
            <TableRow>
              <TableCell className="table-header-cell">Order ID</TableCell>
              <TableCell className="table-header-cell">Date</TableCell>
              <TableCell className="table-header-cell">Customer Name</TableCell>
              <TableCell className="table-header-cell">
                Invoice Amount
              </TableCell>
              <TableCell className="table-header-cell">Paid Amount</TableCell>
              <TableCell className="table-header-cell">Due Amount</TableCell>
              <TableCell className="table-header-cell">Due Date</TableCell>
              <TableCell className="table-header-cell">Status</TableCell>
              <TableCell className="table-header-cell">Action</TableCell>
              <TableCell className="table-header-cell">Settled On</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(searchData || []).map((order: any) => (
              <TableRow key={order.id} className="collapsed-row">
                <TableCell className="table-body-cell">
                  <span
                    style={{
                      color: "#01783B",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                    onClick={() => router.push(`/order-details/${order.id}`)}
                  >
                    {order.code}
                  </span>
                </TableCell>
                <TableCell className="table-body-cell">
                  {moment(order.date).format("DD-MMM-YYYY")}
                </TableCell>
                <TableCell className="table-body-cell">
                  {order.customerName}
                </TableCell>
                <TableCell className="table-body-cell">
                  {(+order.state.totalAmount || 0).toFixed(0)}
                </TableCell>
                <TableCell className="table-body-cell">
                  {(+order.paidAmount || 0).toFixed(0)}
                </TableCell>
                <TableCell className="table-body-cell ">
                  {(
                    +(+order.state.totalAmount || 0) - (+order.paidAmount || 0)
                  ).toFixed(0)}
                </TableCell>
                <TableCell className="table-body-cell">
                  {order.paymentStatus === "PAID" ||
                  order.paymentStatus === "REFUNDED" ? (
                    <span style={{ color: "#B4B4CD" }}>N/A</span>
                  ) : (
                    moment(order.partialAmountDueDate).format("DD-MMM-YYYY")
                  )}
                </TableCell>
                <TableCell className="table-body-cell">
                  <span
                    style={{
                      color: `${
                        order.paymentStatus === "PAID"
                          ? "#01783B"
                          : order.paymentStatus === "REFUNDED"
                          ? "#87B0FF"
                          : "#D32F2F"
                      }`,
                      fontSize: "12px",
                      textAlign: "center",
                    }}
                  >
                    {order.paymentStatus === "PAID"
                      ? "Paid"
                      : order.paymentStatus === "REFUNDED"
                      ? "Refund"
                      : "Unpaid"}
                  </span>
                </TableCell>
                <TableCell className="table-body-cell">
                  {order.paymentStatus === "PAID" ||
                  order.paymentStatus === "REFUNDED" ? (
                    <span style={{ color: "#B4B4CD" }}>N/A</span>
                  ) : (
                    <button
                      style={{
                        background: "#D32F2F",
                        color: "#fff",
                        fontSize: "12px",
                        textTransform: "none",
                        padding: "5px 10px",
                        borderRadius: "2px",
                        fontFamily: "Outfit",
                        border: "none",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => handleDueSettleOpen(order)}
                    >
                      Settle Now
                    </button>
                  )}
                </TableCell>
                <TableCell className="table-body-cell">
                  {order.paymentStatus !== "PAID" ||
                  order.paymentStatus === "REFUNDED" ? (
                    <span style={{ color: "#B4B4CD" }}>N/A</span>
                  ) : (
                    moment(order.partialAmountDueDate).format("DD-MMM-YYYY")
                  )}
                </TableCell>
              </TableRow>
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
                fontFamily: "Outfit",
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
    </Box>
  );
};

export default PartialDueList;
