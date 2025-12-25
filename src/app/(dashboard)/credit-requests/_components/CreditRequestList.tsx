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
  Collapse,
  Tabs,
  Tab,
  MenuItem,
  ThemeProvider,
  Stack,
  Pagination,
  GridLegacy as Grid,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { ExpandMore, ExpandLess, Search } from "@mui/icons-material";
import { CustomPaginationSelect } from "@/components/custom/CustomPaginationSelect";
import { getCreditRequests } from "@/features/agent/credit-request/apis/service";
import { CustomSearchInput } from "@/components/custom/CustomSearchInput";
import { PaginationTheme } from "@/components/custom/PaginationTheme";
import { useRouter } from "next/navigation";
import moment from "moment";
import Loader from "@/components/Loader";
import { CustomMenuItem } from "@/components/custom/CustomMenuItem";
import { getMeWallet } from "@/features/agent/apis/service";
import CreditSettle from "./CreditSettle";

const CreditRequestList: React.FC = () => {
  const router = useRouter();

  const [wallet, setWallet] = useState<any>({});
  const [loading, setLoading] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [creditRequests, setCreditRequests] = useState([]);
  const [selectedTab, setSelectedTab] = useState<any>("ALL");
  const [isCreditSettle, setIsCreditSettle] = useState(false);

  const [limit, setLimit] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [expanded, setExpanded] = useState(null);
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading({ data: true });
      const query = {
        page: pageNo,
        limit: limit,
        requestStatus: selectedTab,
      };

      const {
        data: { payload: agentWallet },
      } = await getMeWallet();

      const {
        data: { payload },
      } = await getCreditRequests(query);

      setSearchData(payload.data);
      setWallet(agentWallet.wallet);
      setCreditRequests(payload.data);
      setPageCount(payload?.meta?.totalPages);
      setTotalEntries(payload?.meta?.totalRecords || 0);
      setLoading({ data: false });
    })();
  }, [selectedTab, limit, pageNo]);

  const handleQuickSearch = (e: any) => {
    const searchInput = e.target.value.toLowerCase();

    const filteredData = creditRequests.filter((item) =>
      Object.values(item).join("").toLowerCase().includes(searchInput)
    );

    setSearchData(filteredData.length ? filteredData : creditRequests);
  };

  const handleExpandClick = (id: any) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const handleTabChange = (event: any, value: any) => {
    setSelectedTab(value);
  };

  const handlePageChange = (event: any, value: any) => {
    setPageNo(value);
  };

  const handlePage = (value: any) => {
    if (pageNo !== 1) setPageNo(1);
    setLimit(value);
  };

  const handleCreditClose = () => {
    setFormData({});
    setIsCreditSettle(false);
  };

  const handleChange = ({ target }: any) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  if (loading.data) return <Loader />;

  return (
    <Box>
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
          Credit History
          <Typography className="form-subtitle">Manage your credits</Typography>
        </Typography>

        <Box display="flex" gap={2}>
          {wallet.isActiveCashBalance ? (
            <Box
              sx={{
                gap: "10px",
                display: "flex",
                alignItems: "center",
                borderRadius: "4px",
                padding: "5px 5px",
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <button
                className={`secondary-button ${
                  !(+wallet.creditDueAmount || 0) ? "disable" : ""
                }`}
                onClick={() => setIsCreditSettle(true)}
                disabled={!(+wallet.creditDueAmount || 0)}
              >
                Settle Credit Due
              </button>

              {wallet.isCreditRequestEligible ? (
                <button
                  className="add-button"
                  onClick={() => router.push("/credit-requests/create")}
                >
                  Credit Request
                </button>
              ) : (
                ""
              )}
            </Box>
          ) : null}
        </Box>
      </Grid>

      <Box className="main-box" mb={5}>
        <Box mb={2}>
          <Tabs
            value={selectedTab}
            variant="fullWidth"
            className="primary-tab"
            onChange={handleTabChange}
          >
            <Tab label="ALL" value="ALL" />
            <Tab label="Pending" value="PENDING" />
            <Tab label="Approved" value="ACC_APPROVED" />
            <Tab label="Rejected" value="REJECTED" />
          </Tabs>
        </Box>

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
                <TableCell className="table-header-cell" />
                <TableCell className="table-header-cell">Date</TableCell>
                <TableCell className="table-header-cell">Amount</TableCell>
                <TableCell className="table-header-cell">Due Date</TableCell>
                <TableCell className="table-header-cell">
                  Settle Amount
                </TableCell>
                <TableCell className="table-header-cell">
                  Payment Status
                </TableCell>
                <TableCell className="table-header-cell">
                  Request Status
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(searchData || []).map((creditReq: any) => (
                <React.Fragment key={creditReq.id}>
                  <TableRow
                    className={
                      expanded === creditReq.id ? "expand-row" : "collapsed-row"
                    }
                  >
                    <TableCell className="table-body-cell">
                      <IconButton
                        size="small"
                        className="collapsed-icon-button"
                        onClick={() => handleExpandClick(creditReq.id)}
                      >
                        {expanded === creditReq.id ? (
                          <ExpandLess fontSize="small" />
                        ) : (
                          <ExpandMore fontSize="small" />
                        )}
                      </IconButton>
                    </TableCell>

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
                    <TableCell className="table-body-cell">
                      <Typography
                        className={`deposit-status ${
                          creditReq.requestStatus
                            ?.toLowerCase()
                            .replace(/_/g, "-") || "default"
                        }`}
                      >
                        {creditReq.requestStatus === "ACC_APPROVED" ||
                        creditReq.requestStatus === "KAM_APPROVED"
                          ? "Approved"
                          : creditReq.requestStatus
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

                  {/* Expandable Row */}
                  <TableRow className="expand-row">
                    <TableCell colSpan={12} className="expand-cell">
                      <Collapse
                        in={expanded === creditReq.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box className="expand-content">
                          <Typography className="typography">
                            Created By:{" "}
                            {`${creditReq.createdByUser?.identificationShortCode}`}
                          </Typography>

                          <Typography className="typography">
                            Created Date:{" "}
                            {moment(creditReq.createdDateTime).format(
                              "DD-MMM-YYYY HH:mm"
                            )}
                          </Typography>

                          {creditReq.requestStatus === "ACC_APPROVED" && (
                            <>
                              <Typography className="typography">
                                Approved By:{" "}
                                {creditReq.approvedByAccountUser
                                  ? `${creditReq.approvedByAccountUser.identificationShortCode}`
                                  : "N/A"}
                              </Typography>

                              <Typography className="typography">
                                Approved Remarks:{" "}
                                {creditReq.clientRemarks || "N/A"}
                              </Typography>
                            </>
                          )}

                          {creditReq.requestStatus === "KAM_APPROVED" && (
                            <>
                              <Typography className="typography">
                                Kam Approved By:{" "}
                                {creditReq.approvedByKamUser
                                  ? `${creditReq.approvedByKamUser.identificationShortCode}`
                                  : "N/A"}
                              </Typography>

                              <Typography className="typography">
                                Approved Remarks:{" "}
                                {creditReq.clientRemarks || "N/A"}
                              </Typography>
                            </>
                          )}

                          {creditReq.requestStatus === "REJECTED" && (
                            <>
                              <Typography className="typography">
                                Rejected By:{" "}
                                {creditReq.updatedByUser
                                  ? `${creditReq.updatedByUser.identificationShortCode}`
                                  : "N/A"}
                              </Typography>
                              <Typography className="typography">
                                Rejection Reason: {creditReq.adminRemarks}
                              </Typography>
                            </>
                          )}
                          <Typography className="typography">
                            Notes: {creditReq.userNotes}
                          </Typography>
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

        <Dialog
          open={isCreditSettle}
          onClose={handleCreditClose}
          sx={{
            "& .MuiDialog-paper": {
              width: "750px",
              maxWidth: "750px",
              margin: "auto",
            },
          }}
        >
          <DialogTitle className="normal-header">
            Credit Due Settlement
          </DialogTitle>

          <DialogContent>
            <CreditSettle
              loading={loading}
              setLoading={setLoading}
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              handleCreditClose={handleCreditClose}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default CreditRequestList;
