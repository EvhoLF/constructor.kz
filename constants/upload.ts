export enum UploadFolder {
    imgsDiagram = "imgsDiagram",
    imgsOntology = "imgsOntology",
}
export const ALLOWED_FOLDERS = Object.values(UploadFolder);

export enum ImageUploadType {
  DIAGRAM = "diagram",
  ONTOLOGY = "ontology",
  TEMPLATE_DIAGRAM = "templateDiagram",
  TEMPLATE_ONTOLOGY = "templateOntology",
}