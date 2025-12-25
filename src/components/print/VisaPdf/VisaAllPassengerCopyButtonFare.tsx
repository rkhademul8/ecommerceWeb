"use client";

import { Box } from "@mui/material";
import { pdf } from "@react-pdf/renderer";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import PrintIcon from "@mui/icons-material/Print";
import { getMeAgent } from "@/features/agent/apis/service";
import VisaPassengerCopy from "./VisaPassengerCopy";
import VisaAllPassengerCopy from "./VisaAllPassengerCopy";
import VisaAllPassengerCopyFare from "./VisaAllPassengerCopyFare";

const VisaAllPassengerCopyButtonFare = ({
  setAllPassengerOpen,
  booking,
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
      <VisaAllPassengerCopyFare agent={agent} booking={booking} />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");

    const link = document.createElement("a");
    link.href = url;
    link.download = `${booking?.visaRef}.pdf`;
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
          setAllPassengerOpen(false);
        }}
      >
        <PrintIcon
          sx={{
            cursor: "pointer",
            color: "#ffffff",
            fontSize: "22px",
          }}
        />{" "}
        Download PDF
      </button>
    </Box>
  ) : (
    "Loading..."
  );
};

export default VisaAllPassengerCopyButtonFare;
