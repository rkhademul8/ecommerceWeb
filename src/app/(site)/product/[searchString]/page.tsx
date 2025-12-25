"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  GridLegacy as Grid,
  Typography,
  Button,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
  Container,
  Modal,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import {
  getDescriptions,
  getProductDetails,
  similerProductSearch,
} from "@/features/product/product";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import "../../../../scss/product-details/product-details.scss";
import ProductDetailsSkeleton from "../_components/ProductDetailsSkeleton";
import secureLocalStorage from "react-secure-storage";
import { getSafeJSON } from "@/utils/func/func";
import Image from "next/image";
import ProductCard from "../../shop/_components/ProductCard";
import CloseIcon from "@mui/icons-material/Close";
import { fixImageUrl } from "@/utils/common/function/fix-image";
import ProductCardSkeleton from "../../shop/_components/ProductCardSkeleton";

interface ProductPageProps {
  params: { searchString: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();

  const { searchString } = params;

  const [tabIndex, setTabIndex] = useState(0);
  const [result, setResult] = useState<any>({});

  const [selectedImage, setSelectedImage] = useState("/no-image.png");

  const [isSaved, setIsSaved] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const [isFetching, setIsFetching] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedSku, setSelectedSku] = useState<any>({});
  const [packageInfo, setPackageInfo] = useState<any>([]);
  const [similerProducts, setSimilerProducts] = useState<any[]>([]);
  const [descriptionImageUrls, setDescriptionImageUrls] = useState<any[]>([]);

  const [selectedVariation, setSelectedVariation] = useState<any>({});
  const [quantities, setQuantities] = useState<{ [skuId: string]: number }>({});
  const [open, setOpen] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!searchString) return;

      setLoadingProduct(true);

      try {
        const [sourceStr, productIdStr] = searchString.split("-");
        const params = { source: sourceStr, productId: productIdStr };
        const {
          data: { payload },
        } = await getProductDetails(params);

        setResult(payload?.item || {});
      } catch {
        ErrorAlert("Error fetching product details");
      } finally {
        setLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [searchString]);

  useEffect(() => {
    const fetchSimilar = async () => {
      if (!result?.categoryRemote?.id) return;

      setLoadingSimilar(true);
      try {
        const {
          data: { payload },
        } = await similerProductSearch({
          page: 1,
          limit: 20,
          categoryId: result.categoryRemote.id,
        });
        setSimilerProducts(payload?.items || []);
      } catch {
        ErrorAlert("Error fetching search results");
      } finally {
        setLoadingSimilar(false);
      }
    };
    fetchSimilar();
  }, [result?.categoryRemote?.id]);

  useEffect(() => {
    (() => {
      const defaultVariation: any = {};
      let defaultImage = "";

      result.skuProps?.forEach((prop: any) => {
        if (prop.values?.length > 0) {
          const firstVal = prop.values[0];
          defaultVariation[prop.prop_name] = {
            pid: prop.pid,
            vid: firstVal.vid,
            name: firstVal.name,
          };

          if (firstVal.imageUrl) {
            defaultImage = firstVal.imageUrl;
          }
        }
      });

      const propsIds = Object.values(defaultVariation)
        .filter((v: any) => v?.pid && v?.vid)
        .map((v: any) => `${v.pid}:${v.vid}`)
        .sort()
        .join(";");

      const matchedSku = result?.itemSkus?.find(
        (sku: any) => sku.props_ids === propsIds
      );

      setSelectedImage(result?.images?.[0]);
      setSelectedSku(matchedSku || {});
      setSelectedVariation({ ...defaultVariation, image: defaultImage });
    })();
  }, [result]);

  useEffect(() => {
    const saved = getSafeJSON("favoriteProducts", []);
    const exists = saved.some((p: any) => p.id === result?.itemIdRemote);
    setIsSaved(exists);
  }, [result]);

  useEffect(() => {
    if (isFetching) return;
    if (!searchString) return;
    if (packageInfo?.length > 0) return;
    if (descriptionImageUrls?.length > 0) return;

    if (!hasFetched.current || tabIndex === 2 || tabIndex === 3) {
      const fetchDescription = async () => {
        setIsFetching(true);
        try {
          const [sourceStr, productIdStr] = searchString.split("-");
          const params = { source: sourceStr, productId: productIdStr };

          const {
            data: { payload },
          } = await getDescriptions(params);

          setPackageInfo(payload?.description?.packageInfo ?? []);
          setDescriptionImageUrls(
            payload?.description?.descriptionImageUrls ?? []
          );
          hasFetched.current = true;
        } catch (err) {
          console.log("Error fetching search results", err);
        } finally {
          setIsFetching(false);
        }
      };

      fetchDescription();
    }
  }, [searchString, tabIndex]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDetailsOpen = () => setDetailsOpen(true);
  const handleDetailsClose = () => setDetailsOpen(false);

  const handleQuantityChange = (skuId: string, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [skuId]: Math.max(0, value),
    }));
  };

  const increment = (skuId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [skuId]: (prev[skuId] || 0) + 1,
    }));
  };

  const decrement = (skuId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [skuId]: prev[skuId] > 0 ? prev[skuId] - 1 : 0,
    }));
  };

  const handleImageDownload = async (url: string) => {
    try {
      const response = await fetch(url, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `product-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("❌ Error downloading image:", error);
    }
  };

  const generateId = (length = 24) => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    return (timestamp + random).substring(0, length);
  };

  const handleSaveProduct = () => {
    let saved = getSafeJSON("favoriteProducts", []);

    if (isSaved) {
      saved = saved.filter((p: any) => p.id !== result?.itemIdRemote);
      setIsSaved(false);
    } else {
      saved.push({
        id: result.itemIdRemote,
        title: result.title,
        image: selectedImage,
        price: selectedSku.sale_price_bdt || 0,
        soldCount: result?.sales?.total || 0,
        ratings: result?.ratings?.score || 0,
        source: "osee",
        searchString,
      });
      setIsSaved(true);
    }

    secureLocalStorage.setItem("favoriteProducts", JSON.stringify(saved));
    window.dispatchEvent(new Event("favorite-updated"));
  };

  const handleAddToCartOrBuy = (action: "cart" | "buy") => {
    const totalQty = Object.values(quantities)
      .map(Number)
      .reduce((a, b) => a + (b || 0), 0);

    let totalAmount = 0;

    Object.entries(quantities).forEach(([skuId, qty]) => {
      const sku = result.itemSkus.find((s: any) => s.skuid === skuId);
      if (!sku) return;

      const unitPrice = Number(sku.sale_price_bdt) || 0;
      totalAmount += (qty || 0) * unitPrice;
    });

    if (totalQty < 3) {
      ErrorAlert("Minimum 3 products required.");
      return;
    }

    if (totalAmount < 1000) {
      ErrorAlert("Minimum BDT 1000 amount required.");
      return;
    }

    const existingData = getSafeJSON("cartData", {
      result: { sub_total: 0, items: [] },
    });

    const productIndex = existingData.result.items.findIndex(
      (item: any) =>
        item.product._id === (result?.id || "") ||
        item.product.code === (result?.productCode || searchString)
    );

    let targetItem;

    if (productIndex !== -1) {
      targetItem = existingData.result.items[productIndex];
    } else {
      targetItem = {
        _id: generateId(24),
        product: {
          _id: result?.id || generateId(24),
          code: result?.productCode || searchString,
          type: result?.itemSkus?.length > 1 ? "variable" : "simple",
          title: result?.title,
          image: selectedImage,
          sourceLink: result?.productDetailUrlRemote,
          minimum_order_qty: result?.minOrderQuantity || 1,
          quantity_ranges: result?.quantityRanges || [],
        },
        variations: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    Object.entries(quantities).forEach(([skuId, qty]) => {
      if (!qty || qty <= 0) return;

      const sku = result.itemSkus.find((s: any) => s.skuid === skuId);
      if (!sku) return;

      const unitPrice = Number(sku.sale_price_bdt) || 0;
      const price = qty * unitPrice;

      const variant = sku.props_names_translated
        ? Object.fromEntries(
            sku.props_names_translated
              .split(";")
              .map((pair: string) => {
                const [key, value] = pair.split(":").map((s) => s.trim());
                return [key || "Unknown", value || ""];
              })
              .filter(([key, _value]: [string, string]) => key)
          )
        : {};

      const variantIndex = targetItem.variations.findIndex(
        (v: any) => JSON.stringify(v.variant) === JSON.stringify(variant)
      );

      let variantImage = selectedImage;
      result.skuProps?.forEach((prop: any) => {
        const propIdPairs = sku.props_ids.split(";");
        const matchedPair = propIdPairs.find((p: any) =>
          p.startsWith(`${prop.pid}:`)
        );
        if (!matchedPair) return;

        const [, vid] = matchedPair.split(":");
        const matchedVal = prop.values.find((v: any) => v.vid == vid);
        if (matchedVal?.imageUrl) {
          variantImage = matchedVal.imageUrl;
        }
      });

      // console.log(variantImage);

      if (variantIndex !== -1) {
        targetItem.variations[variantIndex].quantity += qty;
        targetItem.variations[variantIndex].price =
          targetItem.variations[variantIndex].quantity *
          targetItem.variations[variantIndex].unit_price;
      } else {
        targetItem.variations.push({
          id: sku.skuid || generateId(32),
          quantity: qty,
          unit_price: unitPrice,
          price,
          variant,
          image: variantImage,
        });
      }
    });

    if (productIndex === -1) {
      existingData.result.items.push(targetItem);
    }

    existingData.result.sub_total = existingData.result.items.reduce(
      (acc: number, item: any) =>
        acc +
        item.variations.reduce(
          (sum: number, v: any) => sum + (v.price || 0),
          0
        ),
      0
    );

    secureLocalStorage.setItem("cartData", JSON.stringify(existingData));
    window.dispatchEvent(new Event("cart-updated"));

    // return;
    if (action === "buy") {
      router.push("/checkout");
    } else {
      router.push("/cart");
    }
  };

  const totalQty = Object.values(quantities).reduce(
    (acc, qty) => acc + qty || 0,
    0
  );

  const totalPrice = result?.itemSkus?.reduce((acc: number, sku: any) => {
    const qty = quantities[sku.skuid] || 0;
    return acc + qty * (Number(sku.sale_price_bdt) || 0);
  }, 0);

  const payNow = (+totalPrice || 0) * 0.7;
  const payOnDelivery = (+totalPrice || 0) * 0.3;

  if (loadingProduct) return <ProductDetailsSkeleton />;

  return (
    <Box className="root-container">
      <Box className="product-details-page">
        <Grid container>
          <Grid item xs={12} md={12} mt={3} mb={3}>
            <span className="product-title">{result?.title}</span>
          </Grid>
          <Grid item xs={12} md={4} className="product-images">
            <Box>
              <Box className="main-media">
                {selectedImage === "video" && result?.videoUrl ? (
                  <video
                    controls
                    autoPlay
                    width="95%"
                    height={375}
                    style={{
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      background: "#000",
                    }}
                  >
                    <source src={result.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <>
                    {/* Clickable main image */}
                    <div style={{ cursor: "pointer" }} onClick={handleOpen}>
                      <Image
                        alt="Product"
                        unoptimized
                        width={500}
                        height={500}
                        src={fixImageUrl(selectedImage)}
                        className="main-image"
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    </div>

                    <Modal open={open} onClose={() => setOpen(false)}>
                      <Box
                        sx={{
                          position: "fixed",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "90vw",
                          maxWidth: 600,
                          maxHeight: "90vh",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          outline: "none",
                        }}
                      >
                        <IconButton
                          onClick={() => setOpen(false)}
                          sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            backgroundColor: "rgba(0,0,0,0.4)",
                            "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
                            color: "#fff",
                          }}
                        >
                          <CloseIcon />
                        </IconButton>

                        <Image
                          alt="Product Preview"
                          unoptimized
                          src={fixImageUrl(selectedImage)}
                          width={0}
                          height={0}
                          style={{
                            width: "100%",
                            height: "auto",
                            maxHeight: "90vh",
                            borderRadius: "8px",
                            objectFit: "contain",
                          }}
                        />
                      </Box>
                    </Modal>
                  </>
                )}
              </Box>

              <Box className="thumbnail-list">
                {(result?.images?.length > 0 || result?.videoUrl) && (
                  <>
                    <Box className="image-gallery">
                      {result?.images?.map((img: any, index: number) => (
                        <Image
                          key={index}
                          alt=""
                          src={fixImageUrl(img)}
                          unoptimized
                          width={60}
                          height={60}
                          className="thumb"
                          onClick={() => setSelectedImage(img)}
                        />
                      ))}

                      {result?.videoUrl && (
                        <Box
                          className="thumb video-thumb"
                          onClick={() => setSelectedImage("video")}
                        >
                          <video
                            width="60"
                            height="60"
                            muted
                            loop
                            playsInline
                            style={{
                              borderRadius: "4px",
                              objectFit: "cover",
                              background: "#000",
                            }}
                          >
                            <source src={result.videoUrl} type="video/mp4" />
                          </video>
                          <span className="play-icon">▶</span>
                        </Box>
                      )}
                    </Box>

                    <br />

                    {selectedImage !== "video" && (
                      <Box className="download-section">
                        <button
                          className="download-btn"
                          onClick={() =>
                            handleImageDownload(fixImageUrl(selectedImage))
                          }
                        >
                          Download Image
                        </button>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={5} className="product-summary">
            <Box>
              <Box className="variation-section">
                {result?.skuProps?.map((prop: any, propIndex: number) => (
                  <Box key={propIndex} className="variation-block">
                    <span className="variation-title">{prop.prop_name}</span>

                    <Box className="variation-images" mt={1}>
                      {prop.values.map((val: any, index: number) => (
                        <Box
                          key={index}
                          className={`variation-option ${
                            selectedVariation?.[prop.prop_name]?.vid === val.vid
                              ? "active"
                              : ""
                          }`}
                          onClick={() => {
                            const newVariation = {
                              ...selectedVariation,
                              [prop.prop_name]: {
                                pid: prop.pid,
                                vid: val.vid,
                                name: val.name,
                              },
                              image: selectedImage,
                            };

                            setSelectedVariation(newVariation);

                            const propsIds = Object.values(newVariation)
                              .filter((v: any) => v?.pid && v?.vid)
                              .map((v: any) => `${v.pid}:${v.vid}`)
                              .sort()
                              .join(";");

                            const matchedSku = result?.itemSkus?.find(
                              (sku: any) => sku.props_ids === propsIds
                            );

                            setSelectedSku(matchedSku || {});
                          }}
                        >
                          <div className="thumb-wrapper">
                            {val.imageUrl ? (
                              <Box
                                display="flex"
                                alignItems="center"
                                sx={{ cursor: "pointer", gap: 0.5 }}
                                onClick={() => setSelectedImage(val.imageUrl)}
                              >
                                <Image
                                  alt=""
                                  unoptimized
                                  width={60}
                                  height={60}
                                  className="thumb"
                                  src={fixImageUrl(val.imageUrl)}
                                />

                                <Typography className="option-text">
                                  {val.name}
                                </Typography>
                              </Box>
                            ) : (
                              <Typography className="option-text">
                                {val.name}
                              </Typography>
                            )}

                            {(() => {
                              const isSelected =
                                selectedSku &&
                                selectedSku.props_ids?.includes(
                                  `${prop.pid}:${val.vid}`
                                ) &&
                                quantities[selectedSku.skuid] > 0;

                              const anyQty = result?.itemSkus?.some(
                                (sku: any) =>
                                  sku.props_ids?.includes(
                                    `${prop.pid}:${val.vid}`
                                  ) && (quantities[sku.skuid] || 0) > 0
                              );

                              if (isSelected || anyQty) {
                                const totalQty = result?.itemSkus
                                  ?.filter((sku: any) =>
                                    sku.props_ids?.includes(
                                      `${prop.pid}:${val.vid}`
                                    )
                                  )
                                  .reduce(
                                    (acc: number, sku: any) =>
                                      acc + (quantities[sku.skuid] || 0),
                                    0
                                  );

                                return (
                                  <span className="qty-badge">{totalQty}</span>
                                );
                              }

                              return null;
                            })()}
                          </div>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))}

                {/* Variation Table */}
                <Box className="variation-table">
                  <table className="sku-table">
                    <thead>
                      <tr>
                        <th style={{ width: "50%", color: "#000" }}>Product</th>
                        <th style={{ width: "25%", color: "#000" }}>Price</th>
                        <th style={{ width: "25%", color: "#000" }}>
                          Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSku?.props_names_translated ? (
                        <tr>
                          <td style={{ color: "#000" }}>
                            {selectedSku?.props_names_translated ||
                              "Select Variation"}
                          </td>
                          <td style={{ color: "#000" }}>
                            {selectedSku
                              ? `৳ ${+selectedSku.sale_price_bdt || 0}`
                              : "৳ -"}
                          </td>
                          <td>
                            <div className="quantity-wrapper">
                              <div className="quantity-control">
                                <button
                                  className="qty-btn"
                                  onClick={() => decrement(selectedSku.skuid)}
                                >
                                  -
                                </button>
                                <input
                                  value={quantities[selectedSku.skuid] || 0}
                                  min={0}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      selectedSku.skuid,
                                      Number(e.target.value)
                                    )
                                  }
                                />
                                <button
                                  className="qty-btn"
                                  onClick={() => increment(selectedSku.skuid)}
                                >
                                  +
                                </button>
                              </div>
                              <div className="stock">{selectedSku.stock}</div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <tr className="empty-row">
                          <td colSpan={3}>
                            No products selected — please select a product
                            variation.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Box>
              </Box>

              <Box className="product-meta">
                <Typography mb={1.5}>
                  <strong>Product Quantity:</strong>{" "}
                  <span style={{ color: "#000", fontFamily: "Outfit" }}>
                    {totalQty}
                  </span>
                </Typography>
                <Typography mb={1.5}>
                  <strong>Product Price:</strong>{" "}
                  <span style={{ color: "#000", fontFamily: "Outfit" }}>
                    ৳ {(+totalPrice || 0)?.toFixed(2)}
                  </span>
                </Typography>
                <Typography mb={1.5} className="shipping">
                  <strong>Shipping Charge:</strong> ৳ 750/1100 Per Kg{" "}
                  <span className="note" onClick={handleDetailsOpen}>
                    (বিস্তারিত)
                  </span>
                </Typography>
                <Typography mb={1.5}>
                  <strong>Approximate Weight:</strong>{" "}
                  <span style={{ color: "#000", fontFamily: "Outfit" }}>
                    Check below package info or contact support.
                  </span>
                </Typography>
                <Typography mb={1.5}>
                  <strong>Pay Now (70%):</strong>{" "}
                  <span style={{ color: "#000", fontFamily: "Outfit" }}>
                    ৳ {payNow.toFixed(2)}
                  </span>
                </Typography>
                <Typography>
                  <strong>Pay on Delivery:</strong>{" "}
                  <span style={{ color: "#000", fontFamily: "Outfit" }}>
                    ৳ {payOnDelivery.toFixed(2)} + চায়না কুরিয়ার বিল + চায়না
                    থেকে বাংলাদেশ শিপিং চার্জ
                  </span>
                </Typography>
              </Box>

              <Box className="extra-info">
                <Typography className="extra-label">
                  Product Code: {searchString}
                </Typography>
                <Typography className="extra-label">
                  Total Sold: {result?.saleCount || "N/A"}
                </Typography>
                <Box className="share-section">
                  <span className="share-label">Share:</span>

                  <Tooltip title="Facebook">
                    <IconButton
                      className="share-btn fb"
                      onClick={() =>
                        window.open(
                          `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
                          "_blank"
                        )
                      }
                    >
                      <FacebookIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="WhatsApp">
                    <IconButton
                      className="share-btn wa"
                      onClick={() =>
                        window.open(
                          `https://wa.me/?text=${window.location.href}`,
                          "_blank"
                        )
                      }
                    >
                      <WhatsAppIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Copy Link">
                    <IconButton
                      className="share-btn copy"
                      onClick={() =>
                        navigator.clipboard.writeText(window.location.href)
                      }
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Box className="action-buttons">
                <button
                  className="add-cart"
                  onClick={() => handleAddToCartOrBuy("cart")}
                >
                  Add to Cart
                </button>
                <button
                  className="buy-now"
                  onClick={() => handleAddToCartOrBuy("buy")}
                >
                  Buy Now
                </button>
                <button className="save-btn" onClick={handleSaveProduct}>
                  {isSaved ? "Unsave" : "Save"}
                </button>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={3} className="product-extra-summary">
            <Box>
              <Box className="disclaimer-box">
                <span className="disclaimer-title">
                  <i className="fas fa-info-circle"></i> Disclaimer
                </span>
                <span className="disclaimer-text">
                  উপরের উল্লেখিত মূল্য শুধুমাত্র পণ্যের ক্রয়মূল্য; পণ্যের ওজন
                  ১০০ ভাগ সঠিক নয়। বাংলাদেশে আসার পর পণ্যের প্রকৃত ওজন মেপে
                  শিপিং চার্জ আলাদাভাবে হিসাব করা হবে।
                </span>
              </Box>

              <Box className="seller-card">
                <Box className="seller-header">
                  <i className="fas fa-store"></i>
                  <Box className="seller-details">
                    <Typography className="seller-name">
                      {result?.vendor?.id}
                    </Typography>
                    <Typography className="seller-username">
                      {result?.vendor?.name}
                    </Typography>
                  </Box>
                </Box>

                <button
                  className="visit-store-btn"
                  onClick={() => router.push(`/store/${result?.vendor?.id}`)}
                >
                  Visit Seller Store
                </button>
              </Box>
            </Box>
          </Grid>

          <Container>
            <Grid item xs={12} md={12} mt={3} mb={3}>
              <Box className="product-tabs" mb={5}>
                <Tabs
                  value={tabIndex}
                  variant="scrollable"
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                  className="product-custom-tabs"
                  onChange={(e, v) => setTabIndex(v)}
                >
                  <Tab label="Similar Products" />
                  <Tab label="Specification" />
                  <Tab label="Package Info" />
                  <Tab label="Description" />
                  <Tab label="Seller Info" />
                </Tabs>

                {tabIndex === 0 && (
                  <Grid container spacing={3} mb={2}>
                    {loadingSimilar
                      ? [...Array(10)].map((_, idx) => (
                          <Grid item xs={6} md={2.4} key={idx}>
                            <ProductCardSkeleton />
                          </Grid>
                        ))
                      : similerProducts.map((item, idx) => (
                          <Grid item xs={6} md={2.4} key={idx}>
                            <ProductCard
                              id={item.id}
                              source="osee"
                              name={item.title}
                              price={item.equivalentPrice?.current}
                              image={item.image}
                              soldCount={item.sales?.total || 0}
                              ratings={item.ratings?.score}
                            />
                          </Grid>
                        ))}

                    <Grid item xs={12} mt={2} textAlign="center">
                      <button
                        className="view-all-btn"
                        onClick={() =>
                          router.push(`/shop/cat-${result?.categoryRemote?.id}`)
                        }
                      >
                        Load More
                      </button>
                    </Grid>
                  </Grid>
                )}

                {tabIndex === 1 && (
                  <Grid container spacing={0} className="spec-list">
                    {result?.productProperties?.map(
                      (prop: any, idx: number) => {
                        const [key, value] = Object.entries(prop)[0];
                        return (
                          <Grid
                            item
                            xs={12}
                            key={idx}
                            className={`spec-item ${
                              idx % 2 === 0 ? "even" : "odd"
                            }`}
                          >
                            <span className="spec-key">{key}</span>
                            <span className="spec-value">
                              {value as string}
                            </span>
                          </Grid>
                        );
                      }
                    )}
                  </Grid>
                )}

                {tabIndex === 2 && packageInfo && packageInfo.length > 0 && (
                  <table className="spec-table">
                    <thead>
                      <tr>
                        {packageInfo[0].map((header: string, idx: number) => (
                          <th key={idx}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {packageInfo
                        .slice(1)
                        .map((row: string[], rowIndex: number) => (
                          <tr
                            key={rowIndex}
                            className={rowIndex % 2 === 0 ? "even" : "odd"}
                          >
                            {row.map((cell: string, cellIndex: number) => (
                              <td key={cellIndex}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}

                {tabIndex === 3 && (
                  <Grid container spacing={0} className="">
                    {descriptionImageUrls?.map((img: any, index: number) => (
                      <Grid item xs={12} mb={1} key={index}>
                        <Image
                          alt=""
                          src={fixImageUrl(img)}
                          unoptimized
                          width={0}
                          height={0}
                          sizes="90vw"
                          style={{
                            width: "100%",
                            height: "auto",
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}

                {tabIndex === 4 && (
                  <Grid container spacing={0} className="seller-info-table">
                    <Grid item xs={12} className="seller-row even">
                      <span className="seller-key">Id</span>
                      <span className="seller-value">{result?.vendor?.id}</span>
                    </Grid>

                    <Grid item xs={12} className="seller-row odd">
                      <span className="seller-key">Name</span>
                      <span className="seller-value">
                        {result?.vendor?.name}
                      </span>
                    </Grid>

                    <Grid item xs={12} className="seller-row odd">
                      <span className="seller-key">Shop URL</span>
                      <span className="seller-value">
                        {result?.vendor?.url}
                      </span>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </Grid>
          </Container>
        </Grid>
      </Box>

      <Modal
        open={detailsOpen}
        onClose={handleDetailsClose}
        aria-labelledby="category-details-modal"
        aria-describedby="category-details-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#fff",
            borderRadius: "8px",
            boxShadow: 24,
            width: { xs: "90%", sm: "500px" },
            p: 3,
            outline: "none",
          }}
        >
          <IconButton
            onClick={handleDetailsClose}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "#f44336",
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography
            sx={{
              fontFamily: "Outfit",
              fontSize: "14px",
              color: "#000",
              lineHeight: 1.8,
            }}
          >
            <strong>ক্যাটাগরিঃ এ - 750 থেকে 950 টাকা প্রতি কেজি</strong>
            <br />
            প্রতি কেজি জুতা, ব্যাগ, জুয়েলারী,যন্ত্রপাতি, স্টিকার, ইলেকট্রনিক্স,
            কম্পিউটার এক্সেসরীস, সিরামিক, ধাতব, চামরা, রাবার,প্লাস্টিক জাতীয়
            পন্য, ব্যাটারি ব্যাতিত খেলনা।
            <br />
            <br />
            <strong>ক্যাটাগরিঃ বি - 1100 থেকে 1350 টাকা প্রতি কেজি</strong>
            <br />
            ব্যাটারি জাতীয় যেকোণ পন্য, ডুপ্লিকেট ব্রান্ড বা কপিঁ পন্য, জীবন্ত
            উদ্ভিদ, বীজ,রাসায়নীক দ্রব্য, খাদ্য,নেটওয়ার্কিং আইটেম, ম্যাগনেট বা
            লেজার জাতীয় পন্য।
            <br />
            <br />
            <strong>ক্যাটাগরিঃ সি</strong>
            <br />
            পোশাক বা যেকোন গার্মেন্টস আইটেম 850 থেকে 950 টাকা , হিজাব /ওড়না 850
            টাকা , পাউডার 1150 টাকা, পারফিউম 1250 টাকা, ট্রিমার 1380 টাকা ,
            সানগ্লাস 3500 টাকা , তরল পণ্য বা কসমেটিক্স 1200 টাকা থেকে 1350 টাকা,
            শুধু ব্যাটারি বা পাওয়ার ব্যাংক 1350 টাকা, স্মার্ট ওয়াচ 1250 থেকে
            1450 টাকা , সাধারন ঘড়ি 1300 টাকা , Bluetooth হেডফোন 1250 টাকা,
            চকলেট 3200 টাকা
          </Typography>

          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              variant="contained"
              onClick={handleDetailsClose}
              sx={{
                background: "#D32F2F",
                textTransform: "none",
                fontSize: "13px",
                px: 3,
                py: 0.7,
                fontFamily: "Outfit",
                borderRadius: "4px",
                "&:hover": {
                  background: "#B71C1C",
                },
              }}
            >
              Accept
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
