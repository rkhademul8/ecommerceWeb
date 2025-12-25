"use client";

import React, { useEffect, useState } from "react";
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
  ThemeProvider,
  Stack,
  Pagination,
  Tooltip,
  GridLegacy as Grid,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { CustomPaginationSelect } from "@/components/custom/CustomPaginationSelect";
import { CustomSearchInput } from "@/components/custom/CustomSearchInput";
import { PaginationTheme } from "@/components/custom/PaginationTheme";
import {
  getUserAccountLedgers,
  getUserLedgerSummary,
} from "@/features/agent/account-ledger/apis/service";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import moment from "moment";
import { getMeWallet } from "@/features/agent/apis/service";
import "../../../../scss/table-ledger/table.scss";
import { serviceTypes } from "@/utils/common/array/service-types";
import Loader from "@/components/Loader";
import { InfoAlert } from "@/components/alerts/InfoAlert";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { formatCsvData } from "@/utils/csv/format-csv-data";
import { CustomMenuItem } from "@/components/custom/CustomMenuItem";
import { useRouter } from "next/navigation";

const getCsvHeaders = (wallet: any) => {
  const headers = [
    { label: "Date", key: "createdDateTime" },
    { label: "Reference ID", key: "referenceId" },
    { label: "Type", key: "transactionType" },
    { label: "Service", key: "service" },
    { label: "Narration", key: "narration" },
    { label: "Debit [DR]", key: "debit" },
    { label: "Credit [CR]", key: "credit" },
    { label: "Cash Balance", key: "currentBalance" },
    { label: "Remarks", key: "remarks" },
  ];

  if (wallet?.isActiveCreditBalance) {
    headers.push(
      { label: "Credit Limit", key: "creditBalance" },
      { label: "Credit Used", key: "creditUsed" },
      { label: "Credit Due", key: "creditDueAmount" }
    );
  }

  return headers;
};

const AccountLedgerList: React.FC = () => {
  const router = useRouter();

  const [wallet, setWallet] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState<any>({});

  const [accountLedger, setAccountLedger] = useState([]);
  const [ledgerSummary, setLedgerSummary] = useState<any>({});
  const [isCreditSettle, setIsCreditSettle] = useState(false);
  // const [partialDueSummary, setPartialDueSummary] = useState<any>({});

  const [limit, setLimit] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [searchData, setSearchData] = useState([]);
  const [totalEntries, setTotalEntries] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        setLoading({ data: true });
        const query = {
          page: pageNo,
          limit: limit,
        };
        const {
          data: { payload: agentWallet },
        } = await getMeWallet();
        setWallet(agentWallet.wallet);

        const {
          data: { payload: ledgerSummary },
        } = await getUserLedgerSummary();
        setLedgerSummary(ledgerSummary);

        // const {
        //   data: { payload: partialDueSummary },
        // } = await getPartialDueSummary();

        const {
          data: { payload },
        } = await getUserAccountLedgers(query);

        setSearchData(payload.data);
        setAccountLedger(payload.data);
        setPageCount(payload?.meta?.totalPages);
        // setPartialDueSummary(partialDueSummary);
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
  }, [limit, pageNo]);

  const handleQuickSearch = (e: any) => {
    const searchInput = e.target.value.toLowerCase();

    const filteredData = accountLedger.filter((item) =>
      Object.values(item).join("").toLowerCase().includes(searchInput)
    );

    setSearchData(filteredData.length ? filteredData : accountLedger);
  };

  const getServiceColor = (service: any) => {
    const serviceType = serviceTypes.find((s) => s.name === service);
    return serviceType ? serviceType.color : "#00B6FF";
  };

  const handlePageChange = (event: any, value: any) => {
    setPageNo(value);
  };

  const handlePage = (value: any) => {
    if (pageNo !== 1) setPageNo(1);
    setLimit(value);
  };

  const formatServiceText = (text: any) => {
    return text
      ? text
          .toLowerCase()
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char: any) => char.toUpperCase())
      : "";
  };

  const handleCreditClose = () => {
    setFormData({});
    setIsCreditSettle(false);
  };

  const handleChange = ({ target }: any) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  const csvHeaders = getCsvHeaders(wallet);
  const formattedLedger = formatCsvData(accountLedger, csvHeaders);

  if (loading.data) return <Loader />;

  return (
    <Box>
      <Box
        mb={4}
        display="flex"
        justifyContent="space-between"
      >
        <Typography className="form-title">
          Ledger Report
          <Typography className="form-subtitle">Manage your ledgers</Typography>
        </Typography>
      </Box>

      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <Box
              sx={{
                borderRadius: "2px",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "10px",
                      padding: "15px",
                      position: "relative",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#6E6996",
                        fontSize: "12px",
                        fontFamily: "Outfit",
                      }}
                    >
                      Cash Balance
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "20px",
                        color: "#292F36",
                        fontFamily: "Outfit",
                      }}
                    >
                      {wallet.walletCurrency || "BDT"}{" "}
                      {(+wallet.cashBalance || 0).toFixed(0)}
                    </Typography>

                    <Box display="flex" flexDirection="column" gap={2} mt={1}>
                      <Box display="flex" gap={4} alignItems="center">
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="flex-start"
                        >
                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontFamily: "Outfit",
                              color: "#6E6996",
                              minWidth: "80px",
                            }}
                          >
                            Total Credit
                          </Typography>
                          <span
                            style={{
                              fontSize: "12px",
                              fontFamily: "Outfit",
                              color: "#292F36",
                              fontWeight: 700,
                            }}
                          >
                            {wallet.walletCurrency || "BDT"}{" "}
                            {ledgerSummary.totalCredit}
                          </span>
                        </Box>

                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="flex-start"
                        >
                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontFamily: "Outfit",
                              color: "#6E6996",
                              minWidth: "80px",
                            }}
                          >
                            Total Debit
                          </Typography>
                          <span
                            style={{
                              fontSize: "12px",
                              fontFamily: "Outfit",
                              color: "#292F36",
                              fontWeight: 700,
                            }}
                          >
                            {wallet.walletCurrency || "BDT"}{" "}
                            {ledgerSummary.totalDebit}
                          </span>
                        </Box>
                      </Box>

                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-start"
                      >
                        {/* <Typography
                          sx={{
                            fontSize: "12px",
                            fontFamily: "Outfit",
                            color: "#6E6996",
                            minWidth: "80px",
                          }}
                        >
                          Partial Due
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#FF5A7D",
                            fontFamily: "Outfit",
                          }}
                        >
                          {partialDueSummary.currency || "BDT"}{" "}
                          {partialDueSummary.totalPartialDue || 0}
                        </Typography> */}
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                      <button
                        className="secondary-button white long"
                        onClick={() => router.push("/deposit-requests/create")}
                      >
                        Deposit Request
                      </button>

                      <button
                        className="add-button long"
                        onClick={() => router.push("/partial-due")}
                      >
                        Settle Partial Due
                      </button>
                    </Box>
                  </Box>
                </Grid>

                {wallet.isActiveCreditBalance ? (
                <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "10px",
                        padding: "15px",
                        position: "relative",
                      }}
                    >
                      <Typography
                        style={{
                          color: "#6E6996",
                          fontSize: "12px",
                          fontFamily: "Outfit",
                        }}
                      >
                        Credit Due
                      </Typography>

                      <Typography
                        sx={{
                          color: "#FF5A7D",
                          fontSize: "20px",
                          fontWeight: 600,
                          fontFamily: "Outfit",
                        }}
                      >
                        {wallet.walletCurrency || "BDT"}{" "}
                        {(+wallet.creditDueAmount || 0).toFixed(0)}
                      </Typography>

                      <Box display="flex" flexDirection="column" gap={2} mt={1}>
                        <Box display="flex" gap={4} alignItems="center">
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="flex-start"
                          >
                            <Typography
                              sx={{
                                fontSize: "12px",
                                fontFamily: "Outfit",
                                color: "#6E6996",
                                minWidth: "80px",
                              }}
                            >
                              Credit Balance
                            </Typography>
                            <span
                              style={{
                                fontSize: "12px",
                                fontFamily: "Outfit",
                                color: "#292F36",
                                fontWeight: 700,
                              }}
                            >
                              {wallet.walletCurrency || "BDT"}{" "}
                              {(+wallet.creditBalance || 0).toFixed(0)}
                            </span>
                          </Box>

                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="flex-start"
                          >
                            <Typography
                              sx={{
                                fontSize: "12px",
                                fontFamily: "Outfit",
                                color: "#6E6996",
                                minWidth: "80px",
                              }}
                            >
                              Credit Issued
                            </Typography>
                            <span
                              style={{
                                fontSize: "12px",
                                fontFamily: "Outfit",
                                color: "#292F36",
                                fontWeight: 700,
                              }}
                            >
                              {wallet.walletCurrency || "BDT"}{" "}
                              {ledgerSummary.totalCreditIssued}
                            </span>
                          </Box>
                        </Box>

                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="flex-start"
                        >
                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontFamily: "Outfit",
                              color: "#6E6996",
                              minWidth: "80px",
                            }}
                          >
                            Credit Used
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontFamily: "Outfit",
                              color: "#292F36",
                              fontWeight: 700,
                            }}
                          >
                            {wallet.walletCurrency || "BDT"}{" "}
                            {ledgerSummary.totalCreditUsed}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                        <button
                          className={`secondary-button white long ${
                            !(+wallet.creditDueAmount || 0) ? "disable" : ""
                          }`}
                          disabled={!(+wallet.creditDueAmount || 0)}
                          onClick={(e) => setIsCreditSettle(true)}
                        >
                          Settle Credit Due
                        </button>

                        {wallet.isCreditRequestEligible ? (
                          <button
                            className="add-button long"
                            onClick={() =>
                              router.push("/credit-requests/create")
                            }
                          >
                            Credit Request
                          </button>
                        ) : null}
                      </Box>
                    </Box>
                  </Grid>
                ) : null}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box className="main-box" mb={5}>
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

        <TableContainer>
          <Table className="table">
            <TableHead className="table-head">
              <TableRow>
                <TableCell className="header-cell first-group">Date</TableCell>
                <TableCell className="header-cell first-group">
                  Reference ID
                </TableCell>
                <TableCell className="header-cell first-group">Type</TableCell>
                <TableCell className="header-cell first-group">
                  Service
                </TableCell>
                <TableCell className="header-cell first-group">
                  Narration
                </TableCell>
                <TableCell className="header-cell second-group">
                  Debit [DR]
                </TableCell>
                <TableCell className="header-cell second-group">
                  Credit [CR]
                </TableCell>
                <TableCell className="header-cell second-group">
                  Cash Balance
                </TableCell>
                {wallet?.isActiveCreditBalance ? (
                  <>
                    <TableCell className="header-cell third-group">
                      Credit Limit
                    </TableCell>
                    <TableCell className="header-cell third-group">
                      Credit Used
                    </TableCell>
                    <TableCell className="header-cell third-group">
                      Credit Due
                    </TableCell>
                  </>
                ) : null}
              </TableRow>
            </TableHead>
            <TableBody className="table-body">
              {(searchData || []).map((ledger: any) => (
                <TableRow key={ledger.id} className="table-row">
                  <TableCell
                    className="body-cell"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {moment(ledger.createdDateTime).format("DD-MMM-YYYY")}
                    <br />
                    {moment(ledger.createdDateTime).format("HH:mm")}
                  </TableCell>
                  <TableCell className="body-cell">
                    <span
                      style={{
                        padding: "6px",
                        color: "#FFFFFF",
                        borderRadius: "2px",
                        backgroundColor:
                          ledger.transactionType === "ADD" ||
                          ledger.transactionType === "DEDUCT"
                            ? "#B4B4CD"
                            : ledger.transactionCategory === "DEPOSIT"
                            ? "#01783B"
                            : ledger.transactionCategory === "REFUND"
                            ? "#01783B"
                            : ledger.transactionCategory === "CASHBACK"
                            ? "#01783B"
                            : ledger.transactionCategory === "PAYMENT"
                            ? "#D32F2F"
                            : ledger.transactionCategory === "CREDIT_SETTLE"
                            ? "#D32F2F"
                            : ledger.transactionCategory === "CREDIT_ADJUST"
                            ? "#87B0FF"
                            : ledger.transactionCategory === "CREDIT_USE"
                            ? "#DAB556"
                            : "#ccc",
                      }}
                    >
                      {ledger.referenceId}
                    </span>
                  </TableCell>
                  <TableCell className="body-cell">
                    {ledger.transactionType && ledger.transactionType !== "ALL"
                      ? ledger.transactionType === "CL_ADD"
                        ? "CL Add"
                        : ledger.transactionType === "CL_CLEAR"
                        ? "CL Clear"
                        : ledger.transactionType
                            .toLowerCase()
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (char: any) => char.toUpperCase())
                      : ""}
                  </TableCell>
                  <TableCell className="body-cell">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                      }}
                    >
                      {ledger.service !== "WALLET" &&
                      ledger.service !== "ALL" ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#F2F0F9",
                            borderRadius: "2px",
                            padding: "4px 0px",
                            fontFamily: "Outfit",
                            textAlign: "center",
                            width: "100px",
                            height: "100%",
                          }}
                        >
                          <Box
                            sx={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              backgroundColor: getServiceColor(ledger.service),
                              marginRight: "8px",
                            }}
                          ></Box>
                          <span
                            style={{
                              color: "#6E6996",
                              fontSize: "12px",
                            }}
                          >
                            {ledger.service === "WALLET" ||
                            ledger?.service === "ALL"
                              ? null
                              : formatServiceText(ledger.service)}
                          </span>
                        </Box>
                      ) : null}

                      {ledger.scanCopyUrl ? (
                        <Tooltip title="Click to view" arrow>
                          <IconButton
                            onClick={() =>
                              window.open(ledger.scanCopyUrl, "_blank")
                            }
                            style={{ padding: "2px" }}
                          >
                            <AttachFileIcon style={{ fontSize: "15px" }} />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                    </Box>
                  </TableCell>
                  <TableCell className="body-cell">
                    {ledger.narration}
                  </TableCell>
                  <TableCell className="body-cell">
                    {(+ledger.debit || 0).toFixed(0)}
                  </TableCell>
                  <TableCell className="body-cell">
                    {(+ledger.credit || 0).toFixed(0)}
                  </TableCell>
                  <TableCell className="body-cell cash-balance">
                    {(+ledger.currentBalance || 0).toFixed(0)}
                  </TableCell>
                  {wallet?.isActiveCreditBalance ? (
                    <>
                      <TableCell className="body-cell">
                        {(+ledger.creditBalance || 0).toFixed(0)}
                      </TableCell>
                      <TableCell className="body-cell">
                        {(+ledger.creditUsed || 0).toFixed(0)}
                      </TableCell>
                      <TableCell className="body-cell credit-due">
                        {(+ledger.creditDueAmount || 0).toFixed(0)}
                      </TableCell>
                    </>
                  ) : null}
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
      </Box>
    </Box>
  );
};

export default AccountLedgerList;
