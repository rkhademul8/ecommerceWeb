"use client";

import { Card, CardContent, CardMedia, Box, Typography } from "@mui/material";
import { categories } from "@/utils/product-category/product-category";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import "../../../../scss/landing/category.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Category = () => {
  const router = useRouter();

  // Slick settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 11,
    slidesToScroll: 1,
    arrows: true,

    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 900,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2 },
      },
    ],
  };

  return (
    <Box mt={8}>
      <Slider {...settings}>
        {categories.map((cat, idx) => (
          <Box key={idx} px={1}>
            <Card
              className="category-card"
              onClick={() => router.push(`/shop/${cat.tag}`)}
            >
              <Box mt={1}>
                <CardMedia
                  alt={cat.name}
                  component="img"
                  image={cat.image}
                  className="category-img"
                />
                <CardContent>
                  <span className="category-title">{cat.name}</span>
                </CardContent>
              </Box>
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default Category;
