"use client"

import { Box, Divider } from "@mui/material";
import "../../../scss/privacy-policy.scss";

const PrivacyPolicy = () => {
  return (
    <Box className="root-container" data-aos="fade-up" mb={3} mt={2}>
      <h2 className="privacy-policy-title">Privacy Policy</h2>
      <Divider />

      <Box mt={2}>
        <span className="privacy-section-text">
          Welcome to <strong>DESHMART BUSINESS LIMITED</strong>. We prioritize
          the privacy of our website users and are committed to protecting your
          information. This Privacy Policy outlines how we protect your privacy
          in detail, explaining the methods we use to safeguard your personal
          information. By accessing our site, either directly or through other
          means, you agree to the terms set forth in this policy.
        </span>

        <h3 className="privacy-section-title">Personal Information</h3>
        <span className="privacy-section-text">
          When you register on our website, we collect your phone number. When
          you place an order, we gather additional information, such as your
          name, phone number, email address, and address. All your data is
          securely stored on our protected servers, and we ensure the highest
          security standards.
        </span>

        <h3 className="privacy-section-title">Transaction Information</h3>
        <span className="privacy-section-text">
          To secure your transactions, we offer Mobile Financial Services (MFS)
          and direct bank transfer options. These methods ensure that your
          payment data remains safe and confidential. During payment, you will
          be guided through secure processes, and no sensitive banking
          information is stored on our servers to ensure maximum security.
        </span>

        <h3 className="privacy-section-title">Information Disclosure</h3>
        <span className="privacy-section-text">
          We do not share your personal information with any individual or
          organization, except for our courier service when shipping your
          ordered items. Should the courier company use this information for
          promotional or other purposes, we are not responsible for their
          actions. However, we may be required to disclose information to legal
          authorities if requested for investigative purposes.
        </span>

        <h3 className="privacy-section-title">Data Collection</h3>
        <span className="privacy-section-text">
          We use your provided information to process orders, provide necessary
          services, and fulfill your requests on our website. We also use your
          information to manage your account and validate and complete your
          payment transactions. Additionally, we may conduct research on our
          users’ demographics. If you do not wish to receive promotional
          information from us, you may opt out of this feature.
        </span>

        <h3 className="privacy-section-title">Changes to the Privacy Policy</h3>
        <span className="privacy-section-text">
          DESHMART BUSINESS LIMITED reserves the right to amend this Privacy
          Policy at any time. Should any changes be made, the revised policy
          will be posted here.
        </span>

        <h3 className="privacy-section-title">Your Consent</h3>
        <span className="privacy-section-text">
          By using our website, you consent to this Privacy Policy. If you have
          any questions or concerns about our privacy practices, please feel
          free to contact us.
        </span>

        <h3 className="privacy-section-title">Your Rights</h3>
        <span className="privacy-section-text">
          You have the right to access the personal data we hold or process
          about you. You also have the right to correct any inaccuracies in your
          data and may request that we stop using your data for direct marketing
          purposes at any time.
        </span>

        <h3 className="privacy-section-title">Contact Us</h3>
        <span className="privacy-contact-text">
          For any questions about our Privacy Policy, contact us at{" "}
          <strong className="contact-email">info@deshmart.com</strong>.
        </span>
      </Box>
    </Box>
  );
};

export default PrivacyPolicy;
