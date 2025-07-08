import { init_NodePoint, init_root_NodePoint } from "@/components/MapComponents/Nodes";
import { EDGE_MODIFIERS_ADDITION, NODE_MODIFIERS, rootNodeID } from "./FormulaConfig";
import NodeFitText from "../Map/NodeFitText";
import { init_Edge } from "@/components/MapComponents/Edges";

// Функция для парсинга префиксов по подстрокам (сначала самые длинные)
function matchLongestPrefix(input, modifierMap) {
  const keys = Object.keys(modifierMap).sort((a, b) => b.length - a.length);
  for (const key of keys) { if (input.startsWith(key)) { return { key, value: modifierMap[key] }; } }
  return null;
}

const getPreviousNodeState = (id, pre_nodes) => pre_nodes.find(n => n.id === id);

const getPreviousEdgeState = (id, pre_edges) => pre_edges.find(e => e.id === id);


export const ParseFormulaToGraph = (input, pre_nodes = [], pre_edges = [], restoreData) => {
  try {
    let index = 0;
    const nodes = [];
    const edges = [];
    const rootId = rootNodeID;
    let firstNodeFound = false;
    const peek = () => input[index];
    const consume = () => input[index++];
    const skipWhitespace = () => {
      while (/\s/.test(peek())) consume();
    };
    const readNodeWithModifiers = () => {
      const remaining = input.slice(index);
      // 1 модификаторы связи
      const edgeMod = matchLongestPrefix(remaining, EDGE_MODIFIERS_ADDITION);
      if (edgeMod) index += edgeMod.key.length;
      const afterEdge = input.slice(index);
      // 2 модификаторы узла
      const nodeMod = matchLongestPrefix(afterEdge, NODE_MODIFIERS);
      if (nodeMod) index += nodeMod.key.length;
      // 3 идентификатор
      const labelStart = index;
      while (index < input.length && /[a-zA-Zа-яА-Я0-9_.]/.test(peek())) { index++; }
      const label = input.slice(labelStart, index);
      if (!label) return null;
      return { id: `${label.toUpperCase()}`, label, edgeMod: edgeMod?.value || {}, nodeMod: nodeMod?.value || {} };
    };

    const addNodeIfNotExists = (id, label, props = {}) => {
      if (nodes.find(n => n.id === id)) {
        const error = new Error(`Узел с меткой "${label}" уже существует`);
        error.labelExists = true;
        throw error;
      }
      const existing = getPreviousNodeState(id, pre_nodes);
      const reNode = restoreData.node(id) || {};
      const isAutoResize = props.isAutoResize || existing?.isAutoResize || reNode?.isAutoResize;
      const position = isAutoResize ? { width: NodeFitText({ text: label }) } : {};
      const baseNode = {
        id, ...position, ...(existing || { type: "point" }),
        data: { label, ...(existing?.data || {}), ...reNode, ...props, },
      };
      const newNode = init_NodePoint(baseNode);
      nodes.push(newNode);
    };

    const addEdge = (source, target, props = {}) => {
      const id = `e${source}_${target}`;
      const existing = getPreviousEdgeState(id, pre_edges);
      const reEdge = restoreData.edge(id) || { style: {}, data: {} };
      const baseEdge = {
        id,
        source,
        target,
        ...props,
        style: {
          ...(existing?.style ?? {}),
          ...reEdge.style,
          ...props.style,
        },
        data: {
          ...(existing?.data ?? {}),
          ...reEdge.data,
          ...props.data,
        },
      };
      const newEdge = init_Edge(existing ? { ...existing, ...baseEdge } : baseEdge);
      edges.push(newEdge);
    };


    const parseNode = (parentId = null) => {
      skipWhitespace();
      if (peek() === '(') return null;
      const nodeInfo = readNodeWithModifiers();
      if (!nodeInfo) return null;
      const { id, label, edgeMod, nodeMod } = nodeInfo;
      addNodeIfNotExists(id, label, nodeMod);
      if (!firstNodeFound) {
        firstNodeFound = true;
        const rootNode = getPreviousNodeState(rootId, pre_nodes);
        if (rootNode) { nodes.unshift(rootNode); }
        else {
          const newNode = init_root_NodePoint();
          nodes.unshift(newNode);
        }
        addEdge(rootId, id, edgeMod);
      }
      else { addEdge(parentId || rootId, id, edgeMod); }
      skipWhitespace();
      if (peek() === '(') {
        consume(); // (
        const success = parseChildren(id);
        if (!success || peek() !== ')') return null;
        consume(); // )
      }
      return id;
    };


    const parseChildren = (parentId) => {
      while (index < input.length && peek() !== ')') {
        skipWhitespace();
        const child = parseNode(parentId);
        if (!child) return false;
        skipWhitespace();
      }
      return true;
    };

    const parseTopLevel = () => {
      while (index < input.length) {
        skipWhitespace();
        const node = parseNode(null);
        if (!node) return null;
      }
      return { nodes, edges, error: null };
    };

    return parseTopLevel();
  }
  catch (error) {
    console.log(error);

    if (error.labelExists) {
      return { nodes: [], edges: [], error: error.message }
    }
    return null
  }
};
