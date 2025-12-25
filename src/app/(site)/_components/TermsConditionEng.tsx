"use client"

import { Box, Divider } from "@mui/material";
import "../../../scss/terms-conditions.scss";

const TermsConditionEng = () => {
  return (
    <Box className="root-container" data-aos="fade-up" mb={3} mt={2}>
      <h2 className="terms-title">Terms & Conditions</h2>
      <Divider />
      <Box mt={2}>
        <p className="terms-section-text">
          Welcome to <strong>DESHMART BUSINESS LIMITED</strong>. Thank you for
          choosing us. Before making a purchase, please read and understand the
          following terms to avoid any post-purchase confusion. We aim to
          provide our customers with 100% clarity about our service so they can
          make informed decisions. For any questions, please contact us at{" "}
          <strong>01309977797</strong> or through our social media inbox.
        </p>

        <h3 className="terms-section-title">Inventory Policy</h3>
        <p className="terms-section-text">
          DESHMART BUSINESS LIMITED does not hold ready stock. We only purchase
          items from suppliers in China based on your specific orders.
        </p>

        <h3 className="terms-section-title">Payment Terms</h3>
        <p className="terms-section-text">
          A minimum of <strong>50% advance payment</strong> is required to place
          an order. The remaining 50% and shipping charges are payable upon
          delivery. For more details, call <strong>01309977797</strong> or
          message us on social media.
        </p>

        <h3 className="terms-section-title">Weight and Shipping Charges</h3>
        <p className="terms-section-text">
          The weights displayed on our site are based on supplier-provided data
          and may not be 100% accurate. Actual weight-based shipping and customs
          charges will be calculated upon arrival. Note that these charges are
          not included in the product price and will be assessed only when the
          product arrives. Shipping rates per kilogram are provided on the
          product page and checkout page, and the rate at the time of order will
          be applicable at delivery.
        </p>

        <h3 className="terms-section-title">Estimated Delivery Times</h3>
        <p className="terms-section-text">
          For commercial products arriving by air, expect delivery within{" "}
          <strong>15–20 days</strong> from the date they reach our warehouse.
          For sea shipping, it may take <strong>45–60 days</strong> from
          warehouse arrival.
        </p>

        <h3 className="terms-section-title">Local Delivery Charges</h3>
        <p className="terms-section-text">
          Local courier or transport charges within Bangladesh are not included
          in the product price.
        </p>

        <h3 className="terms-section-title">Return and Refund Policy</h3>
        <p className="terms-section-text">
          Please review our return and refund policy before purchasing. For
          products shipped by air, refunds may be considered only after{" "}
          <strong>40 days</strong>, and for products shipped by sea, after{" "}
          <strong>90 days</strong>, and will be subject to certain conditions.
          Refund applications will not be accepted before these timeframes.
        </p>

        <h3 className="terms-section-title">Prohibited Items</h3>
        <p className="terms-section-text">
          Items banned for import by customs authorities cannot be ordered. If
          an order is placed for a prohibited item, it will be canceled, and a{" "}
          <strong>2.50% gateway charge</strong> will be deducted from the
          refund.
        </p>

        <h3 className="terms-section-title">
          Partial Deliveries for Multiple Items
        </h3>
        <p className="terms-section-text">
          Orders with multiple items from different suppliers may arrive at
          different times. If you wish to receive partial delivery before the
          entire order arrives, you must pay the full remaining balance. For
          subsequent items, you will only need to pay the shipping or customs
          charges as applicable.
        </p>

        <p className="terms-section-text">
          These terms are designed to ensure a smooth shopping experience. If
          you have any uncertainties, feel free to reach out at{" "}
          <strong>01309977797</strong> or message us via our social media
          channels.
        </p>
      </Box>
    </Box>
  );
};

export default TermsConditionEng;
