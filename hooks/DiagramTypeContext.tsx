'use client'
import React, { useContext, ReactNode, useMemo, createContext } from 'react';
import { DiagramType } from '@/global';
import { DiagramTypeProps, getDiagramTypeProps } from '@/utils/getDiagramTypeProps';

interface DiagramTypeContextType {
  diagramTypeProps: DiagramTypeProps;
}

const DiagramTypeContext = createContext<DiagramTypeContextType | undefined>(undefined);

interface DiagramTypeProvider {
  children: ReactNode;
  type?: DiagramType;
  id?: string | number;
}

export const DiagramTypeProvider: React.FC<DiagramTypeProvider> = ({ children, type = 'diagram', id = '' }) => {
  const diagramTypeProps = useMemo((): DiagramTypeProps => getDiagramTypeProps(type, id), [type, id]);
  const value: DiagramTypeContextType = { diagramTypeProps, };
  return (
    <DiagramTypeContext.Provider value={value}>
      {children}
    </DiagramTypeContext.Provider>
  );
};

export const useDiagramType = (id?: string | number): DiagramTypeProps => {
  const context = useContext(DiagramTypeContext);
  if (context === undefined) {
    throw new Error('useDiagramProps must be used within a DiagramTypeProvider');
  }
  if (id) return getDiagramTypeProps(context.diagramTypeProps.type, id)
  return context.diagramTypeProps;
};

export const DiagramTypeWrapper = ({ children, type = 'diagram' }: { children: React.ReactNode, type: DiagramType }) => {
  return (
    <DiagramTypeProvider type={type}>
      {children}
    </DiagramTypeProvider>
  );
};