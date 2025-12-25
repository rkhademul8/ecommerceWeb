"use client"

import { Box, Divider } from "@mui/material";

import "../../../scss/refund-policy.scss";

const RefundPolicy = () => {
  return (
    <Box className="root-container" data-aos="fade-up" mb={3} mt={2}>
      <h2 className="refund-policy-title">Refunds & Return Policy</h2>
      <Divider />
      <Box mt={2}>
        <span className="refund-section-text">
          Our products are shipped through various methods, including China
          local courier, by air, and by sea. Customs and the duty department may
          open cartons for inspection, which may result in product damage. We
          handle customer complaints with the utmost importance and strive to
          resolve any issues promptly.
        </span>

        <h3 className="refund-section-title">Conditions for Refund</h3>
        <span className="refund-section-text">
          If a product is damaged or broken upon receipt, please submit a claim
          with a photo within <strong>2 days</strong> of receiving the item.
        </span>
        <span className="refund-section-text">
          If the received product does not match the description on our site.
        </span>
        <span className="refund-section-text">
          If the size or color differs from your order.{" "}
          <em>
            (Please note, a color variation of 5%-10% due to lighting or
            resolution will not be considered a mismatch.)
          </em>
        </span>
        <span className="refund-section-text">
          No warranty is provided on electronic products.
        </span>
        <span className="refund-section-text">
          For valid refund issues, we will process your refund within{" "}
          <strong>7 business days</strong>.
        </span>

        <h3 className="refund-section-title">
          Conditions Where Return/Refund is Not Provided
        </h3>
        <span className="refund-section-text">
          If the item is not received due to an incorrect address.
        </span>
        <span className="refund-section-text">
          If you decide not to keep the product after it arrives at our
          Bangladesh warehouse or if you no longer need it.
        </span>
        <span className="refund-section-text">
          If customs or the duty department opens the carton and inspects the
          items.
        </span>
        <span className="refund-section-text">
          Once a product has been delivered from the supplier’s warehouse,
          returns are not possible. If the product is still in our warehouse and
          you wish to return it, you must cover the return shipping cost to the
          supplier as well as any shipment charges.
        </span>
        <span className="refund-section-text">
          For air shipments that exceed <strong>40 days</strong> and sea
          shipments that exceed <strong>90 days</strong>, refunds may be issued
          conditionally.
        </span>
      </Box>
    </Box>
  );
};

export default RefundPolicy;
