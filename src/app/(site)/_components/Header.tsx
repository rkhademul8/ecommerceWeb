"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import {
  GridLegacy as Grid,
  Box,
  InputBase,
  IconButton,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import "../../../scss/header.scss";

import { useRouter } from "next/navigation";
import { getMe } from "@/features/user/service";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { getJWT, isTokenValid } from "@/features/auth/service";
import { uploadProductSearchImage } from "@/features/product/product";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import secureLocalStorage from "react-secure-storage";
import logo from "../../../../public/assests/logo/logo.jpeg";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

const Header = () => {
  const router = useRouter();
  const [hover, setHover] = useState(false);

  const logoUrl = secureLocalStorage.getItem("site-logo");
  const safeLogoUrl =
    logoUrl && logoUrl !== "null" && logoUrl !== "undefined"
      ? logoUrl
      : "/default-logo.png";

  const [user, setUser] = useState<any>({});
  const [cartCount, setCartCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);

  const [searchValue, setSearchValue] = useState("");

  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getJWT();
      if (token && isTokenValid()) {
        try {
          const {
            data: { payload: user },
          } = await getMe();
          setUser(user);
        } catch (error) {
          console.error("Error refreshing user:", error);
        }
      } else {
        setUser({});
      }
    };

    fetchUser();

    const handleUserLogin = () => {
      fetchUser();
    };

    window.addEventListener("user-logged-in", handleUserLogin);

    return () => {
      window.removeEventListener("user-logged-in", handleUserLogin);
    };
  }, []);

  useEffect(() => {
    const loadCartCount = () => {
      const storedData = secureLocalStorage.getItem("cartData");
      if (typeof storedData === "string") {
        try {
          const parsed = JSON.parse(storedData);
          setCartCount(parsed?.result?.items?.length || 0);
        } catch (error) {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    loadCartCount();

    window.addEventListener("cart-updated", loadCartCount);
    window.addEventListener("storage", loadCartCount);

    return () => {
      window.removeEventListener("cart-updated", loadCartCount);
      window.removeEventListener("storage", loadCartCount);
    };
  }, []);

  useEffect(() => {
    const loadFavoriteCount = () => {
      const storedData = secureLocalStorage.getItem("favoriteProducts");

      if (typeof storedData === "string") {
        try {
          const parsed = JSON.parse(storedData);
          setFavoriteCount(parsed?.length || 0);
        } catch (error) {
          setFavoriteCount(0);
        }
      } else {
        setFavoriteCount(0);
      }
    };

    loadFavoriteCount();

    window.addEventListener("favorite-updated", loadFavoriteCount);
    window.addEventListener("storage", loadFavoriteCount);

    return () => {
      window.removeEventListener("favorite-updated", loadFavoriteCount);
      window.removeEventListener("storage", loadFavoriteCount);
    };
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleUpload = async (selectedFile?: File) => {
    try {
      const fileToUpload = selectedFile || file;

      if (fileToUpload) {
        const formData = new FormData();
        formData.append("file", fileToUpload);

        const response = await uploadProductSearchImage(formData);

        if (response.data) {
          router.push(`/shop/img-${response.data?.payload?.code}`);
        }
      }
    } catch (error) {
      const errorMessage = handleApiErrors(error);
      ErrorAlert(errorMessage);
    }
  };

  const handleSearch = () => {
    if (!searchValue.trim()) return;

    const isUrl = /^https?:\/\//i.test(searchValue);

    if (isUrl) {
      const url = new URL(searchValue);

      if (url.hostname.includes("1688")) {
        let offerId = "";

        if (url.searchParams.has("offerId")) {
          offerId = url.searchParams.get("offerId") || "";
        }

        if (!offerId) {
          const match = url.pathname.match(/\/offer\/(\d+)\.html/);
          if (match) {
            offerId = match[1];
          }
        }

        if (offerId) {
          router.push(`/product/osee-${offerId}`);
          return;
        }
      } else {
        ErrorAlert(
          "This link is not valid. Please enter a correct product link."
        );
      }
    } else {
      const formattedSearch = searchValue.trim().replace(/\s+/g, "-");
      router.push(`/shop/${formattedSearch}`);
    }
  };

  return (
    <Box className="header" data-aos="fade-up">
      <Grid container alignItems="center" mb={0.5}>
        {/* Logo */}
        <Grid item xs={6} md={3.5} className="logo-section">
          <Link
            href="/"
            style={{ display: "inline-block" }}
            onClick={() => setSearchValue("")}
          >
            <Image
              alt="Logo"
              priority
              width={130}
              height={35}
              // src={String(safeLogoUrl)}
              src={logo}
            />
          </Link>
        </Grid>

        {/* Search Bar */}
        <Grid item xs={12} md={5} sx={{ order: { xs: 3, md: 2 } }}>
          <Box className="search-bar">
            <input
              type="file"
              accept="image/*"
              id="upload-image"
              style={{ display: "none" }}
              onChange={(e: any) => {
                if (e.target.files && e.target.files[0]) {
                  const selectedFile = e.target.files[0];
                  setFile(selectedFile);
                  handleUpload(selectedFile);
                }
              }}
            />

            <label htmlFor="upload-image">
              <IconButton className="camera-btn" disableRipple component="span">
                <CameraAltIcon />
              </IconButton>
            </label>

            <InputBase
              value={searchValue}
              onChange={handleChange}
              className="search-input"
              placeholder="Search by keyword or link"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <IconButton className="search-btn" onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
          </Box>
        </Grid>

        {/* Right Section */}
        <Grid
          item
          xs={6}
          md={3.5}
          className="right-section"
          sx={{
            display: "flex",
            alignItems: "center",
            order: { xs: 2, md: 3 },
            justifyContent: "flex-end",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "flex-start", md: "flex-end" },
              gap: "15px",
            }}
          >
            <Box
              sx={{
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() => router.push("/cart")}
            >
              <ShoppingCartOutlinedIcon className="icon" />
              {cartCount > 0 && <Box className="cart-count">{cartCount}</Box>}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "flex-start", md: "flex-end" },
              gap: "15px",
            }}
          >
            <Box
              sx={{
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() => router.push("/wishlist")}
            >
              <FavoriteBorderOutlinedIcon className="icon" />
              {favoriteCount > 0 && (
                <Box className="cart-count">{favoriteCount}</Box>
              )}
            </Box>
          </Box>

          <Box
            className="user-info"
            onClick={() =>
              user?.id ? router.push("/dashboard") : router.push("/login")
            }
          >
            <Box>
              <AccountCircleIcon className="icon" />
            </Box>
            <Box className="login-info">
              <span className="user-name">
                {user.firstname} {user.lastname}
              </span>
              <br />
              <span className="user-email">{user.email}</span>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <hr className="header-divider" />
    </Box>
  );
};

export default Header;
