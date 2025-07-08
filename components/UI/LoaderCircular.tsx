import { CircularProgress } from '@mui/material'
import React from 'react'

const LoaderCircular = ({ size = "14px", color = '#ffffff', sx = {}, ...props }) => {
  return (
    <CircularProgress size={size} {...props} sx={{ ...sx, 'svg circle': { stroke: color } }} />
  )
}

export default LoaderCircular