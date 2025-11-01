// components/Kanban/KanbanColumn.tsx
'use client'
import { IKanbanBlock, IKanbanColumn, IKanbanStyle } from '@/types/kanban';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  IconButton,
  Stack,
  Portal,
  Popper,
  Menu,
  MenuItem,
} from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanBlock from './KanbanBlock';
import Icon from '../UI/Icon';
import { memo, useContext, useRef, useState } from 'react';
import Dots from '../UI/Dots';
import { ThemeContext } from '@/hooks/ThemeRegistry';
import Frame from '../UI/Frame';
import InputColorText from '../UI/InputColorText';
import KanbanInsertButton from './KanbanInsertButton';

interface Props {
  column: IKanbanColumn;
  blocks: IKanbanBlock[];
  funnelStyle: IKanbanStyle;
  onUpdate?: (columnId: string, updates: Partial<IKanbanColumn>) => void;
  onAddBlock?: (columnId: string, position?: number) => void;
  onUpdateBlock?: (blockId: string, updates: Partial<IKanbanBlock>) => void;
  deleteColumn?: (columnId: string) => void;
  deleteBlock?: (blockId: string) => void;
  isDragging?: boolean;
  overId?: string | null;
}

function KanbanColumn({ column, blocks, funnelStyle, onUpdate, onAddBlock, deleteBlock, onUpdateBlock, deleteColumn, isDragging = false, overId }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({ id: column.id, data: { type: 'column' }, });
  const style = { transform: CSS.Transform.toString(transform), transition, };

  const color = funnelStyle.colored ? (funnelStyle.filled ? column.color : 'uiPanel.main') : 'uiPanel.main'
  const textColor = funnelStyle.colored ? (funnelStyle.filled ? 'uiPanel.reverse' : column.color) : (funnelStyle.filled ? 'uiPanel.reverse' : 'uiPanel.reverse')
  const borderColor = funnelStyle.colored ? (funnelStyle.filled ? 'uiPanel.reverse' : column.color) : 'uiPanel.reverse'
  const dotsColor = funnelStyle.colored ? (funnelStyle.filled ? 'white' : column.color) : 'uiPanel.sub_main'

  const isOver = overId === column.id;
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  const columnRef = useRef(null);
  const headerRef = useRef(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleColorChange = (color: string) => {
    onUpdate?.(column.id, { color });
    setColorPickerOpen(false);
    handleMenuClose();
  };

  const handleDelete = () => {
    if (deleteColumn) {
      deleteColumn(column.id);
    }
    handleMenuClose();
  };

  const isMenuOpen = Boolean(menuAnchorEl);

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        position: 'relative',
        overflow: 'visible',
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Frame
        ref={columnRef}
        sx={{
          padding: 0,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          ...(funnelStyle.filled ? {} : { borderColor: borderColor, border: '2px solid' }),
        }}
      >
        {/* Заголовок колонки с точками для перетаскивания */}
        <CardContent
          ref={headerRef}
          sx={{
            p: .5,
            backgroundColor: color,
            position: 'relative',
            '&:hover .column-menu': {
              opacity: 1,
            },
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Stack alignItems='center'>
            <Stack direction="row" alignItems="center" spacing={1}>
              {/* Точки для перетаскивания */}
              <Box
                className='no-export'
                {...listeners}
                sx={{ width: '38px', height: '16px' }}
              >
                <Dots dotColor={dotsColor} spacing={8} />
              </Box>

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

              {/* Кнопка меню, появляющаяся при наведении */}
              <Stack direction='row' className="column-menu" sx={{ opacity: 0 }}>
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{
                    color: textColor,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <Icon icon='settings' />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => onAddBlock?.(column.id)}
                  sx={{ color: textColor }}
                >
                  <Icon icon="add" />
                </IconButton>
              </Stack>
            </Stack>
          </Stack>

          {/* Меню для управления колонкой */}
          <Menu
            anchorEl={menuAnchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Stack
              justifyContent='center'
              alignItems='center'
              direction='row'
              gap={.5}
              paddingX={1}
              mb={1}
            >
              <InputColorText
                size="small"
                value={column.color}
                pickColor={handleColorChange}
                setColor={handleColorChange}
                sx={{
                  '& input': { maxWidth: '100px' },
                  mb: 1
                }}
              />
            </Stack>
            <MenuItem
              onClick={handleDelete}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}
            >
              <Icon icon="delete" fontSize="small" />
              Удалить колонку
            </MenuItem>
          </Menu>

          {/* Попап для выбора цвета */}
          <Popper
            open={colorPickerOpen}
            anchorEl={menuAnchorEl}
            placement="right-start"
            sx={{ zIndex: 1300 }}
          >
            <Stack
              direction='row'
              gap={1}
              sx={{
                p: 2,
                bgcolor: 'background.paper',
                boxShadow: 3,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
              onMouseLeave={() => setColorPickerOpen(false)}
            >
              <InputColorText
                size="small"
                value={column.color}
                pickColor={handleColorChange}
                setColor={handleColorChange}
                sx={{
                  '& input': { maxWidth: '100px' },
                  mb: 1
                }}
              />
              <Box>
                <IconButton size="small" onClick={() => setColorPickerOpen(false)}>
                  <Icon icon="close" />
                </IconButton>
              </Box>
            </Stack>
          </Popper>
        </CardContent>

        {/* Контент колонки с скроллом */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 1,
            '&::-webkit-scrollbar': { width: 6, background: 'transparent' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { bgcolor: '#bbbbbb' },
          }}
        >
          <KanbanInsertButton onClick={() => onAddBlock?.(column.id, 0)} />
          <SortableContext items={blocks.map(block => block.id)} strategy={verticalListSortingStrategy}>
            <Stack spacing={1}>
              {blocks.map((block) => (
                <KanbanBlock
                  key={block.id}
                  block={block}
                  kanbanStyle={funnelStyle}
                  onUpdate={onUpdateBlock}
                  onDelete={deleteBlock}
                  overId={overId}
                  color={column.color}
                />
              ))}
            </Stack>
          </SortableContext>
          {blocks.length > 0 ? < KanbanInsertButton onClick={() => { onAddBlock?.(column.id) }} /> : <></>}

          {blocks.length === 0 && (
            <Box
              className='no-export no-focus'
              sx={{
                p: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed',
                borderColor: 'grey.500',
                borderRadius: 1,
              }}
            >
              <Typography color='grey.600' variant="body2" textAlign="center">
                Блоков еще нет
              </Typography>
            </Box>
          )}
        </Box>
      </Frame >
    </Box >
  );
}

export default memo(KanbanColumn);