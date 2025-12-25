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
  MenuItem,
  Menu,
  Grid,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { CustomSearchInput } from "@/components/custom/CustomSearchInput";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DeleteAlert } from "@/components/alerts/DeleteAlert";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import { SuccessAlert } from "@/components/alerts/SuccessAlert";
import {
  deleteUserBankAccount,
  getUserBankAccounts,
} from "@/features/agent/bank-account/apis/service";
import EditMenuImg from "../../../../../../public/assests/image/Frame.svg";
import Loader from "@/components/Loader";

const BankAccountList: React.FC = () => {
  const router = useRouter();

  const [data, setData] = useState<any>({});
  const [action, setAction] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [anchorEl, setAnchorEl] = useState<any>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const {
        data: { payload },
      } = await getUserBankAccounts();

      setSearchData(payload);
      setBankAccounts(payload);
      setIsLoading(false);
    })();
  }, []);

  const handleDelete = async () => {
    setAction(false);
    setAnchorEl(false);

    DeleteAlert("Are you sure you want to delete this Bank Account?").then(
      async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteUserBankAccount(data.id);
            setSearchData(searchData.filter((item: any) => item.id != data.id));
            setBankAccounts(
              bankAccounts.filter((item: any) => item.id != data.id)
            );
            SuccessAlert("Bank Account deleted successfully");
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

    const filteredData = bankAccounts.filter((item) =>
      Object.values(item).join("").toLowerCase().includes(searchInput)
    );

    setSearchData(filteredData.length ? filteredData : bankAccounts);
  };

  const handleShow = ({ payload }: any) => {
    setAction(true);
    setData(payload);
  };

  const handleClose = () => {
    setData({});
    setAction(false);
  };

  if (isLoading) return <Loader />;

  return (
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
              <TableCell className="table-header-cell">Account Type</TableCell>
              <TableCell className="table-header-cell">Bank Name</TableCell>
              <TableCell className="table-header-cell">Account Name</TableCell>
              <TableCell className="table-header-cell">Account No</TableCell>
              <TableCell className="table-header-cell">Branch Name</TableCell>
              <TableCell className="table-header-cell">Routing No</TableCell>
              <TableCell className="table-header-cell">Swift Code</TableCell>
              <TableCell className="table-header-cell">Status</TableCell>
              <TableCell className="table-header-cell">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(searchData || []).map((bankAccount: any) => (
              <React.Fragment key={bankAccount.id}>
                <TableRow className="collapsed-row">
                  <TableCell className="table-body-cell">
                    {bankAccount.accountType}
                  </TableCell>
                  <TableCell className="table-body-cell">
                    {bankAccount.bankName}
                  </TableCell>
                  <TableCell className="table-body-cell">
                    {bankAccount.bankAccountName}
                  </TableCell>
                  <TableCell className="table-body-cell">
                    {bankAccount.bankAccountNumber}
                  </TableCell>
                  <TableCell className="table-body-cell">
                    {bankAccount.bankBranch}
                  </TableCell>
                  <TableCell className="table-body-cell">
                    {bankAccount.routingNumber}
                  </TableCell>
                  <TableCell className="table-body-cell">
                    {bankAccount.swiftCode}
                  </TableCell>
                  <TableCell className="table-body-cell">
                    <Typography
                      className={`bank-status ${
                        bankAccount.status?.toLowerCase().replace(/_/g, "-") ||
                        "default"
                      }`}
                    >
                      {bankAccount.status?.replace(/_/g, "-")}
                    </Typography>
                  </TableCell>
                  <TableCell className="table-body-cell">
                    <IconButton
                      size="small"
                      onClick={(event: any) => {
                        setAnchorEl(event.currentTarget);
                        handleShow({ payload: bankAccount });
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
                          router.push(
                            `/settings/bank-accounts/create/${data.id}`
                          )
                        }
                      >
                        Edit Account
                      </MenuItem>

                      <MenuItem
                        className="menu-item menu-item-delete"
                        onClick={handleDelete}
                      >
                        Delete Account
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BankAccountList;
