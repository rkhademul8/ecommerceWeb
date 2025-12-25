"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  Box,
  Grid,
  Typography,
  Divider,
  Dialog,
  TextField,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import "../../../scss/checkout/checkout.scss";
import { CustomInput } from "@/components/custom/CustomInput";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { CustomTextArea } from "@/components/custom/CustomTextArea";
import { CustomMenuItem } from "@/components/custom/CustomMenuItem";
import { allDistrictsOfBangladesh } from "@/utils/common/array/districts";
import { CustomAutocomplete } from "@/components/custom/CustomAutoComplete";
import secureLocalStorage from "react-secure-storage";
import { getJWT, isTokenValid } from "@/features/auth/service";
import { getMe } from "@/features/user/service";
import LoginModal from "../_components/auth/modal/LoginModal";
import { createOrder } from "@/features/order/order";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { fixImageUrl } from "@/utils/common/function/fix-image";
import PaymentFlow from "@/components/PaymentFlow";

export default function CheckoutPage() {
  const searchParams = useSearchParams();

  // Checkout states
  const [cart, setCart] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const [orderIdsArray, setOrderIdsArray] = useState<string[]>([]);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const totalProductPrice = cart?.sub_total || 0;
  const payNow = Math.round(totalProductPrice * 0.7);
  const payOnDelivery = totalProductPrice * 0.3;

  const handleChange = (e: any) => {
    const newData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newData);
  };

  useEffect(() => {
    (async () => {
      const token = getJWT();

      if (token && isTokenValid()) {

        const { data: { payload: user } } = await getMe();

        setLoggedIn(true);
        setFormData({
          firstname: user.firstname,
          lastname: user.lastname,
          contactNumber: user.phoneCode + user.phoneNo,
          emergencyPhone: user.phoneCode + user.phoneNo,
          district: user.city,
          city: user.city,
          address: user.address,
        });
      }
    })();
  }, []);

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
    const handleCartUpdate = () => loadCart();
    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);


  const handleSubmitOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!loggedIn) return setOpenLoginModal(true);

    const newData = {
      customerName: `${formData.firstname} ${formData.lastname}`,
      customerPhone: formData.contactNumber,
      customerEmergencyPhone: formData.emergencyPhone,
      district: formData.district,
      city: formData.city,
      address: formData.address,
      deliveryAddress: formData.address,
      deliveryMethod: formData.deliveryMethod === "Office Collection" ? "Office" : "Courier",
      customerNotes: formData.note,
      partialAmount: payNow,
      products: cart.items.map((item: any) => ({
        productCode: item.product.code,
        productTitle: item.product.title,
        sourceLink: item.product.sourceLink,
        productImage: fixImageUrl(item.product.image),
        orderItems: item.variations.map((v: any) => {
          const itemName = Object.entries(v.variant || {})
            .map(([key, value]) => `${key.trim().replace(/_/g, " ")}: ${value}`)
            .join(", ");
          return {
            itemName,
            itemImage: fixImageUrl(v.image) || null,
            price: +v.unit_price || 0,
            quantity: +v.quantity || 0,
          };
        }),
      })),
    };

    try {
      const response = await createOrder(newData);
      if (response?.data?.statusCode === 201) {
        const payload = response.data.payload;
        const orderIds = Array.isArray(payload)
          ? payload.map(item => item.id)
          : payload?.id
            ? [payload.id]
            : [];

        if (orderIds.length > 0) {
          setOrderIdsArray(orderIds);
          setPaymentModalOpen(true);
          secureLocalStorage.removeItem("cartData");
          window.dispatchEvent(new Event("cart-updated"));
        }
      }
    } catch (error) {
      const errorMessage = handleApiErrors(error);
      ErrorAlert(errorMessage);
    }
  };

  return (
    <Box className="root-container" mt={1}>
      <Box className="checkout-root">
        <Typography className="checkout-title">🛒 Checkout</Typography>
        <Divider />

        <form onSubmit={handleSubmitOrder}>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} md={8.5}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <label className="form-label">
                    <span className="form-required">*</span> First Name
                  </label>
                  <CustomInput
                    required
                    name="firstname"
                    value={formData.firstname || ""}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <label className="form-label">
                    <span className="form-required">*</span> Last Name
                  </label>
                  <CustomInput
                    required
                    name="lastname"
                    value={formData.lastname || ""}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <label className="form-label">
                    <span className="form-required">*</span> Contact Number
                  </label>
                  <CustomInput
                    required
                    name="contactNumber"
                    value={formData.contactNumber || ""}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <label className="form-label">
                    Emergency Phone <span className="form-text">(optional)</span>
                  </label>
                  <CustomInput
                    name="emergencyPhone"
                    value={formData.emergencyPhone || ""}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <label className="form-label">
                    <span className="form-required">*</span> District
                  </label>
                  <CustomAutocomplete
                    options={allDistrictsOfBangladesh}
                    getOptionLabel={(option: any) => option || ""}
                    renderOption={(props, option: any, { selected }) => (
                      <CustomMenuItem {...props} selected={selected}>
                        {option}
                      </CustomMenuItem>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        placeholder="Select District"
                        variant="outlined"
                        size="small"
                      />
                    )}
                    value={
                      allDistrictsOfBangladesh.find(
                        (district) => district === formData.district
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      handleChange({
                        target: { name: "district", value: newValue || "" },
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <label className="form-label">
                    <span className="form-required">*</span> City / Upazila
                  </label>
                  <CustomInput
                    required
                    name="city"
                    value={formData.city || ""}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <label className="form-label">
                    <span className="form-required">*</span> Address
                  </label>
                  <CustomInput
                    required
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <label className="form-label">
                    <span className="form-required">*</span> Delivery Method
                  </label>
                  <CustomSelect
                    required
                    displayEmpty
                    name="deliveryMethod"
                    onChange={handleChange}
                    value={formData.deliveryMethod || ""}
                    renderValue={(selected: any) => selected || "Select Method"}
                  >
                    <CustomMenuItem value="">Select Method</CustomMenuItem>
                    <CustomMenuItem value="Office Collection">
                      Office Collection
                    </CustomMenuItem>
                    <CustomMenuItem value="Home Delivery">
                      Home Delivery
                    </CustomMenuItem>
                  </CustomSelect>
                </Grid>

                <Grid item xs={12}>
                  <label className="form-label">
                    Order Note <span className="form-text">
                      (Please leave a note, if you have any special instruction about your order.)
                    </span>
                  </label>
                  <CustomTextArea
                    multiline
                    name="note"
                    value={formData.note || ""}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>

              <Box mt={3}>
                {cart?.items?.length > 0 ? (
                  cart.items.map((item: any, idx: number) => (
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

                          {item.variations?.map((variation: any, vIdx: number) => (
                            <Box key={vIdx} className="variant-row">
                              <Box className="variant-left">
                                {Object.entries(variation.variant || {}).map(([key, value]: any, i) => (
                                  <span key={i} className="variant-line">
                                    {key}: {value}
                                  </span>
                                ))}
                              </Box>

                              <Box className="variant-right">
                                <span className="variant-price">
                                  {variation.quantity} x ৳ {variation.unit_price}
                                </span>
                                <span className="variant-total">৳ {variation.price}</span>
                              </Box>
                            </Box>
                          ))}

                          <Divider />

                          <Box className="summary-footer">
                            <Typography className="summary-text">Item Summary</Typography>
                            <Typography className="summary-right">
                              {item.variations.reduce((sum: number, v: any) => sum + (v.quantity || 0), 0)} items
                            </Typography>
                            <Typography className="summary-right">
                              ৳ {item.variations.reduce((sum: number, v: any) => sum + (v.price || 0), 0).toFixed(2)}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  ))
                ) : (
                  <Typography className="empty-text">No order found.</Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={3.5}>
              <Box className="cart-summary-box">
                <Box textAlign="center">
                  <span className="summary-title">Payment Summary</span>
                </Box>

                <Divider sx={{ marginTop: "15px", marginBottom: "15px" }} />

                <Box className="summary-row">
                  <span>Product Price</span>
                  <span className="span">৳ {(+totalProductPrice || 0).toFixed(2)}</span>
                </Box>

                <Box className="summary-row">
                  <span>Pay Now (70%)</span>
                  <span className="span">৳ {(+payNow || 0).toFixed(2)}</span>
                </Box>

                <Box className="summary-row">
                  <span>Pay on Delivery</span>
                  <span className="span">৳ {(+payOnDelivery || 0).toFixed(0)} + Shipping & Courier Charge</span>
                </Box>

                <Box className="coupon-section">
                  <CustomInput
                    name="coupon"
                    value={formData.coupon || ""}
                    onChange={handleChange}
                    placeholder="Coupon Code"
                  />
                  <button className="apply-btn">Apply</button>
                </Box>

                {!loggedIn && (
                  <p className="login-footer">
                    Before placing your order, please{" "}
                    <span
                      className="link"
                      style={{ cursor: "pointer" }}
                      onClick={() => setOpenLoginModal(true)}
                    >
                      Sign in
                    </span>
                  </p>
                )}

                <button
                  type="submit"
                  className="checkout-btn"
                  disabled={!loggedIn || cart?.items?.length <= 0}
                >
                  Place Order & Pay
                </button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>

      <Dialog open={openLoginModal} onClose={() => setOpenLoginModal(false)}>
        <LoginModal setLoggedIn={setLoggedIn} setOpenLoginModal={setOpenLoginModal} />
      </Dialog>

      <PaymentFlow
        paymentModalOpen={paymentModalOpen}
        setPaymentModalOpen={setPaymentModalOpen}
        orderIds={orderIdsArray}
        payNow={+payNow}
        searchParams={searchParams}
        isOrder={false}
      />

    </Box>
  );
}
