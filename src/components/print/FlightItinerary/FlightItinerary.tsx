import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import moment from "moment";
import commaNumber from "comma-number";

const FlightItinerary = ({
  flightData,
  dictionary,
  markupPrice,
  agent,
}: any) => {
  const styles = StyleSheet.create({
    page: {
      paddingTop: 60,
      paddingBottom: 40,
      paddingHorizontal: 20,
    },
    header: {
      position: "absolute",
      top: 0,
      left: 20,
      right: 20,
      height: 60,
      // paddingTop: 30,
    },
    footer: {
      position: "absolute",
      bottom: 0,
      left: 20,
      right: 20,
      height: 60,
      // backgroundColor: "#f3f3f3",
      // justifyContent: "center",
      // alignItems: "center",
      // borderTop: "1px solid #ccc",
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
    },
    tableCol: {
      width: "33.33%",
      // borderWidth: 1,
      // borderStyle: "solid",
      // borderColor: "#000",
      border: "1px solid #cbc7df",
      padding: 5,
    },
    tableCell: {
      fontSize: 10,
      textAlign: "center",
    },

    borderColor1: {
      width: "16px",
      borderBottomWidth: 2,
      borderBottomColor: "#D32F2F",
      borderBottomStyle: "solid",
      marginRight: "4px",
    },
    borderColor2: {
      width: "16px",
      borderBottomWidth: 2,
      borderBottomcolor: "#01783B",
      borderBottomStyle: "solid",
      marginRight: "4px",
    },
    borderColor3: {
      width: "16px",
      borderBottomWidth: 2,
      borderBottomColor: "#0f9455",
      borderBottomStyle: "solid",
      marginRight: "4px",
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
            <View>
              {agent?.companyLogoUrl !== null ? (
                <Image
                  style={{ width: "150px", height: "30px" }}
                  src={agent?.companyLogoUrl}
                />
              ) : (
                ""
              )}
            </View>
            <View
              style={{
                paddingTop: "8px",
              }}
            >
              <Text style={styles.footerCompanyTitle}>Flight Itinerary</Text>
              <Text></Text>
            </View>
          </View>
        </View>
        {/*body content section */}
        {flightData?.flightOffer?.itinerary?.OriginDestinationOptions.map(
          (destination: any, index: any) => (
            <View key={index}>
              <View
                style={{
                  backgroundColor: "#999DAA",
                  padding: "5px 4px",
                  borderRadius: "1px",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: "5px",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 9,
                      color: "#fff",
                    }}
                  >
                    {dictionary.locations?.[destination?.departure]?.cityName} -{" "}
                    {dictionary.locations?.[destination?.arrival]?.cityName} ({" "}
                    {moment(
                      destination?.segments[0]?.departure?.scheduledDate
                    ).format("DD MMM, ddd")}
                    )
                  </Text>
                  <Text
                    style={{
                      fontSize: 9,
                      color: "#fff",
                    }}
                  >
                    {moment(
                      destination?.segments[0]?.departure?.scheduledTime,
                      "HH:mm:ss"
                    ).format("HH:mm")}{" "}
                    -{" "}
                    {moment(
                      destination?.segments[destination.segments.length - 1]
                        ?.arrival?.scheduledTime,
                      "HH:mm:ss"
                    ).format("HH:mm")}{" "}
                    ({" "}
                    {formatDuration(
                      Number(destination?.totalDurationInMinutes) +
                        Number(destination?.totalLayoverTimeInMinutes)
                    )}
                    ,{" "}
                    {destination?.segments.length - 1 === 0
                      ? "Direct"
                      : destination?.segments.length - 1 + " Stop"}
                    ){" "}
                  </Text>
                </View>

                <View>
                  <Text
                    style={{
                      fontSize: 9,
                      color: "#fff",
                    }}
                  >
                    Gross Fare:{" "}
                    {
                      flightData?.flightOffer?.pricingInfo?.bestCombinablePrice
                        ?.currency
                    }{" "}
                    {commaNumber(
                      flightData?.flightOffer?.pricingInfo?.bestCombinablePrice
                        ?.totalFare +
                        Number(
                          flightData?.flightOffer?.pricingInfo
                            ?.bestCombinablePrice?.markupAmount
                        )
                    ) || 0}
                  </Text>
                </View>
              </View>

              {destination?.segments?.map((segment: any, index: any) => (
                <View key={index}>
                  {index > 0 ? (
                    <View
                      style={{
                        paddingTop: "10px",
                        // paddingBottom: "10px",
                      }}
                    >
                      <View style={styles.layoverRow}>
                        <View style={styles.layoverDashedLine}></View>
                        <Text
                          style={{
                            fontSize: 9,
                            color: "#5D6385",
                            paddingRight: "6px",
                          }}
                        >
                          Plane change{" "}
                          {
                            dictionary.locations?.[
                              segment?.departure?.airportCode
                            ]?.cityName
                          }{" "}
                          ({segment?.departure?.airportCode}){" "}
                          {formatDuration(
                            Number(segment?.flightInfo?.layoverTimeInMinutes)
                          )}{" "}
                          Layover
                        </Text>
                        <View style={styles.layoverDashedLine}></View>
                      </View>
                    </View>
                  ) : (
                    ""
                  )}

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#EDF0F8",
                      padding: "5px 5px",
                      marginTop: "8px",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Image
                        style={styles.logo}
                        src={`https://tourmart-assets.s3.ap-south-1.amazonaws.com/airline-logo/${segment?.flightInfo?.operatingAirlineCode}.png`}
                      />
                    </View>

                    <View style={{ flex: 2 }}>
                      <Text
                        style={{
                          fontSize: 7,
                          color: "#5D6385",
                          padding: "2px",
                        }}
                      >
                        {
                          dictionary.airlines?.[
                            segment.flightInfo.operatingAirlineCode
                          ]
                        }
                      </Text>
                      <Text
                        style={{
                          fontSize: 7,
                          color: "#5D6385",
                          padding: "2px",
                        }}
                      >
                        {segment.flightInfo.operatingAirlineCode}-
                        {segment.flightInfo.operatingAirlineNumber}
                      </Text>
                      <Text
                        style={{
                          fontSize: 7,
                          color: "#5D6385",
                          padding: "2px",
                        }}
                      >
                        {
                          dictionary?.aircrafts?.[
                            segment.flightInfo.aircraftType
                          ]
                        }
                      </Text>
                      <Text
                        style={{
                          fontSize: 7,
                          color: "#5D6385",
                          padding: "2px",
                        }}
                      >
                        {segment.flightInfo.cabinClass?.text}{" "}
                        {segment?.flightInfo?.bookingCode}-
                        {segment?.flightInfo?.seatsAvailable}
                      </Text>
                      {/* <Text
                              style={{
                                fontSize: 7,
                                color: "#5D6385",
                                padding: "2px",
                              }}
                            >
                              {segment?.flightInfo?.bookingCode}-
                              {segment?.flightInfo?.seatsAvailable}
                            </Text> */}
                    </View>

                    <View style={{ flex: 2.5 }}>
                      <Text style={styles.paragraphText1}>
                        {
                          dictionary.locations?.[
                            segment?.departure?.airportCode
                          ]?.cityName
                        }
                      </Text>
                      <Text style={styles.paragraphTextBold1}>
                        {segment?.departure?.airportCode}{" "}
                        {moment(
                          segment?.departure?.scheduledTime,
                          "HH:mm:ss"
                        ).format("HH:mm")}
                      </Text>
                      <Text style={styles.paragraphText1}>
                        {moment(segment?.departure?.scheduledDate).format(
                          "DD MMM, ddd"
                        )}
                      </Text>
                      <Text style={styles.paragraphText1}>
                        {
                          dictionary.locations?.[
                            segment?.departure?.airportCode
                          ]?.airportName
                        }
                      </Text>
                      <Text style={styles.paragraphText1}>
                        Terminal {segment?.departure?.terminal}
                      </Text>
                    </View>

                    <View style={{ flex: 4 }}>
                      <View style={styles.row}>
                        <View style={styles.dashedLine}></View>
                        <Text style={styles.direct}>
                          {" "}
                          {formatDuration(
                            Number(segment?.flightInfo?.duration)
                          )}{" "}
                        </Text>
                        <Text style={styles.text}>
                          {segment?.flightInfo?.technicalStopover?.length === 0
                            ? "Direct"
                            : segment?.flightInfo?.technicalStopover?.length +
                              " Stop"}{" "}
                        </Text>
                        <View style={styles.dashedLine}></View>

                        {segment?.length === 1 && (
                          <Text style={styles.layover}>No Layover</Text>
                        )}
                      </View>
                    </View>

                    <View style={{ flex: 2.5 }}>
                      <Text style={styles.paragraphText1}>
                        {
                          dictionary.locations?.[segment?.arrival?.airportCode]
                            ?.cityName
                        }
                      </Text>
                      <Text style={styles.paragraphTextBold1}>
                        {moment(
                          segment?.arrival?.scheduledTime,
                          "HH:mm:ss"
                        ).format("HH:mm")}{" "}
                        {segment?.arrival?.airportCode}
                      </Text>
                      <Text style={styles.paragraphText1}>
                        {moment(segment?.arrival?.scheduledDate).format(
                          "DD MMM, ddd"
                        )}
                      </Text>
                      <Text style={styles.paragraphText1}>
                        {
                          dictionary.locations?.[segment?.arrival?.airportCode]
                            ?.airportName
                        }
                      </Text>
                      <Text style={styles.paragraphText1}>
                        Terminal {segment?.arrival?.terminal}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )
        )}

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
              <Text style={styles.footerCompanyTitle}>Tour Mart Ltd</Text>
              <Text style={styles.footerCompanyAddress}>
                43, TSL Tower (Level 4), Sonargaon Janapath Road,
              </Text>
              <Text style={styles.footerCompanyAddress}>
                Sector 12, Uttara, Dhaka - 1230
              </Text>
            </View>
            <View
              style={{
                paddingTop: "8px",
              }}
            >
              <Text style={styles.footerCompanyAddress}>
                <Text style={styles.titleHighlight}>P:</Text> 09647-221122,
                02-55086888
              </Text>
              <Text style={styles.footerCompanyAddress}>
                <Text style={styles.titleHighlight}>M:</Text> info@tourmart.net{" "}
                <Text style={styles.titleHighlight}>W:</Text> www.tourmart.net
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default FlightItinerary;
