"use client";

import { Box } from "@mui/material";
import { pdf } from "@react-pdf/renderer";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import PrintIcon from "@mui/icons-material/Print";
import FlightBookingCopy from "./FlightBookingCopy";
import { getMeAgent } from "@/features/agent/apis/service";

const FlightBookingCopyButton = ({
  bookingDetails,
  price,
  editableTotals,
  editUserPatableGrandTotal,
  setOpenDownloadModal,
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
      <FlightBookingCopy
        bookingDetails={bookingDetails}
        price={price}
        agent={agent}
        editableTotals={editableTotals}
        editUserPatableGrandTotal={editUserPatableGrandTotal}
      />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");

    const link = document.createElement("a");
    link.href = url;
    link.download = `${bookingDetails?.TMLBookingRef}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return isClient ? (
    <Box>
      <button
        className="booking-issue"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
        onClick={() => {
          handleViewPDF();
          setOpenDownloadModal(false);
        }}
      >
        <PrintIcon
          sx={{
            cursor: "pointer",
            color: "#ffffff",
            fontSize: "22px",
          }}
        />{" "}
        Download PDF With Price
      </button>
    </Box>
  ) : (
    "Loading..."
  );
};

export default FlightBookingCopyButton;
