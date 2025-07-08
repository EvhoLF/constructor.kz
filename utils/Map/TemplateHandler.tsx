import { Edge, Node } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';

export const exportTemplate = (nodes: Node[], edges: Edge[]) => {
  return JSON.stringify({ nodes, edges });
}

export const importTemplate = (
  rawTemplate: string,
  addNodes: (nodes: Node[]) => void,
  addEdges: (edges: Edge[]) => void,
  offset = { x: 100, y: 100 },
) => {
  const { nodes, edges }: { nodes: Node[]; edges: Edge[] } = JSON.parse(rawTemplate);
  const idMap = new Map<string, string>();
  const newNodes = nodes.map((node) => {
    const newId = uuidv4();
    idMap.set(node.id, newId);
    return { ...node, id: newId, position: { x: node.position.x + offset.x, y: node.position.y + offset.y, }, };
  });
  const newEdges = edges.map((edge) => ({ ...edge, id: uuidv4(), source: idMap.get(edge.source)!, target: idMap.get(edge.target)!, }));
  addNodes(newNodes);
  addEdges(newEdges);
}
