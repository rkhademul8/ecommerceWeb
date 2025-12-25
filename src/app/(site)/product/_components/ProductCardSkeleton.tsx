import { Skeleton } from "@mui/material";

export const ProductCardSkeleton = () => (
  <div>
    <Skeleton variant="rectangular" height={140} />
    <Skeleton variant="text" />
    <Skeleton variant="text" width="60%" />
  </div>
);
