import { init_NodePoint } from "@/components/Diagram/Nodes";
import { EDGE_MODIFIERS_ADDITION, NODE_MODIFIERS, rootNodeID } from "./FormulaConfig";

// Функция для парсинга префиксов по подстрокам (сначала самые длинные)
function matchLongestPrefix(input, modifierMap) {
  const keys = Object.keys(modifierMap).sort((a, b) => b.length - a.length);
  for (const key of keys) { if (input.startsWith(key)) { return { key, value: modifierMap[key] }; } }
  return null;
}

export const ParseFormulaToGraph = (input) => {
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
      // Проверка: если не осталось метки (имя узла), это ошибка
      if (!label) return null;
      return { id: label.toUpperCase(), label, edgeMod: edgeMod?.value || {}, nodeMod: nodeMod?.value || {} };
    };

    const addNodeIfNotExists = (id, label, props = {}) => {
      const labelExists = nodes.some(n => n.data.label.toLowerCase() === label.toLowerCase());
      if (labelExists) {
        const error = new Error(`Узел с меткой "${label}" уже существует`);
        error.labelExists = true;
        throw error;
      }
      if (!nodes.some(n => n.id === id)) {
        const { data, style, position } = init_NodePoint();
        nodes.push({ id, type: "point", position, style, data: { ...data, label, ...props }, });
      }
    };

    const addEdge = (source, target, props = {}) => {
      const id = `e${source}_${target}`;
      edges.push({ id, source, target, ...props, });
    };

    const parseNode = (parentId = null) => {
      skipWhitespace();
      if (peek() === '(') return null; // Ошибка: не может начинаться с "("
      const nodeInfo = readNodeWithModifiers();
      if (!nodeInfo) return null;
      const { id, label, edgeMod, nodeMod } = nodeInfo;
      addNodeIfNotExists(id, label, nodeMod);
      if (!firstNodeFound) {
        firstNodeFound = true;
        const { data, style, position } = init_NodePoint();
        nodes.unshift({ id: rootId, type: "point", position, style, data: { ...data, label: 'Центральный узел', required: true }, });
        addEdge(rootId, id, edgeMod);
      } else if (parentId) {
        addEdge(parentId, id, edgeMod);
      } else {
        addEdge(rootId, id, edgeMod);
      }
      skipWhitespace();
      if (peek() === '(') {
        consume(); // (
        const success = parseChildren(id);
        if (!success) return null;
        if (peek() !== ')') return null;
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
    if (error.labelExists) {
      return { nodes: [], edges: [], error: error.message }
    }
    return null
  }
};
