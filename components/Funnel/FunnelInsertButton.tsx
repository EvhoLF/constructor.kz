'use client'

import { useState } from 'react'
import { Box, Fade, IconButton } from '@mui/material'
import Icon from '../UI/Icon'

export default function FunnelInsertButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{ position: 'relative', height: 12, my: .75 }}
    >
      <Fade in={hovered}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            borderTop: '1px dashed',
            borderColor: 'primary.main',
            transform: 'translateY(-50%)',
            zIndex: 0,
          }}
        />
      </Fade>

      <Fade in={hovered}>
        <IconButton
          onClick={onClick}
          size="small"
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'primary.light',
            color: 'primary.contrastText',
            transition: 'all 0.3s',
            zIndex: 10,
            '&:hover': { backgroundColor: 'primary.dark' },
            boxShadow: 1,
          }}
        >
          <Icon icon="add" />
        </IconButton>
      </Fade>
    </Box>
  )
}
