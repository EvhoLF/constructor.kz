import { Box, SxProps, Theme } from '@mui/material'
import React from 'react'

interface Props {
  sx?: SxProps<Theme> | undefined,
  dark?: number,
}
const Dots = ({ sx, dark, ...props }: Props) => {
  const DarkStyle = dark ? { filter: `brightness(${dark})` } : {}
  return (
    <Box
      {...props}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        cursor: 'grab',
        // px: 0.5,
        width: '32px',
        height: '16px',
        backgroundImage: `url('/dot_min.png')`,
        backgroundPosition: 'top left',
        backgroundSize: '8px 8px',
        backgroundRepeat: 'repeat',
        ...DarkStyle,
        ...sx,
      }}
    >
    </Box>
  )
}

export default Dots