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
  Pagination,
  Tooltip,
  GridLegacy as Grid,
  Menu,
  Modal,
} from "@mui/material";
import { ExpandMore, ExpandLess, Search } from "@mui/icons-material";
import { CustomPaginationSelect } from "@/components/custom/CustomPaginationSelect";
import {
  deleteDepositRequest,
  getDepositRequests,
  updateDepositRequest,
  uploadPayslipDeposit,
} from "@/features/agent/deposit-request/apis/service";
import { CustomSearchInput } from "@/components/custom/CustomSearchInput";
import { PaginationTheme } from "@/components/custom/PaginationTheme";
import { useRouter } from "next/navigation";
import moment from "moment";
import Link from "next/link";
import Loader from "@/components/Loader";
import { InfoAlert } from "@/components/alerts/InfoAlert";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { DeleteAlert } from "@/components/alerts/DeleteAlert";
import { SuccessAlert } from "@/components/alerts/SuccessAlert";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import Image from "next/image";
import EditMenuImg from "../../../../../public/assests/image/Frame.svg";
import { getTransactions } from "@/features/payment-gateway/transaction/service";
import { CustomInput } from "@/components/custom/CustomInput";
import { CustomTextArea } from "@/components/custom/CustomTextArea";
import { CustomMenuItem } from "@/components/custom/CustomMenuItem";

const DepositRequestList: React.FC = () => {
  const router = useRouter();

  const [selectedType, setSelectedType] = useState<any>("BANK");
  const [selectedTab, setSelectedTab] = useState<any>("ALL");

  const [data, setData] = useState<any>({});
  const [action, setAction] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [depositRequests, setDepositRequests] = useState<any>([]);

  const [limit, setLimit] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [searchData, setSearchData] = useState<any>([]);

  const [expanded, setExpanded] = useState(null);
  const [formData, setFormData] = useState<any>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [payslipFile, setPayslipFile] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        let payload;
        if (selectedType === "Online Payment") {
          const query = {
            page: pageNo,
            limit: limit,
            transactionStatus: selectedTab,
          };
          const response = await getTransactions(query);
          payload = response.data.payload;
        } else {
          const query = {
            page: pageNo,
            limit: limit,
            requestStatus: selectedTab,
            paymentType: selectedType,
          };
          const response = await getDepositRequests(query);
          payload = response.data.payload;
        }

        setSearchData(payload.data);
        setDepositRequests(payload.data);
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
  }, [selectedTab, selectedType, limit, pageNo]);

  const handlePayslipUpload = async (id: number) => {
    try {
      if (payslipFile) {
        const payslipFormData = new FormData();
        payslipFormData.append("file", payslipFile);
        const result = await uploadPayslipDeposit(id, payslipFormData);
        return result;
      }
    } catch (error) {
      const errorMessage = handleApiErrors(error);
      ErrorAlert(errorMessage);
    }
  };

  const handleSubmit = async () => {
    try {
      const result = await updateDepositRequest(formData);

      if (result.data) {
        const uploadResult: any = await handlePayslipUpload(
          result.data.payload?.id
        );

        SuccessAlert("Deposit updated successfully");
        setDepositRequests([
          ...depositRequests.map((item: any) =>
            item.id == formData.id
              ? {
                  ...item,
                  ...result?.data?.payload,
                  depositPaySlipUrl: uploadResult?.data
                    ? uploadResult.data?.payload.depositPaySlipUrl
                    : item.depositPaySlipUrl,
                }
              : item
          ),
        ]);
        setSearchData([
          ...searchData.map((item: any) =>
            item.id == formData.id
              ? {
                  ...item,
                  ...result?.data?.payload,
                  depositPaySlipUrl: uploadResult?.data
                    ? uploadResult.data?.payload.depositPaySlipUrl
                    : item.depositPaySlipUrl,
                }
              : item
          ),
        ]);
        setData({});
        setFormData({});
        setAction(false);
        setModalOpen(false);
      }
    } catch (error) {
      const errorMessage = handleApiErrors(error);
      ErrorAlert(errorMessage);
    }
  };

  const handleQuickSearch = (event: any) => {
    const searchInput = event.target.value.toLowerCase();
    const filteredData = depositRequests.filter((item: any) =>
      Object.values(item).join("").toLowerCase().includes(searchInput)
    );
    setSearchData(filteredData.length ? filteredData : depositRequests);
  };

  const handleDelete = async () => {
    setAction(false);
    setAnchorEl(false);

    DeleteAlert("Are you sure you want to delete this deposit?").then(
      async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteDepositRequest(data.id);
            setSearchData(searchData.filter((item: any) => item.id != data.id));
            setDepositRequests(
              depositRequests.filter((item: any) => item.id != data.id)
            );
            SuccessAlert("Deposit Request deleted successfully");
          } catch (error) {
            const errorMessage = handleApiErrors(error);
            ErrorAlert(errorMessage);
          }
        }
      }
    );
  };

  const handleChange = ({ target }: any) => {
    if (target.files) return setPayslipFile(target.files[0]);
    const newData = { ...formData, [target.name]: target.value };
    setFormData(newData);
  };

  const handleShow = ({ payload }: any) => {
    setAction(true);
    setData(payload);
  };

  const handleEditClick = () => {
    setAction(false);
    setAnchorEl(false);
    setModalOpen(true);
    setFormData(data);
  };

  const handleClose = () => {
    setData({});
    setFormData({});
    setAction(false);
    setModalOpen(false);
  };

  const handleExpandClick = (id: any) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const handleTabChange = (event: any, value: any) => {
    setSelectedTab(value);
  };

  const handleTypeChange = (event: any, value: any) => {
    setSelectedTab("ALL");
    setSelectedType(value);
  };

  const handlePageChange = (event: any, value: any) => {
    setPageNo(value);
  };

  const handlePage = (value: any) => {
    if (pageNo !== 1) setPageNo(1);
    setLimit(value);
  };

  const tabs =
    selectedType === "Online Payment"
      ? [
          { label: "ALL", value: "ALL" },
          { label: "Completed", value: "Completed" },
          { label: "Cancelled", value: "Cancelled" },
          { label: "Failed", value: "Failed" },
        ]
      : [
          { label: "ALL", value: "ALL" },
          { label: "Pending", value: "PENDING" },
          { label: "Approved", value: "ACC_APPROVED" },
          { label: "Rejected", value: "REJECTED" },
        ];

  if (isLoading) return <Loader />;

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
          Deposit List
          <Typography className="form-subtitle">
            Manage your deposits
          </Typography>
        </Typography>

        <Box>
          <button
            className="add-button"
            onClick={() => router.push("/deposit-requests/create")}
          >
            Deposit Request
          </button>
        </Box>
      </Grid>

      <Box className="main-box" mb={5}>
        <Box mb={3}>
          <Tabs
            value={selectedType}
            onChange={handleTypeChange}
            className="tabs-container"
            variant="fullWidth"
            scrollButtons="auto"
            aria-label="deposit type tabs"
            TabIndicatorProps={{ style: { background: "transparent" } }}
          >
            <Tab
              label="Bank Account"
              value="BANK"
              className={`MuiTab-root ${
                selectedType === "BANK" ? "selected" : ""
              }`}
            />
            <Tab
              label="Mobile Banking"
              value="MFS"
              className={`MuiTab-root ${
                selectedType === "MFS" ? "selected" : ""
              }`}
            />
            <Tab
              label="Cash Deposit"
              value="CASH"
              className={`MuiTab-root ${
                selectedType === "CASH" ? "selected" : ""
              }`}
            />
            <Tab
              label="Online Payment"
              value="Online Payment"
              className={`MuiTab-root ${
                selectedType === "Online Payment" ? "selected" : ""
              }`}
            />
          </Tabs>
        </Box>

        <Box mb={2}>
          <Tabs
            value={selectedTab}
            variant="fullWidth"
            className="primary-tab"
            onChange={handleTabChange}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                value={tab.value}
                label={tab.label}
                className={`${tab.label.toLowerCase()}-tab ${
                  selectedTab === tab.value ? "selected" : ""
                }`}
              />
            ))}
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
          {selectedType === "Online Payment" ? (
            <Table className="table">
              <TableHead>
                <TableRow>
                  <TableCell className="table-header-cell" />
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
                  <TableCell className="table-header-cell">
                    Gateway Fee
                  </TableCell>
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
                {(searchData || []).map((transaction: any) => (
                  <React.Fragment key={transaction.id}>
                    <TableRow
                      className={
                        expanded === transaction.id
                          ? "expand-row"
                          : "collapsed-row"
                      }
                    >
                      <TableCell className="table-body-cell">
                        <IconButton
                          size="small"
                          className="collapsed-icon-button"
                          onClick={() => handleExpandClick(transaction.id)}
                        >
                          {expanded === transaction.id ? (
                            <ExpandLess fontSize="small" />
                          ) : (
                            <ExpandMore fontSize="small" />
                          )}
                        </IconButton>
                      </TableCell>
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
                                (+transaction.amount * +transaction.charge) /
                                  100
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

                    {/* Expandable Row */}
                    <TableRow className="expand-row">
                      <TableCell colSpan={12} className="expand-cell">
                        <Collapse
                          in={expanded === transaction.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box className="expand-content">
                            <Typography className="typography">
                              Created Date Time:{" "}
                              {moment(transaction.createdDateTime).format(
                                "DD-MMM-YYYY HH:mm"
                              )}
                            </Typography>

                            {transaction.transactionStatus === "Refunded" ? (
                              <>
                                <Typography className="typography">
                                  Refund Trx Id: {transaction.refundTrxId}
                                </Typography>

                                <Typography className="typography">
                                  Refund Date:{" "}
                                  {transaction.refundExecuteTime
                                    ? moment(
                                        transaction.refundExecuteTime
                                      ).format("DD-MMM-YYYY HH:mm")
                                    : "N/A"}
                                </Typography>
                              </>
                            ) : null}

                            <Typography className="typography">
                              Notes: {transaction.userNotes || "N/A"}
                            </Typography>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table className="table">
              <TableHead>
                <TableRow>
                  <TableCell className="table-header-cell" />
                  <TableCell className="table-header-cell">
                    Deposit ID
                  </TableCell>
                  <TableCell className="table-header-cell">
                    Deposit Date
                  </TableCell>
                  <TableCell className="table-header-cell">Amount</TableCell>

                  <TableCell className="table-header-cell">
                    Gateway Fee
                  </TableCell>

                  <TableCell className="table-header-cell">
                    Deposit Amount
                  </TableCell>

                  <TableCell className="table-header-cell">
                    Deposit Type
                  </TableCell>
                  {selectedType === "MFS" ? (
                    <TableCell className="table-header-cell">
                      From A/c No.
                    </TableCell>
                  ) : null}
                  <TableCell className="table-header-cell">
                    Deposited A/c
                  </TableCell>
                  <TableCell className="table-header-cell">Ref. ID</TableCell>
                  <TableCell className="table-header-cell">Status</TableCell>
                  <TableCell className="table-header-cell">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {(searchData || []).map((depositReq: any) => (
                  <React.Fragment key={depositReq.id}>
                    <TableRow
                      className={
                        expanded === depositReq.id
                          ? "expand-row"
                          : "collapsed-row"
                      }
                    >
                      <TableCell className="table-body-cell">
                        <IconButton
                          size="small"
                          className="collapsed-icon-button"
                          onClick={() => handleExpandClick(depositReq.id)}
                        >
                          {expanded === depositReq.id ? (
                            <ExpandLess fontSize="small" />
                          ) : (
                            <ExpandMore fontSize="small" />
                          )}
                        </IconButton>
                      </TableCell>
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
                      {selectedType === "MFS" ? (
                        <TableCell className="table-body-cell">
                          {depositReq.fromBankAccountNumber}
                        </TableCell>
                      ) : null}
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

                      {depositReq.requestStatus === "PENDING" ? (
                        <TableCell className="table-body-cell">
                          <IconButton
                            size="small"
                            onClick={(event: any) => {
                              setAnchorEl(event.currentTarget);
                              handleShow({ payload: depositReq });
                            }}
                          >
                            <Image
                              width={13}
                              height={13}
                              alt="Options"
                              src={EditMenuImg}
                            />
                          </IconButton>
                          <Menu
                            keepMounted
                            open={action}
                            anchorEl={anchorEl}
                            onClose={() => {
                              handleClose();
                              setAnchorEl(null);
                            }}
                          >
                            <MenuItem
                              className="menu-item"
                              onClick={handleEditClick}
                            >
                              Edit Deposit
                            </MenuItem>

                            <MenuItem
                              className="menu-item menu-item-delete"
                              onClick={handleDelete}
                            >
                              Delete Deposit
                            </MenuItem>
                          </Menu>
                        </TableCell>
                      ) : (
                        <TableCell className="table-body-cell"></TableCell>
                      )}
                    </TableRow>

                    {/* Expandable Row */}
                    <TableRow className="expand-row">
                      <TableCell colSpan={12} className="expand-cell">
                        <Collapse
                          in={expanded === depositReq.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box className="expand-content">
                            <Typography className="typography">
                              Created Date:{" "}
                              {moment(depositReq.createdDateTime).format(
                                "DD-MMM-YYYY HH:mm"
                              )}
                            </Typography>

                            <Typography className="typography">
                              Created By:{" "}
                              {
                                depositReq.createdByUser
                                  ?.identificationShortCode
                              }
                            </Typography>

                            {depositReq.requestStatus === "ACC_APPROVED" && (
                              <>
                                <Typography className="typography">
                                  Approved By:{" "}
                                  {depositReq.approvedByAccountUser
                                    ? `${depositReq.approvedByAccountUser.identificationShortCode}`
                                    : "N/A"}
                                </Typography>

                                <Typography className="typography">
                                  Approved Remarks:{" "}
                                  {depositReq.clientRemarks || "N/A"}
                                </Typography>
                              </>
                            )}

                            {depositReq.requestStatus === "REJECTED" && (
                              <>
                                <Typography className="typography">
                                  Rejected By:{" "}
                                  {depositReq.approvedByAccountUser
                                    ? `${depositReq.approvedByAccountUser.identificationShortCode}`
                                    : "N/A"}
                                </Typography>
                                <Typography className="typography">
                                  Rejected Reason: {depositReq.adminRemarks}
                                </Typography>
                              </>
                            )}

                            <Typography className="typography">
                              Notes: {depositReq.userNotes || "N/A"}
                            </Typography>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          )}
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

        <Modal open={modalOpen} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: "500px" },
              bgcolor: "background.paper",
              p: 4,
            }}
          >
            <span className="normal-header">{`Edit Deposit Request ( ${data.depositReference} -  ${data.paymentType} )`}</span>
            <Grid container spacing={2} mt={0}>
              {data.paymentType === "MFS" ? (
                <Grid item xs={12} md={12}>
                  <label className="form-label">
                    <span className="form-required">*</span> From Account
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

              <Grid item xs={12} md={6}>
                <label className="form-label">
                  <span className="form-required">*</span> Deposit Amount
                </label>
                <CustomInput
                  required
                  type="number"
                  name="depositAmount"
                  onChange={handleChange}
                  placeholder="Enter Amount"
                  value={formData.depositAmount || ""}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <label className="form-label">
                  <span className="form-required">*</span> Deposit Date
                </label>
                <CustomInput
                  required
                  type="date"
                  name="depositDate"
                  onChange={handleChange}
                  placeholder="DD/MM/YYYY"
                  value={formData.depositDate || ""}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <label className="form-label">
                  <span className="form-required">*</span> Reference ID
                </label>
                <CustomInput
                  required
                  onChange={handleChange}
                  name="transactionReference"
                  placeholder="Enter Reference ID"
                  value={formData.transactionReference || ""}
                />
              </Grid>

              <Grid item xs={12} md={12}>
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
                  rows={2}
                  name="userNotes"
                  onChange={handleChange}
                  placeholder="Enter Notes"
                  value={formData.userNotes || ""}
                />
              </Grid>

              <Grid
                item
                xs={12}
                textAlign="center"
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <button
                  className="cancel-button"
                  onClick={handleClose}
                  style={{ marginRight: "5px" }}
                >
                  Close
                </button>
                <button className="submit-button" onClick={handleSubmit}>
                  Submit
                </button>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default DepositRequestList;
