import { Node, Edge, useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { useDnD } from "./DnDProvider";
import { init_NodePoint } from "@/components/MapComponents/Nodes";
import { v4 as uuidv4 } from 'uuid';
import { useModal } from "@/hooks/useModal";
import ModalFormSchemeImport from "@/components/Modals/ModalFormSchemeImport";

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
        const scheme = dnd.data as SchemePayload;
        if (!scheme?.nodes || !scheme.edges) return;
        showModal({
          content: (
            <ModalFormSchemeImport
              onCancel={() => { }}
              onSubmit={(baseName: string, autoRename: boolean) => {
                const offsetX = position.x - (scheme.nodes[0]?.position?.x || 0);
                const offsetY = position.y - (scheme.nodes[0]?.position?.y || 0);
                const newNodes = scheme.nodes.map((node) => ({
                  ...node, id: uuidv4(),
                  position: { x: node.position.x + offsetX, y: node.position.y + offsetY, },
                }));
                const oldToNewId: Record<string, string> = {};
                scheme.nodes.forEach((old, idx) => { oldToNewId[old.id] = newNodes[idx].id; });
                const newEdges = scheme.edges.map((edge) => ({
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
