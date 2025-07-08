import { getNodesBounds, getViewportForBounds, Node } from '@xyflow/react';
import { toPng } from 'html-to-image';

const getSize = () => {
  if (!document) return;
  const el = document.getElementsByClassName('react-flow__nodes')[0] as HTMLElement
  if (!el) return;
  const children = Array.from(el.children);
  let minLeft = Infinity, maxRight = -Infinity, minTop = Infinity, maxBottom = -Infinity;
  children.forEach(child => {
    const rect = child.getBoundingClientRect();
    minLeft = Math.min(minLeft, rect.left);
    maxRight = Math.max(maxRight, rect.right);
    minTop = Math.min(minTop, rect.top);
    maxBottom = Math.max(maxBottom, rect.bottom);
  });
  const width = maxRight - minLeft;
  const height = maxBottom - minTop;
  return [width, height]
}

export const TakeImageMap = async (nodes: Node[]) => {
  const sizes = getSize();
  if (!sizes) return;
  const [imageWidth, imageHeight] = sizes
  const nodesBounds = getNodesBounds(nodes);
  const viewport = getViewportForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2, 0);
  const res = await toPng(document.querySelector('.react-flow__viewport') as HTMLElement, {
    width: imageWidth + 4,
    height: imageHeight,
    style: { width: `${imageWidth}`, height: `${imageHeight}`, transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`, },
  });
  return res
}

export function downloadImage(value: string | undefined) {
  if (!value) return;
  const a = document.createElement('a');
  a.setAttribute('download', 'reactflow.png');
  a.setAttribute('href', value);
  a.click();
}

export const TakeImageMapDownload = (nodes: Node[]) => TakeImageMap(nodes).then(downloadImage)