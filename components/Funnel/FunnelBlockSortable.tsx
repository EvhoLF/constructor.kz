'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Box, CardContent, Stack, TextField, Typography, IconButton } from '@mui/material'
import { memo, useState, useRef } from 'react'
import Icon from '../UI/Icon'
import Frame from '../UI/Frame'
import InputColorText from '../UI/InputColorText'
import { IFunnelBlock } from '@/types/funnel'
import Dots from '../UI/Dots'

interface Props {
  block: IFunnelBlock & { blockStyle: React.CSSProperties }
  onChange: (id: string, data: Partial<IFunnelBlock>) => void
  onRemove: (id: string) => void
  styleMode: 'filled' | 'outlined'
  colored: boolean
  showNumber: boolean
  showDescription: boolean
}

function FunnelBlockSortable({
  block,
  onChange,
  onRemove,
  styleMode,
  colored,
  showNumber,
  showDescription
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id })
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const titleRef = useRef<HTMLInputElement>(null)

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const color = colored ? block.color || '#2196f3' : 'uiPanel.reverse'
  const textColor = colored ? (styleMode === 'filled' ? 'uiPanel.reverse' : block.color) : (styleMode === 'filled' ? 'uiPanel.reverse' : 'uiPanel.reverse')
  const borderColor = colored ? (styleMode === 'filled' ? 'uiPanel.reverse' : block.color) : 'uiPanel.reverse'
  const dotsColor = colored ? (styleMode === 'filled' ? 'white' : block.color) : 'uiPanel.sub_main'

  const setColor = (e: string) => onChange(block.id, { color: e })

  return (
    <Box
      zIndex={isDragging ? 100 : 0}
      ref={setNodeRef}
      style={sortableStyle}
      {...attributes}
      position="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsEditing(true)}
      onBlurCapture={() => setIsEditing(false)}
      onClick={(e) => {
        const target = e.target as HTMLElement
        if (target.closest('.no-focus')) return
        if (titleRef.current) titleRef.current.focus()
      }}
    >
      <Frame
        elevation={isDragging ? 8 : 2}
        variant={styleMode === 'outlined' ? 'outlined' : undefined}
        sx={{
          position: 'relative',
          boxShadow: 'none',
          display: 'grid',
          gridTemplateColumns: showNumber ? 'min-content 1fr 20px' : '1fr',
          background: styleMode === 'filled' ? color : 'rgba(255,255,255,0.01)',
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
          <Stack gap={0.5} height="100%" px={.5} justifyContent="center">
            <Box display="flex" alignItems="center" gap={1} width="100%">
              <TextField
                className='no-focus'
                inputRef={titleRef}
                variant="standard"
                fullWidth
                value={block.title}
                onChange={(e) => onChange(block.id, { title: e.target.value })}
                placeholder="Введите заголовок"
                InputProps={{ disableUnderline: true }}
                sx={{
                  '& *': { padding: 0 },
                  padding: 0,
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
                className='no-focus'
                variant="standard"
                fullWidth
                value={block.description}
                onChange={(e) => onChange(block.id, { description: e.target.value })}
                placeholder="Описание"
                InputProps={{ disableUnderline: true }}
                multiline
                maxRows={3}
                sx={{
                  padding: 0,
                  '& *': { maxHeight: '100%', padding: 0 },
                  '& .MuiInputBase-input': {
                    fontSize: '.8em',
                    color: textColor,
                    textAlign: block.blockStyle.textAlign,
                  },
                }}
              />
            )}
          </Stack>

          {(isHovered || isEditing) && (
            <Frame
              className="no-focus"
              sx={{
                display: 'flex',
                px: 1,
                py: .25,
                gap: 1,
                position: 'absolute',
                right: 40,
                top: '50%',
                alignItems: 'center',
                transform: 'translateY(-50%)'
              }}
            >
              <IconButton size="small" onClick={() => onRemove(block.id)}>
                <Icon icon='delete' />
              </IconButton>
              <InputColorText
                size='extraSmall'
                value={block.color}
                pickColor={setColor}
                setColor={setColor}
                sx={{ '& input': { maxWidth: '70px' }, '& *': { py: 1.1 } }}
              />
            </Frame>
          )}

          <Box
            className='no-focus'
            {...listeners}
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: '34px',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '.5rem',
              cursor: 'pointer',
            }}
          >
            <Dots dotColor={dotsColor} />
          </Box>
        </CardContent>
      </Frame>
    </Box>
  )
}

export default memo(FunnelBlockSortable)
