import { Metadata } from "next";
import { projectConfig } from "@/config";
import ClientLayout from "@/components/ClientLayout";

import "../scss/globals.scss";
import "../styles/globals.css";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import "aos/dist/aos.css";
import AOSProvider from "@/components/AOSProvider";
import CombinedProvider from "@/context/CombinedProvider";
import DisableInspect from "@/components/DisableInspect";

export const metadata: Metadata = {
  title: projectConfig.title,
  description: projectConfig.description,
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {/* <DisableInspect /> */}

        <CombinedProvider>
          <AOSProvider>
            <ClientLayout>{children}</ClientLayout>
          </AOSProvider>
        </CombinedProvider>
      </body>
    </html>
  );
}
