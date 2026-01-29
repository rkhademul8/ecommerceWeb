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
        <Box>
          <CardMedia
            alt={name}
            component="img"
            className="product-card-img"
            image={fixImageUrl(image) || "/placeholder.png"}
            onContextMenu={(e) => e.preventDefault()}
          />
        </Box>

        <CardContent className="product-card-content">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box className="product-card-price-rating">
              <span className="product-card-price">৳ {price}</span>
              <span className="home-product-old-price">৳ 200</span>
            </Box>
            <Box>
              <span className="product-card-sold">{soldCount || 0} SOLD</span>
            </Box>
          </Box>

          <span className="product-card-title">{name}</span>

          <span className="product-card-deli">
            China to Bangladesh: 10-12 days
          </span>
        </CardContent>

        <Box px={1} pb={2} pt={1}>
          <button className="product-add-to-cart">Add to cart </button>
        </Box>
      </Card>
    </Box>
  );
};

export default ProductCard;
