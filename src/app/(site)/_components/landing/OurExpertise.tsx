import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import "../../../../scss/landing/OurExpertise.scss";
import Deal from "../../../../../public/assests/homeService/deal.png";
import Payment from "../../../../../public/assests/homeService/payment.png";
import search from "../../../../../public/assests/homeService/search.png";
import support from "../../../../../public/assests/homeService/support.png";
import Image from "next/image";

const OurExpertise = () => {
  return (
    <Box mt={8}>
      <Box mb={4}>
        <Typography className="expertise-title">Our Expertise</Typography>
      </Box>
      <Grid spacing={2} container>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box className="expertiseCard">
            <Box
              className="content"
              sx={{
                textAlign: "center",
              }}
            >
              <Image
                src={Deal}
                alt="A beautiful view"
                width={80}
                height={80}
              />
              <Typography className="subtitle">
                Best E-commerce Deals in Bangladesh
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box className="expertiseCard">
            <Box
              className="content"
              sx={{
                textAlign: "center",
              }}
            >
              <Image
                src={search}
                alt="A beautiful view"
                width={80}
                height={80}
              />
              <Typography className="subtitle">
                Thousands of Product Deals
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box className="expertiseCard">
            <Box
              className="content"
              sx={{
                textAlign: "center",
              }}
            >
              <Image
                src={Payment}
                alt="A beautiful view"
                width={80}
                height={80}
              />
              <Typography className="subtitle">
                Multiple Payment Methods
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box className="expertiseCard">
            <Box
              className="content"
              sx={{
                textAlign: "center",
              }}
            >
              <Image
                src={support}
                alt="A beautiful view"
                width={80}
                height={80}
              />
              <Typography className="subtitle">
                24/7 Customer Service Support
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OurExpertise;
