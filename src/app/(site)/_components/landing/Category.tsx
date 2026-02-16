"use client";

import {
  GridLegacy as Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Typography,
} from "@mui/material";
import { categories } from "@/utils/product-category/product-category";
import { useRouter } from "next/navigation";

import "../../../../scss/landing/category.scss";

const Category = () => {
  const router = useRouter();

  return (
    <Box mt={5}>
      <Grid mt={1} container spacing={1.5}>
        {categories.map((cat, idx) => (
          <Grid item xs={6} sm={4} md={1.5} key={idx}>
            <Box
              className="category-card-link"
              onClick={() => router.push(`/shop/${cat.tag}`)}
            >
              <Card className="category-card">
                <Box mt={1}>
                  <CardMedia
                    alt={cat.name}
                    component="img"
                    image={cat.image}
                    className="category-img"
                  />
                  <Box>
                    <Typography className="category-title">
                      {cat.name}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Category;
