import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import "../../../../scss/landing/landingVideo.scss";

const LandingPageVideo = () => {
  return (
    <Box textAlign="center" py={4}>
      <Typography className="e-shop-works-title" mb={3}>
        How E-shop Works
      </Typography>

      {/* Video Container */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <video
          src="/videos/eshop-demo.mp4" // place your mp4 file in public/videos/
          controls
          autoPlay={false}
          muted
          loop
          style={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: "10px",
          }}
        /> */}

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
    </Box>
  );
};

export default LandingPageVideo;
