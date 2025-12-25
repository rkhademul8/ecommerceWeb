"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
interface FlightData {
  msg: string;
}

interface FlightDataContextType {
  flightData: FlightData | null;
  setFlightData: (data: FlightData) => void;
}

// Create the context
const FlightDataContext = createContext<FlightDataContextType | undefined>(
  undefined
);

// FlightDataProvider component
export const FlightDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [flightData, setFlightData] = useState<FlightData | null>(null);

  return (
    <FlightDataContext.Provider value={{ flightData, setFlightData }}>
      {children}
    </FlightDataContext.Provider>
  );
};

// Hook to use the FlightDataContext
export const useFlightData = (): FlightDataContextType => {
  const context = useContext(FlightDataContext);
  if (!context) {
    throw new Error("useFlightData must be used within a FlightDataProvider");
  }
  return context;
};
