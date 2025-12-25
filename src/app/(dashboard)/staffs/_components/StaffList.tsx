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
  MenuItem,
  ThemeProvider,
  Stack,
  Pagination,
  Menu,
  GridLegacy as Grid,
} from "@mui/material";
import {
  FilterList,
  ExpandMore,
  ExpandLess,
  Search,
  RestartAlt,
} from "@mui/icons-material";
import { CustomPaginationSelect } from "@/components/custom/CustomPaginationSelect";
import { CustomSearchInput } from "@/components/custom/CustomSearchInput";
import { PaginationTheme } from "@/components/custom/PaginationTheme";
import { deleteStaff, getStaffs } from "@/features/agent/staff/apis/service";
import { useRouter } from "next/navigation";
import moment from "moment";
import DeactivateImg from "../../../../../public/assests/image/deactive.svg";
import ActiveImg from "../../../../../public/assests/image/activeicon.svg";
import EditMenuImg from "../../../../../public/assests/image/Frame.svg";

import Image from "next/image";
import { DeleteAlert } from "@/components/alerts/DeleteAlert";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import { SuccessAlert } from "@/components/alerts/SuccessAlert";
import Loader from "@/components/Loader";
import { InfoAlert } from "@/components/alerts/InfoAlert";
import { CustomMenuItem } from "@/components/custom/CustomMenuItem";

const StaffList: React.FC = () => {
  const router = useRouter();

  const [staffs, setStaffs] = useState([]);
  const [data, setData] = useState<any>({});
  const [action, setAction] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [expanded, setExpanded] = useState(null);
  const [limit, setLimit] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [searchData, setSearchData] = useState([]);
  const [totalEntries, setTotalEntries] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const query = {
          page: pageNo,
          limit: limit,
        };
        const {
          data: { payload },
        } = await getStaffs(query);
        setStaffs(payload.data);
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
  }, [limit, pageNo]);

  const handleDelete = async () => {
    setAction(false);
    setAnchorEl(false);

    DeleteAlert("Are you sure you want to delete this staff?").then(
      async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteStaff(data.user?.id);
            setSearchData(searchData.filter((item: any) => item.id != data.id));
            setStaffs(staffs.filter((item: any) => item.id != data.id));
            SuccessAlert("Staff deleted successfully");
          } catch (error) {
            const errorMessage = handleApiErrors(error);
            ErrorAlert(errorMessage);
          }
        }
      }
    );
  };

  const handleQuickSearch = (e: any) => {
    const searchInput = e.target.value.toLowerCase();

    const filteredData = staffs.filter((item) =>
      Object.values(item).join("").toLowerCase().includes(searchInput)
    );

    setSearchData(filteredData.length ? filteredData : staffs);
  };

  const handleShow = ({ payload }: any) => {
    setAction(true);
    setData(payload);
  };

  const handleClose = () => {
    setData({});
    setAction(false);
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
          Staff List
          <Typography className="form-subtitle">Manage your staffs</Typography>
        </Typography>

        <Box>
          <button
            className="add-button"
            onClick={() => router.push("/staffs/create/new")}
          >
            Add Staff
          </button>
        </Box>
      </Grid>

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

        <TableContainer className="table-container">
          <Table className="table">
            <TableHead>
              <TableRow>
                <TableCell className="table-header-cell" />
                <TableCell className="table-header-cell">Code</TableCell>
                <TableCell className="table-header-cell">Name</TableCell>
                <TableCell className="table-header-cell">Phone No.</TableCell>
                <TableCell className="table-header-cell">Email</TableCell>
                <TableCell className="table-header-cell">Roles</TableCell>
                <TableCell className="table-header-cell">Address</TableCell>
                <TableCell className="table-header-cell">City</TableCell>
                <TableCell className="table-header-cell">Postal code</TableCell>
                <TableCell className="table-header-cell">
                  Country code
                </TableCell>
                <TableCell className="table-header-cell">Status</TableCell>
                <TableCell className="table-header-cell">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(searchData || []).map((staff: any) => (
                <React.Fragment key={staff.id}>
                  <TableRow
                    className={
                      expanded === staff.id ? "expand-row" : "collapsed-row"
                    }
                  >
                    <TableCell className="table-body-cell">
                      <IconButton
                        size="small"
                        className="collapsed-icon-button"
                        onClick={() => handleExpandClick(staff.id)}
                      >
                        {expanded === staff.id ? (
                          <ExpandLess fontSize="small" />
                        ) : (
                          <ExpandMore fontSize="small" />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {staff.user?.identificationShortCode}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {staff.user?.title} {staff.user?.firstname}{" "}
                      {staff.user?.lastname}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {staff.user?.phoneCode} {staff.user?.phoneNo}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {staff.user?.email}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {staff.user?.roles
                        ?.map((role: any) => role.name)
                        .join(", ") || "No Roles"}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {staff.user?.address}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {staff.user?.city}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {staff.user?.postalCode}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {staff.user?.countryCode}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      {staff.user?.isActive ? (
                        <Image
                          src={ActiveImg}
                          alt="Active"
                          width={13}
                          height={13}
                        />
                      ) : (
                        <Image
                          src={DeactivateImg}
                          alt="Inactive"
                          width={13}
                          height={13}
                        />
                      )}
                    </TableCell>
                    <TableCell className="table-body-cell">
                      <IconButton
                        size="small"
                        onClick={(event: any) => {
                          setAnchorEl(event.currentTarget);
                          handleShow({ payload: staff });
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
                          onClick={() =>
                            router.push(`/staffs/create/${data.id}`)
                          }
                        >
                          Edit Staff
                        </MenuItem>

                        <MenuItem
                          className="menu-item menu-item-delete"
                          onClick={handleDelete}
                        >
                          Delete Staff
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>

                  {/* Expandable Row */}
                  <TableRow className="expand-row">
                    <TableCell colSpan={12} className="expand-cell">
                      <Collapse
                        in={expanded === staff.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box className="expand-content">
                          <Typography className="typography">
                            Created By:{" "}
                            {`${staff.user?.createdByUser?.identificationShortCode}`}
                          </Typography>

                          <Typography className="typography">
                            Updated By:{" "}
                            {staff.user?.updatedByUser
                              ? `${staff.user?.updatedByUser.identificationShortCode}`
                              : "N/A"}
                          </Typography>

                          <Typography className="typography">
                            Created Date:{" "}
                            {moment(staff.user?.createdDateTime).format(
                              "DD-MMM-YYYY HH:mm"
                            )}
                          </Typography>

                          <Typography className="typography">
                            Updated Date:{" "}
                            {moment(staff.user?.updatedDateTime).format(
                              "DD-MMM-YYYY HH:mm"
                            )}
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

export default StaffList;
