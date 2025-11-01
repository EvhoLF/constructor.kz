export const defaultEdgeOptions = (mode: string) => {
  if (mode == 'dark') return { style: { stroke: '#eeeeee', strokeWidth: 2 } };
  return { style: { stroke: '#222222', strokeWidth: 2 } }
}

export const lineStyle = (mode: string) => {
  if (mode == 'dark') return '#1f1f22';
  return '#eeeeee'
}