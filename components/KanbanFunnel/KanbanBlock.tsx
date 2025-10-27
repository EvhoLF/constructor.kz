// components/KanbanFunnel/KanbanBlock.tsx
'use client'
import { IKanbanBlock, IKanbanFunnelStyle } from '@/types/kanban';
import { CardContent, TextField, Stack, Box, IconButton } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { memo, useState, useContext, useRef } from 'react';
import { ThemeContext } from '@/hooks/ThemeRegistry';
import Frame from '../UI/Frame';
import Dots from '../UI/Dots';
import Icon from '../UI/Icon';

interface Props {
  block: IKanbanBlock;
  kanbanStyle: IKanbanFunnelStyle;
  onUpdate?: (blockId: string, updates: Partial<IKanbanBlock>) => void;
  onDelete?: (blockId: string) => void;
  isDragging?: boolean;
  overId?: string | null;
  color?: string;
}

function KanbanBlock({ block, kanbanStyle, onUpdate, onDelete, color = '#555555', isDragging = false, overId }: Props) {
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false);
  const { mode } = useContext(ThemeContext);
  const titleRef = useRef<HTMLInputElement>(null)

  // const blockColor = kanbanStyle.colored ? color || '#2196f3' : 'uiPanel.reverse'
  // const textColor = kanbanStyle.colored ? (kanbanStyle.filled ? 'uiPanel.main' : color) : (kanbanStyle.filled ? 'uiPanel.reverse' : 'uiPanel.reverse')
  // const borderColor = kanbanStyle.colored ? (kanbanStyle.filled ? 'uiPanel.reverse' : color) : 'uiPanel.reverse'
  // const dotsColor = kanbanStyle.colored ? (kanbanStyle.filled ? 'white' : color) : 'uiPanel.sub_main'

  const blockColor = kanbanStyle.colored ? (kanbanStyle.filled ? color : 'uiPanel.main') : 'uiPanel.main'
  const textColor = kanbanStyle.colored ? (kanbanStyle.filled ? 'uiPanel.main' : color) : (kanbanStyle.filled ? 'uiPanel.reverse' : 'uiPanel.reverse')
  const borderColor = kanbanStyle.colored ? (kanbanStyle.filled ? 'uiPanel.reverse' : color) : 'uiPanel.reverse'
  const dotsColor = kanbanStyle.colored ? (kanbanStyle.filled ? 'white' : color) : 'uiPanel.sub_main'

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
        backgroundColor: blockColor,
        borderColor: isOver ? borderColor : 'none',
        cursor: 'default',
        opacity: isSortableDragging ? 0.5 : 1,
        height: kanbanStyle.blockHeight,
        transition: 'all 0.2s ease',
        borderRadius: 1.5,

      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsEditing(true)}
      onBlurCapture={() => setIsEditing(false)}
      onDoubleClick={() => setIsEditing(true)}
      onBlur={() => setIsEditing(false)}
      onClick={(e) => {
        const target = e.target as HTMLElement
        if (target.closest('.no-focus')) return
        if (titleRef.current) {

          titleRef.current.focus()
        }
      }}
    >
      {(isHovered) && (
        <Frame
          className="no-focus"
          sx={{ p: 0, zIndex: 10, display: 'flex', gap: 1, position: 'absolute', right: 0, top: 0, alignItems: 'center' }}
        >
          <IconButton size="small" onClick={() => { if (onDelete) onDelete(block.id) }}>
            <Icon icon='delete' />
          </IconButton>
        </Frame>
      )}
      <CardContent sx={{
        p: 1.5,
        pl: 0,
        '&:last-child': { pb: 1.5 },
        height: '100%',
        display: 'flex',
        // flexDirection: 'column',
      }}>
        <Box
          className='no-export no-focus'
          {...listeners}
          sx={{ position: 'absolute', left: 0, top: 0, width: '16px', height: '100%', display: 'flex', padding: '.25rem', }}
        >
          <Dots spacing={9} dotColor={dotsColor} />
        </Box>
        <Stack spacing={1} flex={1} pl={2} pr={1} justifyContent='center'>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, minHeight: 0 }}>
            <TextField
              className='no-focus'
              inputRef={titleRef}
              value={block.title}
              onChange={(e) => onUpdate?.(block.id, { title: e.target.value })}
              onFocus={() => setIsEditing(true)}
              variant="standard"
              InputProps={{
                disableUnderline: !isEditing,
                sx: {
                  color: textColor,
                  lineHeight: '1rem',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  textAlign: kanbanStyle.textAlign as any,
                  flex: 1,
                  '& .MuiInput-input': {
                    cursor: isEditing ? 'text' : 'default',
                  },
                },
              }}
              placeholder="Заголовок"
              fullWidth
              multiline
              maxRows={kanbanStyle.blockHeight < 105 ? 1 : 2}
            />
          </Box>

          {kanbanStyle.showDescriptions && kanbanStyle.blockHeight > 85 && (
            <TextField
              className='no-focus'
              value={block.description}
              onChange={(e) => onUpdate?.(block.id, { description: e.target.value })}
              onFocus={() => setIsEditing(true)}
              variant="standard"
              InputProps={{
                disableUnderline: !isEditing,
                sx: {
                  fontSize: '0.8rem',
                  color: textColor,
                  textAlign: kanbanStyle.textAlign as any,
                  '& .MuiInput-input': {
                    cursor: isEditing ? 'text' : 'default',
                  },
                },
              }}
              placeholder="Описание"
              fullWidth
              multiline
              maxRows={kanbanStyle.blockHeight < 90 ? 1 : kanbanStyle.blockHeight < 120 ? 2 : 3}
            />
          )}
        </Stack>
      </CardContent>
    </Frame>
  );
}

export default memo(KanbanBlock);