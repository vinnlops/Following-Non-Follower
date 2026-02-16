"use client";
import React, { createContext, useContext, useState } from 'react';

interface DataContextType {
  zipData: Record<string, any>;
  setZipData: (data: Record<string, any>) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [zipData, setZipData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  return (
    <DataContext.Provider value={{ zipData, setZipData, loading, setLoading }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData deve ser usado dentro de DataProvider");
  return context;
};