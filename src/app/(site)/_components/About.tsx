"use client";

import { Box, Divider } from "@mui/material";
import "../../../scss/about.scss";

const About = () => {
  return (
    <Box className="root-container" data-aos="fade-up" mb={3} mt={2}>
      <h2 className="about-title">About Us</h2>
      <Divider />

      <Box mt={2}>
        <span className="about-section-text">
          Welcome to <strong>Ecommerce Wholesale Marketplace!</strong> We offer
          a vast selection of products from China, featuring hundreds of
          thousands of items. Our platform is crafted specifically for small to
          medium-sized entrepreneurs, retailers, and e-commerce businesses.
          Finding reliable manufacturers in China can be a challenge in product
          sourcing, but with <strong>DESHMART BUSINESS LIMITED</strong>, you can
          buy directly from manufacturers at authentic wholesale prices. Simply
          search by product name or use a photo to quickly find your desired
          items.
        </span>

        <h3 className="about-section-title">Our Delivery Promise</h3>
        <span className="about-section-text">
          After purchasing, your products will be delivered to the China
          warehouse and shipped to Bangladesh in{" "}
          <strong>10–15 days by air</strong> or{" "}
          <strong>30–40 days by sea</strong>. We manage all aspects of LC and
          customs, so you don’t have to. Shipping charges are only applicable
          upon product delivery.
        </span>

        <h3 className="about-section-title">Customer Support</h3>
        <span className="about-section-text">
          Our dedicated and experienced customer service team is ready to assist
          you at every step. Whether it’s sourcing, order updates, or
          after-sales service, we ensure you get a seamless experience.
        </span>

        <h3 className="about-section-title">Why Choose Us</h3>
        <span className="about-section-text">
          Start sourcing from <strong>DESHMART BUSINESS LIMITED</strong> today
          and elevate your business to the next level!
        </span>
      </Box>
    </Box>
  );
};

export default About;
