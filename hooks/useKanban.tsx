// hooks/useKanban.ts
'use client'
import { IKanbanBlock, IKanbanColumn, IKanbanStyle } from '@/types/kanban';
import { useState, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_COLORS = ['#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#f44336', '#00bcd4'];

export function useKanban(initialData?: {
  columns?: IKanbanColumn[];
  blocks?: IKanbanBlock[];
  style?: IKanbanStyle;
}) {
  const [columns, setColumns] = useState<IKanbanColumn[]>(() =>
    initialData?.columns || [
      {
        id: 'c1',
        title: 'Новые',
        color: DEFAULT_COLORS[0],
        order: 0,
        style: { filled: true, textAlign: 'left', showHeader: true }
      },
      {
        id: 'c2',
        title: 'В работе',
        color: DEFAULT_COLORS[1],
        order: 1,
        style: { filled: true, textAlign: 'left', showHeader: true }
      },
      {
        id: 'c3',
        title: 'Завершено',
        color: DEFAULT_COLORS[2],
        order: 2,
        style: { filled: true, textAlign: 'left', showHeader: true }
      },
    ]
  );

  const [blocks, setBlocks] = useState<IKanbanBlock[]>(() => {
    if (initialData?.blocks) return initialData.blocks;

    const defaultBlocks = [
      { id: 'c1-1', title: 'Задача 1', description: 'Описание задачи 1', columnId: '', order: 0 },
      { id: 'c1-2', title: 'Задача 2', description: 'Описание задачи 2', columnId: '', order: 1 },
      { id: 'c1-3', title: 'Задача 3', description: 'Описание задачи 3', columnId: '', order: 2 },
    ].map((block, index) => ({
      ...block,
      columnId: columns[Math.min(index, columns.length - 1)].id
    }));

    return defaultBlocks;
  });

  const [funnelStyle, setFunnelStyle] = useState<IKanbanStyle>(() =>
    initialData?.style || {
      colored: true,
      filled: true,
      textAlign: 'left',
      showNumbers: false,
      showDescriptions: true,
      columnWidth: 300,
      blockHeight: 80,
    }
  );

  const sortedColumns = useMemo(() =>
    [...columns].sort((a, b) => a.order - b.order),
    [columns]
  );

  const blocksByColumn = useMemo(() => {
    const grouped: Record<string, IKanbanBlock[]> = {};
    sortedColumns.forEach(col => {
      grouped[col.id] = blocks
        .filter(block => block.columnId === col.id)
        .sort((a, b) => a.order - b.order);
    });
    return grouped;
  }, [blocks, sortedColumns]);

  const addColumn = useCallback((afterId?: string) => {
    setColumns(prev => {
      const newColumn: IKanbanColumn = {
        id: uuidv4(),
        title: 'Новая колонка',
        color: DEFAULT_COLORS[prev.length % DEFAULT_COLORS.length],
        order: prev.length,
        style: { filled: true, textAlign: 'left', showHeader: true }
      };
      return [...prev, newColumn];
    });
  }, []);

  const updateColumn = useCallback((columnId: string, updates: Partial<IKanbanColumn>) => {
    setColumns(prev => prev.map(col =>
      col.id === columnId ? { ...col, ...updates } : col
    ));
  }, []);

  const moveColumn = useCallback((activeId: string, overId: string) => {
    setColumns(prev => {
      const newColumns = [...prev];
      const activeIndex = newColumns.findIndex(col => col.id === activeId);
      const overIndex = newColumns.findIndex(col => col.id === overId);

      if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
        return prev;
      }

      const [movedColumn] = newColumns.splice(activeIndex, 1);
      newColumns.splice(overIndex, 0, movedColumn);

      return newColumns.map((col, index) => ({
        ...col,
        order: index
      }));
    });
  }, []);

  const addBlock = useCallback((columnId: string, position?: number) => {
    setBlocks(prev => {
      const columnBlocks = prev.filter(block => block.columnId === columnId);

      // Если позиция не указана или больше количества блоков - добавляем в конец
      if (position === undefined || position > columnBlocks.length) {
        const newBlock: IKanbanBlock = {
          id: uuidv4(),
          title: 'Новая задача',
          description: 'Описание задачи',
          columnId,
          order: columnBlocks.length
        };
        return [...prev, newBlock];
      }

      // Если позиция указана - вставляем в нужное место и обновляем порядок остальных блоков
      const newBlock: IKanbanBlock = {
        id: uuidv4(),
        title: 'Новая задача',
        description: 'Описание задачи',
        columnId,
        order: position
      };

      // Обновляем order у блоков, которые идут после вставленной позиции
      const updatedBlocks = prev.map(block => {
        if (block.columnId === columnId && block.order >= position) {
          return { ...block, order: block.order + 1 };
        }
        return block;
      });

      return [...updatedBlocks, newBlock];
    });
  }, []);

  const updateBlock = useCallback((blockId: string, updates: Partial<IKanbanBlock>) => {
    setBlocks(prev => prev.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    ));
  }, []);

  const moveBlock = useCallback((activeId: string, overId: string | null, newColumnId: string) => {
    setBlocks(prev => {
      const activeBlock = prev.find(b => b.id === activeId);
      if (!activeBlock) return prev;

      const blocksWithoutActive = prev.filter(b => b.id !== activeId);
      const targetColumnBlocks = blocksWithoutActive
        .filter(b => b.columnId === newColumnId)
        .sort((a, b) => a.order - b.order);

      let newOrder: number;

      if (!overId) {
        newOrder = targetColumnBlocks.length;
      } else {
        const overBlock = targetColumnBlocks.find(b => b.id === overId);
        if (!overBlock) {
          newOrder = targetColumnBlocks.length;
        } else {
          const isMovingDown =
            activeBlock.columnId === newColumnId && activeBlock.order < overBlock.order;
          newOrder = isMovingDown ? overBlock.order + 1 : overBlock.order;
        }
      }

      const updatedBlocks = blocksWithoutActive.map(block => {
        if (block.columnId === newColumnId && block.order >= newOrder) {
          return { ...block, order: block.order + 1 };
        }
        return block;
      });

      const movedBlock = { ...activeBlock, columnId: newColumnId, order: newOrder };
      return normalizeBlockOrders([...updatedBlocks, movedBlock]);
    });
  }, []);

  const deleteBlock = useCallback((blockId: string) => {
    setBlocks(prev => {
      return prev.filter(block => block.id !== blockId);
    });
  }, []);

  const deleteColumn = useCallback((columnId: string) => {
    setColumns(prev => {
      // Удаляем колонку
      const filteredColumns = prev.filter(col => col.id !== columnId);
      // Перенумеровываем order
      return filteredColumns.map((col, index) => ({ ...col, order: index }));
    });

    setBlocks(prev => {
      // Удаляем все блоки, которые были в колонке
      return prev.filter(block => block.columnId !== columnId);
    });
  }, []);

  const normalizeBlockOrders = useCallback((blocks: IKanbanBlock[]): IKanbanBlock[] => {
    const columnGroups: Record<string, IKanbanBlock[]> = {};

    blocks.forEach(block => {
      if (!columnGroups[block.columnId]) {
        columnGroups[block.columnId] = [];
      }
      columnGroups[block.columnId].push(block);
    });

    const normalized: IKanbanBlock[] = [];

    Object.values(columnGroups).forEach(columnBlocks => {
      const sorted = [...columnBlocks].sort((a, b) => a.order - b.order);
      sorted.forEach((block, index) => {
        normalized.push({ ...block, order: index });
      });
    });

    return normalized;
  }, []);

  const updateStyle = useCallback((updates: Partial<IKanbanStyle>) => {
    setFunnelStyle(prev => ({ ...prev, ...updates }));
  }, []);

  const resetColors = useCallback(() => {
    setColumns(prev => prev.map((col, index) => ({
      ...col,
      color: DEFAULT_COLORS[index % DEFAULT_COLORS.length]
    })));
  }, []);

  const exportJSON = useCallback(() => {
    const data = { columns, blocks, funnelStyle };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kanban-funnel.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [columns, blocks, funnelStyle]);

  // Функции для установки начальных данных
  const setInitialData = useCallback((data: {
    columns: IKanbanColumn[];
    blocks: IKanbanBlock[];
    style: IKanbanStyle;
  }) => {
    setColumns(data.columns);
    setBlocks(data.blocks);
    setFunnelStyle(data.style);
  }, []);

  return {
    // State
    columns: sortedColumns,
    blocksByColumn,
    blocks,
    funnelStyle,

    // Setters
    setColumns,
    setBlocks,
    setFunnelStyle,
    setInitialData,

    // Actions
    addColumn,
    updateColumn,
    moveColumn,
    deleteColumn,
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    updateStyle,
    resetColors,
    exportJSON,
  };
}