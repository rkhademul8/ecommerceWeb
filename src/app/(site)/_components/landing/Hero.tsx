"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";
import { Box, Grid } from "@mui/material";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { getBanners } from "@/features/company/banner/apis/service";

const Hero = () => {
  const [loading, setLoading] = useState<any>({});
  const [banners, setBanners] = useState<any>([]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading({ data: true });
      try {
        const query = {
          type: "Banner",
          location: "Public",
        };

        const {
          data: { payload },
        } = await getBanners(query);

        setBanners(payload.data);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading({ data: false });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const settings = {
    dots: loading.data ? false : true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 1,
    autoplay: true,
    arrows: false,
  };

  if (loading.data) return <div>loading..........</div>;

  return (
    <Box mt={2}>
      <Grid container>
        <Grid size={{ xs: 12, md: 12 }}>
          {banners?.length > 1 ? (
            <Box>
              <Slider {...settings}>
                {banners.map((data: any, index: number) => (
                  <Box key={index} className="banner-landing-image-container">
                    <Image
                      src={data.imgUrl}
                      alt={`Banner ${index}`}
                      fill
                      priority={index === 0}
                      className="banner-image"
                    />
                  </Box>
                ))}
              </Slider>
            </Box>
          ) : banners?.length === 1 ? (
            <Box className="banner-image-container">
              <Image
                src={banners[0].imgUrl}
                alt="Single Banner"
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>
          ) : null}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Hero;
