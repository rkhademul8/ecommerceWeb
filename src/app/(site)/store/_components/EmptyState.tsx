"use client";

import { Box } from "@mui/material";
import Image from "next/image";

interface EmptyStateProps {
  title?: string;
  image?: string;
}

export default function EmptyState({
  image = "/product-not-found.jpg",
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "50vh",  
      }}
    >
      <Image src={image} alt="No Data" width={250} height={250} /> 
    </Box>
  );
}
