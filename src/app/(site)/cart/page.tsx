"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import secureLocalStorage from "react-secure-storage";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import "../../../scss/cart/cart-page.scss";
import { getSafeJSON } from "@/utils/func/func";
import { useRouter } from "next/navigation";
import { fixImageUrl } from "@/utils/common/function/fix-image";

export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState<any>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editQty, setEditQty] = useState<number>(0);
  const [editItem, setEditItem] = useState<any>(null);

  useEffect(() => {
    const loadCart = () => {
      const storedData = secureLocalStorage.getItem("cartData");
      if (typeof storedData === "string") {
        try {
          const parsed = JSON.parse(storedData);
          setCart(parsed.result || { sub_total: 0, items: [] });
        } catch {
          setCart({ sub_total: 0, items: [] });
        }
      } else {
        setCart({ sub_total: 0, items: [] });
      }
    };

    loadCart();

    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  const handleOpenEdit = (item: any, variation: any) => {
    setEditItem({ ...item, variation });
    setEditQty(variation.quantity);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditItem(null);
  };

  const handleQuantityChange = (type: "inc" | "dec") => {
    setEditQty((prev) => (type === "inc" ? prev + 1 : Math.max(1, prev - 1)));
  };

  const handleUpdateItem = () => {
    if (!editItem) return;

    const cartData = getSafeJSON("cartData", {
      result: { sub_total: 0, items: [] },
    });

    const updatedItems = cartData.result.items.map((item: any) => {
      if (item._id === editItem._id) {
        const updatedVariations = item.variations.map((v: any) =>
          v.id === editItem.variation.id
            ? { ...v, quantity: editQty, price: editQty * v.unit_price }
            : v
        );

        return { ...item, variations: updatedVariations };
      }
      return item;
    });

    const sub_total = updatedItems.reduce((sum: number, item: any) => {
      return (
        sum +
        item.variations.reduce((acc: number, v: any) => acc + (v.price || 0), 0)
      );
    }, 0);

    const updatedCart = { result: { sub_total, items: updatedItems } };

    secureLocalStorage.setItem("cartData", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart-updated"));

    setOpenEdit(false);
    setEditItem(null);
  };

  const handleDeleteFromModal = () => {
    if (!editItem) return;

    const cartData = getSafeJSON("cartData", {
      result: { sub_total: 0, items: [] },
    });

    const updatedItems = cartData.result.items
      .map((item: any) => {
        if (item._id === editItem._id) {
          const remainingVariants = item.variations.filter(
            (v: any) => v.id !== editItem.variation.id
          );

          if (remainingVariants.length === 0) return null;

          return { ...item, variations: remainingVariants };
        }
        return item;
      })
      .filter(Boolean);

    const sub_total = updatedItems.reduce((sum: number, item: any) => {
      return (
        sum +
        item.variations.reduce((acc: number, v: any) => acc + (v.price || 0), 0)
      );
    }, 0);

    const updatedCart = { result: { sub_total, items: updatedItems } };

    secureLocalStorage.setItem("cartData", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart-updated"));

    setOpenEdit(false);
    setEditItem(null);
  };

  const handleDelete = (itemId: string) => {
    if (!cart) return;

    const updatedItems = cart.items.filter((item: any) => item._id !== itemId);

    const updatedCart = {
      result: {
        ...cart,
        items: updatedItems,
        sub_total: updatedItems.reduce((acc: number, item: any) => {
          const total = item.variations?.reduce(
            (sum: number, v: any) => sum + (v.price || 0),
            0
          );
          return acc + total;
        }, 0),
      },
    };

    secureLocalStorage.setItem("cartData", JSON.stringify(updatedCart));
    setCart(updatedCart.result);

    window.dispatchEvent(new Event("cart-updated"));
  };

  const totalProductPrice = cart?.sub_total || 0;
  const payNow = totalProductPrice * 0.7;
  const payOnDelivery = totalProductPrice * 0.3;

  return (
    <Box className="root-container" mt={1}>
      <Box className="cart-root">
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Typography className="cart-title">🛒 CART</Typography>
            <Divider />
          </Grid>

          <Grid item xs={12} md={8.5}>
            {cart?.items?.length > 0 ? (
              cart.items.map((item: any, idx: number) => {
                return (
                  <Box key={idx} className="cart-item-card">
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={2}>
                        <img
                          src={fixImageUrl(item.product.image)}
                          alt={item.product.title}
                          className="cart-image"
                        />
                      </Grid>

                      <Grid item xs={12} md={10}>
                        <span className="product-title">
                          {item.product.title}
                        </span>

                        {item.variations?.map(
                          (variation: any, vIdx: number) => (
                            <Box key={vIdx} className="variant-row">
                              <Box className="variant-left">
                                {Object.entries(variation.variant || {}).map(
                                  ([key, value]: any, i) => (
                                    <span key={i} className="variant-line">
                                      {key}: {value}
                                    </span>
                                  )
                                )}
                              </Box>

                              <Box className="variant-right">
                                <span className="variant-price">
                                  {variation.quantity} x ৳{" "}
                                  {variation.unit_price}
                                </span>
                                <span className="variant-total">
                                  ৳ {variation.price}
                                </span>
                                <button
                                  className="edit-button"
                                  onClick={() =>
                                    handleOpenEdit(item, variation)
                                  }
                                >
                                  Edit
                                </button>
                              </Box>
                            </Box>
                          )
                        )}

                        <Divider />

                        <Box className="summary-footer">
                          <Typography className="summary-text">
                            Item Summary
                          </Typography>
                          <Typography className="summary-right">
                            {item.variations.reduce(
                              (sum: number, v: any) => sum + (v.quantity || 0),
                              0
                            )}{" "}
                            items
                          </Typography>
                          <Typography className="summary-right">
                            ৳{" "}
                            {item.variations
                              .reduce(
                                (sum: number, v: any) => sum + (v.price || 0),
                                0
                              )
                              .toFixed(2)}
                          </Typography>

                          <Tooltip title="Remove Item" arrow>
                            <IconButton
                              className="delete-btn"
                              onClick={() => handleDelete(item._id)}
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                );
              })
            ) : (
              <Typography className="empty-text">
                Your cart is empty.
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={3.5}>
            <Box className="cart-summary-box">
              <Box textAlign="center">
                <span className="summary-title">Cart Summary</span>
              </Box>

              <Divider sx={{ marginTop: "15px", marginBottom: "15px" }} />

              <Box className="summary-row">
                <span>Product Price</span>
                <span className="span">
                  ৳ {(+totalProductPrice || 0).toFixed(2)}
                </span>
              </Box>

              <Box className="summary-row">
                <span>Pay Now (70%)</span>
                <span className="span">৳ {(+payNow || 0).toFixed(0)}</span>
              </Box>

              <Box className="summary-row">
                <span>Pay on Delivery</span>
                <span className="span">
                  ৳ {(+payOnDelivery || 0).toFixed(0)} + Shipping & Courier
                  Charge{" "}
                  {/* <Tooltip
                  title="Remaining balance payable on delivery + shipping charges"
                  arrow
                >
                  <InfoOutlinedIcon className="info-icon" />
                </Tooltip> */}
                </span>
              </Box>

              <button
                className="checkout-btn"
                disabled={cart?.items?.length <= 0}
                onClick={() => router.push("/checkout")}
              >
                Checkout
              </button>
            </Box>
          </Grid>
        </Grid>

        <Dialog
          open={openEdit}
          onClose={handleCloseEdit}
          sx={{
            "& .MuiDialog-paper": {
              width: "500px",
              margin: "auto",
              maxwidth: "500px",
            },
          }}
        >
          <DialogContent>
            {editItem && (
              <Box className="edit-modal">
                {Object.entries(editItem.variation.variant || {}).map(
                  ([key, value], idx) => (
                    <Typography key={idx} className="variant-info">
                      {key}: <span>{String(value)}</span>
                    </Typography>
                  )
                )}

                <Box className="qty-box">
                  <IconButton
                    className="qty-btn"
                    onClick={() => handleQuantityChange("dec")}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography className="qty-text">{editQty}</Typography>
                  <IconButton
                    className="qty-btn"
                    onClick={() => handleQuantityChange("inc")}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>

                <Box className="summary-line">
                  <Typography className="summary-chip">
                    Total Items: {editQty}
                  </Typography>
                  <Typography className="summary-chip">
                    Subtotal: ৳{" "}
                    {editQty * (editItem?.variation?.unit_price || 0)}
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>

          <DialogActions>
            <button onClick={handleDeleteFromModal} className="delete-modal-btn">
              Delete
            </button>
            <button onClick={handleCloseEdit} className="cancel-btn">
              Cancel
            </button>
            <button onClick={handleUpdateItem} className="update-btn">
              Update
            </button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
