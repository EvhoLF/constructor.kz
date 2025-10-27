'use client'
import React, { useContext, ReactNode, useMemo, createContext } from 'react';
import { ImageUploadType } from '@/constants/upload';
import { DiagramType } from '@/types/diagrams';

interface DiagramTypeContextType {
  diagramTypeProps: DiagramTypeProps;
}

export interface DiagramTypeProps {
  api: string;
  url: string;
  templateApi: string;
  templateUrl: string;
  type: DiagramType;
  imageUploadType?: ImageUploadType
}

export const getDiagramTypeProps = (
  type: DiagramType = 'diagram',
  id: string | number = '',
  isTemplate: boolean = false,
): DiagramTypeProps => {
  switch (type) {
    case 'ontology':
      return {
        api: `/ontology/${id}`,
        url: `/ontology/${id}`,
        type: 'ontology',
        templateApi: `/template-ontology/${id}`,
        templateUrl: `/admin/template-ontology/${id}`,
        imageUploadType: isTemplate ? ImageUploadType.TEMPLATE_ONTOLOGY : ImageUploadType.ONTOLOGY,
      };
    case 'diagram':
    default:
      return {
        api: `/diagram/${id}`,
        url: `/diagram/${id}`,
        type: 'diagram',
        templateApi: `/template-diagram/${id}`,
        templateUrl: `/admin/template-diagram/${id}`,
        imageUploadType: isTemplate ? ImageUploadType.TEMPLATE_DIAGRAM : ImageUploadType.DIAGRAM,
      };
  }
};

const DiagramTypeContext = createContext<DiagramTypeContextType | undefined>(undefined);

interface DiagramTypeProvider {
  children: ReactNode;
  type?: DiagramType;
  id?: string | number;
  isTemplate?: boolean;
}
interface DiagramTypeWrapper {
  children: React.ReactNode,
  type: DiagramType,
  isTemplate?: boolean;
}

export const DiagramTypeProvider: React.FC<DiagramTypeProvider> = ({ children, type = 'diagram', isTemplate, id = '' }) => {
  const diagramTypeProps = useMemo((): DiagramTypeProps => getDiagramTypeProps(type, id, isTemplate), [type, id]);
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

export const DiagramTypeWrapper = ({ children, type = 'diagram', isTemplate = false }: DiagramTypeWrapper) => {
  return (
    <DiagramTypeProvider type={type} isTemplate={isTemplate}>
      {children}
    </DiagramTypeProvider >
  );
};