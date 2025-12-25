"use client";

import Link from "next/link";
import { Box, Card, CardContent, CardMedia, Rating } from "@mui/material";

import "../../../../scss/shop/product-card.scss";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  id: string | number;
  source: string;
  name: string;
  price: number;
  image?: string;
  soldCount?: number;
  ratings?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  source,
  name,
  price,
  image,
  soldCount,
  ratings,
}) => {
  const router = useRouter();

  return (
    <Box
      className="product-card-link"
      onClick={() => router.push(`/product/${source}-${id}`)}
    >
      <Card className="product-card">
        <CardMedia
          alt={name}
          component="img"
          className="product-card-img"
          image={image || "/placeholder.png"}
        />

        <CardContent className="product-card-content">
          <Box className="product-card-price-rating">
            <span className="product-card-price">৳ {price}</span>
            <Rating
              name="read-only"
              value={ratings}
              precision={0.5}
              readOnly
              size="small"
              className="product-card-rating"
            />
          </Box>
          <span className="product-card-title">{name}</span>
          <span className="product-card-sold">{soldCount || 0} SOLD</span>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductCard;
