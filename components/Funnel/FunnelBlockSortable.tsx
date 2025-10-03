'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Box, Card, CardContent, Stack, TextField, Typography, IconButton } from '@mui/material'
import { IFunnelBlock } from '@/global'
import { memo, useState } from 'react'
import Icon from '../UI/Icon'

interface Props {
  block: IFunnelBlock & { blockStyle: React.CSSProperties }
  onChange: (id: string, data: Partial<IFunnelBlock>) => void
  onRemove: (id: string) => void // ← добавляем пропс для удаления
  styleMode: 'filled' | 'outlined'
  colored: boolean
  showNumber: boolean
  showDescription: boolean
}

function FunnelBlockSortable({
  block,
  onChange,
  onRemove, // ← добавляем пропс
  styleMode,
  colored,
  showNumber,
  showDescription
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id })
  const [isHovered, setIsHovered] = useState(false)

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const color = colored ? block.color : '#fff'
  const textColor = colored ? (styleMode === 'filled' ? '#eee' : block.color) : '#000'
  const borderColor = colored ? (styleMode === 'filled' ? '#fff' : block.color) : '#000'

  return (
    <Box
      zIndex={isDragging ? 100 : 0}
      ref={setNodeRef}
      style={sortableStyle}
      {...attributes}
      position="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        elevation={isDragging ? 8 : 2}
        variant={styleMode === 'outlined' ? 'outlined' : undefined}
        sx={{
          display: 'grid',
          gridTemplateColumns: showNumber ? 'min-content 1fr 20px' : '1fr',
          position: 'relative',
          backgroundColor: styleMode === 'filled' ? color : 'transparent',
          borderColor: styleMode === 'outlined' ? borderColor : 'transparent',
          borderWidth: styleMode === 'outlined' ? 2 : 1,
          color: textColor,
          cursor: 'default',
          transition: 'all .3s',
          gap: '1rem',
          p: '0 1rem',
          ...block.blockStyle,
        }}
      >
        {showNumber && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '24px',
            }}
          >
            <Typography color={textColor} variant="body1">
              #{block.order}
            </Typography>
          </Box>
        )}
        <CardContent
          sx={{
            flexGrow: 1,
            width: '100%',
            padding: '0px 0px !important',
            textAlign: block.blockStyle.textAlign,
          }}
        >
          <Stack gap={0.5} height="100%" justifyContent="center">
            <Box display="flex" alignItems="center" gap={1} width="100%">
              <TextField
                variant="standard"
                fullWidth
                value={block.title}
                onChange={(e) => onChange(block.id, { title: e.target.value })}
                placeholder="Введите заголовок"
                InputProps={{ disableUnderline: true }}
                sx={{
                  '& *': { padding: 0 },
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  '& .MuiInputBase-input': {
                    color: textColor,
                    textAlign: block.blockStyle.textAlign,
                  },
                }}
              />
            </Box>

            {showDescription && (
              <TextField
                variant="standard"
                fullWidth
                value={block.description}
                onChange={(e) => onChange(block.id, { description: e.target.value })}
                placeholder="Описание"
                InputProps={{ disableUnderline: true }}
                multiline
                maxRows={3}
                sx={{
                  '& *': { maxHeight:'100%', padding: 0 },
                  '& .MuiInputBase-input': {
                    fontSize: '.8em',
                    color: textColor,
                    textAlign: block.blockStyle.textAlign,
                  },
                }}
              />
            )}
          </Stack>

          {/* Кнопка удаления (появляется при наведении) */}
          {isHovered && (
            <IconButton
              className='no-export'
              size="small"
              onClick={() => onRemove(block.id)}
              sx={{
                position: 'absolute',
                right: 40, // размещаем слева от дрэг-хэндла
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: '#ffffff',
                '&:hover': {
                  backgroundColor: '#dddddd',
                },
              }}
            >
              <Icon icon='delete' />
            </IconButton>
          )}

          {/* Дрэг-хэндл */}
          <Box
            className='no-export'
            {...listeners}
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: '32px',
              height: '100%',
              display: 'flex',
              padding: '.5rem',
            }}
          >
            <Box
              className='no-export'
              {...listeners}
              sx={{
                width:'100%',
                height:'100%',
                backgroundImage: `url('/dot_min.png')`,
                backgroundPosition: 'top left',
                backgroundSize: '8px 8px',
                backgroundRepeat: 'repeat',
              }}
            >
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default memo(FunnelBlockSortable, (prev, next) => {
  return (
    prev.block.id === next.block.id &&
    prev.block.color === next.block.color &&
    prev.block.title === next.block.title &&
    prev.block.description === next.block.description &&
    prev.styleMode === next.styleMode &&
    prev.colored === next.colored &&
    prev.showNumber === next.showNumber &&
    prev.showDescription === next.showDescription &&
    JSON.stringify(prev.block.blockStyle) === JSON.stringify(next.block.blockStyle)
  )
})