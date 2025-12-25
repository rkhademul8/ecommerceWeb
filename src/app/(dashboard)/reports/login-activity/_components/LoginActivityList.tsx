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
  Pagination,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { CustomPaginationSelect } from "@/components/custom/CustomPaginationSelect";
import { CustomSearchInput } from "@/components/custom/CustomSearchInput";
import { PaginationTheme } from "@/components/custom/PaginationTheme";
import Loader from "@/components/Loader";
import { getLoginActivities } from "@/features/reports/login-activity/service";
import moment from "moment";
import { InfoAlert } from "@/components/alerts/InfoAlert";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { CustomMenuItem } from "@/components/custom/CustomMenuItem";

const LoginActivityList: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginActivities, setLoginActivities] = useState([]);

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
        } = await getLoginActivities(query);

        setLoginActivities(payload.data);
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

  const handleQuickSearch = (e: any) => {
    const searchInput = e.target.value.toLowerCase();

    const filteredData = loginActivities.filter((item) =>
      Object.values(item).join("").toLowerCase().includes(searchInput)
    );

    setSearchData(filteredData.length ? filteredData : loginActivities);
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
    <Box className="main-box">
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
              <TableCell className="table-header-cell">Date Time</TableCell>
              <TableCell className="table-header-cell">Type</TableCell>
              <TableCell className="table-header-cell">User</TableCell>
              <TableCell className="table-header-cell">Device Name</TableCell>
              <TableCell className="table-header-cell">Device OS</TableCell>
              <TableCell className="table-header-cell">Browser</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(searchData || []).map((activity: any) => (
              <React.Fragment key={activity.id}>
                <TableRow className="collapsed-row">
                  <TableCell className="table-body-cell">
                    {moment(activity.createdDateTime).format(
                      "DD-MMM-YYYY HH:mm"
                    )}
                  </TableCell>
                  <TableCell className="table-body-cell">
                    {activity.activityType}
                  </TableCell>
                  <TableCell className="table-body-cell">
                    {activity.userLoggedinDevice?.user
                      ? `${activity.userLoggedinDevice.user.identificationShortCode} - ${activity.userLoggedinDevice.user.title}  ${activity.userLoggedinDevice.user.firstname}  ${activity.userLoggedinDevice.user.lastname}`
                      : "No User Info"}
                  </TableCell>
                  <TableCell className="table-body-cell">
                    {activity.userLoggedinDevice?.deviceName}
                  </TableCell>
                  <TableCell className="table-body-cell">
                    {activity.userLoggedinDevice?.deviceOS}
                  </TableCell>
                  <TableCell className="table-body-cell">
                    {activity.userLoggedinDevice?.browser}
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
  );
};

export default LoginActivityList;
