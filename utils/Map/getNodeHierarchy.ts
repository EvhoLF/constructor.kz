import { Edge, Node } from "@xyflow/react";

const getNodeHierarchy = (nodes: Node[], edges: Edge[]): Node[] => {
  const nodeMap = new Map(nodes.map(node => [node.id, node]));
  const childrenMap = new Map<string, string[]>();
  // Построим карту: id родителя -> массив id детей
  edges.forEach(({ source, target }) => {
    if (!childrenMap.has(source)) childrenMap.set(source, []);
    childrenMap.get(source)!.push(target);
  });
  // Найдём корневые узлы (те, у кого нет входящих рёбер)
  const allChildIds = new Set(edges.map(e => e.target));
  const rootNodes = nodes.filter(node => !allChildIds.has(node.id));
  const result: Node[] = [];
  const dfs = (id: string) => {
    const node = nodeMap.get(id);
    if (node) result.push(node);
    const children = childrenMap.get(id) || [];
    children.forEach(childId => dfs(childId));
  };
  rootNodes.forEach(root => dfs(root.id));
  return result;
}

export default getNodeHierarchy