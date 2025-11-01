import { Ontology, Diagram, TemplateDiagram, TemplateOntology } from '.prisma/client';

export type DiagramType = 'diagram' | 'ontology';
export type SuperDiagram = (Ontology | Diagram) & {
  isNew?: boolean;
  type?: 'ontology' | 'diagram';
};

export type SuperTemplate = TemplateDiagram | TemplateOntology;
export type DiagramSourceTab = 'templates' | 'user';
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}