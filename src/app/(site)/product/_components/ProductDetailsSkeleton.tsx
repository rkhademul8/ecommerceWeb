"use client";

import { Box, GridLegacy as Grid, Skeleton } from "@mui/material";

export default function ProductDetailsSkeleton() {
  return (
    <Box className="root-container">
      <Box className="product-details-page">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Skeleton
              variant="text"
              sx={{ fontSize: "24px", width: "60%", marginTop: "20px" }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" width="100%" height={300} />
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              {[...Array(4)].map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  width={60}
                  height={60}
                  sx={{ borderRadius: "8px" }}
                />
              ))}
            </Box>
            <Box mt={2}>
              <Skeleton variant="rounded" width={150} height={36} />
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            {[...Array(2)].map((_, i) => (
              <Box key={i} mb={3}>
                <Skeleton variant="text" width="40%" height={24} />
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  {[...Array(5)].map((_, j) => (
                    <Skeleton
                      key={j}
                      variant="rectangular"
                      width={50}
                      height={50}
                      sx={{ borderRadius: "6px" }}
                    />
                  ))}
                </Box>
              </Box>
            ))}

            <Skeleton
              variant="rectangular"
              width="100%"
              height={120}
              sx={{ borderRadius: "8px", mt: 2 }}
            />

            <Box mt={4}>
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  variant="text"
                  width={`${70 - i * 10}%`}
                  height={20}
                />
              ))}
            </Box>

            <Box mt={3} display="flex" gap={1}>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} variant="circular" width={35} height={35} />
              ))}
            </Box>

            <Box mt={3} display="flex" gap={2}>
              <Skeleton variant="rounded" width={120} height={40} />
              <Skeleton variant="rounded" width={120} height={40} />
              <Skeleton variant="rounded" width={60} height={40} />
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Skeleton variant="rectangular" width="100%" height={100} />

            <Box mt={3}>
              <Skeleton variant="rectangular" width="100%" height={180} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
