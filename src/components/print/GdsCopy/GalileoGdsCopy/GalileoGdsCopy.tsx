import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import moment from "moment";
import commaNumber from "comma-number";
const GalileoGdsCopy = ({
  bookingDetails,
  price,
  agent,
  editableTotals,
  editUserPatableGrandTotal,
}: any) => {
  // Font.register({
  //   family: "Poppins",
  //   fonts: [
  //     {
  //       src: "https://fonts.gstatic.com/s/poppins/v15/pxiEyp8kv8JHgFVrJJfedw.ttf",
  //     },
  //   ],
  // });

  const styles = StyleSheet.create({
    page: {
      // fontFamily: "Poppins",
      paddingTop: 50,
      paddingBottom: 50,
      paddingHorizontal: 50,
    },
    // header: {
    //   position: "absolute",
    //   top: 50,
    //   left: 50,
    //   right: 50,
    //   height: 100,
    // },
  });

  const passengerTableStyles = StyleSheet.create({
    tableContainer: {
      borderTopWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: "#000",
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#B0E0E6",
      borderBottomWidth: 1,
      borderColor: "#000",
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: "#000",
    },
    cell: {
      borderRightWidth: 1,
      borderColor: "#000",
      padding: 4,
      fontSize: 8,
    },
    lastCell: {
      padding: 4,
      fontSize: 8,
    },
    col1: { width: "30%" },
    col2: { width: "20%" },
    col3: { width: "25%" },
    col4: { width: "25%" },
    sectionTitle: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      marginBottom: 4,
    },
  });

  const airlineTableStyles = StyleSheet.create({
    tableContainer: {
      borderTopWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 0.8,
      borderColor: "#000",
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#B0E0E6",
      borderBottomWidth: 1,
      borderColor: "#000",
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: "#000",
    },
    cell: {
      borderRightWidth: 1,
      borderColor: "#000",
      padding: 4,
      fontSize: 8,
    },
    lastCell: {
      padding: 4,
      fontSize: 8,
    },
    col1: { width: "50%" },
    col2: { width: "25%" },
    col3: { width: "25%" },

    sectionTitle: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      marginBottom: 4,
    },
  });

  const itineraryTableStyles = StyleSheet.create({
    tableContainer: {
      borderTopWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: "#000",
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#B0E0E6",
      borderBottomWidth: 1,
      borderColor: "#000",
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: "#000",
    },
    cell: {
      borderRightWidth: 1,
      borderColor: "#000",
      padding: 4,
      fontSize: 8,
    },
    lastCell: {
      padding: 4,
      fontSize: 8,
    },
    colFlight: { width: "13%" },
    colFrom: { width: "20%" },
    colTo: { width: "20%" },
    colDepart: { width: "12%" },
    colArrive: { width: "12%" },
    colSeat: { width: "5%" },
    colInfo: { width: "18%" },
    sectionTitle: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      marginBottom: 4,
    },
  });

  function formatDuration(minutes: number): string {
    const duration = moment.duration(minutes, "minutes");
    const totalHours = Math.floor(duration.asHours());
    const remainingMinutes = duration.minutes();
    return `${totalHours}h ${remainingMinutes}m`;
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

  const getSegmentBaggage = (departure: string, arrival: string) => {
    const checkIn = groupedBaggage?.ADT?.checkIn?.find(
      (bag: any) =>
        bag.departureCode === departure && bag.arrivalCode === arrival
    );

    const cabin = groupedBaggage?.ADT?.cabin?.find(
      (bag: any) =>
        bag.departureCode === departure && bag.arrivalCode === arrival
    );

    return {
      checkIn: checkIn
        ? `${checkIn.baggageAmount}${checkIn.unit || "K"}`
        : "N/A",
      cabin: cabin ? `${cabin.baggageAmount}${cabin.unit || "K"}` : "N/A",
    };
  };

  const updatedBaggageData = bookingDetails?.baggage.map((item: any) => ({
    ...item,
    sector: `${item.departureCode}-${item.arrivalCode}`,
  }));

  const segmentIcon =
    "https://tourmart-assets.s3.ap-south-1.amazonaws.com/logo/tourmart-logo-png.png";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* header section */}
        <View fixed>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: "10px",
                  fontFamily: "Helvetica-Bold",
                  color: "#000319",
                  paddingBottom: "1px",
                }}
              >
                {agent?.companyName}
              </Text>
              <Text
                style={{
                  fontSize: "9px",
                  color: "#000000",
                  paddingBottom: "1px",
                  width: "200px",
                }}
              >
                Address:{agent?.companyAddress}
              </Text>
              {/* <Text
                style={{
                  fontSize: "9px",
                  color: "#000000",
                  paddingBottom: "1px",
                }}
              >
                Sonargaon Janapath Road, Sector 12,
              </Text> */}
              {/* <Text
                style={{
                  fontSize: "9px",
                  color: "#000000",
                  paddingBottom: "1px",
                }}
              >
                Uttara, Dhaka -1230
              </Text> */}
              <Text
                style={{
                  fontSize: "9px",
                  color: "#000000",
                  paddingBottom: "1px",
                }}
              >
                Contact number: {agent?.companyPhoneCode}{" "}
                {agent?.companyPhoneNo}
              </Text>
              <Text
                style={{
                  fontSize: "9px",
                  color: "#000000",
                  paddingBottom: "1px",
                }}
              >
                Email address:{agent?.companyEmail}
              </Text>
            </View>
            {/* <View>
              <Image
                style={{ width: "200px", height: "30px" }}
                src={segmentIcon}
              />
            </View> */}
          </View>
        </View>

        <View
          style={{
            marginTop: "40px",
          }}
        >
          <Text
            style={{
              fontSize: "10px",
              fontFamily: "Helvetica-Bold",
              color: "#000319",
              paddingBottom: "1px",
            }}
          >
            Electronic Ticket
          </Text>
        </View>

        <View
          style={{
            marginTop: "15px",
          }}
        >
          <Text
            style={{
              fontSize: "10px",
              fontFamily: "Helvetica-Bold",
              color: "#000319",
              marginBottom: "5px",
            }}
          >
            Passenger Information
          </Text>

          <View style={passengerTableStyles.tableContainer}>
            <View style={passengerTableStyles.tableHeader}>
              <Text
                style={[passengerTableStyles.cell, passengerTableStyles.col1]}
              >
                Passenger Name
              </Text>
              <Text
                style={[passengerTableStyles.cell, passengerTableStyles.col2]}
              >
                Passport Number
              </Text>
              <Text
                style={[passengerTableStyles.cell, passengerTableStyles.col3]}
              >
                Frequent Flyer Number
              </Text>
              <Text
                style={[
                  passengerTableStyles.lastCell,
                  passengerTableStyles.col4,
                ]}
              >
                E-Ticket
              </Text>
            </View>

            {/* Rows */}
            {bookingDetails?.passengers?.map((data: any, index: any) => (
              <View key={index} style={passengerTableStyles.tableRow}>
                <Text
                  style={[passengerTableStyles.cell, passengerTableStyles.col1]}
                >
                  {data?.title?.toUpperCase()} {data?.firstName?.toUpperCase()}{" "}
                  {data?.lastName?.toUpperCase()}
                </Text>
                <Text
                  style={[passengerTableStyles.cell, passengerTableStyles.col2]}
                >
                  {data?.passportNumber?.toUpperCase() || "Domestic"}
                </Text>
                <Text
                  style={[passengerTableStyles.cell, passengerTableStyles.col3]}
                >
                  {data?.frequentFlyerNo?.toUpperCase()}
                </Text>
                <Text
                  style={[
                    passengerTableStyles.lastCell,
                    passengerTableStyles.col4,
                  ]}
                >
                  {data?.eTicketNo?.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>

          {/* airline */}

          <View
            style={{
              marginTop: "20px",
            }}
          >
            <View style={airlineTableStyles.tableContainer}>
              <View style={airlineTableStyles.tableHeader}>
                <Text
                  style={[airlineTableStyles.cell, airlineTableStyles.col1]}
                >
                  Airline
                </Text>
                <Text
                  style={[airlineTableStyles.cell, airlineTableStyles.col2]}
                >
                  PNR
                </Text>
                <Text
                  style={[airlineTableStyles.cell, airlineTableStyles.col3]}
                >
                  Date of Issue
                </Text>
              </View>

              {/* Rows */}

              <View style={airlineTableStyles.tableRow}>
                <Text
                  style={[airlineTableStyles.cell, airlineTableStyles.col1]}
                >
                  ({bookingDetails?.validatingAirline} -{" "}
                  {
                    bookingDetails?.dictionary?.airlines?.[
                      bookingDetails?.validatingAirline
                    ]
                  }
                  )
                </Text>
                <Text
                  style={[airlineTableStyles.cell, airlineTableStyles.col2]}
                >
                  {bookingDetails?.airlinesPNR}
                </Text>
                <Text
                  style={[airlineTableStyles.cell, airlineTableStyles.col3]}
                >
                  {moment(bookingDetails?.issuedDateTime).format("DD-MMM-YY")}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: "15px",
          }}
        >
          <Text
            style={{
              fontSize: "10px",
              fontFamily: "Helvetica-Bold",
              color: "#000319",
              marginBottom: "5px",
            }}
          >
            Itinerary Information
          </Text>

          <View style={itineraryTableStyles.tableContainer}>
            <View style={itineraryTableStyles.tableHeader}>
              <Text
                style={[
                  itineraryTableStyles.cell,
                  itineraryTableStyles.colFlight,
                ]}
              >
                Flight #
              </Text>
              <Text
                style={[
                  itineraryTableStyles.cell,
                  itineraryTableStyles.colFrom,
                ]}
              >
                From
              </Text>
              <Text
                style={[itineraryTableStyles.cell, itineraryTableStyles.colTo]}
              >
                To
              </Text>
              <Text
                style={[
                  itineraryTableStyles.cell,
                  itineraryTableStyles.colDepart,
                ]}
              >
                Depart
              </Text>
              <Text
                style={[
                  itineraryTableStyles.cell,
                  itineraryTableStyles.colArrive,
                ]}
              >
                Arrive
              </Text>
              <Text
                style={[
                  itineraryTableStyles.cell,
                  itineraryTableStyles.colSeat,
                ]}
              >
                Seat
              </Text>
              <Text
                style={[
                  itineraryTableStyles.lastCell,
                  itineraryTableStyles.colInfo,
                ]}
              >
                Info
              </Text>
            </View>

            {/* Table Rows should go here */}

            {bookingDetails?.originDestinationOptions?.map(
              (OriginDestination: any, segIndex: number) => (
                <React.Fragment key={segIndex}>
                  {OriginDestination?.segments.map(
                    (segment: any, index: number) => {
                      const baggage = getSegmentBaggage(
                        OriginDestination.departureCode,
                        OriginDestination.arrivalCode
                      );
                      return (
                        <View style={itineraryTableStyles.tableRow} key={index}>
                          {/* Flight Info */}
                          <Text
                            style={[
                              itineraryTableStyles.cell,
                              itineraryTableStyles.colFlight,
                            ]}
                          >
                            <Image
                              style={{ width: "15px", height: "15px" }}
                              src={`https://tourmart-assets.s3.ap-south-1.amazonaws.com/airline-logo/${
                                segment?.operatingAirline ||
                                segment?.marketingAirlineCode
                              }.png`}
                            />
                            {"\n"}
                            {"\n"}
                            <Text style={{ fontFamily: "Helvetica-Bold" }}>
                              {
                                bookingDetails?.dictionary?.airlines?.[
                                  segment?.operatingAirline ||
                                    segment?.marketingAirlineCode
                                ]
                              }
                            </Text>
                            {"\n"}
                            {"\n"}
                            <Text style={{ fontFamily: "Helvetica-Bold" }}>
                              {segment?.operatingAirline ||
                                segment?.marketingAirlineCode}{" "}
                              {segment?.operatingFlightNumber ||
                                segment?.marketingFlightNumber}
                            </Text>
                          </Text>

                          <Text
                            style={[
                              itineraryTableStyles.cell,
                              itineraryTableStyles.colFrom,
                            ]}
                          >
                            <Text style={{ fontFamily: "Helvetica-Bold" }}>
                              {
                                bookingDetails?.dictionary.locations?.[
                                  segment?.originCode
                                ]?.cityName
                              }
                            </Text>{" "}
                            -{"\n"} {"\n"}
                            <Text>
                              {
                                bookingDetails?.dictionary?.locations?.[
                                  segment?.originCode
                                ]?.airportName
                              }
                            </Text>
                            {"\n"} {"\n"}Terminal:{" "}
                            {segment?.originTerminal === "N/A"
                              ? ""
                              : segment?.originTerminal}
                          </Text>

                          {/* To */}
                          <Text
                            style={[
                              itineraryTableStyles.cell,
                              itineraryTableStyles.colTo,
                            ]}
                          >
                            <Text style={{ fontFamily: "Helvetica-Bold" }}>
                              {
                                bookingDetails?.dictionary.locations?.[
                                  segment?.destinationCode
                                ]?.cityName
                              }
                            </Text>{" "}
                            -{"\n"}
                            {"\n"}
                            <Text>
                              {
                                bookingDetails?.dictionary?.locations?.[
                                  segment?.destinationCode
                                ]?.airportName
                              }
                            </Text>
                            {"\n"}
                            {"\n"}Terminal:{" "}
                            {segment?.destinationTerminal === "N/A"
                              ? ""
                              : segment?.destinationTerminal}
                          </Text>

                          {/* Departure */}
                          <Text
                            style={[
                              itineraryTableStyles.cell,
                              itineraryTableStyles.colDepart,
                              { fontFamily: "Helvetica-Bold" },
                            ]}
                          >
                            {moment
                              .utc(segment?.departureDateTime)
                              .format("ddd")}
                            ,{"\n"}
                            {moment
                              .utc(segment?.departureDateTime)
                              .format("DD MMM YYYY")}
                            {"\n"} {"\n"}
                            <Text
                              style={{
                                fontFamily: "Helvetica-Bold",
                                fontSize: "12px",
                              }}
                            >
                              {moment
                                .utc(segment?.departureDateTime)
                                .format("HH:mm")}
                            </Text>
                          </Text>

                          {/* Arrival */}
                          <Text
                            style={[
                              itineraryTableStyles.cell,
                              itineraryTableStyles.colArrive,
                              { fontFamily: "Helvetica-Bold" },
                            ]}
                          >
                            {moment.utc(segment?.arrivalDateTime).format("ddd")}
                            ,{"\n"}
                            {moment
                              .utc(segment?.arrivalDateTime)
                              .format("DD MMM YYYY")}
                            {"\n"}
                            {"\n"}
                            <Text
                              style={{
                                fontFamily: "Helvetica-Bold",
                                fontSize: "12px",
                              }}
                            >
                              {moment
                                .utc(segment?.arrivalDateTime)
                                .format("HH:mm")}
                            </Text>
                          </Text>

                          {/* Seat (optional / empty) */}
                          <Text
                            style={[
                              itineraryTableStyles.cell,
                              itineraryTableStyles.colSeat,
                            ]}
                          />

                          <Text
                            style={[
                              itineraryTableStyles.lastCell,
                              itineraryTableStyles.colInfo,
                            ]}
                          >
                            Baggage: {baggage.checkIn}
                            {"\n"}
                            {/* Cabin: {baggage.cabin} */}
                            Duration:{" "}
                            {formatDuration(Number(segment?.durationInMinutes))}
                            {"\n"}
                            Status: Confirmed
                            {"\n"}
                            Aircraft:{" "}
                            {bookingDetails?.dictionary.aircrafts?.[
                              segment?.aircraftType
                            ] || "N/A"}
                            {"\n"}
                            Special Svc:
                          </Text>
                        </View>
                      );
                    }
                  )}
                </React.Fragment>
              )
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default GalileoGdsCopy;
