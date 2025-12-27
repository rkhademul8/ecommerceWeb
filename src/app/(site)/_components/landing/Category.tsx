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
    <Grid mt={1} container spacing={5}>
      {categories.map((cat, idx) => (
        <Grid item xs={6} sm={4} md={2} lg={1.2} key={idx}>
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
                <CardContent>
                  <span className="category-title">{cat.name}</span>
                </CardContent>
              </Box>
            </Card>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default Category;
