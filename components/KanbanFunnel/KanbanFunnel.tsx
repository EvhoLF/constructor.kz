'use client'
import { useKanbanFunnel } from '@/hooks/useKanbanFunnel';
import {
  Box,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  IconButton,
} from '@mui/material';
import { DndContext, DragOverlay, rectIntersection } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import KanbanBlock from './KanbanBlock';
import { useRef, useState, useCallback, useEffect } from 'react';
import { exportFunnelPDF, exportFunnelPNG } from '@/utils/exportFunnel';
import Icon from '../UI/Icon';
import InputSlider from '../UI/InputSlider';
import ClientOnly from '../ClientOnly';

import { useAsync } from '@/hooks/useAsync';
import { enqueueSnackbar } from 'notistack';
import { IKanbanFunnel } from '@/types/kanban';
import axiosClient from '@/libs/axiosClient';

interface KanbanFunnelProps {
  id: string;
}

export default function KanbanFunnel({ id }: KanbanFunnelProps) {
  const kanbanRef = useRef<HTMLDivElement>(null);
  const { asyncFn } = useAsync();

  const {
    columns,
    blocks,
    blocksByColumn,
    funnelStyle,
    addColumn,
    updateColumn,
    moveColumn,
    deleteColumn,
    addBlock,
    updateBlock,
    moveBlock,
    updateStyle,
    resetColors,
    setColumns,
    setBlocks,
    setFunnelStyle,
  } = useKanbanFunnel();

  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const handleDragStart = useCallback((event: any) => {
    const { active } = event;
    if (active.data.current?.type === 'column') {
      setActiveColumn(active.id);
    } else if (active.data.current?.type === 'block') {
      setActiveBlock(active.id);
    }
  }, []);

  const handleDragOver = useCallback((event: any) => {
    const { over } = event;
    setOverId(over?.id || null);
  }, []);

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;

    setOverId(null);

    if (!over) {
      setActiveColumn(null);
      setActiveBlock(null);
      return;
    }

    if (active.data.current?.type === 'column') {
      if (active.id !== over.id) {
        moveColumn(active.id, over.id);
      }
    } else if (active.data.current?.type === 'block') {
      const activeBlock = blocks.find(b => b.id === active.id);
      if (!activeBlock) return;

      let targetColumnId: string;

      if (over.data.current?.type === 'column') {
        targetColumnId = over.id;
      } else if (over.data.current?.type === 'block') {
        const targetBlock = blocks.find(b => b.id === over.id);
        targetColumnId = targetBlock?.columnId || activeBlock.columnId;
      } else {
        targetColumnId = activeBlock.columnId;
      }

      if (targetColumnId) {
        moveBlock(active.id, over.id, targetColumnId);
      }
    }

    setActiveColumn(null);
    setActiveBlock(null);
  }, [blocks, moveColumn, moveBlock]);

  const save = async () => {
    try {
      const res = await asyncFn(() => axiosClient.put(`/api/kanban/${id}`, {
        columns,
        blocks,
        style: funnelStyle
      }));
      if (res && res?.data) {
        enqueueSnackbar('Канбан воронка обновлена успешно', { variant: 'success' });
      } else {
        console.error('Ошибка при обновлении канбан воронки');
        enqueueSnackbar('Ошибка при обновлении канбан воронки', { variant: 'error' });
      }
    } catch (err) {
      console.error('Ошибка при обновлении канбан воронки:', err);
      enqueueSnackbar('Ошибка при обновлении канбан воронки', { variant: 'error' });
    }
  };

  useEffect(() => {
    try {
      const fetch = async () => {
        const res = await asyncFn(() => axiosClient.get(`/api/kanban/${id}`));
        if (!res || !res?.data) return;

        const resData: IKanbanFunnel = res.data;

        if (resData.columns) {
          const parsedColumns = JSON.parse(resData.columns as any);
          setColumns(parsedColumns);
        }

        if (resData.blocks) {
          const parsedBlocks = JSON.parse(resData.blocks as any);
          setBlocks(parsedBlocks);
        }

        if (resData.style) {
          const parsedStyle = JSON.parse(resData.style as any);
          setFunnelStyle(parsedStyle);
        }
      };
      fetch();
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  const activeColumnData = activeColumn ? columns.find(col => col.id === activeColumn) : null;
  const activeBlockData = activeBlock ? blocks.find(b => b.id === activeBlock) : null;

  return (
    <Stack sx={{ p: 1, height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <ClientOnly>
        {/* Панель настроек */}
        <Stack direction="row" spacing={2} mb={2} flexWrap="wrap" alignItems="center">
          <ToggleButton value="" size='small' onClick={save}>
            <Icon icon='save' />
          </ToggleButton>

          <ToggleButtonGroup size="small" color="primary">
            <ToggleButton value="" onClick={() => exportFunnelPNG(kanbanRef.current)}>
              <Icon icon='fileImage' />
            </ToggleButton>
            <ToggleButton value="" onClick={() => exportFunnelPDF(kanbanRef.current)}>
              <Icon icon='filePdf2' />
            </ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup
            size="small"
            color="primary"
            value={[
              funnelStyle.colored && 'colored',
              funnelStyle.filled && 'filled',
              funnelStyle.showDescriptions && 'showDescriptions',
            ].filter(Boolean)}
            onChange={(_, newValues) => {
              updateStyle({
                colored: newValues.includes('colored'),
                filled: newValues.includes('filled'),
                showDescriptions: newValues.includes('showDescriptions'),
              });
            }}
          >
            <ToggleButton value="colored">
              <Icon icon="palette" />
            </ToggleButton>
            <ToggleButton value="filled">
              <Icon icon="squareFill" />
            </ToggleButton>
            <ToggleButton value="showDescriptions">
              <Icon icon="infoCard" />
            </ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup
            size="small"
            color="primary"
            value={funnelStyle.textAlign}
            exclusive
            onChange={(_, v) => v && updateStyle({ textAlign: v })}
          >
            <ToggleButton value="left">
              <Icon icon="textAlignLeft" />
            </ToggleButton>
            <ToggleButton value="center">
              <Icon icon="textAlignCenter" />
            </ToggleButton>
            <ToggleButton value="right">
              <Icon icon="textAlignRight" />
            </ToggleButton>
          </ToggleButtonGroup>

          <Stack direction="row" spacing={2} alignItems="center">
            <InputSlider
              label="Ширина колонки"
              value={funnelStyle.columnWidth}
              min={200}
              max={500}
              onChange={(v) => updateStyle({ columnWidth: v })}
            />
            <InputSlider
              label="Высота блока"
              value={funnelStyle.blockHeight}
              min={60}
              max={150}
              onChange={(v) => updateStyle({ blockHeight: v })}
            />
          </Stack>

          <Button variant="outlined" onClick={resetColors}>Сбросить цвета</Button>
          <Button variant="outlined" onClick={() => addColumn()}><Icon icon='add' /></Button>
        </Stack>

        {/* Канбан доска */}
        <Box ref={kanbanRef} sx={{ flex: 1, overflow: 'hidden' }}>
          <DndContext
            collisionDetection={rectIntersection}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={columns.map(col => col.id)} strategy={horizontalListSortingStrategy}>
              <Stack direction="row" spacing={2} sx={{ height: '100%', overflowX: 'auto', pb: 1 }}>
                {columns.map((column) => (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    blocks={blocksByColumn[column.id] || []}
                    funnelStyle={funnelStyle}
                    onUpdate={updateColumn}
                    onAddBlock={addBlock}
                    onUpdateBlock={updateBlock}
                    deleteColumn={deleteColumn}
                    overId={overId}
                  />
                ))}
              </Stack>
            </SortableContext>

            <DragOverlay>
              {activeColumnData && (
                <Box sx={{ opacity: 0.8 }}>
                  <KanbanColumn
                    column={activeColumnData}
                    blocks={blocksByColumn[activeColumnData.id] || []}
                    funnelStyle={funnelStyle}
                    isDragging
                  />
                </Box>
              )}
              {activeBlockData && (
                <Box sx={{ opacity: 0.8, transform: 'rotate(5deg)' }}>
                  <KanbanBlock
                    block={activeBlockData}
                    funnelStyle={funnelStyle}
                    isDragging
                  />
                </Box>
              )}
            </DragOverlay>
          </DndContext>
        </Box>
      </ClientOnly>
    </Stack>
  );
}