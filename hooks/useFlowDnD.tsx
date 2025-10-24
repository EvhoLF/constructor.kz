import { Node, Edge, useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { useDnD } from "./DnDProvider";
import { init_NodePoint } from "@/components/MapComponents/Nodes";
import { v4 as uuidv4 } from 'uuid';
import { useModal } from "@/hooks/useModal";
import ModalDiagramImport from "@/components/Modals/ModalDiagramImport";

interface SchemePayload {
  nodes: Node[];
  edges: Edge[];
}

export const useFlowDnD = () => {
  const { screenToFlowPosition, addNodes, addEdges } = useReactFlow();
  const [dnd] = useDnD();
  const { showModal } = useModal();

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const generateNames = (
    nodes: Node[],
    edges: Edge[],
    rootName: string
  ): Node[] => {
    const idToChildren: Record<string, string[]> = {};
    edges.forEach((edge) => {
      if (!idToChildren[edge.source]) idToChildren[edge.source] = [];
      idToChildren[edge.source].push(edge.target);
    });

    const named: Record<string, string> = {};
    const assignNames = (id: string, prefix: string) => {
      named[id] = prefix;
      const children = idToChildren[id] || [];
      children.forEach((childId, index) => {
        assignNames(childId, `${prefix}.${index + 1}`);
      });
    };

    const rootNode = nodes[0];
    assignNames(rootNode.id, rootName);
    return nodes.map((node) => ({ ...node, data: { ...node.data, label: named[node.id] || node.data?.label || "Unnamed", }, }));
  };

  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      if (!dnd) return;
      if (dnd.type === "ADD_NODE") {
        const initNode = init_NodePoint({ ...dnd.props, data: dnd?.data ?? {}, position, });
        const newNode: Node = { ...initNode, id: initNode.id || uuidv4(), };
        addNodes(newNode);
      }
      if (dnd.type === "ADD_SCHEME") {
        const newAddScheme = dnd.data as SchemePayload;
        if (!newAddScheme?.nodes || !newAddScheme.edges) return;
        showModal({
          content: (
            <ModalDiagramImport
              onCancel={() => { }}
              onSubmit={(baseName: string, autoRename: boolean) => {
                const offsetX = position.x - (newAddScheme.nodes[0]?.position?.x || 0);
                const offsetY = position.y - (newAddScheme.nodes[0]?.position?.y || 0);
                const newNodes = newAddScheme.nodes.map((node) => ({
                  ...node, id: uuidv4(),
                  position: { x: node.position.x + offsetX, y: node.position.y + offsetY, },
                }));
                const oldToNewId: Record<string, string> = {};
                newAddScheme.nodes.forEach((old, idx) => { oldToNewId[old.id] = newNodes[idx].id; });
                const newEdges = newAddScheme.edges.map((edge) => ({
                  ...edge,
                  id: uuidv4(),
                  source: oldToNewId[edge.source],
                  target: oldToNewId[edge.target],
                }));
                const renamedNodes = autoRename ? generateNames(newNodes, newEdges, baseName) : newNodes;
                addNodes(renamedNodes);
                addEdges(newEdges);
              }}
            />
          ),
        });
      }
    },
    [addNodes, addEdges, dnd, screenToFlowPosition, showModal]
  );

  return {
    onDragOver,
    onDrop,
  };
};
