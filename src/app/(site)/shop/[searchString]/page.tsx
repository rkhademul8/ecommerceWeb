"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ProductCard from "../_components/ProductCard";
import { Box, GridLegacy as Grid, Typography } from "@mui/material";
import {
  productSearch,
  productSearchByImage,
  similerProductSearch,
} from "@/features/product/product";

import { useRouter } from "next/navigation";
import "../../../../scss/shop/shop-page.scss";
import EmptyState from "../_components/EmptyState";
import ProductCardSkeleton from "../_components/ProductCardSkeleton";
import { categories } from "@/utils/product-category/product-category";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import MenuIcon from "@mui/icons-material/Menu";

interface ShopPageProps {
  params: { searchString: string };
}

export default function ShopPage({ params }: ShopPageProps) {
  const router = useRouter();

  const { searchString } = params;

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [openCategory, setOpenCategory] = useState<any>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setMobileSidebarOpen(false);
      }
    }

    if (mobileSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileSidebarOpen]);

  const fetchResults = async (pageNumber = 1, append = false) => {
    try {
      if (!searchString) return;

      if (append) setLoadingMore(true);

      const [sourceStr, productIdStr] = searchString.split("-");
      let response;

      if (sourceStr !== "img") {
        if (sourceStr === "cat") {
          const params = {
            page: pageNumber,
            limit: 20,
            categoryId: productIdStr,
          };
          response = await similerProductSearch(params);
        } else {
          const params = { page: pageNumber, limit: 20, searchString };
          response = await productSearch(params);
        }
      } else {
        const params = {
          page: pageNumber,
          limit: 20,
          imageLocatorCode: productIdStr,
        };
        response = await productSearchByImage(params);
      }

      const payload = response?.data?.payload;
      const newItems = payload?.items || [];

      if (append) {
        setResults((prev) => [...prev, ...newItems]);
      } else {
        setResults(newItems);
      }

      setHasMore(newItems.length >= 20);
    } catch (error) {
      ErrorAlert("Error fetching search results");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setLoading(true);
    fetchResults(1, false);
  }, [searchString]);

  const formattedSearch = decodeURIComponent(searchString)?.replace(/-/g, " ");

  return (
    <Box className="root-container">
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Box
          ref={sidebarRef}
          className={`sidebar ${mobileSidebarOpen ? "open" : ""}`}
        >
          {categories.map((cat, i) => {
            const isOpen = openCategory === cat.tag;

            return (
              <Box key={i} className="category-wrapper">
                <Box
                  className="category-item"
                  onClick={() => setOpenCategory(isOpen ? null : cat.tag)}
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={30}
                    height={25}
                    className="category-img"
                  />
                  <span className="category-text">{cat.name}</span>
                  {isOpen ? (
                    <KeyboardArrowDownIcon className="arrow" />
                  ) : (
                    <KeyboardArrowRightIcon className="arrow" />
                  )}
                </Box>

                {isOpen && cat.subCategories && (
                  <Box className="subcategory-list">
                    {cat.subCategories.map((sub, idx) => (
                      <Typography
                        key={idx}
                        className="subcategory-item"
                        onClick={() =>
                          router.push(
                            `/shop/${encodeURIComponent(sub.searchTag)}`
                          )
                        }
                      >
                        {sub.name}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>

        <Box className="shop-content">
          <Box
            className="results-header"
            mb={2}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Box display="flex" alignItems="center" gap={1}>
                <MenuIcon
                  onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                  sx={{
                    display: { xs: "block", md: "none", color: "#000" },
                    cursor: "pointer",
                  }}
                />

                <span className="title">
                  Showing Results for{" "}
                  <span className="highlight">{formattedSearch}</span>
                </span>
              </Box>
              <span className="results-count">{results.length} Results</span>
            </Box>
          </Box>
          {loading ? (
            <Grid container spacing={3} mb={2}>
              {[...Array(15)].map((_, idx) => (
                <Grid item xs={6} md={2.4} key={idx}>
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
                <Grid item xs={6} md={2.4} key={idx}>
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

              <Grid item xs={12} mt={2} textAlign="center">
                {hasMore ? (
                  <button
                    className="view-all-btn"
                    onClick={() => {
                      const nextPage = page + 1;
                      setPage(nextPage);
                      fetchResults(nextPage, true);
                    }}
                  >
                    {loadingMore ? "Loading..." : "Load More"}
                  </button>
                ) : (
                  <Typography sx={{ fontSize: 13, color: "#777" }}>
                    No more products
                  </Typography>
                )}
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
}
