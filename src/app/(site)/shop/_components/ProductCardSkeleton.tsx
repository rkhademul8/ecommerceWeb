"use client";

import { Box, Card, CardContent, Skeleton } from "@mui/material";

export default function ProductCardSkeleton() {
  return (
    <Box>
      <Card
        sx={{
          height: "100%",
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        {/* Image Placeholder */}
        <Skeleton variant="rectangular" width="100%" height={220} />

        <CardContent>
          {/* Price */}
          <Skeleton width="40%" height={25} sx={{ mb: 1 }} />
          {/* Title lines */}
          <Skeleton width="80%" height={20} sx={{ mb: 1 }} />
           {/* Sold count */}
          <Skeleton width="30%" height={15} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    </Box>
  );
}
