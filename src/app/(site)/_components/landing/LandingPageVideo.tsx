import { Box, Container, Grid, Typography } from "@mui/material";
import React from "react";
import "../../../../scss/landing/landingVideo.scss";
import Image from "next/image";
import growBusiness from "../../../../../public/assests/homeService/growBusiness.png";
import { CustomInputRegister } from "@/components/custom/CustomInputRegister";

const LandingPageVideo = () => {
  return (
    <Box textAlign="center" py={4}>
      {/* <Box>
        <Typography className="e-shop-works-title" mb={3}>
          How E-shop Works
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <iframe
            width="860"
            height="415"
            src="https://www.youtube.com/embed/HJDvWiJs_Lc"
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: "10px", maxWidth: "100%" }}
          ></iframe>
        </Box>
      </Box> */}

      <Container maxWidth="md">
        <Box className="growBusiness-section">
          <Grid
            spacing={2}
            container
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box>
                <Typography className="growBusiness-title">
                  Grow your business with Chinese products
                </Typography>

                <Typography className="growBusiness-text">
                  a Door to Door Shop to Customer import service from China to
                  Bangladesh By Air and Sea
                </Typography>
              </Box>
              <Box>
                <Box mt={2} className="newsletter-input-wrapper">
                  <input
                    className="custom-input-register-newsletter"
                    required
                    name="email"
                    type="email"
                    placeholder="Enter E-mail address"
                  />

                  <button type="submit" className="newsletter-submit-btn">
                    →
                  </button>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box>
                <Image
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                  src={growBusiness}
                  alt="A beautiful view"
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPageVideo;
