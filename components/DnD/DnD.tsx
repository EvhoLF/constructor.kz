
import { useDnD } from '@/hooks/DnDProvider';
import React, { ReactNode } from 'react';

type DnDProps = {

  props?: any;
  className?: string;
  children?: ReactNode;
};

const DnD = ({ props, children }: DnDProps) => {
  const [_, setDnD] = useDnD();

  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {

    try {
      event.dataTransfer.setData('application/reactflow', JSON.stringify(props));
      event.dataTransfer.effectAllowed = 'move';
    } catch (err) {
    }
    setDnD(props);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDnD(props);
  };

  const onTouchStart = (e: React.TouchEvent) => {

    setDnD(props);
  };

  return (
    <div
      style={{
        cursor: 'grab',
        userSelect: 'none',
      }}
      draggable
      onDragStart={onDragStart}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}

    >
      {children}
    </div>
  );
};

export default DnD;
