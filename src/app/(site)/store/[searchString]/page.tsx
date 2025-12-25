"use client";

import { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";

import EmptyState from "../_components/EmptyState";
import ProductCard from "../_components/ProductCard";
import "../../../../scss/shop/store-page.scss";
import ProductCardSkeleton from "../_components/ProductCardSkeleton";

interface StorePageProps {
  params: { searchString: string };
}

export default function StorePage({ params }: StorePageProps) {
  const { searchString } = params;

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (!searchString) return;

        const params = {
          sellerId: searchString,
        };

        // const {
        //   data: { payload },
        // } = await getStoreDetails(params);

        // setResult(payload.items || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchString]);

  return (
    <Box className="root-container" mt={2}>
      <Box className="store-content">
        <Box className="results-header" mb={2}>
          <span className="title">SELLER</span>
          <span className="subtitle">{searchString}</span>
        </Box>

        {loading ? (
          <Grid container spacing={3} mb={2}>
            {[...Array(15)].map((_, idx) => (
              <Grid item xs={6} md={2} key={idx}>
                <ProductCardSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : results.length === 0 ? (
          <EmptyState
            title="Product Not Found"
            image="/product-not-found.jpg"
          />
        ) : (
          <Grid container spacing={3} mb={2}>
            {results.map((item, idx) => (
              <Grid item xs={6} md={2} key={idx}>
                <ProductCard
                  id={item.id}
                  source={"osee"}
                  name={item.title}
                  price={item.equivalentPrice?.current}
                  image={item.image}
                  soldCount={item.sales?.total || 0}
                  ratings={item.ratings?.score}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
