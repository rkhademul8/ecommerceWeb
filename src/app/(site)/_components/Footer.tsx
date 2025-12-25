"use client";

import Image from "next/image";
import Link from "next/link";
import { Box, Grid } from "@mui/material";

import "../../../scss/footer.scss";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import secureLocalStorage from "react-secure-storage";

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
                    src={String(safeLogoUrl)}
                    alt="DeshMart Logo"
                    width={180}
                    height={60}
                    style={{ width: "60%", height: "auto" }}
                  />
                </Link>
                <span className="description">
                  <strong>DeshMart Ltd</strong>, a sister concern of{" "}
                  <Link href="https://agent.tourmart.net/" target="_blank" rel="noopener noreferrer">
                    <strong>Tour Mart Ltd</strong>
                  </Link>. DeshMart provides reliable access to quality products sourced
                  directly from trusted suppliers in China, ensuring transparency, efficiency,
                  and end-to-end sourcing support.
                </span>
              </Grid>

              {/* Column 2 - Contact */}
              <Grid item xs={12} sm={6} md={3}>
                <span className="footer-title">Contact</span>

                <span className="footer-subtitle">
                  {`43, TSL Tower (Level 4), Sonargaon Janapath Road, Sector - 12,
                Uttara, Dhaka`}
                </span>
                <span className="footer-subtitle">
                  <EmailIcon fontSize="small" className="footer-icon" />
                  <a href="mailto:info@deshmart.com">info@deshmart.com</a>
                </span>
                <span className="footer-subtitle">
                  <PhoneIcon fontSize="small" className="footer-icon" />
                  <a href="tel:01309977797">01309977797</a>
                </span>
                <span className="footer-subtitle">
                  <PlaceIcon fontSize="small" className="footer-icon" />
                  <a
                    href="https://www.google.com/maps/place/TSL+TOWER/@23.873966,90.379859,16z/data=!4m6!3m5!1s0x3755c54c8918278f:0xcbb6403327f86de9!8m2!3d23.8739662!4d90.3798593!16s%2Fg%2F11ts18dqdp?hl=en&entry=ttu&g_ep=EgoyMDI1MTAyMi4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Find us on map
                  </a>
                </span>
              </Grid>

              {/* Column 3 - Info Links */}
              <Grid item xs={12} sm={6} md={3}>
                <span className="footer-title">Information</span>
                <ul className="footer-list">
                  <li>
                    <Link href="/about">About</Link>
                  </li>
                  <li>
                    <Link href="/contact-us">Contact</Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link href="/refunds-return-policy">Returns & Refund</Link>
                  </li>
                  <li>
                    <Link href="/terms-and-conditions">Terms & Conditions</Link>
                  </li>
                </ul>
              </Grid>

              {/* Column 4 - Social + Payments */}
              <Grid item xs={12} sm={6} md={3}>
                <span className="footer-title">Social Links</span>
                <Box className="social-icons" mb={2}>
                  <a
                    href="https://www.facebook.com/deshmartcom"
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
                    href="https://www.youtube.com/@deshmartltd"
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
                    href="https://www.instagram.com/desh_mart/"
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
          ©2025 <strong>DeshMart Ltd</strong> - All Rights Reserved | Developed by{" "}
          <a
            href="https://qodemart.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Qode Mart Ltd
          </a>
        </p>
      </Box>
    </Box>
  );
};

export default Footer;
