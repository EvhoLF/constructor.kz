import { DiagramFormula, Diagram, TemplateDiagram, TemplateFormula } from '.prisma/client';

type DiagramType = 'diagram' | 'formula';
type SuperDiagram = (DiagramFormula | Diagram) & { isNew?: boolean, type?: 'formula' | 'diagram' }

type SuperTemplate = (TemplateDiagram | TemplateFormula);


export interface IFunnelBlock {
  id: string
  order: number
  title: string
  description?: string
  color?: string
}