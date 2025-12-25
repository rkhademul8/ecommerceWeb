import React, { useEffect, useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
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
const SabreGdsCopy = ({
  bookingDetails,
  price,
  agent,
  editableTotals,
  editUserPatableGrandTotal,
}: any) => {
  // Font.register({
  //   family: "Open Sans",
  //   fonts: [
  //     {
  //       src: "https://fonts.gstatic.com/s/opensans/v34/mem8YaGs126MiZpBA-U1Ug.ttf",
  //     },
  //     {
  //       src: "https://fonts.gstatic.com/s/opensans/v34/mem5YaGs126MiZpBA-UN7rgOUuhp.ttf",
  //       fontWeight: "bold",
  //     },
  //   ],
  // });

  const styles = StyleSheet.create({
    page: {
      // fontFamily: "Open Sans",
      paddingTop: 30,
      paddingBottom: 50,
      paddingHorizontal: 30,
    },
    footer: {
      bottom: 0,
      left: 30,
      right: 30,
      height: 200,
    },
  });

  const passengerTableStyles = StyleSheet.create({
    tableContainer: {
      borderTopWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#E7E7E9",
      borderBottomWidth: 0,
    },

    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 0,
      borderColor: "#000",
    },

    cell: {
      borderRightWidth: 1,
      borderColor: "#c7c7c7",
      padding: 4,
      fontSize: 8,
    },

    lastCell: {
      padding: 4,
      fontSize: 8,
    },

    col1: { width: "33.33%" },
    col2: { width: "33.33%" },
    col3: { width: "33.33%" },
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

  const updatedBaggageData = bookingDetails?.baggage.map((item: any) => ({
    ...item,
    sector: `${item.departureCode}-${item.arrivalCode}`,
  }));

  const segmentIcon =
    "https://tourmart-assets.s3.ap-south-1.amazonaws.com/logo/tourmart-logo-png.png";

  const flightImage =
    "https://e7.pngegg.com/pngimages/130/90/png-clipart-airplane-fixed-wing-aircraft-flight-aeroplane-drawing-silhouette-website-thumbnail.png";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <View>
            <Text
              style={{
                fontSize: "12px",
                fontFamily: "Helvetica-Bold",
                color: "#000319",
                paddingBottom: "1px",
                textTransform: "uppercase",
                borderBottom: "1px solid #000000",
              }}
            >
              {moment
                .utc(
                  bookingDetails?.originDestinationOptions[0]?.departureDateTime
                )
                .format("DD MMM YYYY")}{" "}
              {moment
                .utc(
                  bookingDetails?.originDestinationOptions[0]?.arrivalDateTime
                )
                .format("DD MMM YYYY")}{" "}
              TRIP TO{" "}
              {
                bookingDetails?.dictionary?.locations[
                  bookingDetails?.originDestinationOptions[0]?.arrivalCode
                ]?.cityName
              }
              ,{" "}
              {
                bookingDetails?.dictionary?.locations[
                  bookingDetails?.originDestinationOptions[0]?.arrivalCode
                ]?.countryName
              }
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: "5px",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: "10px",
                  color: "#333333",
                  paddingBottom: "1px",
                }}
              >
                PREPARED FOR
              </Text>

              {bookingDetails?.passengers.map((data: any, index: any) => (
                <Text
                  key={index}
                  style={{
                    fontSize: "11px",
                    color: "#333333",
                    paddingBottom: "2px",
                    fontFamily: "Helvetica-Bold",
                  }}
                >
                  {data?.lastName}/{data?.firstName} {data?.title}
                </Text>
              ))}
            </View>

            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  paddingTop: "15px",
                  paddingRight: "10px",
                }}
              >
                {/* {agent?.companyLogoUrl !== null ? (
                  <Image
                    style={{ width: "100px", height: "13px" }}
                    src={segmentIcon}
                  />
                ) : (
                  ""
                )} */}
              </View>

              <View>
                <Text
                  style={{
                    fontSize: "9px",
                    fontFamily: "Helvetica-Bold",
                    color: "#333333",
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
                  {agent?.companyAddress}
                </Text>
                {/* <Text
                  style={{
                    fontSize: "8px",
                    color: "#1F1F1F",
                    paddingBottom: "1px",
                  }}
                >
                  43, TSL Tower (4th Floor) Sonargaon
                </Text>
                <Text
                  style={{
                    fontSize: "8px",
                    color: "#1F1F1F",
                    paddingBottom: "1px",
                  }}
                >
                  Janapath Road, Sector 12, Uttara, Dhaka -
                </Text> */}
                {/* <Text
                  style={{
                    fontSize: "8px",
                    color: "#1F1F1F",
                    paddingBottom: "1px",
                  }}
                >
                  1230
                </Text> */}
                <Text
                  style={{
                    fontSize: "8px",
                    color: "#1F1F1F",
                    paddingBottom: "1px",
                  }}
                >
                  {agent?.companyPhoneCode} {agent?.companyPhoneNo}
                </Text>
                <Text
                  style={{
                    fontSize: "8px",
                    color: "#1F1F1F",
                    paddingBottom: "1px",
                  }}
                >
                  TRAVEL CONSULTANT WS
                </Text>
              </View>
            </View>
          </View>
        </View>

        {bookingDetails?.originDestinationOptions?.map(
          (data: any, index: any) => {
            const filteredBaggage = updatedBaggageData?.filter(
              (bag: any) => bag.sector === data.sector
            );
            const checkedBaggage = filteredBaggage?.filter(
              (bag: any) => bag.baggageType === "FirstCheckedBag"
            );

            const cabinBaggage = filteredBaggage?.filter(
              (bag: any) => bag.baggageType === "CarryOn"
            );

            return (
              <View key={index}>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingBottom: "1px",
                      borderBottom: "1px solid #000000",
                      gap: "7px",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "10px",
                        color: "#333333",
                      }}
                    >
                      AIRLINE RESERVATION CODE{" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: "9px",
                        color: "#333333",
                      }}
                    >
                      {bookingDetails?.airlinesPNR} (
                      {bookingDetails?.validatingAirline})
                    </Text>
                  </View>
                  <View>
                    {/* <Image
              style={{ width: "100px", height: "100px" }}
              src={flightImage}
            /> */}
                    <View>
                      <View
                        style={{
                          paddingTop: "3px",
                          flexDirection: "row",
                          gap: "5px",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "11px",
                            color: "#333333",
                          }}
                        >
                          DEPARTURE:{" "}
                          <Text
                            style={{
                              fontFamily: "Helvetica-Bold",
                              textTransform: "uppercase",
                            }}
                          >
                            {moment
                              .utc(data?.departureDateTime)
                              .format("dddd DD MMM")}
                          </Text>
                        </Text>
                        <Text
                          style={{
                            fontSize: "11px",
                            color: "#333333",
                          }}
                        >
                          ARRIVAL:{" "}
                          <Text
                            style={{
                              fontFamily: "Helvetica-Bold",
                              textTransform: "uppercase",
                            }}
                          >
                            {moment
                              .utc(data?.arrivalDateTime)
                              .format("dddd DD MMM")}
                          </Text>
                        </Text>
                      </View>

                      <View>
                        <Text
                          style={{
                            fontSize: "9px",
                            color: "#767676",
                            paddingTop: "5px",
                          }}
                        >
                          Please verify flight times prior to departure
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {data?.segments?.map((segmentData: any, segIndex: any) => (
                  <View key={segIndex}>
                    <View
                      wrap={false}
                      style={{
                        marginTop: "5px",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          gap: "5px",
                        }}
                      >
                        <View
                          style={{
                            width: "33.33%",
                            backgroundColor: "#E7E7E9",
                            padding: "6px 8px",
                            borderBottomLeftRadius: "10%",
                          }}
                        >
                          <View>
                            <Text
                              style={{
                                fontSize: "13px",
                                color: "#333333",
                                width: "100px",
                              }}
                            >
                              {
                                bookingDetails?.dictionary?.airlines[
                                  segmentData?.marketingAirlineCode ||
                                    segmentData?.operatingFlightNumber
                                ]
                              }
                            </Text>
                            <Text
                              style={{
                                fontFamily: "Helvetica-Bold",
                                fontSize: "13px",
                                color: "#333333",
                              }}
                            >
                              {segmentData?.marketingAirlineCode ||
                                segmentData?.operatingAirline}{" "}
                              {segmentData?.marketingFlightNumber ||
                                segmentData?.operatingFlightNumber}
                            </Text>
                          </View>

                          <View
                            style={{
                              marginTop: "8px",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: "10px",
                                color: "#333333",
                              }}
                            >
                              Duration:
                            </Text>
                            <Text
                              style={{
                                fontSize: "10px",
                                color: "#333333",
                              }}
                            >
                              {formatDuration(segmentData?.durationInMinutes)}
                            </Text>
                          </View>

                          <View
                            style={{
                              marginTop: "8px",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: "10px",
                                color: "#333333",
                              }}
                            >
                              Cabin:
                            </Text>
                            <Text
                              style={{
                                fontSize: "10px",
                                color: "#333333",
                              }}
                            >
                              {segmentData?.cabinClass}
                            </Text>
                          </View>

                          <View
                            style={{
                              marginTop: "8px",
                              marginBottom: "5px",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: "10px",
                                color: "#333333",
                              }}
                            >
                              Status:
                            </Text>
                            <Text
                              style={{
                                fontSize: "10px",
                                color: "#333333",
                              }}
                            >
                              Confirmed
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            width: "66.66%",
                            border: "1px solid #c7c7c7",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                            }}
                          >
                            <View
                              style={{
                                width: "75%",
                                borderRight: "1px solid #c7c7c7",
                              }}
                            >
                              <View
                                style={{
                                  borderBottom: "1px dashed #c7c7c7",
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                  }}
                                >
                                  <View
                                    style={{
                                      width: "50%",
                                      padding: "6px 8px",
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontSize: "12px",
                                        color: "#333333",
                                      }}
                                    >
                                      {segmentData?.originCode}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: "9px",
                                        color: "#333333",
                                      }}
                                    >
                                      {
                                        bookingDetails?.dictionary?.locations[
                                          segmentData?.originCode
                                        ].cityName
                                      }
                                      ,{" "}
                                      {
                                        bookingDetails?.dictionary?.locations[
                                          segmentData?.originCode
                                        ].countryName
                                      }
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      width: "50%",
                                      padding: "6px 8px",
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontSize: "12px",
                                        color: "#333333",
                                      }}
                                    >
                                      {segmentData?.destinationCode}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: "9px",
                                        color: "#333333",
                                      }}
                                    >
                                      {
                                        bookingDetails?.dictionary?.locations[
                                          segmentData?.destinationCode
                                        ].cityName
                                      }
                                      ,{" "}
                                      {
                                        bookingDetails?.dictionary?.locations[
                                          segmentData?.destinationCode
                                        ].countryName
                                      }
                                    </Text>
                                  </View>
                                </View>
                              </View>

                              <View
                                style={{
                                  flexDirection: "row",
                                }}
                              >
                                <View
                                  style={{
                                    padding: "0px 8px",
                                    borderRight: "1px dashed #c7c7c7",
                                    height: "100px",
                                    // paddingRight: "55px",
                                    width: "50%",
                                  }}
                                >
                                  <View
                                    style={{
                                      marginTop: "8px",
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontSize: "9px",
                                        color: "#333333",
                                      }}
                                    >
                                      Departing At:
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: "12px",
                                        color: "#333333",
                                      }}
                                    >
                                      {moment
                                        .utc(segmentData?.departureDateTime)
                                        .format("HH:mm")}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: "10px",
                                        color: "#333333",
                                        fontFamily: "Helvetica-Bold",
                                      }}
                                    >
                                      (
                                      {moment
                                        .utc(segmentData?.departureDateTime)
                                        .format("ddd, MMM DD")}
                                      )
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      marginTop: "8px",
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontSize: "9px",
                                        color: "#333333",
                                      }}
                                    >
                                      Terminal:
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: "9px",
                                        color: "#333333",
                                      }}
                                    >
                                      TERMINAL {segmentData?.originTerminal}
                                    </Text>
                                  </View>
                                </View>
                                <View
                                  style={{
                                    padding: "0px 8px",
                                    width: "50%",
                                  }}
                                >
                                  <View
                                    style={{
                                      marginTop: "8px",
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontSize: "9px",
                                        color: "#333333",
                                      }}
                                    >
                                      Arriving At:
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: "12px",
                                        color: "#333333",
                                      }}
                                    >
                                      {moment
                                        .utc(segmentData?.arrivalDateTime)
                                        .format("HH:mm")}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: "10px",
                                        color: "#333333",
                                        fontFamily: "Helvetica-Bold",
                                      }}
                                    >
                                      (
                                      {moment
                                        .utc(segmentData?.arrivalDateTime)
                                        .format("ddd, MMM DD")}
                                      )
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      marginTop: "8px",
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontSize: "9px",
                                        color: "#333333",
                                      }}
                                    >
                                      Terminal:
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: "9px",
                                        color: "#333333",
                                      }}
                                    >
                                      TERMINAL{" "}
                                      {segmentData?.destinationTerminal}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                            <View
                              style={{
                                width: "25%",
                                padding: "6px 8px",
                              }}
                            >
                              <View>
                                <Text
                                  style={{
                                    fontSize: "9px",
                                    color: "#333333",
                                  }}
                                >
                                  Aircraft:
                                </Text>
                                <Text
                                  style={{
                                    fontSize: "9px",
                                    color: "#333333",
                                  }}
                                >
                                  {
                                    bookingDetails?.dictionary?.aircrafts[
                                      segmentData?.aircraftType
                                    ]
                                  }
                                </Text>
                              </View>
                              <View
                                style={{
                                  marginTop: "5px",
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: "9px",
                                    color: "#333333",
                                  }}
                                >
                                  Distance:
                                </Text>
                                <Text
                                  style={{
                                    fontSize: "9px",
                                    color: "#333333",
                                  }}
                                >
                                  {segmentData?.distance}{" "}
                                  {segmentData?.distance ? "Miles" : ""}
                                </Text>
                              </View>
                              <View>
                                <Text
                                  style={{
                                    fontSize: "9px",
                                    color: "#333333",
                                  }}
                                >
                                  Meals:
                                </Text>
                                <Text
                                  style={{
                                    fontSize: "9px",
                                    color: "#333333",
                                  }}
                                >
                                  Meals
                                </Text>
                              </View>
                              {/* <View>
                              <Text
                                style={{
                                  fontSize: "9px",
                                  color: "#333333",
                                }}
                              >
                                Est. emission:
                              </Text>
                              <Text
                                style={{
                                  fontSize: "9px",
                                  color: "#333333",
                                }}
                              >
                                177.62 kg CO2
                              </Text>
                            </View> */}
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>

                    {(segIndex + 1) % 3 === 0 &&
                      segIndex !== data?.segments?.length - 1 && <View break />}
                  </View>
                ))}

                {/* baggage */}

                <View
                  key={index}
                  style={{
                    margin: "12px 0px",
                  }}
                >
                  {checkedBaggage?.length > 0 && (
                    <Text
                      style={{
                        fontSize: "9px",
                        color: "#333333",
                        paddingBottom: "3px",
                      }}
                    >
                      Checked Baggage:{" "}
                      {checkedBaggage
                        .map(
                          (item: any) =>
                            `${
                              item.bookingPassengerType === "ADT"
                                ? "Adult"
                                : item.bookingPassengerType === "CHD"
                                ? "Child"
                                : "Infant"
                            }, ${item.baggageAmount}${item.unit}`
                        )
                        .join(" ")}
                    </Text>
                  )}

                  {cabinBaggage?.length > 0 && (
                    <Text
                      style={{
                        fontSize: "9px",
                        color: "#333333",
                      }}
                    >
                      Cabin Baggage:{" "}
                      {cabinBaggage
                        .map(
                          (item: any) =>
                            `${
                              item.bookingPassengerType === "ADT"
                                ? "Adult"
                                : item.bookingPassengerType === "CHD"
                                ? "Child"
                                : "Infant"
                            }, ${item.baggageAmount}${item.unit}`
                        )
                        .join("  ")}
                    </Text>
                  )}
                </View>
                {/*  passenger */}
                <View style={passengerTableStyles.tableContainer}>
                  <View style={passengerTableStyles.tableHeader}>
                    <Text
                      style={[
                        passengerTableStyles.cell,
                        passengerTableStyles.col1,
                      ]}
                    >
                      Passenger Name:
                    </Text>
                    <Text
                      style={[
                        passengerTableStyles.cell,
                        passengerTableStyles.col2,
                      ]}
                    >
                      Seats:
                    </Text>

                    <Text
                      style={[
                        passengerTableStyles.lastCell,
                        passengerTableStyles.col3,
                      ]}
                    >
                      eTicket Receipt(s):
                    </Text>
                  </View>

                  {/* Rows */}
                  {bookingDetails?.passengers?.map((data: any, index: any) => (
                    <View key={index} style={passengerTableStyles.tableRow}>
                      <Text
                        style={[
                          passengerTableStyles.cell,
                          passengerTableStyles.col1,
                        ]}
                      >
                        {data?.lastName?.toUpperCase()}/
                        {data?.firstName?.toUpperCase()}{" "}
                        {data?.title?.toUpperCase()}
                      </Text>
                      <Text
                        style={[
                          passengerTableStyles.cell,
                          passengerTableStyles.col2,
                        ]}
                      >
                        Check-In Required
                      </Text>

                      <Text
                        style={[
                          passengerTableStyles.lastCell,
                          passengerTableStyles.col3,
                        ]}
                      >
                        {data?.eTicketNo?.toUpperCase()}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          }
        )}
        <View style={styles.footer}></View>
      </Page>
    </Document>
  );
};

export default SabreGdsCopy;
