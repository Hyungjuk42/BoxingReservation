"use client";

import React from "react";
import { createContext, useState, useContext } from "react";

const SectionContext = createContext<{
  section: string;
  setSection: (newData: string) => void;
} | null>(null);

export const useSectionContext = () => {
  const context = useContext(SectionContext);
  if (!context) {
    throw new Error(
      "useSectionContext must be used within a SectionContextProvider"
    );
  }
  return context;
};

export const SectionContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [section, setSection] = useState<string>("reservation");

  return (
    <SectionContext.Provider value={{ section, setSection }}>
      {children}
    </SectionContext.Provider>
  );
};
