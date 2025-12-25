"use client";

import { Box, Card, CardContent, CardMedia, Rating } from "@mui/material";

import "../../../../scss/shop/product-card.scss";
import { fixImageUrl } from "@/utils/common/function/fix-image";

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
  return (
    <Box
      className="product-card-link"
      onClick={() => window.open(`/product/${source}-${id}`, "_blank")}
    >
      <Card className="product-card">
        <CardMedia
          alt={name}
          component="img"
          className="product-card-img"
          image={fixImageUrl(image) || "/placeholder.png"}
          onContextMenu={(e) => e.preventDefault()}
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
          <span className="product-card-deli">CN to BD: 10-12 days</span>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductCard;
