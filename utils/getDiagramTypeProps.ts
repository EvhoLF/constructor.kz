// utils/diagramTypeUtils.ts
import { DiagramType } from '@/global';

export interface DiagramTypeProps {
  api: string;
  url: string;
  type: DiagramType;
  templateApi: string;
  templateUrl: string;
}

export const getDiagramTypeProps = (
  type: DiagramType = 'diagram', 
  id: string | number = ''
): DiagramTypeProps => {
  switch (type) {
    case 'formula':
      return {
        api: `/api/diagram-formula/${id}`,
        url: `/diagram-formula/${id}`,
        type: 'formula',
        templateApi: `/api/template-formula/${id}`,
        templateUrl: `/admin/template-formula/${id}`,
      };
    case 'diagram':
    default:
      return {
        api: `/api/diagram/${id}`,
        url: `/diagram/${id}`,
        type: 'diagram',
        templateApi: `/api/template-diagram/${id}`,
        templateUrl: `/admin/template-diagram/${id}`,
      };
  }
};