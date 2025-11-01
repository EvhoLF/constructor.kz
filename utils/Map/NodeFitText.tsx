import { NODE_MIN_WIDTH } from "@/components/Diagram/Nodes";

interface NodeFitTextProps {
  text: string,
  minWidth?: number,
  icon?: boolean
}
const NodeFitText = ({ text, minWidth = NODE_MIN_WIDTH, icon = false }: NodeFitTextProps) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return null
  context.font = 'normal 500 21px "Roboto", "Helvetica", "Arial", sans-serif';
  const data = context?.measureText(text + (icon ? 'CC' : ''));
  if (!data) return null
  const roundWidth = Math.ceil(data.width / 10) * 10 + 20
  return Math.max(roundWidth, minWidth);
}

export default NodeFitText;