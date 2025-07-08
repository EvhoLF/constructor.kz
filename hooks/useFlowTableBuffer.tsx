import { TableEdge } from '@/components/MapComponents/Edges';
import { TableNode } from '@/components/MapComponents/Nodes';
import { Node, Edge } from '@xyflow/react';
import { useEffect, useRef } from 'react';

export function useFlowTableBuffer(nodes: Node[], edges: Edge[]) {
  const nodeRef = useRef<Map<string, TableNode>>(new Map());
  const edgeRef = useRef<Map<string, TableEdge>>(new Map());

  useEffect(() => {
    const map = nodeRef.current;
    nodes.forEach((node) => {
      const label = node.data.label as string || '';
      map.set(label, { id: node.id, type: node.type, data: node.data });
    });
  }, [nodes]);

  useEffect(() => {
    const edgeMap = edgeRef.current;
    edges.forEach((edge) => {
      edgeMap.set(edge.id, {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        data: edge.data || {},
        style: edge.style || {},
      });
    });
  }, [edges]);

  const restoreNodeData = (id: string) => nodeRef.current.get(id)?.data;
  const getNodeArray = () => Array.from(nodeRef.current.values());

  const restoreEdgeData = (id: string) => edgeRef.current.get(id);
  const getEdgeArray = () => Array.from(edgeRef.current.values());

  return {
    restoreData: { node: restoreNodeData, edge: restoreEdgeData },
    getArray: { node: getNodeArray, edge: getEdgeArray },
    nodeRef, edgeRef,
  };
}
