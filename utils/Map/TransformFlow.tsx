import { TableFlow } from "@/components/MapComponents/Nodes";
import { Edge, Node } from "@xyflow/react";

export const transformFlowToTable = (nodes: Node[], edges: Edge[]): TableFlow[] => {
  return nodes.map(node => {
    const childEdges = edges.filter(edge => edge.source === node.id).map(edge => edge.target);
    return {
      id: node.id,
      data: node.data || {},
      edges: childEdges,
    };
  });
}

export const transformTableToFlow = (flowTable: TableFlow[]) => {
  const nodes = flowTable.map((item) => ({
    id: item.id,
    type: item?.type || 'point',
    position: { x: 0, y: 0 },
    data: item.data || {},
  }));

  const edges: Edge[] = [];
  flowTable.forEach(parent => {
    parent.edges?.forEach(childId => {
      edges.push({
        id: `e${parent.id}-${childId}`,
        source: parent.id,
        target: childId,
        type: 'default',
      });
    });
  });

  return { nodes, edges };
}
