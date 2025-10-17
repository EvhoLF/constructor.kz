import { Box, CardProps, Stack } from '@mui/material'
import React from 'react'
import HeaderBar from './HeaderBar'
import HeaderButton from './HeaderButton'
import HeaderMenuSmall from './HeaderMenuSmall'
import Frame from '../UI/Frame'

interface WrapperHeaderProps extends CardProps {
  pageTitle?: string | null,
  hide?: boolean,
  center?: boolean,
}

const WrapperHeader = ({ pageTitle = null, children, hide, center, ...props }: WrapperHeaderProps) => {
  const styleChildren = { overflow: 'auto', ...(center ? { display: 'flex', justifyContent: 'center', alignItems: 'center' } : {}) }
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
        <HeaderBar pageTitle={pageTitle} />
      </Box>
      {/* Sidebar */}
      <Frame sx={{ padding: '5px', }}>
        <HeaderMenuSmall />
      </Frame>
      {
        hide
          ? <Box sx={{ ...styleChildren }} {...props}>{children}</Box>
          : <Frame sx={{ ...styleChildren }} {...props}>{children}</Frame>
      }
    </Box >
  )
}

export default WrapperHeader