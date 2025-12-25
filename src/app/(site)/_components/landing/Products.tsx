"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, GridLegacy as Grid, Typography } from "@mui/material";

import { productSearch } from "@/features/product/product";
import ProductCard from "../../shop/_components/ProductCard";
import ProductCardSkeleton from "../../shop/_components/ProductCardSkeleton";

export const categories = [
  {
    tag: "hand-bag",
    name: "Bag",
  },
  {
    tag: "sunglass",
    name: "Sunglass",
  },
  {
    tag: "shoes",
    name: "Shoes",
  },
  {
    tag: "jewelry",
    name: "Jewelry",
  },
  {
    tag: "beauty-products",
    name: "Beauty Products",
  },
  {
    tag: "womens-clothing",
    name: "Womens Clothing",
  },
];

const Products = () => {
  const router = useRouter();

  const [data, setData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    categories.forEach(async (cat) => {
      setLoading((prev) => ({ ...prev, [cat.tag]: true }));

      try {
        const params = {
          page: 1,
          limit: 12,
          searchString: cat.tag,
        };
        const {
          data: { payload },
        } = await productSearch(params);

        setData((prev) => ({
          ...prev,
          [cat.tag]: payload.items || [],
        }));
      } catch (error) {
        console.error(`Error fetching ${cat.name} products:`, error);
      } finally {
        setLoading((prev) => ({ ...prev, [cat.tag]: false }));
      }
    });
  }, [categories]);

  return (
    <Box mt={4}>
      {categories.map((cat) => (
        <Box key={cat.tag} sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }} mb={2}>
            <Typography className="normal-header">{cat.name}</Typography>
            <button
              className="view-all-btn"
              onClick={() => router.push(`/shop/${cat.tag}`)}
            >
              View All
            </button>
          </Box>

          <Grid container spacing={3}>
            {loading[cat.tag] ? (
              [...Array(6)].map((_, idx) => (
                <Grid item xs={6} md={2} key={idx}>
                  <ProductCardSkeleton />
                </Grid>
              ))
            ) : !data[cat.tag] || data[cat.tag].length < 1 ? (
              <Grid item xs={12}>
                <Typography className="err-msg">No products found</Typography>
              </Grid>
            ) : (
              data[cat.tag]?.slice(0, 6)?.map((item, idx) => (
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
              ))
            )}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default Products;
