"use client";

import Image from "next/image";
import { Box, Grid, Typography } from "@mui/material";

const CountdownBlock = ({ numbers }: { numbers: string }) => (
  <Box className="countdown-block">
    {numbers.split("").map((n, i) => (
      <Box key={i} className="digit animate">
        {n}
      </Box>
    ))}
  </Box>
);

const Countdown = () => {
  return (
    <Box mt={5} data-aos="fade-up">
      <Grid container spacing={3} mt={5} className="countdown-section">
        {/* Left Card */}
        <Grid item xs={12} md={6}>
          <Box className="countdown-card sourcing">
            <Box className="card-left">
              <Typography className="title">
                Product Sourcing Countdown
              </Typography>
              <CountdownBlock numbers="104692" />
            </Box>

            <Box className="card-right">
              <Image
                src="/bag.png"
                alt="Luxury women bag"
                width={150}
                height={150}
              />
              <Typography className="product-name">Luxury women bag</Typography>
              <Typography className="product-meta">⭐⭐⭐⭐⭐</Typography>
              <Typography className="product-meta">12,560 sold</Typography>
            </Box>
          </Box>
        </Grid>

        {/* Right Card */}
        <Grid item xs={12} md={6}>
          <Box className="countdown-card shipment">
            <Box className="card-left">
              <Typography className="title">
                Product Shipment Countdown
              </Typography>
              <CountdownBlock numbers="6928" />
            </Box>
            <Box className="card-right">
              <Image
                src="/necklace.png"
                alt="Necklace on jewelry"
                width={150}
                height={150}
              />
              <Typography className="product-name">
                Necklace on jewelry
              </Typography>
              <Typography className="product-meta">1 hour ago</Typography>
              <Typography className="product-meta">
                {`Shipping from: china > bd`}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Countdown;
