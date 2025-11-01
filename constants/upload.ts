export enum UploadFolder {
  imgsDiagram = "imgsDiagram",
  imgsOntology = "imgsOntology",
}
export const ALLOWED_FOLDERS = Object.values(UploadFolder);

export enum ImageUploadType {
  DIAGRAM = 'diagram',
  TEMPLATE_DIAGRAM = 'template-diagram',
  FUNNEL = 'funnel', // Добавлено
  KANBAN = 'kanban', // Добавлено
  ONTOLOGY = 'ontology',
  TEMPLATE_ONTOLOGY = 'template-ontology'
}