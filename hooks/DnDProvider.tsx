/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { createContext, ReactNode, useContext, useState, Dispatch, SetStateAction } from "react";

type DnDContextType = [any, Dispatch<SetStateAction<any>>];

const DnDContext = createContext<DnDContextType | undefined>(undefined);

export const DnDProvider = ({ children }: { children: ReactNode }) => {
  const [type, setType] = useState<any>(null);
  return (<DnDContext.Provider value={[type, setType]}>{children}</DnDContext.Provider>);
};

export default DnDContext;

export const useDnD = (): DnDContextType => {
  const context = useContext(DnDContext);
  if (!context) { throw new Error("useDnD must be used within a DnDProvider"); }
  return context;
};
