"use client";

import { Box } from "@mui/material";

import "../../../../scss/landing/landing.scss";

import Hero from "./Hero";
import Notice from "./Notice";
import Features from "./Features";
import Products from "./Products";
import Category from "./Category";
import Countdown from "./Countdown";
import GlobalService from "./GlobalService";

const LandingPage = () => {
  return (
    <Box>
      {/* <Box className="root-container">
        <Notice />
      </Box> */}
      <Box className="root-container">
        <Hero />
      </Box>
      {/* <Box className="root-container">
        <GlobalService />
      </Box> */}

      <Box className="root-container">
        <Category />
      </Box>

      <Box className="root-container">
        <Products />
      </Box>

      {/* <Box className="root-container">
        <Countdown />
      </Box> */}

      {/* <Box className="root-container">
        <Features />
      </Box> */}
    </Box>
  );
};

export default LandingPage;
