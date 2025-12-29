// "use client";

// import {
//   GridLegacy as Grid,
//   Card,
//   CardContent,
//   CardMedia,
//   Box,
//   Typography,
// } from "@mui/material";
// import { categories } from "@/utils/product-category/product-category";
// import { useRouter } from "next/navigation";

// import "../../../../scss/landing/category.scss";

// const Category = () => {
//   const router = useRouter();

//   return (
//     <Grid mt={1} container spacing={5}>
//       {categories.map((cat, idx) => (
//         <Grid item xs={6} sm={4} md={2} lg={1.2} key={idx}>
//           <Box
//             className="category-card-link"
//             onClick={() => router.push(`/shop/${cat.tag}`)}
//           >
//             <Card className="category-card">
//               <Box mt={1}>
//                 <CardMedia
//                   alt={cat.name}
//                   component="img"
//                   image={cat.image}
//                   className="category-img"
//                 />
//                 <CardContent>
//                   <span className="category-title">{cat.name}</span>
//                 </CardContent>
//               </Box>
//             </Card>
//           </Box>
//         </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default Category;

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

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 11,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2000,
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
        settings: { slidesToShow: 3 },
      },
    ],
  };

  return (
    <Box mt={8}>
      <Box mb={2}>
        <Typography className="top-categories-title">Top Categories</Typography>
      </Box>
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
