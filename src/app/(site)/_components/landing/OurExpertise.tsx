import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import "../../../../scss/landing/OurExpertise.scss";
import first from "../../../../../public/assests/homeService/first.svg";
import refund from "../../../../../public/assests/homeService/refund.svg";
import safe from "../../../../../public/assests/homeService/safe.svg";
import worldWide from "../../../../../public/assests/homeService/worldWide.svg";
import transparency from "../../../../../public/assests/homeService/transparency.svg";
import Image from "next/image";

const OurExpertise = () => {
  return (
    <Box mt={6} className="expertise-box" px={5} py={5}>
      <Box mb={4}>
        <Typography className="expertise-title">
          Quality Choices, Affordable Prices!
        </Typography>

        <Typography className="expertise-text" pt={1}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dictum
          aliquet accumsan porta lectus ridiculus in mattis.
        </Typography>
        <Typography className="expertise-text">
          Netus sodales in volutpat ullamcorper amet adipiscing fermentum.
        </Typography>
      </Box>
      <Grid spacing={2} container>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Box className="expertiseCard">
            <Box
              className="content"
              sx={{
                textAlign: "center",
              }}
            >
              <Image
                src={first}
                alt="A beautiful view"
                width={70}
                height={70}
              />
              <Typography className="subtitle">Fast Delivery</Typography>
              <Typography className="subtitle-text">
                An all-in-one customer service platform that helps you balance
                everything your customers need to be happy.
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Box className="expertiseCard">
            <Box
              className="content"
              sx={{
                textAlign: "center",
              }}
            >
              <Image
                src={refund}
                alt="A beautiful view"
                width={70}
                height={70}
              />
              <Typography className="subtitle">Refund Policy</Typography>
              <Typography className="subtitle-text">
                An all-in-one customer service platform that helps you balance
                everything your customers need to be happy.
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Box className="expertiseCard">
            <Box
              className="content"
              sx={{
                textAlign: "center",
              }}
            >
              <Image src={safe} alt="A beautiful view" width={70} height={70} />
              <Typography className="subtitle">Safe Payment</Typography>
              <Typography className="subtitle-text">
                An all-in-one customer service platform that helps you balance
                everything your customers need to be happy.
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Box className="expertiseCard">
            <Box
              className="content"
              sx={{
                textAlign: "center",
              }}
            >
              <Image
                src={worldWide}
                alt="A beautiful view"
                width={70}
                height={70}
              />
              <Typography className="subtitle">Worldwide Purchase</Typography>

              <Typography className="subtitle-text">
                An all-in-one customer service platform that helps you balance
                everything your customers need to be happy.
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Box className="expertiseCard">
            <Box
              className="content"
              sx={{
                textAlign: "center",
              }}
            >
              <Image
                src={transparency}
                alt="A beautiful view"
                width={70}
                height={70}
              />

              <Typography className="subtitle">Transparency</Typography>
              <Typography className="subtitle-text">
                An all-in-one customer service platform that helps you balance
                everything your customers need to be happy.
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OurExpertise;
