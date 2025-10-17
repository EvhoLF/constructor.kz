export const defaultEdgeOptions = (mode: string) => {
  if(mode == 'dark') return {style: { stroke: '#eeeeee', strokeWidth: 2 }};
  return  {style: { stroke: '#222222', strokeWidth: 2 }}
}