// context/CombinedProvider.tsx
"use client";

import React, { ReactNode } from "react";
import { FlightDataProvider } from "./FlightDataContext";
// Import other providers as needed

// Array of providers
const providers = [FlightDataProvider /* Add more providers here */];

// CombinedProvider component
const CombinedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return providers.reduce(
    (AccumulatedProviders, CurrentProvider) => (
      <CurrentProvider>{AccumulatedProviders}</CurrentProvider>
    ),
    children
  );
};

export default CombinedProvider;
