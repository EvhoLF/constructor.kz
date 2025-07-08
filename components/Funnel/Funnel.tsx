'use client'

import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useFunnel } from '@/hooks/useFunnel'
import { Box, Button, Container, Typography } from '@mui/material'
import FunnelSortableItem from './FunnelSortableItem'
import FunnelInsertButton from './FunnelInsertButton'
import Icon from '../UI/Icon'

export default function Funnel() {
  const {
    blocks,
    addBlockAfter,
    updateBlockTitle,
    moveBlock,
    exportJSON,
  } = useFunnel()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id)
      const newIndex = blocks.findIndex((b) => b.id === over?.id)
      moveBlock(oldIndex, newIndex)
    }
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" mb={2}>
        Воронка
      </Typography>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block, i) => (
            <Box key={block.id} sx={{ position: 'relative' }}>
              <FunnelInsertButton
                onClick={() => addBlockAfter(blocks[i - 1]?.id ?? block.id)}
              />
              <FunnelSortableItem
                block={block}
                onChangeTitle={updateBlockTitle}
              />
              {i === blocks.length - 1 && (
                <FunnelInsertButton onClick={() => addBlockAfter(block.id)} />
              )}
            </Box>
          ))}
        </SortableContext>
      </DndContext>

      <Button
        variant="outlined"
        onClick={exportJSON}
        sx={{ mt: 3 }}
        startIcon={<Icon icon="add" />}
      >
        Экспортировать JSON
      </Button>
    </Container>
  )
}
