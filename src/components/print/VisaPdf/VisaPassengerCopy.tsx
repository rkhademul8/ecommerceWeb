import React from "react";
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
import { Typography } from "@mui/material";

const VisaPassengerCopy = ({ agent, booking, passenger }: any) => {
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
    tableColFareSummery: {
      width: "33.33%",
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

    visaDetailsText: {
      fontSize: 9,
      textAlign: "center",
      color: "#5D6170",
      fontWeight: 400,
      paddingBottom: "5px",
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

  const segmentIcon =
    "https://tourmart-assets.s3.ap-south-1.amazonaws.com/icons/FlightRouteIcon.jpg";

  const paymentLabelMap: any = {
    PAID: "Paid",
    UNPAID: "Unpaid",
    PARTIALLY_PAID: "Partially Paid",
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {["PAID", "UNPAID", "PARTIALLY_PAID"].includes(
          booking?.paymentStatus
        ) && (
          <Text
            style={{
              position: "absolute",
              top: "40%",
              left: booking?.paymentStatus === "PAID" ? "30%" : "20%",
              fontSize: booking?.paymentStatus === "PARTIALLY_PAID" ? 65 : 100,
              color: "#cccccc",
              opacity: 0.2,
              zIndex: 0,
              transform: "rotate(-45deg)",
            }}
          >
            {paymentLabelMap[booking.paymentStatus]}
          </Text>
        )}

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
                  style={{ width: "100px", height: "25px" }}
                  src={agent?.companyLogoUrl}
                />
              ) : (
                ""
              )}
            </View>
          </View>
        </View>

        {/*  visa Information */}
        {/* <View>
          <View style={{ padding: "10px 0px" }}>
            <View>
              <Text
                style={{
                  color: "#231F20",
                  fontSize: "11px",
                  fontWeight: 1000,
                  paddingBottom: "8px",
                }}
              >
                Visa Details
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                borderTop: "0.2px solid #6e6996",
                padding: "5px",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text
                  style={{
                    color: "#5D6170",
                    fontSize: "10px",
                    fontFamily: "Helvetica-Bold",
                    paddingBottom: "5px",
                  }}
                >
                  {booking?.packageName}
                </Text>
                <Text style={styles.visaDetailsText}>
                  Visa Category: {booking?.categoryName}
                </Text>
                <Text style={styles.visaDetailsText}>
                  Visa Mode: {booking?.mode}
                </Text>
                <Text style={styles.visaDetailsText}>
                  Processing Type: {booking?.processingType}
                </Text>
                <Text style={styles.visaDetailsText}>
                  Visa submitted Date:{" "}
                  {moment(booking?.submitDate).format("DD-MMM-YYYY")}
                </Text>
                <Text style={styles.visaDetailsText}>
                  Embassy Submitted Date:{" "}
                  {booking?.embassySubmitDate
                    ? moment(booking?.embassySubmitDate).format("DD-MMM-YYYY")
                    : ""}
                </Text>
                <Text style={styles.visaDetailsText}>
                  Approximately Collection Date: s
                  {booking?.approximateCollecctDate
                    ? moment(booking?.approximateCollecctDate).format(
                        "DD-MMM-YYYY"
                      )
                    : ""}
                </Text>
                <Text style={styles.visaDetailsText}>
                  Client Delivery Date:{" "}
                  {booking?.clientDelivaryDate
                    ? moment(booking?.clientDelivaryDate).format("DD-MMM-YYYY")
                    : ""}
                </Text>
              </View>

              <View>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <View>
                      <Image
                        style={{ width: "35px", height: "35px" }}
                        src={segmentIcon}
                      />
                    </View>

                    <View
                      style={{
                        paddingTop: "7px",
                      }}
                    >
                      <Text style={styles.visaDetailsText}>Valid for</Text>
                      <Text style={styles.visaDetailsText}>
                        {booking?.validity} Days From Issue
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <View>
                      <Image
                        style={{ width: "35px", height: "35px" }}
                        src={segmentIcon}
                      />
                    </View>

                    <View
                      style={{
                        paddingTop: "7px",
                      }}
                    >
                      <Text style={styles.visaDetailsText}>
                        Number of entries
                      </Text>
                      <Text style={styles.visaDetailsText}>
                        {booking?.numberOfEntry}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <View>
                      <Image
                        style={{ width: "35px", height: "35px" }}
                        src={segmentIcon}
                      />
                    </View>

                    <View
                      style={{
                        paddingTop: "7px",
                      }}
                    >
                      <Text style={styles.visaDetailsText}>Max stay</Text>
                      <Text style={styles.visaDetailsText}>
                        {booking?.durationInDays} Days From Entry
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View> */}

        <View>
          <View>
            <Text
              style={{
                color: "#231F20",
                fontSize: "11px",
                fontWeight: 1000,
                paddingBottom: "8px",
              }}
            >
              Visa Information
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              border: "1px solid #B4B4CD",
              padding: "5px",
              borderRadius: "2px",
            }}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <View
                style={{
                  paddingBottom: "10px",
                }}
              >
                <Text
                  style={{
                    color: "#B4B4CD",
                    fontSize: "9px",
                    fontWeight: 1000,
                    paddingBottom: "5px",
                  }}
                >
                  Visa Category
                </Text>
                <Text
                  style={{
                    color: "#6E6996",
                    fontSize: "9px",
                    fontWeight: 1000,
                  }}
                >
                  {booking?.categoryName}
                </Text>
              </View>
              <View
                style={{
                  paddingBottom: "10px",
                }}
              >
                <Text
                  style={{
                    color: "#B4B4CD",
                    fontSize: "9px",
                    fontWeight: 1000,
                    paddingBottom: "5px",
                  }}
                >
                  Visa Validity
                </Text>
                <Text
                  style={{
                    color: "#6E6996",
                    fontSize: "9px",
                    fontWeight: 1000,
                  }}
                >
                  {booking?.validity} {booking?.validity ? "Days" : ""}
                </Text>
              </View>
              <View
                style={{
                  paddingBottom: "10px",
                }}
              >
                <Text
                  style={{
                    color: "#B4B4CD",
                    fontSize: "9px",
                    fontWeight: 1000,
                    paddingBottom: "5px",
                  }}
                >
                  Visa Mode
                </Text>
                <Text
                  style={{
                    color: "#6E6996",
                    fontSize: "9px",
                    fontWeight: 1000,
                  }}
                >
                  {booking?.mode}
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
              }}
            >
              <View
                style={{
                  paddingBottom: "10px",
                }}
              >
                <Text
                  style={{
                    color: "#B4B4CD",
                    fontSize: "9px",
                    fontWeight: 1000,
                    paddingBottom: "5px",
                  }}
                >
                  Visa Duration
                </Text>
                <Text
                  style={{
                    color: "#6E6996",
                    fontSize: "9px",
                    fontWeight: 1000,
                  }}
                >
                  {booking?.durationInDays}{" "}
                  {booking?.durationInDays ? "Days" : ""}
                </Text>
              </View>
              <View
                style={{
                  paddingBottom: "10px",
                }}
              >
                <Text
                  style={{
                    color: "#B4B4CD",
                    fontSize: "9px",
                    fontWeight: 1000,
                    paddingBottom: "5px",
                  }}
                >
                  Entry Type
                </Text>
                <Text
                  style={{
                    color: "#6E6996",
                    fontSize: "9px",
                    fontWeight: 1000,
                  }}
                >
                  {booking?.numberOfEntry}{" "}
                </Text>
              </View>
              <View
                style={{
                  paddingBottom: "10px",
                }}
              >
                <Text
                  style={{
                    color: "#B4B4CD",
                    fontSize: "9px",
                    fontWeight: 1000,
                    paddingBottom: "5px",
                  }}
                >
                  Submission Date
                </Text>
                <Text
                  style={{
                    color: "#6E6996",
                    fontSize: "9px",
                    fontWeight: 1000,
                  }}
                >
                  {moment(booking?.submitDate).format("DD-MMM-YYYY")}
                </Text>
              </View>
            </View>
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
            Applicant Information
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
                  Applicant Name
                </Text>
              </View>

              <View style={styles.tableCol}>
                <Text style={styles.tableHeaderCell}>Nationality</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeaderCell}>DOB</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeaderCell}>Gender</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeaderCell}>Passport No</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeaderCell}>Passport Expiry</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, styles.passengerNameCell]}>
                <Text
                  style={[
                    styles.tableBodyCell,
                    { alignSelf: "flex-start", paddingLeft: "15px" },
                  ]}
                >
                  {passenger?.firstName?.toUpperCase()}{" "}
                  {passenger?.lastName?.toUpperCase()} ({" "}
                  {passenger?.passengerType === "ADT"
                    ? "Adult"
                    : passenger?.passengerType === "CHD" ||
                      passenger?.passengerType === "CNN"
                    ? "Child"
                    : passenger?.passengerType === "INF" ||
                      passenger?.passengerType === "INS"
                    ? "Infant"
                    : ""}
                  )
                </Text>
              </View>

              <View style={styles.tableCol}>
                <Text style={styles.tableBodyCell}>
                  {passenger?.nationality}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableBodyCell}>
                  {passenger.dateOfBirth
                    ? moment(passenger.dateOfBirth).format("DD-MMM-YYYY")
                    : "Domestic"}
                </Text>
              </View>

              <View style={styles.tableCol}>
                <Text style={styles.tableBodyCell}>{passenger?.gender}</Text>
              </View>

              <View style={styles.tableCol}>
                <Text style={styles.tableBodyCell}>
                  {passenger?.passportNumber}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableBodyCell}>
                  {passenger.passportExpiryDate
                    ? moment(passenger.passportExpiryDate).format("DD-MMM-YYYY")
                    : ""}
                </Text>
              </View>
            </View>
          </View>
        </View>

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
              <View style={styles.tableHeaderRow}>
                <View style={styles.tableColFareSummery}>
                  <Text style={styles.tableHeaderCell}>Visa Fee</Text>
                </View>
                <View style={styles.tableColFareSummery}>
                  <Text style={styles.tableHeaderCell}>Service Charge</Text>
                </View>

                <View style={styles.tableColFareSummery}>
                  <Text style={styles.tableHeaderCell}>Sub-total</Text>
                </View>
              </View>

              <View style={styles.tableRow}>
                <View style={styles.tableColFareSummery}>
                  <Text style={styles.tableBodyCell}>
                    {commaNumber(passenger.userVisaFee)}
                  </Text>
                </View>
                <View style={styles.tableColFareSummery}>
                  <Text style={styles.tableBodyCell}>
                    {commaNumber(passenger.userServiceFee)}
                  </Text>
                </View>

                <View style={styles.tableColFareSummery}>
                  <Text style={styles.tableBodyCell}>
                    {commaNumber(passenger.userPayable)}
                  </Text>
                </View>
              </View>
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
                fontSize: "9px",
                color: "#fff",
                backgroundColor: agent.brandColor
                  ? agent.brandColor
                  : "#F1666A",
                padding: "4px 6px",
                borderRadius: "2px",
              }}
            >
              Grand Total: {commaNumber(passenger.userPayable)}{" "}
              {booking?.currency}
            </Text>
          </View>
        </View>

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

export default VisaPassengerCopy;
