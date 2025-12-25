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
const FlightBookingCopy = ({
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
      paddingTop: 60,
      paddingBottom: 60,
      paddingHorizontal: 30,
    },
    header: {
      position: "absolute",
      top: 0,
      left: 30,
      right: 30,
      height: 60,
    },
    footer: {
      position: "absolute",
      bottom: 0,
      left: 30,
      right: 30,
      height: 60,
    },
    headerText: {
      fontSize: 12,
    },

    logo: {
      width: 30,
      height: 30,
    },

    paragraphText1: {
      color: "#6e6996",
      fontSize: "8px",
      paddingBottom: "3px",
    },

    paragraphTextBold1: {
      color: "#0a0a0a",
      fontSize: "8px",
      fontWeight: 600,
      paddingBottom: "3px",
    },
    paragraphTextBold2: {
      color: "#0a0a0a",
      fontSize: "10px",
      fontWeight: 600,
      paddingBottom: "3px",
    },

    dashedLine: {
      width: "20%",
      borderBottomWidth: 1,
      borderBottomColor: "#6b6b6b",
      borderBottomStyle: "dashed",
      marginHorizontal: "5px",
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      fontSize: "10px",
      color: "#6b6b6b",
      textAlign: "center",
    },
    text2: {
      fontSize: "10px",
      color: "#6b6b6b",
    },

    direct: {
      fontSize: "10px",
      color: "green",
      textAlign: "center",
      position: "absolute",
      top: -14,
      left: 0,
      right: 0,
    },
    layover: {
      fontSize: "10px",
      color: "#6b6b6b",
      textAlign: "center",
      position: "absolute",
      top: 14,
      left: 0,
      right: 0,
    },

    layoverRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },

    layoverDashedLine: {
      width: "30%",
      borderBottomWidth: 1,
      borderBottomColor: "#6b6b6b",
      borderBottomStyle: "dashed",
      marginHorizontal: "5px",
    },

    table: {
      width: "100%",
    },
    tableRow: {
      flexDirection: "row",
      width: "100%",
      borderBottom: "0.2px solid #6e6996",
    },
    tableHeaderRow: {
      flexDirection: "row",
      width: "100%",
      backgroundColor: "#999DAA",
      borderRadius: 3,
      height: "20px",
    },
    tableCol: {
      width: "20%",
      padding: 5,
    },
    passengerNameHeader: {
      width: "40%",
    },
    passengerNameCell: {
      width: "40%",
    },
    tableHeaderCell: {
      fontSize: 9,
      textAlign: "center",
      color: "#fff",
    },
    tableBodyCell: {
      fontSize: 7,
      textAlign: "center",
      color: "#5D6170",
      fontWeight: 400,
    },

    borderColor1: {
      width: "16px",
      borderBottomWidth: 3,
      borderBottomColor: agent.brandColor ? agent.brandColor : "#D32F2F",
      borderBottomStyle: "solid",
      marginRight: "4px",
    },
    borderColor2: {
      width: "16px",
      borderBottomWidth: 3,
      borderBottomColor: agent.brandColor ? agent.brandColor : "#6e0a82",
      borderBottomStyle: "solid",
      marginRight: "4px",
    },
    borderColor3: {
      width: "16px",
      borderBottomWidth: 3,
      borderBottomColor: agent.brandColor ? agent.brandColor : "#0f9455",
      borderBottomStyle: "solid",
      marginRight: "4px",
    },

    headerCompanyTitle: {
      color: "#fff",
      fontSize: "24px",
      fontWeight: 600,
      paddingBottom: "5px",
      paddingTop: "50px",
      paddingLeft: "5px",
      paddingRight: "5px",
    },
    footerCompanyTitle: {
      color: "#0a0a0a",
      fontSize: "10px",
      fontWeight: 600,
      paddingBottom: "5px",
    },
    footerCompanyAddress: {
      color: "#6b6b6b",
      fontSize: "8px",
      paddingBottom: "5px",
    },
    titleHighlight: {
      color: "#D32F2F",
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

  const segmentIcon =
    "https://tourmart-assets.s3.ap-south-1.amazonaws.com/icons/FlightRouteIcon.jpg";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header  section*/}
        <View style={styles.header} fixed>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "20px",
            }}
          >
            {/* <View>
              {agent?.companyLogoUrl !== null ? (
                <Image
                  style={{ width: "100px", height: "100%" }}
                  src={agent?.companyLogoUrl}
                />
              ) : (
                ""
              )}
            </View> */}

            <View>
              {agent?.companyLogoUrl !== null ? (
                <Image
                  style={{ width: "100px", height: "25px" }}
                  src={agent?.companyLogoUrl}
                />
              ) : (
                ""
              )}
            </View>
            <View
              style={{
                paddingTop: "8px",
                backgroundColor: "#cdcfd8",
                marginTop: "-50px",
              }}
            >
              <Text style={styles.headerCompanyTitle}>E-Ticket</Text>
            </View>
          </View>
        </View>

        {/* Booking Details */}
        <View style={{ flexDirection: "row", gap: "8px", marginTop: "10px" }}>
          <View
            style={{
              flex: 9,
              border: "1px dashed #CDCFD8",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: "10px",
                padding: "8px 15px",
              }}
            >
              <View>
                <Text
                  style={{
                    color: "#5D6170",
                    fontSize: "8px",
                    paddingBottom: "5px",
                    fontWeight: 500,
                  }}
                >
                  Booking Id
                </Text>
                <Text
                  style={{
                    color: "#3E3E43",
                    fontSize: "9px",
                  }}
                >
                  {bookingDetails?.TMLBookingRef}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: "#5D6170",
                    fontSize: "8px",
                    paddingBottom: "5px",
                    fontWeight: 500,
                  }}
                >
                  Date of issue
                </Text>
                <Text
                  style={{
                    color: "#3E3E43",
                    fontSize: "9px",
                  }}
                >
                  {bookingDetails?.bookingStatus === "ON_HOLD" ? (
                    <>
                      {moment(bookingDetails?.createdDateTime).format(
                        "Do-MMM-YY"
                      )}
                    </>
                  ) : (
                    <>
                      {moment(bookingDetails?.issuedDateTime).format(
                        "Do-MMM-YY"
                      )}
                    </>
                  )}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: "#5D6170",
                    fontSize: "8px",
                    paddingBottom: "5px",
                    fontWeight: 500,
                  }}
                >
                  Status
                </Text>
                <Text
                  style={{
                    color: "#3E3E43",
                    fontSize: "9px",
                  }}
                >
                  {bookingDetails?.bookingStatus === "EXP_CNX"
                    ? "EXPIRED"
                    : bookingDetails?.bookingStatus?.replace(/_/g, "-")}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 3,
              backgroundColor: "#e5e9f2",
              padding: "5px 15px",
              borderRadius: "3px",
            }}
          >
            <Text
              style={{
                color: "#5D6170",
                fontSize: "8px",
                paddingBottom: "5px",
              }}
            >
              Airline PNR
            </Text>
            <Text
              style={{
                color: "#231F20",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {bookingDetails?.airlinesPNR}
            </Text>
          </View>
        </View>

        <View style={{ padding: "10px 0px" }}>
          <Text
            style={{
              color: "#231F20",
              fontSize: "11px",
              fontWeight: 1000,
              paddingBottom: "8px",
            }}
          >
            Passenger Information
          </Text>
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <View style={[styles.tableCol, styles.passengerNameHeader]}>
                <Text
                  style={[
                    styles.tableHeaderCell,
                    { alignSelf: "flex-start", paddingLeft: "15px" },
                  ]}
                >
                  Passenger Name
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeaderCell}>Type</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeaderCell}>Nationality</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeaderCell}>Passport</Text>
              </View>
              {["ISSUED", "REISSUED"].includes(
                bookingDetails?.bookingStatus
              ) && (
                <View style={styles.tableCol}>
                  <Text style={styles.tableHeaderCell}>E-Ticket</Text>
                </View>
              )}
            </View>

            {/* Table Rows */}
            {bookingDetails?.passengers?.map((data: any, index: any) => (
              <View style={styles.tableRow} key={index}>
                <View style={[styles.tableCol, styles.passengerNameCell]}>
                  <Text
                    style={[
                      styles.tableBodyCell,
                      { alignSelf: "flex-start", paddingLeft: "15px" },
                    ]}
                  >
                    {data?.title?.toUpperCase()}{" "}
                    {data?.firstName?.toUpperCase()}{" "}
                    {data?.lastName?.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableBodyCell}>
                    {data?.passengerType === "ADT"
                      ? "Adult"
                      : data?.passengerType === "CHD" ||
                        data?.passengerType === "CNN"
                      ? "Child"
                      : data?.passengerType === "INF" ||
                        data?.passengerType === "INS"
                      ? "Infant"
                      : ""}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableBodyCell}>
                    {data?.nationality?.toUpperCase() || "Bangladeshi"}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableBodyCell}>
                    {data?.passportNumber?.toUpperCase() || "Domestic"}
                  </Text>
                </View>
                {["ISSUED", "REISSUED"].includes(
                  bookingDetails?.bookingStatus
                ) && (
                  <View style={styles.tableCol}>
                    <Text style={styles.tableBodyCell}>
                      {data?.eTicketNo?.toUpperCase() || "N/A"}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/*  Flight Itineary */}

        <View style={{ padding: "10px 0px" }}>
          <Text
            style={{
              color: "#231F20",
              fontSize: "11px",
              fontWeight: 1000,
              paddingBottom: "8px",
            }}
          >
            Flight Itinerary
          </Text>

          {bookingDetails?.originDestinationOptions?.map(
            (OriginDestination: any, segIndex: any) => (
              <View key={segIndex}>
                <View style={{ flexDirection: "row", gap: "8px" }}>
                  <View
                    style={{
                      flex: 9,
                      backgroundColor: "#999DAA",
                      padding: "5px 4px",
                      borderRadius: "1px",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 9,
                        color: "#fff",
                      }}
                    >
                      {OriginDestination?.departureCode} -{" "}
                      {OriginDestination?.arrivalCode} |{" "}
                      {moment
                        .utc(OriginDestination?.departureDateTime)
                        .format("DD MMM YYYY, ddd")}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 3,
                      backgroundColor: agent?.brandColor
                        ? agent?.brandColor
                        : "#999DAA",
                      padding: "5px 4px",
                      borderRadius: "1px",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 9,
                        color: "#fff",
                      }}
                    >
                      {bookingDetails?.airlinesPNR || "Airline Pnr"}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    padding: "5px 0px",
                  }}
                >
                  {OriginDestination?.segments.map(
                    (segment: any, index: any) => (
                      <View key={index}>
                        {index > 0 ? (
                          <View
                            style={{
                              flexDirection: "row",
                              gap: "8px",
                              alignItems: "center",
                            }}
                            key={index}
                          >
                            <View
                              style={{
                                flex: 9,
                              }}
                            >
                              <View>
                                <View>
                                  <Text
                                    style={{
                                      fontSize: 5,
                                      color: "#F4696A",
                                      paddingBottom: "5px",
                                      textAlign: "center",
                                      marginTop: 3,
                                    }}
                                  >
                                    Transit in{" "}
                                    {
                                      bookingDetails?.dictionary?.locations?.[
                                        segment?.originCode
                                      ]?.cityName
                                    }{" "}
                                    ({segment?.originCode}){" "}
                                    {formatDuration(
                                      Number(segment?.layoverTimeInMinutes)
                                    )}{" "}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <View
                              style={{
                                flex: 3,
                                padding: "6px 4px",
                                borderRadius: "3px",
                                height: "100%",
                                flexDirection: "row",
                              }}
                            ></View>
                          </View>
                        ) : (
                          ""
                        )}

                        <View
                          style={{
                            flexDirection: "row",
                            gap: "8px",
                            alignItems: "center",
                          }}
                          key={index}
                        >
                          <View
                            style={{
                              flex: 9,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                gap: "3px",
                                alignItems: "center",
                                backgroundColor: "#EDF0F8",
                                padding: "6px 4px",
                                borderRadius: "3px",
                              }}
                            >
                              <View style={{ flex: 1 }}>
                                <Image
                                  style={{ width: "23px", height: "23px" }}
                                  src={`https://tourmart-assets.s3.ap-south-1.amazonaws.com/airline-logo/${
                                    segment?.operatingAirline ||
                                    segment?.marketingAirlineCode
                                  }.png`}
                                />
                              </View>
                              <View style={{ flex: 4 }}>
                                <Text
                                  style={{
                                    fontSize: 7,
                                    color: "#5D6385",
                                    padding: "2px",
                                  }}
                                >
                                  {moment
                                    .utc(segment?.departureDateTime)
                                    .format("DD MMM YYYY, ddd")}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 11,
                                    color: "#3E3E3F",
                                    padding: "2px",
                                    fontWeight: 500,
                                  }}
                                >
                                  {
                                    bookingDetails?.dictionary.locations?.[
                                      segment?.originCode
                                    ]?.cityName
                                  }
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 7,
                                    color: "#5D6385",
                                    padding: "2px",
                                  }}
                                >
                                  {segment?.originCode},{" "}
                                  {
                                    bookingDetails?.dictionary?.locations?.[
                                      segment?.originCode
                                    ]?.airportName
                                  }
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 7,
                                    color: "#5D6385",
                                    padding: "2px",
                                  }}
                                >
                                  Terminal: {segment?.originTerminal}
                                </Text>
                              </View>
                              <View style={{ flex: 3 }}>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    gap: "5px",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: "#231F20",
                                      fontSize: "12px",

                                      fontFamily: "Helvetica-Bold",
                                    }}
                                  >
                                    {moment
                                      .utc(segment?.departureDateTime)
                                      .format("HH:mm")}
                                  </Text>

                                  <Image
                                    style={{
                                      width: "16px",
                                      height: "16px",
                                      borderRadius: "50%",
                                    }}
                                    src={segmentIcon}
                                  />

                                  <Text
                                    style={{
                                      color: "#231F20",
                                      fontSize: "12px",
                                      fontFamily: "Helvetica-Bold",
                                    }}
                                  >
                                    {moment
                                      .utc(segment?.arrivalDateTime)
                                      .format("HH:mm")}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    textAlign: "center",
                                    marginTop: "5px",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 7,
                                      color: "#5D6385",
                                      padding: "2px",
                                    }}
                                  >
                                    Total Duration:{" "}
                                    {formatDuration(
                                      Number(segment?.durationInMinutes)
                                    )}
                                  </Text>
                                </View>
                              </View>
                              <View style={{ flex: 4, textAlign: "right" }}>
                                <Text
                                  style={{
                                    fontSize: 7,
                                    color: "#5D6385",
                                    padding: "2px",
                                  }}
                                >
                                  {moment
                                    .utc(segment?.arrivalDateTime)
                                    .format("DD MMM YYYY, ddd")}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 11,
                                    color: "#3E3E3F",
                                    padding: "2px",
                                    fontWeight: 500,
                                  }}
                                >
                                  {
                                    bookingDetails?.dictionary?.locations?.[
                                      segment?.destinationCode
                                    ]?.cityName
                                  }
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 7,
                                    color: "#5D6385",
                                    padding: "2px",
                                  }}
                                >
                                  {segment?.destinationCode},{" "}
                                  {
                                    bookingDetails?.dictionary?.locations?.[
                                      segment?.destinationCode
                                    ]?.airportName
                                  }
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 7,
                                    color: "#5D6385",
                                    padding: "2px",
                                  }}
                                >
                                  Terminal: {segment?.destinationTerminal}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View
                            style={{
                              flex: 3,
                              backgroundColor: "#EDF0F8",
                              padding: "6px 4px",
                              borderRadius: "3px",
                              height: "100%",
                              flexDirection: "row",
                            }}
                          >
                            <View>
                              <Text
                                style={{
                                  color: "#5E6170",
                                  fontSize: 8,
                                  paddingBottom: "4px",
                                  paddingTop: "2px",
                                }}
                              >
                                {segment?.marketingAirlineCode} -
                                {segment?.marketingFlightNumber}
                              </Text>
                              <Text
                                style={{
                                  color: "#5E6170",
                                  fontSize: 8,
                                  paddingBottom: "4px",
                                }}
                              >
                                {console.log(
                                  "Operation",
                                  bookingDetails?.dictionary?.aircrafts?.[
                                    segment.aircraftType
                                  ],
                                  segment.aircraftType,
                                  bookingDetails
                                )}
                                {bookingDetails?.dictionary?.aircrafts?.[
                                  segment.aircraftType
                                ]?.split(" ")}
                              </Text>

                              <Text
                                style={{
                                  color: "#5E6170",
                                  fontSize: 8,
                                  paddingBottom: "4px",
                                }}
                              >
                                Cabin class - {segment?.cabinClass}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    )
                  )}
                </View>
              </View>
            )
          )}
        </View>

        {/* Fare Summery */}

        {price === "with Price" && (
          <View>
            <View style={{ padding: "10px 0px" }}>
              <Text
                style={{
                  color: "#231F20",
                  fontSize: "11px",
                  fontWeight: 1000,
                  paddingBottom: "8px",
                }}
              >
                Fare Summary
              </Text>
              <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableHeaderRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableHeaderCell}>Passenger Type</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableHeaderCell}>Base Fare</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableHeaderCell}>Tax & Fees</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableHeaderCell}>Others</Text>
                  </View>

                  {/* <View style={styles.tableCol}>
                    <Text style={styles.tableHeaderCell}>AIT</Text>
                  </View> */}
                  {/* <View style={styles.tableCol}>
                    <Text style={styles.tableHeaderCell}>Discount</Text>
                  </View> */}
                  <View style={styles.tableCol}>
                    <Text style={styles.tableHeaderCell}>Total Pax</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableHeaderCell}>Sub Total</Text>
                  </View>
                </View>
                {editableTotals?.map((total: any, index: number) => (
                  <View style={styles.tableRow} key={index}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableBodyCell}>
                        {total.passengerType === "ADT"
                          ? "Adult"
                          : total.passengerType === "CHD"
                          ? "Child"
                          : total.passengerType === "INF"
                          ? "Infant"
                          : total.passengerType === "CNN"
                          ? "Child"
                          : total.passengerType === "INS"
                          ? "Infant"
                          : ""}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableBodyCell}>
                        {commaNumber(total.totalBaseFare)}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableBodyCell}>
                        {commaNumber(total.totalTax)}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableBodyCell}>
                        {commaNumber(total.ticketingFee)}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableBodyCell}>
                        {total.passengerCount}
                      </Text>
                    </View>

                    {/* <View style={styles.tableCol}>
                      <Text style={styles.tableBodyCell}>
                        {commaNumber(total.userAIT)}
                      </Text>
                    </View> */}
                    {/* <View style={styles.tableCol}>
                      <Text style={styles.tableBodyCell}>
                        {commaNumber(total.discount)}
                      </Text>
                    </View> */}
                    <View style={styles.tableCol}>
                      <Text style={styles.tableBodyCell}>
                        {commaNumber(
                          (+total.totalUserPayable +
                            +total.discount -
                            +total?.userAIT) *
                            Number(total.passengerCount)
                        )}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                paddingTop: "5px",
              }}
            >
              <Text
                style={{
                  fontSize: "8px",
                  borderRadius: "2px",
                  color: "#5D6170",
                }}
              >
                AIT & VAT:{" "}
                {commaNumber((+bookingDetails.userAIT || 0).toFixed(2))}{" "}
                {bookingDetails?.currency}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                paddingTop: "5px",
              }}
            >
              <Text
                style={{
                  fontSize: "9px",
                  color: "#fff",
                  backgroundColor: agent.brandColor
                    ? agent.brandColor
                    : "#F1666A",
                  padding: "4px 6px",
                  borderRadius: "2px",
                }}
              >
                Grand Total:{" "}
                {commaNumber(
                  (
                    +bookingDetails.baseFare +
                    +bookingDetails.markupAmount +
                    +bookingDetails.totalTax +
                    +bookingDetails.ticketingFee +
                    +bookingDetails.userAIT
                  ).toFixed(2)
                )}{" "}
                {bookingDetails?.currency}
              </Text>
            </View>
          </View>
        )}

        {/* baggage information */}
        <View style={{ padding: "0px 0px" }}>
          <Text
            style={{
              color: "#231F20",
              fontSize: "11px",
              fontWeight: 1000,
              paddingBottom: "8px",
            }}
          >
            Baggage Rules
          </Text>
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeaderCell}>Passenger Type</Text>
              </View>

              <View style={styles.tableCol}>
                <Text style={styles.tableHeaderCell}>Check-in</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeaderCell}>Cabin</Text>
              </View>
            </View>
            {bookingDetails?.baggage &&
              Object.keys(groupedBaggage).map(
                (passengerType: string, index: number) => (
                  <View style={styles.tableRow} key={index}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableBodyCell}>
                        {passengerType === "ADT"
                          ? "Adult"
                          : passengerType === "CHD"
                          ? "Child"
                          : passengerType === "INF"
                          ? "Infant"
                          : passengerType === "CNN"
                          ? "Child"
                          : passengerType === "INS"
                          ? "Infant"
                          : ""}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableBodyCell}>
                        {groupedBaggage[passengerType]?.checkIn.map(
                          (item: any, index: number) => (
                            <Text key={index}>
                              ({item.departureCode}-{item.arrivalCode}){" "}
                              {item.baggageAmount} {item.unit}{" "}
                            </Text>
                          )
                        )}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableBodyCell}>
                        {groupedBaggage[passengerType]?.cabin.map(
                          (item: any, index: number) => (
                            <Text key={index}>
                              ({item.departureCode}-{item.arrivalCode}){" "}
                              {item.baggageAmount} {item.unit}{" "}
                            </Text>
                          )
                        )}
                      </Text>
                    </View>
                  </View>
                )
              )}
          </View>
        </View>

        {/* Footer section */}
        <View style={styles.footer} fixed>
          {/* <Text style={styles.headerText}>Page Footer - Flight Itinerary</Text> */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <View
                style={{
                  flexDirection: "row",
                  paddingBottom: "8px",
                }}
              >
                <Text style={styles.borderColor1}></Text>
                <Text style={styles.borderColor2}></Text>
                <Text style={styles.borderColor3}></Text>
              </View>
              <Text style={styles.footerCompanyTitle}>
                {agent?.companyName || ""}
              </Text>
              <Text style={styles.footerCompanyAddress}>
                {agent?.companyAddress || ""} {agent?.companyCity || ""}
              </Text>

              <Text style={styles.footerCompanyAddress}>
                {agent?.companyState || ""}-{agent?.postalCode || ""}
              </Text>
            </View>
            <View
              style={{
                paddingTop: "8px",
              }}
            >
              <Text style={styles.footerCompanyAddress}>
                <Text style={styles.titleHighlight}>P:</Text>
                {agent?.companyPhoneCode || ""} {agent?.companyPhoneNo || ""}
              </Text>
              <Text style={styles.footerCompanyAddress}>
                <Text style={styles.titleHighlight}>M:</Text>{" "}
                {agent?.companyEmail || ""}{" "}
                {/* <Text style={styles.titleHighlight}>W:</Text> www.tourmart.net */}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default FlightBookingCopy;
