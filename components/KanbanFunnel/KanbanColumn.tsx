// components/KanbanFunnel/KanbanColumn.tsx
'use client'
import { IKanbanBlock, IKanbanColumn, IKanbanFunnelStyle } from '@/types/kanban';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  IconButton,
  Stack,
} from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanBlock from './KanbanBlock';
import Icon from '../UI/Icon';
import { memo } from 'react';
import Dots from '../UI/Dots';

interface Props {
  column: IKanbanColumn;
  blocks: IKanbanBlock[];
  funnelStyle: IKanbanFunnelStyle;
  onUpdate?: (columnId: string, updates: Partial<IKanbanColumn>) => void;
  onAddBlock?: (columnId: string) => void;
  onUpdateBlock?: (blockId: string, updates: Partial<IKanbanBlock>) => void;
  isDragging?: boolean;
  overId?: string | null; // Добавляем свойство overId
}

function KanbanColumn({
  column,
  blocks,
  funnelStyle,
  onUpdate,
  onAddBlock,
  onUpdateBlock,
  isDragging = false,
  overId,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: column.id,
    data: { type: 'column' },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const columnColor = funnelStyle.colored ? column.color : '#f5f5f5';
  const textColor = funnelStyle.colored && funnelStyle.filled ? '#fff' : '#000';
  const isOver = overId === column.id;

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        width: funnelStyle.columnWidth,
        minWidth: funnelStyle.columnWidth,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        opacity: isSortableDragging ? 0.5 : 1,
        ...(isOver && {
          border: '2px dashed',
          borderColor: 'primary.main',
          borderRadius: 1,
        }),
      }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: funnelStyle.filled ? columnColor : 'transparent',
          border: `2px solid ${funnelStyle.filled ? 'transparent' : columnColor}`,
          transition: 'all 0.3s ease',
        }}
      >
        {/* Заголовок колонки с точками для перетаскивания */}
        <CardContent
          sx={{
            p: .5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: funnelStyle.filled ? columnColor : 'transparent',
          }}
        >
          <Stack alignItems='center'>
            <Stack direction="row" alignItems="center" spacing={1}>
              {/* Точки для перетаскивания */}
              <Dots {...listeners}{...attributes} sx={{ width: '32px', height: '16px', }} />

              <TextField
                value={column.title}
                onChange={(e) => onUpdate?.(column.id, { title: e.target.value })}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    color: textColor,
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    textAlign: funnelStyle.textAlign,
                    width: '100%',
                    '&:before, &:after': { display: 'none' },
                  },
                }}
                placeholder="Название колонки"
                fullWidth
              />

              <IconButton
                size="small"
                onClick={() => onAddBlock?.(column.id)}
                sx={{ color: textColor }}
              >
                <Icon icon="add" />
              </IconButton>
            </Stack>
          </Stack>
        </CardContent>

        {/* Контент колонки с скроллом */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 1,
            '&::-webkit-scrollbar': { width: 6, background: 'transparent' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { bgcolor: '#eeeeee' },
          }}
        >
          <SortableContext items={blocks.map(block => block.id)} strategy={verticalListSortingStrategy}>
            <Stack spacing={1}>
              {blocks.map((block) => (
                <KanbanBlock
                  key={block.id}
                  block={block}
                  funnelStyle={funnelStyle}
                  onUpdate={onUpdateBlock}
                  overId={overId}
                />
              ))}
            </Stack>
          </SortableContext>

          {blocks.length === 0 && (
            <Box
              sx={{
                p: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed',
                borderColor: 'grey.300',
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" color="#fff" textAlign="center">
                Блоков еще нет
              </Typography>
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
}

export default memo(KanbanColumn);