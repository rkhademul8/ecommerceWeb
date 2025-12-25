"use client";

import { Box } from "@mui/material";
import { pdf } from "@react-pdf/renderer";

import React, { useEffect, useState } from "react";
import copyIcone from "../../../../public/assests/Flightsearch/copyIcon.svg";
import FlightItinerary from "./FlightItinerary";
import PrintIcon from "@mui/icons-material/Print";
import SelectedFlightItinerary from "./SelectedFlightItinerary";
import { itinearyJsnon } from "./itinearyJsnon";
import { getMeAgent } from "@/features/agent/apis/service";

const FlightSelectItineraryPrintBtn = ({
  flightData,
  dictionary,
  markupPrice,
}: any) => {
  const [isClient, setIsClient] = useState(false);
  const [agent, setAgent] = useState<any>({});

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    (async () => {
      const {
        data: { payload: agent },
      } = await getMeAgent();
      setAgent(agent);
    })();
  }, []);

  const handleViewPDF = async () => {
    const blob = await pdf(
      <SelectedFlightItinerary
        flightData={flightData}
        // flightData={itinearyJsnon}
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
      <PrintIcon
        onClick={handleViewPDF}
        sx={{
          cursor: "pointer",
          color: "#9493bd",
          fontSize: "32px",
        }}
      />
    </Box>
  ) : (
    "Loading..."
  );
};

export default FlightSelectItineraryPrintBtn;
