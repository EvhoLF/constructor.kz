'use client'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useFunnel } from '@/hooks/useFunnel'
import { Box, Button, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import FunnelBlockSortable from './FunnelBlockSortable'
import FunnelInsertButton from './FunnelInsertButton'
import Icon from '../UI/Icon'
import { useEffect, useRef } from 'react'
import ClientOnly from '../ClientOnly'
import InputSlider from '../UI/InputSlider'
import { exportBoardPDF, exportBoardPNG } from '@/utils/exportBoard'
import { useAsync } from '@/hooks/useAsync'
import axios from 'axios'
import { Funnel as TypeFunnel } from '.prisma/client';
import { enqueueSnackbar } from 'notistack'
import { IFunnelBlock } from '@/types/funnel'


export default function Funnel({ id }: { id: string }) {
  const funnelRef = useRef<HTMLDivElement>(null);
  const { asyncFn } = useAsync();

  const {
    blocks, setBlocksMap,
    addBlockAfter,
    updateBlock,
    moveBlock,
    removeBlock,
    resetColors,
    layoutMode,
    setLayoutMode,
    styleMode,
    setStyleMode,
    textAlign,
    setTextAlign,
    toggles,
    updateToggleStates,
    blockWidth,
    setBlockWidth,
    blockHeight,
    setBlockHeight,
  } = useFunnel();

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex(b => b.id === active.id)
      const newIndex = blocks.findIndex(b => b.id === over?.id)
      moveBlock(oldIndex, newIndex)
    }
  };

  const save = async () => {
    try {
      const res = await asyncFn(() => axios.put(`/api/funnel/${id}`, { blocks }));
      if (res && res?.data) {
        enqueueSnackbar('Cхема обновлена успешно', { variant: 'success' });
      }
      else {
        console.error('Ошибка при обновлении схемы');
        enqueueSnackbar('Ошибка при обновлении схемы', { variant: 'error' });
      }
    }
    catch (err) {
      console.error('Ошибка при обновлении схемы:', err);
      enqueueSnackbar('Ошибка при обновлении схемы', { variant: 'error' });
    }
  }

  useEffect(() => {
    try {
      const fetch = async () => {
        const res = await asyncFn(() => axios.get(`/api/funnel/${id}`))
        if (!res || !res?.data) return;
        const resData: TypeFunnel = res.data;
        if (!resData.blocks) return;
        const resBlocks = JSON.parse(resData.blocks);
        const correctBlocksMap: Record<string, IFunnelBlock> = {};
        Object.values(resBlocks).forEach((block: any) => {
          if (block && typeof block === 'object' && block.id && block.order && block.title) {
            correctBlocksMap[block.id] = block as IFunnelBlock;
          }
        });
        setBlocksMap(correctBlocksMap);
      }
      fetch();
    }
    catch (err) {
      console.error(err);
    }
  }, [id]);

  return (
    <Stack sx={{ m: 0, p: 1 }}>
      {/* Панель настроек */}
      <Stack direction="row" spacing={2} mb={2} flexWrap="wrap" alignItems="center">
        <ToggleButton value="" size='small' onClick={save}>
          <Icon icon='save' />
        </ToggleButton>
        <ToggleButtonGroup size="small" color="primary">
          <ToggleButton value="" onClick={() => exportBoardPNG(funnelRef.current)}>
            <Icon icon='fileImage' />
          </ToggleButton>
          <ToggleButton value="" onClick={() => exportBoardPDF(funnelRef.current)}>
            <Icon icon='filePdf2' />
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          size="small"
          color="primary"
          value={Object.entries(toggles)
            .filter(([, v]) => v)
            .map(([k]) => k)}
          onChange={(_, newValues) => updateToggleStates(newValues)}
        >
          <ToggleButton value="showNumber">
            <Icon icon="hashtag" />
          </ToggleButton>
          <ToggleButton value="colored">
            <Icon icon="palette" />
          </ToggleButton>
          <ToggleButton value="showDescription">
            <Icon icon="infoCard" />
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Layout */}
        <ToggleButtonGroup size="small" color="primary" value={layoutMode} exclusive onChange={(_, v) => v && setLayoutMode(v)}>
          <ToggleButton value="equal">
            <Icon icon="funnelBlock" />
          </ToggleButton>
          <ToggleButton value="bottomBig">
            <Icon icon="funnelUp" />
          </ToggleButton>
          <ToggleButton value="topBig">
            <Icon icon="funnelDown" />
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Text Align */}
        <ToggleButtonGroup size="small" color="primary" value={textAlign} exclusive onChange={(_, v) => v && setTextAlign(v)}>
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

        {/* Style */}
        <ToggleButtonGroup size="small" color="primary" value={styleMode} exclusive onChange={(_, v) => v && setStyleMode(v)}>
          <ToggleButton value="filled">
            <Icon icon="squareFill" />
          </ToggleButton>
          <ToggleButton value="outlined">
            <Icon icon="square" />
          </ToggleButton>
        </ToggleButtonGroup>
        <Stack direction="row" spacing={2} alignItems="center">
          <InputSlider
            label="Ширина (%)"
            value={blockWidth}
            min={20}
            max={100}
            onChange={setBlockWidth}
          />
          <InputSlider
            label="Высота (px)"
            value={blockHeight}
            min={30}
            max={200}
            onChange={setBlockHeight}
          />
        </Stack>

        <Button variant="outlined" onClick={resetColors}>Сбросить цвета</Button>
        <Button variant="outlined" onClick={() => addBlockAfter(blocks[blocks.length - 1].id)}><Icon icon='add' /></Button>
      </Stack>

      {/* Воронка */}
      <Box ref={funnelRef}>
        <ClientOnly>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
              {blocks.map((block, i) => (
                <Box key={block.id} sx={{ position: 'relative' }}>
                  <FunnelInsertButton onClick={() => addBlockAfter(blocks[i - 1]?.id ?? block.id)} />
                  <FunnelBlockSortable
                    block={block}
                    onChange={updateBlock}
                    styleMode={styleMode}
                    onRemove={removeBlock}
                    colored={toggles.colored}
                    showNumber={toggles.showNumber}
                    showDescription={toggles.showDescription}
                  />
                  {i === blocks.length - 1 && <FunnelInsertButton onClick={() => addBlockAfter(block.id)} />}
                </Box>
              ))}
            </SortableContext>
          </DndContext>
        </ClientOnly>
      </Box>
    </Stack >
  )
}
