"use client";

import { Box } from "@mui/material";
import { pdf } from "@react-pdf/renderer";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import PrintIcon from "@mui/icons-material/Print";
import FlightBookingCopy from "./FlightBookingCopy";
import { getMeAgent } from "@/features/agent/apis/service";
import FlightBookingCopyPriceEdit from "./FlightBookingCopyPriceEdit";
import PassengerFlightBookingCopyPriceEdit from "./PassengerFlightBookingCopyPriceEdit";

const FlightBookingCopyButtonPriceEdit = ({
  bookingDetails,
  editableTotals,
  setPDFPriceOpen,
  passengerId,
}: any) => {
  const [isClient, setIsClient] = useState(false);
  const [agent, setAgent] = useState<any>({});

  const passengerInformation = [
    bookingDetails.passengers.find((p: any) => p.id === passengerId),
  ];

  const passengerFareSummery = [
    editableTotals.find(
      (data: any) =>
        data?.passengerType === passengerInformation[0]?.passengerType
    ),
  ];

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

  const handleViewPDF = passengerId
    ? async () => {
        const blob = await pdf(
          <PassengerFlightBookingCopyPriceEdit
            bookingDetails={bookingDetails}
            price={"with Price"}
            agent={agent}
            editableTotals={editableTotals}
            passengerId={passengerId}
            passengerInformation={passengerInformation}
            passengerFareSummery={passengerFareSummery}
          />
        ).toBlob();
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");

        const link = document.createElement("a");
        link.href = url;
        link.download = `${bookingDetails?.TMLBookingRef}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      }
    : async () => {
        const blob = await pdf(
          <FlightBookingCopyPriceEdit
            bookingDetails={bookingDetails}
            agent={agent}
            editableTotals={editableTotals}
            passengerId={passengerId}
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
          setPDFPriceOpen(false);
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

export default FlightBookingCopyButtonPriceEdit;
