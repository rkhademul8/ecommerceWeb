"use client";

import Marquee from "react-fast-marquee";
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getPublicNotices } from "@/features/company/notice/apis/service";

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [playMarquee, setPlayMarquee] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPublicNotices();
      setNotices(response.data?.payload?.data);
    };
    fetchData();
  }, []);

  return (
    <Box>
      {notices.length > 0 ? (
        <Box mt={1}>
          <Typography
            style={{
              display: "flex",
              fontSize: "14px",
              padding: "5px 10px",
              backgroundColor: "#da6363ff",
            }}
            onMouseLeave={() => setPlayMarquee(true)}
            onMouseEnter={() => setPlayMarquee(false)}
          >
            <Marquee play={playMarquee}>
              {notices?.map((data: any) => (
                <span
                key={data?.id}
                style={{
                  color: "#fff",
                  fontWeight: 500,
                  marginRight: "20px",
                }}
                >
                  {data?.description}
                </span>
              ))}
            </Marquee>
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
};

export default Notice;
