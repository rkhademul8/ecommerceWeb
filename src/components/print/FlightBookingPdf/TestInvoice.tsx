import { Box, GridLegacy as Grid, Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightIcon from "@mui/icons-material/Flight";
import Image from "next/image";
import SquareIcon from "@mui/icons-material/Square";
import commaNumber from "comma-number";

const TestInvoice = ({ bookingDetails }: any) => {
  function formatDuration(minutes: number): string {
    const duration = moment.duration(minutes, "minutes");
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const remainingMinutes = duration.minutes();

    if (days > 0) {
      return `${days}d ${hours}h ${remainingMinutes}m`;
    } else {
      return `${hours}h ${remainingMinutes}m`;
    }
  }

  const calculateTotals = (passengers: any) => {
    if (!Array.isArray(passengers)) {
      return [];
    }
    const totals = passengers.reduce((acc: any, passenger: any) => {
      const {
        passengerType,
        baseFare,
        markupAmount,
        serviceFee,
        totalTax,
        ticketingFee,
        userGeneralCommission,
        userExtraCommission,
        userTaxCommission,
        segmentCommissionAmount,
        userAIT,
        userPayable,
      } = passenger;
      if (!acc[passengerType]) {
        acc[passengerType] = {
          passengerType,
          totalBaseFare: 0,
          totalTax: 0,
          ticketingFee: 0,
          discount: 0,
          userAIT: 0,
          totalUserPayable: 0,
          passengerCount: 0,
        };
      }
      acc[passengerType].totalBaseFare = baseFare + markupAmount;
      acc[passengerType].totalTax = totalTax;
      acc[passengerType].ticketingFee = ticketingFee + serviceFee;
      acc[passengerType].discount = userAIT;
      acc[passengerType].userAIT = userAIT;
      acc[passengerType].discount =
        userGeneralCommission +
        userExtraCommission +
        userTaxCommission +
        segmentCommissionAmount;
      acc[passengerType].totalUserPayable = userPayable;
      acc[passengerType].passengerCount += 1;
      return acc;
    }, {});

    return Object.values(totals);
  };

  const totalsByPassengerType = calculateTotals(bookingDetails?.passengers);

  const groupedBaggage = bookingDetails?.baggage?.reduce(
    (acc: any, item: any) => {
      if (!acc[item.bookingPassengerType]) {
        acc[item.bookingPassengerType] = { checkIn: [], cabin: [] };
      }
      if (item.baggageType === "FirstCheckedBag") {
        acc[item.bookingPassengerType].checkIn.push(item);
      } else if (item.baggageType === "CarryOn") {
        acc[item.bookingPassengerType].cabin.push(item);
      }
      return acc;
    },
    {}
  );

  return (
    <Box>
      {/* passenger details */}
      <Box className="booking-confirm">
        <Typography className="booking-confirm-table-header" py={1}>
          Passenger Information
        </Typography>
        <table>
          <tr>
            <th>Passenger Name</th>
            <th>Type</th>
            <th>Nationality</th>
            <th>Passport</th>
            <th>DOB</th>
            <th>Ticket Status</th>

            {bookingDetails?.bookingStatus === "ISSUED" && (
              <th>E-ticket Number</th>
            )}           
          </tr>
          {bookingDetails?.passengers?.map((data: any, index: any) => (
            <tr key={index}>
              <td>
                {data?.title} {data?.firstName} {data?.lastName}
              </td>
              <td>{data?.passengerType}</td>
              <td>{data?.nationality}</td>
              <td>{data?.passportNumber}</td>
              <td>
                {data?.dateOfBirth !== null
                  ? moment(data?.dateOfBirth).format("MMM Do YY")
                  : "Date not available"}
              </td>
              <td>{data?.ticketStatus}</td>
              {bookingDetails?.bookingStatus === "ISSUED" && (
                <td>{data?.eTicketNo}</td>
              )}
            </tr>
          ))}
        </table>
      </Box>
      {/* itanary  */}
      <Box py={1}>
        <Typography className="booking-confirm-table-header" py={1}>
          Flight Itinerary
        </Typography>

        {bookingDetails?.originDestinationOptions?.map(
          (OriginDestination: any, index: any) => (
            <Box key={index} mt={1}>
              <Grid container spacing={2}>
                <Grid item xs={9}>
                  <Box className="itinerary-title" p={0.8} mb={1}>
                    <Typography>
                      {OriginDestination?.departureCode} -{" "}
                      {OriginDestination?.arrivalCode} |{" "}
                      {moment(OriginDestination?.departureDateTime).format(
                        "DD MMM YYYY, ddd "
                      )}{" "}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box className="itinerary-title" p={0.8} mb={1}>
                    <Typography>{bookingDetails?.airlinesPNR}</Typography>
                  </Box>
                </Grid>
              </Grid>
              <Grid container spacing={2} rowGap={1.5} key={index}>
                {OriginDestination?.segments.map((segment: any, index: any) => (
                  <>
                    <Grid
                      item
                      xs={9}
                      sx={{
                        position: "relative",
                      }}
                    >
                      {index > 0 ? (
                        <>
                          <Box
                            sx={{
                              position: "absolute",
                              width: "100%",
                              top: "-13px",
                            }}
                          >
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              justifyContent={"center"}
                            >
                              <Box
                                width="30%"
                                className="flight-dashboard"
                              ></Box>

                              <Box
                                textAlign={"center"}
                                display={"flex"}
                                alignItems={"center"}
                                gap={"5px"}
                              >
                                <ChangeCircleIcon className="layover-icone" />

                                <Typography className="flight-duration">
                                  <span className="layover-icone ">
                                    {" "}
                                    Plane change
                                  </span>{" "}
                                  {
                                    bookingDetails?.dictionary?.locations?.[
                                      segment?.originCode
                                    ]?.cityName
                                  }{" "}
                                  ({segment?.originCode}){" "}
                                  {formatDuration(
                                    Number(segment?.layoverTimeInMinutes)
                                  )}{" "}
                                  <span>Layover</span>
                                </Typography>
                              </Box>

                              <Box
                                width="30%"
                                className="flight-dashboard"
                              ></Box>
                            </Box>
                          </Box>
                        </>
                      ) : (
                        ""
                      )}
                      <Box key={index}>
                        <Box className="booking-itinerary">
                          <Grid
                            container
                            spacing={2}
                            display={"flex"}
                            alignItems={"center"}
                          >
                            <Grid item xs={12} sm={6} md={1.5}> 
                              <Box>
                                <Typography className="booking-itinerary-text">
                                  {
                                    bookingDetails?.dictionary?.airlines?.[
                                      segment?.marketingAirlineCode
                                    ]
                                  }
                                </Typography>
                                <Typography className="booking-itinerary-text">
                                  {segment?.marketingAirlineCode} -
                                  {segment?.marketingFlightNumber}
                                </Typography>
                              </Box>
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                              <Box>
                                <Typography className="booking-itinerary-text">
                                  {moment(segment?.departureDateTime).format(
                                    "DD MMM YYYY, ddd"
                                  )}
                                </Typography>
                                <Typography className="booking-itinerary-destination">
                                  {
                                    bookingDetails?.dictionary?.locations?.[
                                      segment?.originCode
                                    ]?.cityName
                                  }
                                </Typography>

                                <Typography className="booking-itinerary-text">
                                  {segment?.originCode},{" "}
                                  {
                                    bookingDetails?.dictionary?.locations?.[
                                      segment?.originCode
                                    ]?.airportName
                                  }
                                </Typography>
                                <Typography className="booking-itinerary-text">
                                  Terminal: {segment?.originTerminal}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={2.5}>
                              <Box
                                display={"flex"}
                                justifyContent={"space-between"}
                                alignItems={"center"}
                              >
                                <Typography className="booking-itinerary-destination">
                                  {moment
                                    .utc(segment?.departureDateTime)
                                    .format("HH : mm")}
                                </Typography>
                                <FlightTakeoffIcon className="booking-itineary-icon" />
                                <Typography className="booking-itinerary-destination">
                                  {moment
                                    .utc(segment?.arrivalDateTime)
                                    .format("HH : mm")}
                                </Typography>
                              </Box>

                              <Box sx={{ textAlign: "center" }} mt={1}>
                                <Typography className="booking-itinerary-text">
                                  Total Duration:{" "}
                                  {formatDuration(
                                    Number(segment?.durationInMinutes)
                                  )}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <Box sx={{ textAlign: "right" }}>
                                <Typography className="booking-itinerary-text">
                                  {moment(segment?.arrivalDateTime).format(
                                    "DD MMM YYYY, ddd"
                                  )}
                                </Typography>
                                <Typography className="booking-itinerary-destination">
                                  {
                                    bookingDetails?.dictionary?.locations?.[
                                      segment?.destinationCode
                                    ]?.cityName
                                  }
                                </Typography>

                                <Typography className="booking-itinerary-text">
                                  {segment?.destinationCode},{" "}
                                  {
                                    bookingDetails?.dictionary?.locations?.[
                                      segment?.destinationCode
                                    ]?.airportName
                                  }
                                </Typography>
                                <Typography className="booking-itinerary-text">
                                  Terminal: {segment?.destinationTerminal}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={3}>
                      <Box key={index} className="booking-confirmation-ticket">
                        <Box>
                          <Box
                            display={"flex"}
                            alignItems={"center"}
                            gap={"5px"}
                          >
                            <FlightIcon className="booking-ticket-icon" />
                            <Typography className="booking-confirmation-id-title">
                              {segment?.marketingAirlineCode} -
                              {segment?.marketingFlightNumber}
                            </Typography>
                          </Box>
                          <Box
                            display={"flex"}
                            alignItems={"center"}
                            gap={"5px"}
                          >
                            <SquareIcon className="booking-ticket-icon-square" />
                            <Typography className="booking-confirmation-id-title">
                               {segment?.aircraftType}
                            </Typography>
                          </Box>
                          <Box
                            display={"flex"}
                            alignItems={"center"}
                            gap={"5px"}
                          >
                            <SquareIcon className="booking-ticket-icon-square" />
                            <Typography className="booking-confirmation-id-title">
                              {segment?.cabinClass}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </>
                ))}
              </Grid>
            </Box>
          )
        )}
      </Box>
      {/* Fare summery  */}
      <Box className="booking-confirm">
        <Typography className="booking-confirm-table-header" py={1}>
          Fare Summery
        </Typography>
        <table>
          <tr>
            <th>Passenger Type</th>
            <th>Base Fare</th>
            <th>Tax</th>
            <th>Ticketing Fee</th>
            <th>AIT</th>
            <th>Discount</th>
            <th>Total Fare</th>
          </tr>
          {totalsByPassengerType.map((total: any, index: any) => (
            <tr key={index}>
              <td>
                {total.passengerType}x{total.passengerCount}
              </td>

              <td>{commaNumber(total.totalBaseFare)}</td>
              <td>{commaNumber(total.totalTax)}</td>
              <td>{commaNumber(total.ticketingFee)}</td>
              <td>{commaNumber(total.userAIT)}</td>
              <td>{commaNumber(total.discount)}</td>
              <td>{commaNumber(total.totalUserPayable)}</td>
            </tr>
          ))}
        </table>
        <Grid
          container
          spacing={2}
          display={"flex"}
          justifyContent={"flex-end"}
        >
          <Grid item xs={12} sm={6} md={2.2}>
            <Box className="booking-grand-total" mt={1}>
              <Typography>
                Grand Total: {commaNumber(bookingDetails?.userPayable)}{" "}
                {bookingDetails?.currency}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {/* Baggage */}
      <Box>
        <Typography className="booking-confirm-table-header" py={1}>
          Baggage Rules
        </Typography>
        <Grid container spacing={2}>
          {bookingDetails?.baggage &&
            Object.keys(groupedBaggage).map(
              (passengerType: any, index: any) => (
                <Grid key={index} item xs={12} sm={6} md={4}>
                  <Box className="booking-confirm">
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr>
                          <th>Passenger Type</th>
                          <th>Check-in</th>
                          <th>Cabin</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr key={passengerType}>
                          <td>
                            {passengerType === "ADT"
                              ? "Adult"
                              : passengerType === "CHD"
                              ? "Child"
                              : passengerType === "INF"
                              ? "Infant"
                              : passengerType === "CNN"
                              ? "Kid"
                              : "Infant seat"}
                          </td>
                          <td>
                            {groupedBaggage[passengerType].checkIn.map(
                              (item: any, index: any) => (
                                <div key={index}>
                                  ({item.departureCode}-{item.arrivalCode})
                                  {"   "}
                                  {item.baggageAmount} {item.unit}
                                </div>
                              )
                            )}
                          </td>
                          <td>
                            {groupedBaggage[passengerType].cabin.map(
                              (item: any, index: any) => (
                                <div key={index}>
                                  {item.baggageAmount} {item.unit}
                                </div>
                              )
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Box>
                </Grid>
              )
            )}
        </Grid>
      </Box>
    </Box>
  );
};

export default TestInvoice;
