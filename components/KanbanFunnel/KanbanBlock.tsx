// components/KanbanFunnel/KanbanBlock.tsx
'use client'
import { IKanbanBlock, IKanbanFunnelStyle } from '@/types/kanban';
import { CardContent, TextField, Stack, Box } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { memo, useState, useContext } from 'react';
import { ThemeContext } from '@/hooks/ThemeRegistry';
import Frame from '../UI/Frame';

interface Props {
  block: IKanbanBlock;
  funnelStyle: IKanbanFunnelStyle;
  onUpdate?: (blockId: string, updates: Partial<IKanbanBlock>) => void;
  isDragging?: boolean;
  overId?: string | null;
  color?: string;
}

function KanbanBlock({ block, funnelStyle, onUpdate, color = '#222222', isDragging = false, overId }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const { mode } = useContext(ThemeContext);

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
    <Frame
      ref={setNodeRef}
      style={style}
      id={`block-${block.id}`} // Добавляем ID для определения позиции
      elevation={isSortableDragging ? 8 : 1}
      sx={{
        position: 'relative',
        backgroundColor: funnelStyle.filled ? '#ffffff' : 'uiPanel.main',
        borderColor: isOver ? 'primary.main' : 'none',
        cursor: 'default',
        opacity: isSortableDragging ? 0.5 : 1,
        height: funnelStyle.blockHeight,
        transition: 'all 0.2s ease',
        borderRadius: 1.5,
        // borderLeft: `3px solid ${color}`,
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0, top: 0,
          height: '100%',
          width: '5px', // colored
          background: funnelStyle.filled ? '#dddddd' : funnelStyle.colored ? color ?? 'uiPanel.reverse' : 'uiPanel.reverse'
        }
        // '&:hover': {
        //   boxShadow: 2,
        //   borderColor: 'grey.300',
        // },
        // ...(isOver && {
        //   borderColor: 'primary.main',
        //   borderWidth: 2,
        //   marginBottom: '2px',
        // }),
      }}
      onDoubleClick={() => setIsEditing(true)}
      onBlur={() => setIsEditing(false)}
    >
      <CardContent sx={{
        p: 1.5,
        pl: 0,
        '&:last-child': { pb: 1.5 },
        height: '100%',
        display: 'flex',
        // flexDirection: 'column',
      }}>
        <Box {...listeners} {...attributes} sx={{ position: 'absolute', left: '0', top: '0', width: '2rem', height: '100%' }}></Box>
        <Stack spacing={1} flex={1} px={2} justifyContent='center'>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, minHeight: 0 }}>
            <TextField
              value={block.title}
              onChange={(e) => onUpdate?.(block.id, { title: e.target.value })}
              onFocus={() => setIsEditing(true)}
              variant="standard"
              InputProps={{
                disableUnderline: !isEditing,
                sx: {
                  color: funnelStyle.filled ? '#000000' : 'uiPanel.reverse',
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
                  color: funnelStyle.filled ? '#333333' : 'uiPanel.reverse',
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
    </Frame>
  );
}

export default memo(KanbanBlock);