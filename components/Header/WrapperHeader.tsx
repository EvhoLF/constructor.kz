import { Box, CardProps, Stack } from '@mui/material'
import React from 'react'
import HeaderBar from './HeaderBar'
import HeaderButton from './HeaderButton'
import HeaderMenuSmall from './HeaderMenuSmall'
import Frame from '../UI/Frame'

interface WrapperHeaderProps extends CardProps {
  hide?: boolean
}

const WrapperHeader = ({ children, hide, ...props }: WrapperHeaderProps) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: '50px 1fr',
        gridTemplateColumns: '50px 1fr',
        height: '100dvh',
        overflow: 'hidden',
        gap: '.5rem',
        padding: '.5rem',
      }}
    >
      {/* Header */}
      <Box sx={{ gridColumn: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', }} >
        <HeaderButton />
      </Box>
      <Box sx={{ gridColumn: '2', display: 'flex', alignItems: 'center', justifyContent: 'center', }} >
        <HeaderBar />
      </Box>
      {/* Sidebar */}
      <Frame sx={{ padding: '5px', }}>
        <HeaderMenuSmall />
      </Frame>
      {
        hide
          ? <Stack sx={{ overflow: 'scroll', justifyContent: 'center', alignItems: 'center' }} {...props}>{children}</Stack>
          : <Frame sx={{ overflow: 'auto' }} {...props}>{children}</Frame>
      }
    </Box >
  )
}

export default WrapperHeader