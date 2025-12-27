"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";
import { Box, GridLegacy as Grid, Typography } from "@mui/material";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { getBanners } from "@/features/company/banner/apis/service";
import Link from "next/link";
import "../../../../scss/landing/landing.scss";
import product1 from "../../../../../public/assests/product/product1.png";
import product2 from "../../../../../public/assests/product/product2.png";

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
      <Grid spacing={2} container>
        <Grid item xs={12} md={8}>
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
        <Grid item xs={12} md={4}>
          <Box className="promoCard">
            <Box className="content">
              <Typography className="title">New Arrivals</Typography>
              <Typography className="subtitle">Winter Sale 20% OFF</Typography>
              <Link href="/" className="cta">
                EXPLORE NOW
              </Link>
            </Box>

            <Box className="imageBox">
              <Image
              width={100}
              height={100}
              src={product1} alt="image"  />
            </Box>
          </Box>

          <Box className="promoCard" mt={1}>
            <Box className="content">
              <Typography className="title">New Arrivals</Typography>
              <Typography className="subtitle">Winter Sale 20% OFF</Typography>
              <Link href="/" className="cta">
                EXPLORE NOW
              </Link>
            </Box>

            <Box className="imageBox">
              <Image
              width={100}
              height={100}
              src={product2} alt="image"  />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Hero;
