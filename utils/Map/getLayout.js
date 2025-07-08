import { NODE_MIN_HEIGHT, NODE_MIN_WIDTH } from '@/components/MapComponents/Nodes';
import Dagre from '@dagrejs/dagre';

const NODE_WIDTH = NODE_MIN_WIDTH;
const NODE_HEIGHT = NODE_MIN_HEIGHT;
const GRID_COLUMNS = 3;
const HORIZONTAL_SPACING = 40;
const VERTICAL_SPACING = 40;

const calculateNodePosition = (pos, node) => ({
  x: pos.x - (node?.width || node?.style?.width || node.measured?.width || NODE_WIDTH) / 2,
  y: pos.y - (node?.height || node?.style?.height || node.measured?.height || NODE_HEIGHT) / 2,
});

export const getLayout = (nodes, edges) => {
  const direction = 'TB'; // фиксированное направление сверху вниз

  const connectedNodeIds = new Set(edges.flatMap(edge => [edge.source, edge.target]));
  const connectedNodes = nodes.filter(node => connectedNodeIds.has(node.id));
  const nonConnectedNodes = nodes.filter(node => !connectedNodeIds.has(node.id));

  const g = new Dagre.graphlib.Graph({ multigraph: true })
    .setDefaultEdgeLabel(() => ({}))
    .setGraph({
      rankdir: direction,
      nodesep: 20,   // минимальное расстояние между узлами по горизонтали
      ranksep: 60,   // минимальное расстояние между рядами (по вертикали)
      marginx: 10,
      marginy: 10,
    });

  connectedNodes.forEach(node => {
    g.setNode(node.id, {
      width: node.measured?.width ?? NODE_WIDTH,
      height: node.measured?.height ?? NODE_HEIGHT,
    });
  });

  edges.forEach(edge => {
    g.setEdge(String(edge.source), String(edge.target));
  });

  Dagre.layout(g);

  const layoutedNodes = connectedNodes.map(node => {
    const pos = g.node(String(node.id));
    const { x, y } = calculateNodePosition(pos, node);
    return {
      ...node,
      position: { x, y },
      targetPosition: 'top',
      sourcePosition: 'bottom',
      data: { ...node.data, isHorizontal: false },
    };
  });

  // Расположение несвязанных узлов по сетке — центрировано под/над основной схемой
  const maxX = layoutedNodes.length
    ? Math.max(...layoutedNodes.map(n => n.position.x + NODE_WIDTH / 2))
    : 0;

  const minX = layoutedNodes.length
    ? Math.min(...layoutedNodes.map(n => n.position.x - NODE_WIDTH / 2))
    : 0;

  const layoutWidth = maxX - minX;
  const offsetX = minX;

  const yStart = layoutedNodes.length
    ? Math.max(...layoutedNodes.map(n => n.position.y)) + NODE_HEIGHT + VERTICAL_SPACING
    : 0;

  const nonConnectedLayouted = nonConnectedNodes.map((node, index) => {
    const column = index % GRID_COLUMNS;
    const row = Math.floor(index / GRID_COLUMNS);

    const x =
      offsetX +
      layoutWidth / 2 -
      ((GRID_COLUMNS - 1) * (NODE_WIDTH + HORIZONTAL_SPACING)) / 2 +
      column * (NODE_WIDTH + HORIZONTAL_SPACING);

    const y = yStart + row * (NODE_HEIGHT + VERTICAL_SPACING);

    return {
      ...node,
      position: { x, y },
      targetPosition: 'top',
      sourcePosition: 'bottom',
      data: { ...node.data, isHorizontal: false },
    };
  });

  return {
    nodes: [...layoutedNodes, ...nonConnectedLayouted],
    edges,
  };
};
