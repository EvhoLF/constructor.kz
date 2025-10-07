// components/DnD/DnD.tsx
import { useDnD } from '@/hooks/DnDProvider';
import React, { ReactNode } from 'react';

type DnDProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: any;
  className?: string;
  children?: ReactNode;
};

const DnD = ({ props, children }: DnDProps) => {
  const [_, setDnD] = useDnD();

  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    // Чтобы браузер корректно начал drag
    try {
      event.dataTransfer.setData('application/reactflow', JSON.stringify(props));
      event.dataTransfer.effectAllowed = 'move';
      // Можно задать drag image, если нужно:
      // const img = new Image();
      // img.src = 'data:image/svg+xml;base64,...';
      // event.dataTransfer.setDragImage(img, 0, 0);
    } catch (err) {
      // в некоторых браузерах dataTransfer может быть ограничен, игнорируем
    }

    // Сохраняем данные в контексте (на случай, если onMouseDown не сработал)
    setDnD(props);
  };

  // Важно: ставим контекст уже на mousedown/touchstart, чтобы первый клик
  // тоже "подхватывал" дnd-данные (частая причина "нужно нажать дважды")
  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // чтобы не "ловил" MUI Tooltip / parent handlers
    setDnD(props);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    // не вызываем stopPropagation по умолчанию, если это ломает что-то на touch
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
      // если вы делали onMouseDown только для stopPropagation, теперь оно внутри onMouseDown
    >
      {children}
    </div>
  );
};

export default DnD;
