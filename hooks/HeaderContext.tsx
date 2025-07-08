// context/HeaderContext.tsx
'use client';

import { createContext, useCallback, useContext, useState } from 'react';

interface HeaderContextProps {
  isOpen: boolean;
  openHeader: () => void;
  closeHeader: () => void;
  toggleHeader: () => void;
}

const HeaderContext = createContext<HeaderContextProps | undefined>(undefined);

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openHeader = useCallback(() => setIsOpen(true), []);
  const closeHeader = useCallback(() => setIsOpen(false), []);
  const toggleHeader = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <HeaderContext.Provider value={{ isOpen, openHeader, closeHeader, toggleHeader }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (!context) throw new Error('useHeader must be used within a HeaderProvider');
  return context;
}
