export const rootNodeID = 'root';
export const rootTempalteNodeID = 'rootTempalteNode';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const NODE_MODIFIERS: Record<string, any> = {
  '+': { isRequired: false },
  '*': { isRequired: true },
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const EDGE_MODIFIERS: Record<string, any> = {
  '~': { isAlternative: true },
  '': { isAlternative: false },
};
export const EDGE_MODIFIERS_ADDITION: Record<string, unknown> = {
  '~': { data: { isAlternative: true }, style: { strokeDasharray: '10 10' } },
  '': { data: { isAlternative: false }, style: { strokeDasharray: null } },
};


