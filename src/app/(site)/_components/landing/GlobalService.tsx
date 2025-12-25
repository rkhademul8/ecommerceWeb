"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";
import { Box, Typography } from "@mui/material";

const countries = [
  { name: "Bangladesh", code: "bd" },
  { name: "China", code: "cn" },
  { name: "India", code: "in" },
  { name: "UAE", code: "ae" },
  { name: "USA", code: "us" },
  { name: "UK", code: "gb" },
  { name: "Thailand", code: "th" },
  { name: "Malaysia", code: "my" },
  { name: "Turkey", code: "tr" },
  { name: "Bangladesh", code: "bd" },
  { name: "China", code: "cn" },
  { name: "India", code: "in" },
  { name: "UAE", code: "ae" },
  { name: "USA", code: "us" },
  { name: "UK", code: "gb" },
  { name: "Thailand", code: "th" },
  { name: "Malaysia", code: "my" },
  { name: "Turkey", code: "tr" },
];

const GlobalService = () => {
  return (
    <Box mt={5} data-aos="fade-up">
      <Typography className="normal-header" align="center">
        Global Shipping Services
      </Typography>

      <Box mt={4}>
        <Marquee speed={50} pauseOnHover gradient={false} loop={0}>
          {countries.map((c, idx) => {
            const logoSrc = `https://flagcdn.com/w40/${c.code}.png`;

            return (
              <Box key={idx} px={5} textAlign="center">
                <Image
                  src={logoSrc}
                  alt={c.name}
                  width={35}
                  height={35}
                  style={{ borderRadius: "50%" }}
                />
                <Box mt={2}>
                  <span className="normal-header-2">{c.name}</span>
                </Box>
              </Box>
            );
          })}
        </Marquee>
      </Box>
    </Box>
  );
};

export default GlobalService;
