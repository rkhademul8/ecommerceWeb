"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSafeJSON } from "@/utils/func/func";
import secureLocalStorage from "react-secure-storage";
import EmptyState from "../shop/_components/EmptyState";
import ProductCard from "../shop/_components/ProductCard";
import { Box, GridLegacy as Grid, IconButton, Tooltip } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ProductCardSkeleton from "../shop/_components/ProductCardSkeleton";

const Wishlistpage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<any[]>([]);

  const loadFavorites = () => {
    const saved = getSafeJSON("favoriteProducts", []);
    setFavorites(saved);
    setLoading(false);
  };

  useEffect(() => {
    loadFavorites();
    window.addEventListener("favorite-updated", loadFavorites);

    return () => {
      window.removeEventListener("favorite-updated", loadFavorites);
    };
  }, []);

  const removeFavorite = (id: any) => {
    const updated = favorites.filter((p: any) => p.id !== id);
    setFavorites(updated);
    secureLocalStorage.setItem("favoriteProducts", JSON.stringify(updated));
    window.dispatchEvent(new Event("favorite-updated"));
  };

  return (
    <Box className="root-container" mt={2}>
      <Box className="results-header" mb={2}>
        <span className="title">WISHLIST</span>
      </Box>

      {loading ? (
        <Grid container spacing={3} mb={2}>
          {[...Array(15)].map((_, idx) => (
            <Grid item xs={6} md={2.4} key={idx}>
              <ProductCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : favorites.length === 0 ? (
        <EmptyState title="Product Not Found" image="/product-not-found.jpg" />
      ) : (
        <Grid container spacing={3} mb={2}>
          {favorites.map((item, idx) => (
            <Grid item xs={6} md={2.4} key={idx}>
              <ProductCard
                id={item.id}
                source={item.source}
                name={item.title}
                price={item.price}
                image={item.image}
                soldCount={item.soldCount}
                ratings={item.ratings}
              />

              <Box display="flex" justifyContent="space-between" mt={1}>
                <button
                  style={{
                    flex: 1,
                    background: "#F3F3F3",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "none",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    router.push(`/product/${item.source}-${item.id}`)
                  }
                >
                  Buy Now
                </button>

                <Tooltip title="Remove Item" arrow>
                  <IconButton
                    onClick={() => removeFavorite(item.id)}
                    style={{
                      marginLeft: "8px",
                      background: "#D32F2F",
                      borderRadius: "10px",
                      cursor: "pointer",
                      color: "white",
                    }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Wishlistpage;
