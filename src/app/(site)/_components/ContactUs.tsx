"use client";

import { Box, Divider, Grid } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import { officeLocations, supports } from "@/utils/common/array/contact-us";

import "../../../scss/contact-us.scss";

const ContactUs = () => {
  return (
    <Box className="root-container" data-aos="fade-up" mb={3} mt={2}>
      <h2 className="contact-us-title">Contact Details</h2>
      <Divider />
      <Box className="support-cards" mb={3} mt={3}>
        <Grid container spacing={2}>
          {supports.map((support, index) => (
            <Grid key={index} item xs={12} md={4}>
              <div className="support-card">
                <PhoneIcon className="icon" />
                <h3 className="title">{support.title}</h3>
                <span className="details">
                  {`${support.email} | ${support.phone}`}
                </span>
              </div>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box className="office-contact">
        <Grid container spacing={3}>
          {officeLocations.map((office: any, index) => (
            <Grid item key={index} md={4}>
              <div className="office-card">
                <h2 className="office-title">{office.location}</h2>
                <span className="office-details">
                  {office.email} | {office.phone}
                </span>
                <span className="office-address">{office.address}</span>
                <a href="https://maps.google.com" className="get-direction">
                  Get Direction
                </a>
              </div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ContactUs;
