import { useDnD } from '@/hooks/DnDProvider';
import React, { ReactNode } from 'react';

type DnDProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: any,
  className?: string,
  children?: ReactNode,
}

const DnD = ({ props, children }: DnDProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setDnD] = useDnD();

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, event_data: {}) => {
    setDnD(event_data);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div style={{ cursor: 'pointer' }} onDragStart={(event) => onDragStart(event, props)} draggable>{children}</div>
  );
};

export default DnD;
