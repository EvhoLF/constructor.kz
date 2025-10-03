// components/KanbanFunnel/KanbanBlock.tsx
'use client'
import { IKanbanBlock, IKanbanFunnelStyle } from '@/types/kanban';
import { Card, CardContent, TextField, Stack, IconButton, Box } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { memo, useState, useCallback } from 'react';
import Icon from '../UI/Icon';
import Dots from '../UI/Dots';

interface Props {
  block: IKanbanBlock;
  funnelStyle: IKanbanFunnelStyle;
  onUpdate?: (blockId: string, updates: Partial<IKanbanBlock>) => void;
  isDragging?: boolean;
  overId?: string | null;
}

function KanbanBlock({ block, funnelStyle, onUpdate, isDragging = false, overId }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: block.id,
    data: {
      type: 'block',
      columnId: block.columnId
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOver = overId === block.id;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      id={`block-${block.id}`} // Добавляем ID для определения позиции
      elevation={isSortableDragging ? 8 : 1}
      sx={{
        backgroundColor: '#fff',
        border: '1px solid',
        borderColor: isOver ? 'primary.main' : 'grey.200',
        cursor: 'default',
        opacity: isSortableDragging ? 0.5 : 1,
        height: funnelStyle.blockHeight,
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: 2,
          borderColor: 'grey.300',
        },
        ...(isOver && {
          borderColor: 'primary.main',
          borderWidth: 2,
          marginBottom: '2px',
        }),
      }}
      onDoubleClick={() => setIsEditing(true)}
      onBlur={() => setIsEditing(false)}
    >
      <CardContent sx={{
        p: 1.5,
        pl: .5,
        '&:last-child': { pb: 1.5 },
        height: '100%',
        display: 'flex',
        // flexDirection: 'column',
      }}>
        <Dots {...listeners} {...attributes} dark={.8} sx={{ width: '1rem', height: '100%' }} />
        <Stack spacing={1} flex={1} pl={1} justifyContent='center'>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, minHeight: 0 }}>
            <TextField
              value={block.title}
              onChange={(e) => onUpdate?.(block.id, { title: e.target.value })}
              onFocus={() => setIsEditing(true)}
              variant="standard"
              InputProps={{
                disableUnderline: !isEditing,
                sx: {
                  lineHeight: '1rem',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  textAlign: funnelStyle.textAlign as any,
                  flex: 1,
                  '& .MuiInput-input': {
                    cursor: isEditing ? 'text' : 'default',
                  },
                },
              }}
              placeholder="Название задачи"
              fullWidth
              multiline
              maxRows={funnelStyle.blockHeight < 105 ? 1 : 2}
            />
          </Box>

          {funnelStyle.showDescriptions && funnelStyle.blockHeight > 85 && (
            <TextField
              value={block.description}
              onChange={(e) => onUpdate?.(block.id, { description: e.target.value })}
              onFocus={() => setIsEditing(true)}
              variant="standard"
              InputProps={{
                disableUnderline: !isEditing,
                sx: {
                  fontSize: '0.8rem',
                  color: 'grey.600',
                  textAlign: funnelStyle.textAlign as any,
                  '& .MuiInput-input': {
                    cursor: isEditing ? 'text' : 'default',
                  },
                },
              }}
              placeholder="Описание задачи"
              fullWidth
              multiline
              maxRows={funnelStyle.blockHeight < 90 ? 1 : funnelStyle.blockHeight < 120 ? 2 : 3}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default memo(KanbanBlock);