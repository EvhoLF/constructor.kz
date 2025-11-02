export enum UploadFolder {
  imgsDiagram = "imgsDiagram",
  imgsOntology = "imgsOntology",
}
export const ALLOWED_FOLDERS = Object.values(UploadFolder);

export enum ImageUploadType {
  DIAGRAM = 'diagram',
  FUNNEL = 'funnel', // Добавлено
  KANBAN = 'kanban', // Добавлено
  ONTOLOGY = 'ontology',
  TEMPLATE_DIAGRAM = 'template-diagram',
  TEMPLATE_ONTOLOGY = 'template-ontology'
}