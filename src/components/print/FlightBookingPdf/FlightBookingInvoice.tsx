import React, { useEffect, useState } from "react";
import {
  Document,
  Image,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import logo from "../../../../public/assests/image/logo.svg";

const FlightBookingInvoice = ({ bookingDetails }: any) => {
  const styles = StyleSheet.create({
    page: {
      padding: 10,
    },
    headerText: {
      fontSize: 15,
      fontWeight: "bold",
      color: "#702c8b",
      marginTop: 0,
      marginBottom: 0,
    },
    logo: {
      width: 50,
      height: 20,
    },
  });

  const logoUrl =
    "https://media.istockphoto.com/id/2050721742/photo/border-collie-holding-a-golden-maple-leaf-in-autumn-splendor.jpg?s=1024x1024&w=is&k=20&c=CYeLCpuASrjkz-D65MHjsZYOG4O3K0nBdYmrH1uuN4E=";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Image style={styles.logo} src={logoUrl} />
          </View>
          <View>
            <Text
              style={{
                color: "#D3D3D3",
                fontSize: "35px",
                fontWeight: 800,
                fontStyle: "Outfit !important",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              E-TICKET
            </Text>
          </View>
        </View>

        {/*  booking Information */}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              border: " 2px dashed #b4b4cd",
              padding: "5px",
            }}
          >
            <View>
              <Text
                style={{
                  color: "#6e6996",
                  fontSize: "12px",
                }}
              >
                Booking ID
              </Text>
            </View>
            <View></View>
            <View></View>
          </View>

          <View
            style={{
              backgroundColor: "#e5e9f2",
            }}
          >
            <Text
              style={{
                color: "#6e6996",
                fontSize: "10px",
                fontWeight: 500,
                fontStyle: "Outfit !important",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              E-TICKET
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default FlightBookingInvoice;
