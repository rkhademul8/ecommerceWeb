"use client";

import { Box, Grid } from "@mui/material";
import React from "react";
import deal1 from "../../../../../public/assests/homeService/deal1.png";
import deal2 from "../../../../../public/assests/homeService/deal2.png";
import deal3 from "../../../../../public/assests/homeService/deal3.png";
import Image from "next/image";

const HotDeal = () => {
  return (
    <Box mt={5}>
      <Grid spacing={2} container>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box>
            <Image src={deal1} alt="A beautiful view" />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box>
            <Image src={deal3} alt="A beautiful view" />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box>
            <Image src={deal2} alt="A beautiful view" />
          </Box>
        </Grid>

        {/* <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box>
            <Image
              style={{
                width: "100%",
                height: "450px",
              }}
              src={deal1}
              alt="A beautiful view"
            />
          </Box>
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default HotDeal;
