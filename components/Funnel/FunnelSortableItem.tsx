'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Box } from '@mui/material'
import { IFunnelBlock } from '@/types/global'
import FunnelBlock from './FunnelBlock'

interface Props {
  block: IFunnelBlock
  onChangeTitle: (id: string, title: string) => void
}

export default function FunnelSortableItem({ block, onChangeTitle }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Box ref={setNodeRef} style={style} {...attributes} position='relative'>
      <FunnelBlock block={block} onChangeTitle={onChangeTitle} isDragging={isDragging} />
      <Box
        {...listeners}
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 24,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'grab',
          pr: 1,
        }}
      >
        {[...Array(6)].map((_, i) => (
          <Box
            key={i}
            sx={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              bgcolor: '#ccc',
              my: 0.3,
            }}
          />
        ))}
      </Box>
    </Box>
  )
}