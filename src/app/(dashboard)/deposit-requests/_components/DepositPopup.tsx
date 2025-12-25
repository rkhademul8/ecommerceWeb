"use client";
import { Box, Modal } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useGetBannerQuery } from "@/features/company/banner/apis/queries";
import Slider from "react-slick";
import "../../../../scss/dashboard/popup.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { md: "65vw", sm: "80vw", xs: "100vw" },           
  px: { md: 4, sm: 4, xs: 4 },
  py: { md: 4, sm: 4, xs: 5 },
  borderRadius: "3px",
  outline: "none",
};

const DepositPopup = () => {
  const params = {
    type: "PopUp",
    location: "Deposit Request",
  };

  const depositPopup = localStorage.getItem("depositPopup");

  const { data } = useGetBannerQuery(params);
  const [openPopup, setPopup] = useState(false);

  useEffect(() => {
    if (depositPopup === "false") {
      // setPopup(false);
      setPopup(true);
    } else {
      if (data?.payload?.data?.length > 0) {
        setPopup(true);
      }
    }
  }, [data, depositPopup]);

  const handlePouUpClose = () => {
    setPopup(false);
    localStorage.setItem("depositPopup", JSON.stringify(false));
  };

  const closeModal = () => {
    setPopup(false);
    localStorage.setItem("depositPopup", JSON.stringify(false));
  };

  const settings = {
    arrows: true,
    dots: true,
    fade: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <Box>
      <Modal
        open={openPopup}
        onClose={handlePouUpClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} style={{ position: "relative" }}>
          <CloseIcon className="close-icon" onClick={closeModal} />
          <Box className="popupSlider">
            <Slider {...settings}>
              {data?.payload?.data?.map((item: any, index: any) => (
                <Box key={index}>
                  <Box
                    className="popup-bg-image"
                    style={{ backgroundImage: `url(${item?.imgUrl})` }}
                  ></Box>
                </Box>
              ))}
            </Slider>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default DepositPopup;
