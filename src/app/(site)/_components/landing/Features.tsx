"use client";

import { Box, GridLegacy as Grid, Typography } from "@mui/material";

import ReplayIcon from "@mui/icons-material/Replay";
import PublicIcon from "@mui/icons-material/Public";
import PaymentIcon from "@mui/icons-material/Payment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const features = [
  {
    icon: <LocalShippingIcon fontSize="large" style={{ color: "#01783B" }} />,
    title: "Fast delivery",
    desc: "Shipping for Select Items Thanks to Our Enhanced Logistics Network",
  },
  {
    icon: <ReplayIcon fontSize="large" style={{ color: "#01783B" }} />,
    title: "Refund policy",
    desc: "Our refund policy ensures we facilitate a hassle-free refund process",
  },
  {
    icon: <VisibilityIcon fontSize="large" style={{ color: "#01783B" }} />,
    title: "Transparency",
    desc: "With us, you can expect clarity, accountability, & a commitment to ethical business",
  },
  {
    icon: <PublicIcon fontSize="large" style={{ color: "#01783B" }} />,
    title: "Worldwide purchase",
    desc: "You have no boundaries for purchasing products that you like!",
  },
  {
    icon: <VerifiedUserIcon fontSize="large" style={{ color: "#01783B" }} />,
    title: "Verified sellers",
    desc: "We provide you with our verified seller that helps get a quality product",
  },
  {
    icon: <PaymentIcon fontSize="large" style={{ color: "#01783B" }} />,
    title: "Safe payment",
    desc: "We care about every penny of our customers & we ensure safety of that",
  },
];

const Features = () => {
  return (
    <Box className="features-section" data-aos="fade-up">
      <Typography className="normal-header" align="center">
        Quality Choices, Affordable Prices!
      </Typography>

      <Grid container spacing={2} mt={2}>
        {features.map((feature, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Box className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <span className="feature-title">{feature.title}</span>
              <span className="feature-desc">{feature.desc}</span>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Features;
