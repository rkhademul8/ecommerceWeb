"use client";

import { Box } from "@mui/material";
import { pdf } from "@react-pdf/renderer";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import copyIcone from "../../../../public/assests/Flightsearch/copyIcon.svg";
import camera from "../../../../public/assests/Flightsearch/camera.svg";
import FlightItinerary from "./FlightItinerary";
import PrintIcon from "@mui/icons-material/Print";
import SelectedFlightItinerary from "./SelectedFlightItinerary";
import { getMeAgent } from "@/features/agent/apis/service";

const FlightItineryButton = ({
  flightData,
  dictionary,
  markupPrice,
  agent,
}: any) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleViewPDF = async () => {
    const blob = await pdf(
      <FlightItinerary
        flightData={flightData}
        dictionary={dictionary}
        markupPrice={markupPrice}
        agent={agent}
      />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return isClient ? (
    <Box>
      <Image
        onClick={handleViewPDF}
        style={{ cursor: "pointer" }}
        width={20}
        src={camera}
        alt="copy-icon"
      />
    </Box>
  ) : (
    "Loading..."
  );
};

export default FlightItineryButton;
