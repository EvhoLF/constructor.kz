import { EDGE_MODIFIERS, NODE_MODIFIERS, rootNodeID } from "./FormulaConfig";

// Универсальная функция: находит ключ с максимальной длиной и совпадающими полями
const getModifierKey = (item, modifiersMap) => {
  const entries = Object.entries(modifiersMap);
  const matches = entries.filter(([_, expectedObj]) => {
    return Object.entries(expectedObj).every(([field, value]) => item?.[field] === value);
  });
  if (matches.length === 0) return '';
  // сортируем по длине ключа (чем длиннее, тем выше приоритет)
  matches.sort((a, b) => b[0].length - a[0].length);
  return matches[0][0]; // возвращаем самый подходящий ключ
};

// Главная функция: преобразует nodes и edges в формулу
export const ParseGraphToFormula = (nodes, edges) => {
  const nodeMap = Object.fromEntries(nodes.map(node => [node.id, node]));
  const childrenMap = {};
  // Построение карты связей: parentId -> [childIds]
  edges.forEach(edge => {
    // if (!nodeMap[edge.source]) return;
    if (!childrenMap[edge.source]) { childrenMap[edge.source] = []; }
    childrenMap[edge.source].push(edge.target);
  });
  // Поиск рут-узла (обычно с id = "root")
  const rootId = nodes.find(n => n.id === rootNodeID)?.id || nodes[0]?.id;
  // Рекурсивная функция для обхода узлов и построения формулы
  const buildFormula = (parentId) => {
    const childIds = childrenMap[parentId] || [];
    const parts = childIds.map(childId => {
      const node = nodeMap[childId];
      if (!node) return;
      const edge = edges.find(e => e.source === parentId && e.target === childId);
      const edgeMod = getModifierKey(edge?.data, EDGE_MODIFIERS);
      const nodeMod = getModifierKey(node?.data, NODE_MODIFIERS);
      const label = node?.data?.label || node?.id;
      const subChildren = childrenMap[childId];
      if (subChildren && subChildren.length > 0) { return `${edgeMod}${nodeMod}${label}(${buildFormula(childId)})`; }
      else { return `${edgeMod}${nodeMod}${label}`; }
    });
    return parts.join('');
  };
  return buildFormula(rootId).replace(/\(\)/g, "");
};
