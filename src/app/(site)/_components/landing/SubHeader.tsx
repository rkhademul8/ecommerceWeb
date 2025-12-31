"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Grid, Button, Typography, Stack } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import "../../../../scss/landing/SubHeader.scss";
import { useRouter, usePathname } from "next/navigation";
import { categories } from "@/utils/product-category/product-category";

const SubHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [dropdownOpen, setDropdownOpen] = useState(isHomePage); // open by default on home page
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown when navigating to other pages
  useEffect(() => {
    if (!isHomePage) {
      setDropdownOpen(false);
    } else {
      setDropdownOpen(true); // always open by default on home page
    }
  }, [pathname, isHomePage]);

  return (
    <Box className="sub-header" data-aos="fade-up">
      <Grid container alignItems="center" spacing={2}>
        {/* LEFT */}

        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <Box style={{ position: "relative" }}>
            <Button
              ref={buttonRef}
              startIcon={<MenuIcon />}
              className="category-btn"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              SHOP BY CATEGORIES
            </Button>

            {dropdownOpen && (
              <Box ref={dropdownRef} className="floating-categories">
                <Typography className="hero-section-categories-name">
                  Choose Categories
                </Typography>

                {categories.map((cat, i) => {
                  const isOpen = openCategory === cat.tag;
                  return (
                    <Box key={i} className="category-wrapper">
                      <Box
                        className="category-item"
                        onClick={() => setOpenCategory(isOpen ? null : cat.tag)}
                      >
                        <span className="category-text">{cat.name}</span>
                        {isOpen ? (
                          <KeyboardArrowDownIcon className="arrow" />
                        ) : (
                          <KeyboardArrowRightIcon className="arrow" />
                        )}
                      </Box>

                      {isOpen && cat.subCategories && (
                        <Box className="subcategory-list">
                          {cat.subCategories.map((sub, idx) => (
                            <Typography
                              key={idx}
                              className="subcategory-item"
                              onClick={() =>
                                router.push(
                                  `/shop/${encodeURIComponent(sub.searchTag)}`
                                )
                              }
                            >
                              {sub.name}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        </Grid>

        {/* CENTER */}
        <Grid size={{ xs: 12, sm: 8, md: 6 }} className="center-nav">
          <Stack direction="row" spacing={3} justifyContent="center">
            <Typography className="nav-item">About Us</Typography>
            <Typography className="nav-item">Affiliate</Typography>
            <Typography className="nav-item">Contact Us</Typography>
            <Typography className="nav-item">Return Policy</Typography>
            <Typography className="nav-item">Terms & Conditions</Typography>

            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography className="nav-item">More</Typography>
              <KeyboardArrowDownIcon className="nav-icon" />
            </Stack>
          </Stack>
        </Grid>

        {/* RIGHT */}
        <Grid size={{ xs: 12, sm: 12, md: 3 }} className="right-section">
          <Box className="promo-badge">Free Shipping On Order $99</Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SubHeader;
