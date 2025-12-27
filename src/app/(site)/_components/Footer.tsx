"use client";

import Image from "next/image";
import Link from "next/link";
import { Box, GridLegacy as Grid } from "@mui/material";

import "../../../scss/footer.scss";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import secureLocalStorage from "react-secure-storage";
import logo from "../../../../public/assests/logo/logo.jpeg";

const Footer = () => {
  const logoUrl = secureLocalStorage.getItem("site-logo");
  const safeLogoUrl =
    logoUrl && logoUrl !== "null" && logoUrl !== "undefined"
      ? logoUrl
      : "/default-logo.png";
  return (
    <Box sx={{ borderTop: "2px solid #01783B" }} data-aos="fade-up">
      <Box className="root-container">
        <Box className="footer-root">
          <footer className="footer">
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={3}>
                <Link href="/">
                  <Image
                    // src={String(safeLogoUrl)}
                    src={logo}
                    alt="16anabd"
                    width={150}
                    height={50}
                    style={{ width: "40%", height: "auto" }}
                  />
                </Link>
                <span className="description">
                  <strong>16anabd</strong>, a sister concern of{" "}
                  <Link href="/" target="_blank" rel="noopener noreferrer">
                    <strong>T16anabd</strong>
                  </Link>
                  . 16anabd provides reliable access to quality products sourced
                  directly from trusted suppliers in China, ensuring
                  transparency, efficiency, and end-to-end sourcing support.
                </span>
              </Grid>

              {/* Column 2 - Contact */}
              <Grid item xs={12} sm={6} md={3}>
                <span className="footer-title">Contact</span>

                <span className="footer-subtitle">
                  {`Uttara Dhaka Bangladesh`}
                </span>
                <span className="footer-subtitle">
                  <EmailIcon fontSize="small" className="footer-icon" />
                  <a href="mailto:info@deshmart.com">info@16anabd.com</a>
                </span>
                <span className="footer-subtitle">
                  <PhoneIcon fontSize="small" className="footer-icon" />
                  <a href="tel:01309977797">0xxxxxxxx</a>
                </span>
                <span className="footer-subtitle">
                  <PlaceIcon fontSize="small" className="footer-icon" />
                  <a href="/" target="_blank" rel="noopener noreferrer">
                    Find us on map
                  </a>
                </span>
              </Grid>

              {/* Column 3 - Info Links */}
              <Grid item xs={12} sm={6} md={3}>
                <span className="footer-title">Information</span>
                <ul className="footer-list">
                  <li>
                    {/* <Link href="/about">About</Link> */}
                    <Link href="/">About</Link>
                  </li>
                  <li>
                    {/* <Link href="/contact-us">Contact</Link> */}
                    <Link href="/">Contact</Link>
                  </li>
                  <li>
                    {/* <Link href="/privacy-policy">Privacy Policy</Link> */}
                    <Link href="/">Privacy Policy</Link>
                  </li>
                  <li>
                    {/* <Link href="/refunds-return-policy">Returns & Refund</Link> */}
                    <Link href="/">Returns & Refund</Link>
                  </li>
                  <li>
                    {/* <Link href="/terms-and-conditions">Terms & Conditions</Link> */}
                    <Link href="/">Terms & Conditions</Link>
                  </li>
                </ul>
              </Grid>

              {/* Column 4 - Social + Payments */}
              <Grid item xs={12} sm={6} md={3}>
                <span className="footer-title">Social Links</span>
                <Box className="social-icons" mb={2}>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="facebook"
                  >
                    <Image
                      src="/facebook.png"
                      alt="Bank"
                      width={30}
                      height={30}
                    />
                  </a>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="youtube"
                  >
                    <Image
                      src="/youtube.png"
                      alt="Bank"
                      width={30}
                      height={30}
                    />
                  </a>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="instagram"
                  >
                    <Image
                      src="/instagram.png"
                      alt="Bank"
                      width={30}
                      height={30}
                    />
                  </a>
                  <a href="#">
                    <Image
                      src="/playstore.png"
                      alt="Google Play"
                      width={100}
                      height={30}
                    />
                  </a>
                </Box>
                <span className="footer-title">Payment Methods</span>
                <Box className="payment-icons">
                  <Image src="/bank.svg" alt="Bank" width={80} height={40} />
                  <Image src="/bkash.svg" alt="bKash" width={60} height={40} />
                  <Image src="/nagad.svg" alt="Nagad" width={60} height={40} />
                  <Image
                    src="/rocket.svg"
                    alt="Rocket"
                    width={80}
                    height={40}
                  />
                </Box>
              </Grid>
            </Grid>
          </footer>
        </Box>
      </Box>
      <Box className="footer-bottom">
        <p>
          ©2025 <strong>16anabd</strong> - All Rights Reserved | Developed by{" "}
          <a href="/" target="_blank" rel="noopener noreferrer">
            {" "}
            16anabd It
          </a>
        </p>
      </Box>
    </Box>
  );
};

export default Footer;
